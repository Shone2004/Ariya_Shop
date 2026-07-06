const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const mongoose = require('mongoose');
const { sendOrderEmails, sendOrderCancelledEmail } = require('../services/emailService');

// Create a new Razorpay instance if keys are available
let razorpay;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_ID !== 'your_razorpay_key_id_here') {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

// Development debug logging helper
const isDev = process.env.NODE_ENV !== 'production';
const debugLog = (...args) => {
  if (isDev) {
    console.log(...args);
  }
};

/**
 * Atomic inventory decrements helper with rollback capabilities
 */
const deductInventory = async (items) => {
  const deducted = [];
  for (const item of items) {
    const productBefore = await Product.findById(item.productId);
    debugLog(`[deductInventory DEBUG] Product ID: ${item.productId}`);
    debugLog(`[deductInventory DEBUG] Requested quantity: ${item.quantity}`);
    debugLog(`[deductInventory DEBUG] Current stock before: ${productBefore ? productBefore.stockCount : 'N/A'}`);
    
    const query = { _id: item.productId, stockCount: { $gte: item.quantity } };
    debugLog(`[deductInventory DEBUG] MongoDB Update Query:`, JSON.stringify(query));
    
    const res = await Product.updateOne(
      query,
      { $inc: { stockCount: -item.quantity } }
    );
    
    debugLog(`[deductInventory DEBUG] matchedCount: ${res.matchedCount}, modifiedCount: ${res.modifiedCount}`);
    
    const productAfter = await Product.findById(item.productId);
    debugLog(`[deductInventory DEBUG] Stock after: ${productAfter ? productAfter.stockCount : 'N/A'}`);

    if (res.modifiedCount === 0) {
      debugLog(`[deductInventory DEBUG] Failed to deduct inventory, rolling back...`);
      // Rollback previously successfully deducted items
      for (const rolled of deducted) {
        await Product.updateOne(
          { _id: rolled.productId },
          { $inc: { stockCount: rolled.quantity } }
        );
      }
      return false;
    }
    deducted.push(item);
  }
  return true;
};

/**
 * Reusable helper to map order Mongoose documents to consistent JSON payloads
 */
const mapOrder = (o) => {
  const obj = o.toObject ? o.toObject() : o;
  return {
    ...obj,
    id: obj._id,
    customer: obj.customerSnapshot?.name || obj.user?.name || "Guest",
    customerEmail: obj.customerSnapshot?.email || obj.user?.email || "",
    products: obj.orderItems?.map((item) => ({
      productId: item.productId,
      image: item.image,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    })) || [],
    total: obj.totalPrice,
    payment: obj.isPaid ? "Paid" : "Pending",
    date: obj.createdAt
      ? new Date(obj.createdAt).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "",
  };
};

/**
 * @route   POST /api/orders/create
 * @desc    Create a new order and initialize Razorpay payment
 * @access  Public (Should be private once auth is added)
 */
debugLog("🔥 NEW CREATE ORDER CONTROLLER IS RUNNING");
const createOrder = async (req, res) => {
  try {
    const {
      paymentMethod,
      user: checkoutUser,
      orderItems,
      shippingAddress,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Validate stock availability and pricing against database before creating order
    let calculatedItemsPrice = 0;
    for (const item of orderItems) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      if (product.stockCount < item.quantity) {
        return res.status(400).json({
          message: `Only ${product.stockCount} units of ${product.name} are available.`
        });
      }
      
      // Verify price matching
      if (Number(item.price) !== product.price) {
        return res.status(400).json({
          message: `Price mismatch for product ${product.name}.`
        });
      }
      calculatedItemsPrice += product.price * item.quantity;
    }

    // Verify subtotal matches itemsPrice
    if (Math.round(Number(itemsPrice) * 100) !== Math.round(calculatedItemsPrice * 100)) {
      return res.status(400).json({ message: 'Subtotal calculation mismatch' });
    }

    // Verify grand total price = itemsPrice + taxPrice + shippingPrice
    const expectedTotal = Number(itemsPrice) + Number(taxPrice || 0) + Number(shippingPrice || 0);
    if (Math.round(Number(totalPrice) * 100) !== Math.round(expectedTotal * 100)) {
      return res.status(400).json({ message: 'Grand total price mismatch' });
    }

    debugLog("========== ORDER REQUEST ==========");
    debugLog(JSON.stringify(req.body, null, 2));
    debugLog("==================================");
    // 1. Save the initial 'Pending' order in MongoDB
    const order = new Order({
      user: req.user._id,
      customerSnapshot: {
        name: checkoutUser?.name || (shippingAddress && shippingAddress.fullName) || req.user.name,
        email: checkoutUser?.email || req.user.email
      },
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      status: "Pending",
      isPaid: false,
    });

    const createdOrder = await order.save();

    if (paymentMethod && String(paymentMethod).trim().toLowerCase() === "cod") {
      debugLog('[Order] COD order created:', createdOrder._id);
      
      // Deduct inventory atomically
      const success = await deductInventory(orderItems);
      if (!success) {
        await Order.findByIdAndDelete(createdOrder._id);
        return res.status(400).json({
          message: "One of the items in your cart has just sold out. Please try again."
        });
      }

      // Clear cart in database
      await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
      // Fire-and-forget emails — never blocks checkout
      sendOrderEmails(createdOrder).catch(() => {});
      return res.status(201).json({
        success: true,
        order: mapOrder(createdOrder)
      });
    }

    // 2. Initialize Razorpay Order
    if (!razorpay) {
      // For development when keys are not set, return order without Razorpay details
      // Deduct inventory atomically
      const success = await deductInventory(orderItems);
      if (!success) {
        await Order.findByIdAndDelete(createdOrder._id);
        return res.status(400).json({
          message: "One of the items in your cart has just sold out. Please try again."
        });
      }

      // Clear cart in database
      await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
      return res.status(201).json({
        message: 'Order created locally (Razorpay keys missing)',
        order: mapOrder(createdOrder)
      });
    }

    const options = {
      amount: Math.round(totalPrice * 100), // amount in the smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_order_${createdOrder._id}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // 3. Update the order with Razorpay Order ID
    createdOrder.razorpay_order_id = razorpayOrder.id;
    await createdOrder.save();

    // 4. Return to frontend
    res.status(201).json({
      order: mapOrder(createdOrder),
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID // Safe to send public key to frontend
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ 
      message: 'Server error while creating order'
    });
  }
};

/**
 * @route   POST /api/orders/verify
 * @desc    Verify Razorpay payment signature
 * @access  Public
 */
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing Razorpay parameters' });
    }

    // 1. Fetch the order and verify existence
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // 2. Verify Razorpay Order Ownership
    if (order.razorpay_order_id !== razorpay_order_id) {
      return res.status(400).json({ message: 'Razorpay order ID mismatch' });
    }

    // 3. Prevent Duplicate Payment Processing
    if (order.isPaid) {
      return res.status(200).json({
        success: true,
        message: 'Payment successful and verified (already processed)',
        order: mapOrder(order)
      });
    }

    // 4. Verify the signature using timing-safe comparison
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature.length !== razorpay_signature.length) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed (Invalid signature)'
      });
    }

    const isAuthentic = crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'utf-8'),
      Buffer.from(razorpay_signature, 'utf-8')
    );

    if (isAuthentic) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.razorpay_payment_id = razorpay_payment_id;
      order.razorpay_signature = razorpay_signature;

      // Deduct inventory atomically
      const success = await deductInventory(order.orderItems);
      if (!success) {
        order.status = 'Cancelled';
        await order.save();
        return res.status(400).json({
          success: false,
          message: 'Payment verified, but one of the items sold out before payment was completed. Please contact customer support for a refund.'
        });
      }

      order.status = 'Processing';
      const updatedOrder = await order.save();

      // Clear cart in database
      const userId = order.user?._id || order.user;
      await Cart.findOneAndUpdate({ user: userId }, { items: [] });

      // Only send emails AFTER verified Razorpay payment — not on createOrder
      sendOrderEmails(updatedOrder).catch(() => {});

      res.status(200).json({
        success: true,
        message: 'Payment successful and verified',
        order: mapOrder(updatedOrder)
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment verification failed (Invalid signature)'
      });
    }

  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ message: 'Server error while verifying payment' });
  }
};

