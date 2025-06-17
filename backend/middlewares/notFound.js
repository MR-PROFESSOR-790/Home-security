const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`)
  res.status(404).json({
    success: false,
    message: error.message,
    availableEndpoints: {
      auth: "/api/auth",
      users: "/api/users",
      products: "/api/products",
      cart: "/api/cart",
      orders: "/api/orders",
      admin: "/api/admin",
      chatbot: "/api/chatbot",
    },
  })
}

module.exports = notFound
