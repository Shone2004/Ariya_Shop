const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const protect = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

// @route   GET /api/products
router.get('/', getProducts);

// @route   GET /api/products/:id
router.get('/:id', getProductById);

// @route   POST /api/products
router.post(
  '/',
  [
    protect,
    admin,
    [
      check('name', 'Product Name is required').not().isEmpty(),
      check('sku', 'SKU is required').not().isEmpty(),
      check('category', 'Category must be one of the permitted types').isIn([
        'Earrings',
        'Necklaces',
        'Rings',
        'Bracelets',
        'Bangles',
        'Brooch',
        'Organizer'
      ]),
      check('price', 'Selling Price must be a positive number').isFloat({ min: 0 }),
      check('stockCount', 'Stock Quantity must be a positive integer').isInt({ min: 0 }),
      check('description', 'Description is required').not().isEmpty(),
      check('image', 'Main Image URL is required').not().isEmpty()
    ]
  ],
  createProduct
);

// @route   PUT /api/products/:id
router.put('/:id', protect, admin, updateProduct);

// @route   DELETE /api/products/:id
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
