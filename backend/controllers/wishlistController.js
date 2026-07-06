const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

/**
 * @desc    Get user wishlist
 * @route   GET /api/wishlist
 * @access  Private
 */
const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    res.json({
      success: true,
      message: 'Wishlist retrieved successfully',
      data: wishlist.products
    });
  } catch (error) {
    console.error('Get Wishlist Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving wishlist',
      errors: [error.message]
    });
  }
};

/**
 * @desc    Add product to wishlist
 * @route   POST /api/wishlist
 * @access  Private
 */
const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
        errors: ['Product ID is required']
      });
    }

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
        errors: ['Product not found']
      });
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
      await wishlist.save();
    }

    const updatedWishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');

    res.json({
      success: true,
      message: 'Product added to wishlist',
      data: updatedWishlist.products
    });

  } catch (error) {
    console.error('Add to Wishlist Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error adding to wishlist',
      errors: [error.message]
    });
  }
};

/**
 * @desc    Remove product from wishlist
 * @route   DELETE /api/wishlist/:id
 * @access  Private
 */
const removeFromWishlist = async (req, res) => {
  try {
    const productId = req.params.id;

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found',
        errors: ['Wishlist not found']
      });
    }

    wishlist.products = wishlist.products.filter(id => id.toString() !== productId);
    await wishlist.save();

    const updatedWishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');

    res.json({
      success: true,
      message: 'Product removed from wishlist',
      data: updatedWishlist.products
    });

  } catch (error) {
    console.error('Remove from Wishlist Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error removing from wishlist',
      errors: [error.message]
    });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist
};
