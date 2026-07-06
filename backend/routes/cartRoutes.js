const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  getCart,
  addToCart,
  updateCartItem,
  deleteCartItem
} = require('../controllers/cartController');

router.use(protect);

router.route('/')
  .get(getCart)
  .post(addToCart)
  .put(updateCartItem);

router.route('/:id')
  .delete(deleteCartItem);

module.exports = router;
