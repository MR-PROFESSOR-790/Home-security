const Cart = require("../models/Cart")
const Product = require("../models/Product")

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate("items.product")

    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] })
      await cart.save()
    }

    // Calculate totals
    let subtotal = 0
    const validItems = []

    for (const item of cart.items) {
      if (item.product && item.product.isActive) {
        const itemTotal = item.product.price * item.quantity
        subtotal += itemTotal
        validItems.push({
          _id: item._id,
          product: {
            _id: item.product._id,
            name: item.product.name,
            price: item.product.price,
            images: item.product.images,
            stock: item.product.stock,
            brand: item.product.brand,
          },
          quantity: item.quantity,
          price: item.product.price,
          total: itemTotal,
        })
      }
    }

    // Update cart if items were removed
    if (validItems.length !== cart.items.length) {
      cart.items = validItems.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.price,
      }))
      await cart.save()
    }

    const tax = subtotal * 0.08 // 8% tax
    const shipping = subtotal > 100 ? 0 : 9.99
    const total = subtotal + tax + shipping

    res.json({
      success: true,
      cart: {
        _id: cart._id,
        items: validItems,
        subtotal: Number.parseFloat(subtotal.toFixed(2)),
        tax: Number.parseFloat(tax.toFixed(2)),
        shipping: Number.parseFloat(shipping.toFixed(2)),
        total: Number.parseFloat(total.toFixed(2)),
        itemCount: validItems.reduce((sum, item) => sum + item.quantity, 0),
      },
    })
  } catch (error) {
    console.error("Get cart error:", error)
    res.status(500).json({ success: false, message: "Server error" })
  }
}

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body

    if (!productId) {
      return res.status(400).json({ success: false, message: "Product ID is required" })
    }

    // Check if product exists and is active
    const product = await Product.findById(productId)
    if (!product || !product.isActive) {
      return res.status(404).json({ success: false, message: "Product not found" })
    }

    // Check stock
    if (product.stock < quantity) {
      return res.status(400).json({ success: false, message: "Insufficient stock" })
    }

    let cart = await Cart.findOne({ user: req.user.id })

    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] })
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex((item) => item.product.toString() === productId)

    if (existingItemIndex > -1) {
      // Update quantity
      const newQuantity = cart.items[existingItemIndex].quantity + quantity

      if (newQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} items available in stock`,
        })
      }

      cart.items[existingItemIndex].quantity = newQuantity
      cart.items[existingItemIndex].price = product.price
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity,
        price: product.price,
      })
    }

    await cart.save()

    // Return updated cart
    const updatedCart = await Cart.findById(cart._id).populate("items.product")

    res.json({
      success: true,
      message: "Item added to cart",
      cart: updatedCart,
    })
  } catch (error) {
    console.error("Add to cart error:", error)
    res.status(500).json({ success: false, message: "Server error" })
  }
}

// @desc    Update cart item quantity
// @route   PUT /api/cart/update
// @access  Private
const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params
    const { quantity } = req.body

    if (quantity < 0) {
      return res.status(400).json({ success: false, message: "Quantity cannot be negative" })
    }

    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product")

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" })
    }

    const itemIndex = cart.items.findIndex((item) => item._id.toString() === itemId)

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: "Item not found in cart" })
    }

    if (quantity === 0) {
      // Remove item
      cart.items.splice(itemIndex, 1)
    } else {
      // Check stock
      const product = cart.items[itemIndex].product
      if (quantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} items available in stock`,
        })
      }

      // Update quantity
      cart.items[itemIndex].quantity = quantity
    }

    await cart.save()

    res.json({
      success: true,
      message: "Cart updated",
      cart,
    })
  } catch (error) {
    console.error("Update cart error:", error)
    res.status(500).json({ success: false, message: "Server error" })
  }
}

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:productId
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params

    const cart = await Cart.findOne({ user: req.user.id })

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" })
    }

    cart.items = cart.items.filter((item) => item._id.toString() !== itemId)
    await cart.save()

    res.json({
      success: true,
      message: "Item removed from cart",
    })
  } catch (error) {
    console.error("Remove from cart error:", error)
    res.status(500).json({ success: false, message: "Server error" })
  }
}

// @desc    Clear cart
// @route   DELETE /api/cart/clear
// @access  Private
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id })

    if (cart) {
      cart.items = []
      await cart.save()
    }

    res.json({
      success: true,
      message: "Cart cleared",
    })
  } catch (error) {
    console.error("Clear cart error:", error)
    res.status(500).json({ success: false, message: "Server error" })
  }
}

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart }
