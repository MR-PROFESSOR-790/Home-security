const Order = require("../models/Order")
const Cart = require("../models/Cart")
const Product = require("../models/Product")
const { sendOrderConfirmation } = require("../utils/sendEmail")

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  const {
    items,
    shippingAddress,
    billingAddress,
    paymentMethod,
    subtotal,
    tax,
    shipping,
    discount = 0,
    total,
    notes,
  } = req.body

  try {
    // Validate items and check stock
    const orderItems = []
    let calculatedSubtotal = 0

    for (const item of items) {
      const product = await Product.findById(item.product)

      if (!product || !product.isActive) {
        return res.status(400).json({
          success: false,
          message: `Product ${item.product} not found or unavailable`,
        })
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Only ${product.stock} available`,
        })
      }

      // Prepare order item
      orderItems.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
        image: product.images[0]?.url || null,
      })

      calculatedSubtotal += product.price * item.quantity

      // Reduce stock
      product.stock -= item.quantity
      await product.save()
    }

    // Validate totals
    const calculatedTotal = calculatedSubtotal + tax + shipping - discount
    if (Math.abs(calculatedTotal - total) > 0.01) {
      return res.status(400).json({
        success: false,
        message: "Order total mismatch",
      })
    }

    // Create order
    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      paymentMethod,
      subtotal: calculatedSubtotal,
      tax,
      shipping,
      discount,
      total: calculatedTotal,
      notes,
    })

    // Clear user's cart
    await Cart.findOneAndUpdate({ user: req.user.id }, { $set: { items: [] } })

    // Send order confirmation email
    sendOrderConfirmation(req.user, order).catch((err) =>
      console.error("Order confirmation email failed:", err.message),
    )

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: { order },
    })
  } catch (error) {
    console.error("Create order error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while creating order",
    })
  }
}

// @desc    Get user's orders
// @route   GET /api/orders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "firstName lastName email")

    const total = await Order.countDocuments({ user: req.user.id })

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
    console.error("Get my orders error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while fetching orders",
    })
  }
}

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "firstName lastName email")

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      })
    }

    // Check if user owns the order or is admin
    if (order.user._id.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      })
    }

    res.json({
      success: true,
      data: { order },
    })
  } catch (error) {
    console.error("Get order error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while fetching order",
    })
  }
}

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      })
    }

    // Check if user owns the order
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      })
    }

    // Check if order can be cancelled
    if (["shipped", "delivered", "cancelled"].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel order with status: ${order.orderStatus}`,
      })
    }

    // Restore stock for cancelled items
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } })
    }

    // Update order status
    order.updateStatus("cancelled", req.body.reason || "Cancelled by customer", req.user.id)
    order.cancelReason = req.body.reason || "Cancelled by customer"
    await order.save()

    res.json({
      success: true,
      message: "Order cancelled successfully",
      data: { order },
    })
  } catch (error) {
    console.error("Cancel order error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while cancelling order",
    })
  }
}

module.exports = {
  createOrder,
  getMyOrders,
  getOrder,
  cancelOrder,
}
