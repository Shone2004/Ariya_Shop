const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, getOrders, updateOrder, getMyOrders } = require('../controllers/orderController');
const protect = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

// @route   POST /api/orders/create
router.post('/create', protect, createOrder);

// @route   POST /api/orders/verify
router.post('/verify', verifyPayment);

// @route   GET /api/orders/my-orders (Protected)
router.get('/my-orders', protect, getMyOrders);

// @route   GET /api/orders (Admin protected)
router.get('/', protect, admin, getOrders);

// @route   PUT /api/orders/:id (Admin protected)
router.put('/:id', protect, admin, updateOrder);

module.exports = router;
