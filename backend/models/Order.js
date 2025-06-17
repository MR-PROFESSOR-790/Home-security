const mongoose = require("mongoose")

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderItem:
 *       type: object
 *       properties:
 *         product:
 *           type: string
 *           description: Product ID
 *         name:
 *           type: string
 *           description: Product name at time of order
 *         quantity:
 *           type: number
 *           minimum: 1
 *         price:
 *           type: number
 *           description: Price at time of order
 *         image:
 *           type: string
 *           description: Product image URL
 *     Order:
 *       type: object
 *       properties:
 *         orderNumber:
 *           type: string
 *           description: Unique order number
 *         user:
 *           type: string
 *           description: User ID
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *         shippingAddress:
 *           type: object
 *         billingAddress:
 *           type: object
 *         paymentMethod:
 *           type: string
 *           enum: [card, paypal, bank_transfer, cash_on_delivery]
 *         paymentStatus:
 *           type: string
 *           enum: [pending, paid, failed, refunded, partially_refunded]
 *         orderStatus:
 *           type: string
 *           enum: [pending, confirmed, processing, shipped, delivered, cancelled, returned]
 *         subtotal:
 *           type: number
 *         tax:
 *           type: number
 *         shipping:
 *           type: number
 *         discount:
 *           type: number
 *         total:
 *           type: number
 *         currency:
 *           type: string
 *         notes:
 *           type: string
 *         trackingNumber:
 *           type: string
 *         shippingCarrier:
 *           type: string
 *         estimatedDelivery:
 *           type: string
 *           format: date-time
 *         deliveredAt:
 *           type: string
 *           format: date-time
 *         cancelledAt:
 *           type: string
 *           format: date-time
 *         cancelReason:
 *           type: string
 *         refundAmount:
 *           type: number
 *         refundReason:
 *           type: string
 *         statusHistory:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *               note:
 *                 type: string
 *               updatedBy:
 *                 type: string
 *                 description: User ID who updated the status
 */

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, "Quantity must be at least 1"],
  },
  price: {
    type: Number,
    required: true,
    min: [0, "Price cannot be negative"],
  },
  image: String,
})

const addressSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  zipCode: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
    default: "US",
  },
  phone: String,
})

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],
    shippingAddress: {
      type: addressSchema,
      required: true,
    },
    billingAddress: addressSchema,
    paymentMethod: {
      type: String,
      enum: ["card", "paypal", "bank_transfer", "cash_on_delivery"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded", "partially_refunded"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "returned"],
      default: "pending",
    },
    subtotal: {
      type: Number,
      required: true,
      min: [0, "Subtotal cannot be negative"],
    },
    tax: {
      type: Number,
      required: true,
      min: [0, "Tax cannot be negative"],
    },
    shipping: {
      type: Number,
      required: true,
      min: [0, "Shipping cannot be negative"],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, "Discount cannot be negative"],
    },
    total: {
      type: Number,
      required: true,
      min: [0, "Total cannot be negative"],
    },
    currency: {
      type: String,
      default: "USD",
    },
    notes: String,
    trackingNumber: String,
    shippingCarrier: String,
    estimatedDelivery: Date,
    deliveredAt: Date,
    cancelledAt: Date,
    cancelReason: String,
    refundAmount: {
      type: Number,
      default: 0,
    },
    refundReason: String,
    statusHistory: [
      {
        status: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
        note: String,
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
  },
  {
    timestamps: true,
  },
)

// Index for better query performance
orderSchema.index({ user: 1 })
orderSchema.index({ orderNumber: 1 })
orderSchema.index({ orderStatus: 1 })
orderSchema.index({ paymentStatus: 1 })
orderSchema.index({ createdAt: -1 })

// Generate order number before saving
orderSchema.pre("save", function (next) {
  if (this.isNew && !this.orderNumber) {
    const timestamp = Date.now().toString()
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")
    this.orderNumber = `SH-${timestamp.slice(-6)}${random}`
  }
  next()
})

// Add status to history when status changes
orderSchema.pre("save", function (next) {
  if (this.isModified("orderStatus") && !this.isNew) {
    this.statusHistory.push({
      status: this.orderStatus,
      timestamp: new Date(),
      note: `Order status changed to ${this.orderStatus}`,
    })
  }
  next()
})

// Populate user details
orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "firstName lastName email",
  })
  next()
})

// Virtual for order age
orderSchema.virtual("orderAge").get(function () {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24)) // days
})

// Method to update order status
orderSchema.methods.updateStatus = function (newStatus, note, updatedBy) {
  this.orderStatus = newStatus
  this.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    note: note || `Order status updated to ${newStatus}`,
    updatedBy,
  })

  // Set specific timestamps
  if (newStatus === "delivered") {
    this.deliveredAt = new Date()
  } else if (newStatus === "cancelled") {
    this.cancelledAt = new Date()
  }
}

// Method to calculate totals
orderSchema.methods.calculateTotals = function () {
  this.subtotal = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  this.total = this.subtotal + this.tax + this.shipping - this.discount
}

module.exports = mongoose.model("Order", orderSchema)
