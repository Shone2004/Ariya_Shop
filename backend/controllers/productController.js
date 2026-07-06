const Product = require('../models/Product');
const generateSlug = require('../utils/generateSlug');
const { getRandomRating, getRandomReviewCount } = require('../utils/generateRating');
const calculateDiscount = require('../utils/calculateDiscount');
const { validationResult } = require('express-validator');

/**
 * @desc    Get all products with pagination, sorting, filtering, and search
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 8,
      sort,
      category,
      collection,
      occasion,
      finish,
      highlight,
      minPrice,
      maxPrice,
      search
    } = req.query;

    const query = {};
    if (req.query.limit || req.query.page) {
      query.published = true;
    }

    // 1. Filtering
    if (category && category !== 'Shop All') {
      query.category = category;
    }
    if (collection) {
      query.collection = collection;
    }
    if (finish) {
      query.finish = finish;
    }
    if (occasion) {
      // Handles single string occasion or array-like matching
      const occasionsArray = Array.isArray(occasion) ? occasion : occasion.split(',');
      query.occasion = { $in: occasionsArray };
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (highlight) {
      if (highlight === 'isBestSeller') query.isBestSeller = true;
      if (highlight === 'isNewArrival') query.isNewArrival = true;
      if (highlight === 'isSale') query.isSale = true;
    }

    // 2. Search
    if (search) {
      query.$text = { $search: search };
    }

    // 3. Sorting
    let sortOptions = {};
    switch (sort) {
      case 'Newest':
        sortOptions = { createdAt: -1 };
        break;
      case 'Price Low to High':
        sortOptions = { price: 1 };
        break;
      case 'Price High to Low':
        sortOptions = { price: -1 };
        break;
      case 'Highest Rated':
        sortOptions = { rating: -1 };
        break;
      case 'Discount':
        sortOptions = { discountPercentage: -1 };
        break;
      case 'Alphabetical':
        sortOptions = { name: 1 };
        break;
      case 'Best Selling':
        sortOptions = { isBestSeller: -1, createdAt: -1 };
        break;
      case 'Featured':
      default:
        sortOptions = { featured: -1, createdAt: -1 };
        break;
    }

    // If limit query is not provided (Admin panel request)
    if (!req.query.limit && !req.query.page) {
      const allProducts = await Product.find(query).sort(sortOptions).lean();
      const mapped = allProducts.map(p => ({
        ...p,
        id: p._id,
        stock: p.stockCount,
        images: p.galleryImages && p.galleryImages.length > 0 ? p.galleryImages : [p.image].filter(Boolean)
      }));
      return res.json(mapped);
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, parseInt(limit));
    const skip = (pageNum - 1) * limitNum;

    // Run queries in parallel for performance
    const [products, totalCount] = await Promise.all([
      Product.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Product.countDocuments(query)
    ]);

    res.json({
      success: true,
      message: 'Products retrieved successfully',
      data: {
        products,
        totalCount,
        page: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
        hasMore: totalCount > skip + products.length
      }
    });

  } catch (error) {
    console.error('Get Products Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving products',
      errors: [error.message]
    });
  }
};

/**
 * @desc    Get single product details by ID or Slug
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Allow search by slug or mongoose ObjectId
    let query = {};
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      query = { _id: id };
    } else {
      query = { slug: id };
    }

    const product = await Product.findOne(query).lean();
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
        errors: [`No product found matching id/slug '${id}'`]
      });
    }

    res.json({
      success: true,
      message: 'Product retrieved successfully',
      data: product
    });

  } catch (error) {
    console.error('Get Product By ID Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving product details',
      errors: [error.message]
    });
  }
};

/**
 * @desc    Create a product
 * @route   POST /api/products
 * @access  Private (Admin)
 */
const createProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => err.msg)
    });
  }

  try {
    const productData = { ...req.body };

    // Auto slug generation if not provided
    if (!productData.slug) {
      productData.slug = generateSlug(productData.name);
    }

    // Uniqueness validation check for Slug
    const slugExists = await Product.findOne({ slug: productData.slug });
    if (slugExists) {
      return res.status(400).json({
        success: false,
        message: 'Slug already exists',
        errors: [`A product with slug '${productData.slug}' already exists.`]
      });
    }

    // Uniqueness validation check for SKU
    const skuExists = await Product.findOne({ sku: productData.sku });
    if (skuExists) {
      return res.status(400).json({
        success: false,
        message: 'SKU already exists',
        errors: [`A product with SKU '${productData.sku}' already exists.`]
      });
    }

    // Auto calculate discount percentage
    productData.discountPercentage = calculateDiscount(productData.price, productData.originalPrice);

    // Auto generate rating and reviews count permanently
    productData.rating = getRandomRating();
    productData.reviewsCount = getRandomReviewCount();

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });

  } catch (error) {
    console.error('Create Product Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating product',
      errors: [error.message]
    });
  }
};

/**
 * @desc    Update a product
 * @route   PUT /api/products/:id
 * @access  Private (Admin)
 */
const updateProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => err.msg)
    });
  }

  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
        errors: ['Product not found']
      });
    }

    const updateData = { ...req.body };

    // Regenerate slug if name changes
    if (updateData.name && updateData.name !== product.name) {
      updateData.slug = generateSlug(updateData.name);
      
      const slugExists = await Product.findOne({ slug: updateData.slug, _id: { $ne: id } });
      if (slugExists) {
        return res.status(400).json({
          success: false,
          message: 'Slug already exists',
          errors: [`A product with slug '${updateData.slug}' already exists.`]
        });
      }
    }

    // SKU unique check
    if (updateData.sku && updateData.sku !== product.sku) {
      const skuExists = await Product.findOne({ sku: updateData.sku, _id: { $ne: id } });
      if (skuExists) {
        return res.status(400).json({
          success: false,
          message: 'SKU already exists',
          errors: [`A product with SKU '${updateData.sku}' already exists.`]
        });
      }
    }

    // Recalculate discount if price or originalPrice changes
    if (updateData.price !== undefined || updateData.originalPrice !== undefined) {
      const activePrice = updateData.price !== undefined ? updateData.price : product.price;
      const activeOriginalPrice = updateData.originalPrice !== undefined ? updateData.originalPrice : product.originalPrice;
      updateData.discountPercentage = calculateDiscount(activePrice, activeOriginalPrice);
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });

  } catch (error) {
    console.error('Update Product Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating product',
      errors: [error.message]
    });
  }
};

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Private (Admin)
 */
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
        errors: ['Product not found']
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully',
      data: {}
    });

  } catch (error) {
    console.error('Delete Product Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting product',
      errors: [error.message]
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
