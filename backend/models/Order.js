const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true }, // Ideally ObjectId ref to Product
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String }
});

const shippingAddressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
  phone: { type: String, required: true }
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.Mixed,
    ref: 'User',
    required: true
  },
  customerSnapshot: {
    name: { type: String },
    email: { type: String }
  },
  orderItems: [orderItemSchema],
  shippingAddress: shippingAddressSchema,
  paymentMethod: {
    type: String,
    required: true,
    default: 'Razorpay'
  },
  itemsPrice: { type: Number, required: true },
  taxPrice: { type: Number, required: true },
  shippingPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  isPaid: {
    type: Boolean,
    required: true,
    default: false
  },
  paidAt: { type: Date },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  
  // Courier Tracking Number / AWB
  tracking: { type: String },
  
  // Razorpay Specific Fields
  razorpay_order_id: { type: String },
  razorpay_payment_id: { type: String },
  razorpay_signature: { type: String }
}, {
  timestamps: true
});

// Optimization Indexes
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ razorpay_order_id: 1 });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
