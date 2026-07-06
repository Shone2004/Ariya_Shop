const Cart = require('../models/Cart');
const Product = require('../models/Product');

/**
 * @desc    Get user cart
 * @route   GET /api/cart
 * @access  Private
 */
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    res.json({
      success: true,
      message: 'Cart retrieved successfully',
      data: cart.items
    });
  } catch (error) {
    console.error('Get Cart Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving cart',
      errors: [error.message]
    });
  }
};

/**
 * @desc    Add item to cart
 * @route   POST /api/cart
 * @access  Private
 */
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
        errors: ['Product ID is required']
      });
    }

    // Verify product exists and is in stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
        errors: ['Product not found']
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (itemIndex > -1) {
      // Item already in cart, increment quantity
      cart.items[itemIndex].quantity += Number(quantity);
    } else {
      // Add new item
      cart.items.push({ product: productId, quantity: Number(quantity) });
    }

    await cart.save();
    
    // Populate and return updated cart items
    const updatedCart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    res.json({
      success: true,
      message: 'Product added to cart',
      data: updatedCart.items
    });

  } catch (error) {
    console.error('Add to Cart Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error adding to cart',
      errors: [error.message]
    });
  }
};

/**
 * @desc    Update cart item quantity
 * @route   PUT /api/cart
 * @access  Private
 */
const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Product ID and quantity are required',
        errors: ['Product ID and quantity are required']
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
        errors: ['Cart not found']
      });
    }

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (itemIndex > -1) {
      if (Number(quantity) <= 0) {
        // Remove item if quantity is 0 or negative
        cart.items.splice(itemIndex, 1);
      } else {
        // Update quantity
        cart.items[itemIndex].quantity = Number(quantity);
      }
      await cart.save();
    } else {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart',
        errors: ['Item not found in cart']
      });
    }

    const updatedCart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    res.json({
      success: true,
      message: 'Cart updated successfully',
      data: updatedCart.items
    });

  } catch (error) {
    console.error('Update Cart Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating cart',
      errors: [error.message]
    });
  }
};

/**
 * @desc    Delete item from cart
 * @route   DELETE /api/cart/:id
 * @access  Private
 */
const deleteCartItem = async (req, res) => {
  try {
    const productId = req.params.id;

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
        errors: ['Cart not found']
      });
    }

    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();

    const updatedCart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    res.json({
      success: true,
      message: 'Product removed from cart',
      data: updatedCart.items
    });

  } catch (error) {
    console.error('Delete Cart Item Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error removing item from cart',
      errors: [error.message]
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  deleteCartItem
};
