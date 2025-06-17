const Product = require("../models/Product")

// @desc    Get all products with filtering and pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 12
    const skip = (page - 1) * limit

    // Build filter object
    const filter = { isActive: true }

    // Category filter
    if (req.query.category) {
      filter.category = req.query.category
    }

    // Brand filter
    if (req.query.brand) {
      filter.brand = new RegExp(req.query.brand, "i")
    }

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {}
      if (req.query.minPrice) filter.price.$gte = Number.parseFloat(req.query.minPrice)
      if (req.query.maxPrice) filter.price.$lte = Number.parseFloat(req.query.maxPrice)
    }

    // Featured filter
    if (req.query.featured === "true") {
      filter.featured = true
    }

    // In stock filter
    if (req.query.inStock === "true") {
      filter.stock = { $gt: 0 }
    }

    // Search filter
    if (req.query.search) {
      filter.$or = [
        { name: new RegExp(req.query.search, "i") },
        { description: new RegExp(req.query.search, "i") },
        { brand: new RegExp(req.query.search, "i") },
        { tags: { $in: [new RegExp(req.query.search, "i")] } },
      ]
    }

    // Build sort object
    let sort = {}
    if (req.query.sort) {
      const sortField = req.query.sort.startsWith("-") ? req.query.sort.slice(1) : req.query.sort
      const sortOrder = req.query.sort.startsWith("-") ? -1 : 1
      sort[sortField] = sortOrder
    } else {
      sort = { featured: -1, createdAt: -1 }
    }

    // Execute query
    const products = await Product.find(filter).sort(sort).skip(skip).limit(limit).lean()

    const total = await Product.countDocuments(filter)
    const totalPages = Math.ceil(total / limit)

    // Get unique categories and brands for filters
    const categories = await Product.distinct("category", { isActive: true })
    const brands = await Product.distinct("brand", { isActive: true })

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: page,
          totalPages,
          totalProducts: total,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
          limit,
        },
        filters: {
          categories: categories.sort(),
          brands: brands.sort(),
        },
      },
    })
  } catch (error) {
    console.error("Get products error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while fetching products",
    })
  }
}

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      })
    }

    if (!product.isActive) {
      return res.status(404).json({
        success: false,
        message: "Product is not available",
      })
    }

    // Get related products (same category, different product)
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isActive: true,
    })
      .limit(4)
      .select("name price images rating reviewCount slug")
      .lean()

    res.json({
      success: true,
      data: {
        product,
        relatedProducts,
      },
    })
  } catch (error) {
    console.error("Get product error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while fetching product",
    })
  }
}

// @desc    Get product by slug
// @route   GET /api/products/slug/:slug
// @access  Public
const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({
      slug: req.params.slug,
      isActive: true,
    })

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      })
    }

    // Get related products
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isActive: true,
    })
      .limit(4)
      .select("name price images rating reviewCount slug")
      .lean()

    res.json({
      success: true,
      data: {
        product,
        relatedProducts,
      },
    })
  } catch (error) {
    console.error("Get product by slug error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while fetching product",
    })
  }
}

// @desc    Create product (Admin only)
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body)

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: { product },
    })
  } catch (error) {
    console.error("Create product error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while creating product",
    })
  }
}

// @desc    Update product (Admin only)
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      })
    }

    res.json({
      success: true,
      message: "Product updated successfully",
      data: { product },
    })
  } catch (error) {
    console.error("Update product error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while updating product",
    })
  }
}

// @desc    Delete product (Admin only)
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      })
    }

    // Soft delete - just mark as inactive
    product.isActive = false
    await product.save()

    res.json({
      success: true,
      message: "Product deleted successfully",
    })
  } catch (error) {
    console.error("Delete product error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while deleting product",
    })
  }
}

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res) => {
  try {
    const limit = Number.parseInt(req.query.limit) || 8

    const products = await Product.find({
      featured: true,
      isActive: true,
      stock: { $gt: 0 },
    })
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean()

    res.json({
      success: true,
      data: { products },
    })
  } catch (error) {
    console.error("Get featured products error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while fetching featured products",
    })
  }
}

module.exports = {
  getProducts,
  getProduct,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
}
