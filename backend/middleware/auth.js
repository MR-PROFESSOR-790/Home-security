const jwt = require("jsonwebtoken")
const User = require("../models/User")

// Protect routes
const protect = async (req, res, next) => {
  let token

  try {
    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1]
    }
    // Check for token in cookies
    else if (req.cookies.token) {
      token = req.cookies.token
    }

    // Make sure token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      })
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Get user from token
      req.user = await User.findById(decoded.id)

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        })
      }

      // Check if user is active
      if (!req.user.isActive) {
        return res.status(401).json({
          success: false,
          message: "User account is deactivated",
        })
      }

      next()
    } catch (error) {
      console.error("Token verification error:", error)
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      })
    }
  } catch (error) {
    console.error("Auth middleware error:", error)
    return res.status(500).json({
      success: false,
      message: "Server error in authentication",
    })
  }
}

// Check auth status without requiring authentication
const checkAuth = async (req, res) => {
  let token

  try {
    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1]
    }
    // Check for token in cookies
    else if (req.cookies.token) {
      token = req.cookies.token
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      })
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Get user from token
      const user = await User.findById(decoded.id)

      if (!user || !user.isActive) {
        return res.status(401).json({
          success: false,
          message: "User not found or inactive",
        })
      }

      res.json({
        success: true,
        data: {
          user: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            emailVerified: user.emailVerified,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt,
          },
        },
      })
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      })
    }
  } catch (error) {
    console.error("Check auth error:", error)
    return res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`,
      })
    }
    next()
  }
}

module.exports = {
  protect,
  checkAuth,
  authorize,
}
