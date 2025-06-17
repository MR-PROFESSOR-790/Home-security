const errorHandler = (err, req, res, next) => {
  let error = { ...err }
  error.message = err.message

  // Log error for debugging
  console.error("Error Stack:", err.stack)

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = "Resource not found"
    error = { message, statusCode: 404 }
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    const value = err.keyValue[field]
    const message = `${field.charAt(0).toUpperCase() + field.slice(1)} '${value}' already exists`
    error = { message, statusCode: 400 }
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ")
    error = { message, statusCode: 400 }
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    const message = "Invalid authentication token"
    error = { message, statusCode: 401 }
  }

  if (err.name === "TokenExpiredError") {
    const message = "Authentication token has expired"
    error = { message, statusCode: 401 }
  }

  // Multer errors (file upload)
  if (err.code === "LIMIT_FILE_SIZE") {
    const message = "File size too large"
    error = { message, statusCode: 400 }
  }

  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    const message = "Too many files uploaded"
    error = { message, statusCode: 400 }
  }

  // CORS errors
  if (err.message && err.message.includes("CORS")) {
    const message = "Cross-origin request blocked"
    error = { message, statusCode: 403 }
  }

  // Rate limiting errors
  if (err.statusCode === 429) {
    const message = "Too many requests, please try again later"
    error = { message, statusCode: 429 }
  }

  const response = {
    success: false,
    message: error.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
      error: err,
    }),
  }

  res.status(error.statusCode || 500).json(response)
}

module.exports = errorHandler
