const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist
} = require('../controllers/wishlistController');

router.use(protect);

router.route('/')
  .get(getWishlist)
  .post(addToWishlist);

router.route('/:id')
  .delete(removeFromWishlist);

module.exports = router;
