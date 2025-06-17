const User = require("../models/User")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "30d",
  })
}

// Send token response
const sendTokenResponse = (user, statusCode, res, message) => {
  const token = generateToken(user._id)

  // Cookie options
  const cookieExpireDays = Number.parseInt(process.env.JWT_COOKIE_EXPIRE) || 30
  const expirationDate = new Date()
  expirationDate.setDate(expirationDate.getDate() + cookieExpireDays)

  const options = {
    expires: expirationDate,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  }

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      message,
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
        token,
      },
    })
}

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body

    console.log(`📝 Registration attempt for email: ${email}`)

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      })
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email address",
      })
    }

    // Create user
    const user = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      password,
      phone: phone?.trim(),
      role: req.body.role || "user", // Allow role to be set during registration
    })

    console.log(`✅ User created successfully: ${user.email}`)
    sendTokenResponse(user, 201, res, "User registered successfully")
  } catch (error) {
    console.error("❌ Registration error:", error)

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message)
      return res.status(400).json({
        success: false,
        message: messages.join(". "),
      })
    }

    res.status(500).json({
      success: false,
      message: "Server error during registration",
    })
  }
}

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    console.log(`🔐 Login attempt for email: ${email}`)

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      })
    }

    // Find user and include password
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password")

    if (!user) {
      console.log("❌ User not found")
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      })
    }

    console.log(`✅ User found: ${user.email}`)

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Account has been deactivated",
      })
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      console.log("❌ Password validation failed")
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      })
    }

    console.log("✅ Password validation successful")

    // Update last login
    user.lastLogin = new Date()
    await user.save()

    console.log(`✅ Login successful for user: ${user.email}`)
    sendTokenResponse(user, 200, res, "Login successful")
  } catch (error) {
    console.error("❌ Login error:", error)
    res.status(500).json({
      success: false,
      message: "Server error during login",
    })
  }
}

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    res.json({
      success: true,
      data: user,
    })
  } catch (error) {
    console.error("Get profile error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  })

  res.json({
    success: true,
    message: "Logout successful",
  })
}

// @desc    Update profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, address } = req.body

    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Update fields
    if (firstName) user.firstName = firstName.trim()
    if (lastName) user.lastName = lastName.trim()
    if (phone) user.phone = phone.trim()
    if (address) user.address = { ...user.address, ...address }

    await user.save()

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    })
  } catch (error) {
    console.error("Update profile error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide current password and new password",
      })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long",
      })
    }

    const user = await User.findById(req.user.id).select("+password")

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Check current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword)
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      })
    }

    // Update password
    user.password = newPassword
    await user.save()

    res.json({
      success: true,
      message: "Password changed successfully",
    })
  } catch (error) {
    console.error("Change password error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide email address",
      })
    }

    const user = await User.findOne({ email: email.toLowerCase() })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found with this email address",
      })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex")

    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")

    // Set expire
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000 // 10 minutes

    await user.save({ validateBeforeSave: false })

    // For now, just return success (in production, send email)
    res.json({
      success: true,
      message: "Password reset email sent",
      resetToken: resetToken, // Remove this in production
    })
  } catch (error) {
    console.error("Forgot password error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide token and new password",
      })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      })
    }

    // Get hashed token
    const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex")

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    })

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      })
    }

    // Set new password
    user.password = newPassword
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save()

    sendTokenResponse(user, 200, res, "Password reset successful")
  } catch (error) {
    console.error("Reset password error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params

    const user = await User.findOne({
      emailVerificationToken: token,
    })

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification token",
      })
    }

    user.emailVerified = true
    user.emailVerificationToken = undefined
    await user.save()

    res.json({
      success: true,
      message: "Email verified successfully",
    })
  } catch (error) {
    console.error("Verify email error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

module.exports = {
  register,
  login,
  getMe,
  logout,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
}
