const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product Name is required'],
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    unique: true,
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Earrings', 'Necklaces', 'Rings', 'Bracelets', 'Bangles', 'Brooch', 'Organizer']
  },
  collection: {
    type: String,
    default: 'Heritage',
    trim: true
  },
  image: {
    type: String,
    required: [true, 'Main image is required']
  },
  hoverImage: {
    type: String
  },
  galleryImages: {
    type: [String],
    default: []
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  discountPercentage: {
    type: Number,
    default: 0
  },
  stockCount: {
    type: Number,
    required: [true, 'Stock count is required'],
    min: 0,
    default: 0
  },
  lowStockAlert: {
    type: Number,
    default: 5
  },
  rating: {
    type: Number,
    default: 4.5
  },
  reviewsCount: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  occasion: {
    type: [String],
    default: []
  },
  finish: {
    type: String,
    enum: ['Glossy', 'Matte', 'Polished'],
    default: 'Glossy'
  },
  isBestSeller: {
    type: Boolean,
    default: false
  },
  isNewArrival: {
    type: Boolean,
    default: false
  },
  isSale: {
    type: Boolean,
    default: false
  },
  estimatedDelivery: {
    type: String,
    enum: ['2–4 Days', '3–5 Days', '5–7 Days'],
    default: '3–5 Days'
  },
  published: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  metaTitle: {
    type: String,
    trim: true
  },
  metaDescription: {
    type: String,
    trim: true
  },
  sizes: [
    {
      value: { type: String, trim: true, required: true },
      available: { type: Boolean, default: true }
    }
  ]
}, {
  timestamps: true
});

// Create text index for search
productSchema.index({ name: 'text', collection: 'text', category: 'text' });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
