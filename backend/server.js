const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const morgan = require("morgan")
const compression = require("compression")
const rateLimit = require("express-rate-limit")
require("express-async-errors")
require("dotenv").config()

// Import configurations
const connectDB = require("./config/db")

// Import middleware
const errorHandler = require("./middleware/errorHandler")
const notFound = require("./middleware/notFound")

// Import routes
const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/users")
const productRoutes = require("./routes/products")
const cartRoutes = require("./routes/cart")
const orderRoutes = require("./routes/orders")
const adminRoutes = require("./routes/admin")
const chatbotRoutes = require("./routes/chatbot")

const app = express()

// Connect to MongoDB
connectDB()

// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
)

// Compression middleware
app.use(compression())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
})
app.use("/api/", limiter)

// CORS configuration
const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:3001", process.env.FRONTEND_URL].filter(Boolean),
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
}
app.use(cors(corsOptions))

// Logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"))
} else {
  app.use(morgan("combined"))
}

// Body parsing middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: "1.0.0",
  })
})

// API routes
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/products", productRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/chatbot", chatbotRoutes)

// Root endpoint
app.get("/api", (req, res) => {
  res.json({
    message: "SecureHome API Server",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      users: "/api/users",
      products: "/api/products",
      cart: "/api/cart",
      orders: "/api/orders",
      admin: "/api/admin",
      chatbot: "/api/chatbot",
    },
  })
})

// Error handling middleware (must be last)
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/health`)
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`)
})

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`❌ Unhandled Rejection: ${err.message}`)
  server.close(() => {
    process.exit(1)
  })
})

module.exports = app
