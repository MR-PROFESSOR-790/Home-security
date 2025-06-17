const mongoose = require("mongoose")

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
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
  addedAt: {
    type: Date,
    default: Date.now,
  },
})

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
    totalAmount: {
      type: Number,
      default: 0,
    },
    totalItems: {
      type: Number,
      default: 0,
    },
    lastModified: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

// Index for better performance
cartSchema.index({ user: 1 })

// Calculate totals before saving
cartSchema.pre("save", function (next) {
  this.totalAmount = this.items.reduce((total, item) => {
    return total + item.price * item.quantity
  }, 0)

  this.totalItems = this.items.reduce((total, item) => {
    return total + item.quantity
  }, 0)

  this.lastModified = new Date()
  next()
})

// Populate product details
cartSchema.pre(/^find/, function (next) {
  this.populate({
    path: "items.product",
    select: "name images price stock isActive slug",
  })
  next()
})

// Method to add item to cart
cartSchema.methods.addItem = function (productId, quantity, price) {
  const existingItemIndex = this.items.findIndex((item) => item.product.toString() === productId.toString())

  if (existingItemIndex > -1) {
    this.items[existingItemIndex].quantity += quantity
    this.items[existingItemIndex].price = price // Update price
  } else {
    this.items.push({
      product: productId,
      quantity,
      price,
    })
  }
}

// Method to remove item from cart
cartSchema.methods.removeItem = function (productId) {
  this.items = this.items.filter((item) => item.product.toString() !== productId.toString())
}

// Method to update item quantity
cartSchema.methods.updateItemQuantity = function (productId, quantity) {
  const itemIndex = this.items.findIndex((item) => item.product.toString() === productId.toString())

  if (itemIndex > -1) {
    if (quantity <= 0) {
      this.items.splice(itemIndex, 1)
    } else {
      this.items[itemIndex].quantity = quantity
    }
  }
}

// Method to clear cart
cartSchema.methods.clearCart = function () {
  this.items = []
  this.totalAmount = 0
  this.totalItems = 0
}

module.exports = mongoose.model("Cart", cartSchema)