/**
 * @desc    Get all orders (Admin dashboard)
 * @route   GET /api/orders
 * @access  Private (Admin)
 */
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });

    // Manually populate user where it is a valid ObjectId
    const userIds = orders
      .map(o => o.user)
      .filter(u => mongoose.Types.ObjectId.isValid(u));

    const User = require('../models/User');
    const users = await User.find({ _id: { $in: userIds } }).select('-password').lean();
    const userMap = {};
    users.forEach(u => {
      userMap[u._id.toString()] = u;
    });

    const mappedOrders = orders.map((o) => {
      const mapped = mapOrder(o);
      if (mongoose.Types.ObjectId.isValid(o.user)) {
        mapped.user = userMap[o.user.toString()] || null;
      }
      return mapped;
    });

    

    res.json(mappedOrders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      message: "Server error while fetching orders",
    });
  }
};

/**
 * @desc    Update order status / tracking (Admin)
 * @route   PUT /api/orders/:id
 * @access  Private (Admin)
 */
const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, isPaid, payment, tracking, cancelReason } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const oldStatus = order.status;
    if (status === 'Cancelled' && oldStatus !== 'Cancelled') {
      const wasDeducted = (String(order.paymentMethod).toLowerCase() === 'cod') || order.isPaid;
      if (wasDeducted) {
        for (const item of order.orderItems) {
          await Product.updateOne(
            { _id: item.productId },
            { $inc: { stockCount: item.quantity } }
          );
        }
      }
      // Send cancellation email safely (fire-and-forget)
      sendOrderCancelledEmail(order, cancelReason).catch((err) => {
        console.error('[Email] Failed to send order cancelled email:', err.message);
      });
    }

    if (status) order.status = status;
    if (isPaid !== undefined) order.isPaid = isPaid;
    if (payment === 'Paid' || payment === 'paid') order.isPaid = true;
    if (tracking !== undefined) order.tracking = tracking;

    const updated = await order.save();
    res.json(mapOrder(updated));
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Server error while updating order' });
  }
};

/**
 * @desc    Get logged in user's orders
 * @route   GET /api/orders/my-orders
 * @access  Private
 */
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    const mappedOrders = orders.map((o) => mapOrder(o));
    res.json(mappedOrders);
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    res.status(500).json({ message: 'Server error while fetching orders' });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  getOrders,
  updateOrder,
  getMyOrders
};
