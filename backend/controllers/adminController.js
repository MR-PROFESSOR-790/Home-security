const User = require("../models/User")
const Product = require("../models/Product")
const Order = require("../models/Order")

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      pendingOrders,
      totalRevenue,
      recentOrders,
      lowStockProducts,
      monthlyRevenue,
      orderStatusStats,
      monthlySales,
    ] = await Promise.all([
      User.countDocuments({ isActive: true }),
      Product.countDocuments({ isActive: true }),
      Order.countDocuments(),
      Order.countDocuments({ orderStatus: "pending" }),
      Order.aggregate([
        { $match: { orderStatus: { $ne: "cancelled" } } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
      Order.find().sort({ createdAt: -1 }).limit(5).populate("user", "firstName lastName email"),
      Product.find({ stock: { $lte: 10 }, isActive: true }).limit(10),
      Order.aggregate([
        {
          $match: {
            orderStatus: { $ne: "cancelled" },
            createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
          },
        },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
      Order.aggregate([
        {
          $group: {
            _id: "$orderStatus",
            count: { $sum: 1 },
          },
        },
      ]),
      Order.aggregate([
        {
          $match: {
            orderStatus: { $ne: "cancelled" },
            createdAt: { $gte: new Date(new Date().getFullYear(), 0, 1) },
          },
        },
        {
          $group: {
            _id: {
              month: { $month: "$createdAt" },
              year: { $year: "$createdAt" },
            },
            total: { $sum: "$total" },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1 },
        },
      ]),
    ])

    const revenue = totalRevenue[0]?.total || 0
    const monthlyRev = monthlyRevenue[0]?.total || 0
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
    })

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalProducts,
          totalOrders,
          pendingOrders,
          totalRevenue: revenue,
          monthlyRevenue: monthlyRev,
          recentUsers,
          recentOrders: recentOrders.length,
        },
        recentOrders,
        lowStockProducts,
        orderStatusStats,
        monthlySales,
      },
    })
  } catch (error) {
    console.error("Get dashboard stats error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while fetching dashboard stats",
    })
  }
}

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const filter = {}
    if (req.query.role) filter.role = req.query.role
    if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === "true"
    if (req.query.search) {
      filter.$or = [
        { firstName: { $regex: req.query.search, $options: "i" } },
        { lastName: { $regex: req.query.search, $options: "i" } },
        { email: { $regex: req.query.search, $options: "i" } },
      ]
    }

    const users = await User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit)
    const total = await User.countDocuments(filter)

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalUsers: total,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1,
        },
      },
    })
  } catch (error) {
    console.error("Get all users error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while fetching users",
    })
  }
}

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const filter = {}
    if (req.query.status) filter.orderStatus = req.query.status
    if (req.query.paymentStatus) filter.paymentStatus = req.query.paymentStatus

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "firstName lastName email")

    const total = await Order.countDocuments(filter)

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalOrders: total,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1,
        },
      },
    })
  } catch (error) {
    console.error("Get all orders error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while fetching orders",
    })
  }
}

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { status, note, trackingNumber, shippingCarrier } = req.body

    const order = await Order.findById(req.params.id)
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      })
    }

    // Update order status
    order.updateStatus(status, note, req.user.id)

    // Update tracking info if provided
    if (trackingNumber) order.trackingNumber = trackingNumber
    if (shippingCarrier) order.shippingCarrier = shippingCarrier

    await order.save()

    res.json({
      success: true,
      message: "Order status updated successfully",
      data: { order },
    })
  } catch (error) {
    console.error("Update order status error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while updating order status",
    })
  }
}

// @desc    Toggle user status
// @route   PUT /api/admin/users/:id/toggle-status
// @access  Private/Admin
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    user.isActive = !user.isActive
    await user.save()

    res.json({
      success: true,
      message: `User ${user.isActive ? "activated" : "deactivated"} successfully`,
      data: { user },
    })
  } catch (error) {
    console.error("Toggle user status error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while updating user status",
    })
  }
}

module.exports = {
  getDashboardStats,
  getAllUsers,
  getAllOrders,
  updateOrderStatus,
  toggleUserStatus,
}
