const { body, param, query, validationResult } = require("express-validator")
const mongoose = require("mongoose")

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    })
  }
  next()
}

// User registration validation
const validateRegister = [
  body("firstName")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("First name can only contain letters and spaces"),

  body("lastName")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Last name can only contain letters and spaces"),

  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address")
    .isLength({ max: 100 })
    .withMessage("Email cannot exceed 100 characters"),

  body("password")
    .isLength({ min: 8, max: 128 })
    .withMessage("Password must be between 8 and 128 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    ),

  body("phone")
    .optional()
    .matches(/^\+?[\d\s-()]+$/)
    .withMessage("Please provide a valid phone number")
    .isLength({ min: 10, max: 20 })
    .withMessage("Phone number must be between 10 and 20 characters"),

  handleValidationErrors,
]

// User login validation
const validateLogin = [
  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email address"),

  body("password").notEmpty().withMessage("Password is required"),

  handleValidationErrors,
]

// Change password validation
const validateChangePassword = [
  body("currentPassword").notEmpty().withMessage("Current password is required"),

  body("newPassword")
    .isLength({ min: 8, max: 128 })
    .withMessage("New password must be between 8 and 128 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage(
      "New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    ),

  handleValidationErrors,
]

// Forgot password validation
const validateForgotPassword = [
  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email address"),

  handleValidationErrors,
]

// Reset password validation
const validateResetPassword = [
  body("token").notEmpty().withMessage("Reset token is required"),

  body("newPassword")
    .isLength({ min: 8, max: 128 })
    .withMessage("New password must be between 8 and 128 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage(
      "New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    ),

  handleValidationErrors,
]

// Update profile validation
const validateUpdateProfile = [
  body("firstName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("First name can only contain letters and spaces"),

  body("lastName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Last name can only contain letters and spaces"),

  body("phone")
    .optional()
    .matches(/^\+?[\d\s-()]+$/)
    .withMessage("Please provide a valid phone number")
    .isLength({ min: 10, max: 20 })
    .withMessage("Phone number must be between 10 and 20 characters"),

  body("address.street")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Street address cannot exceed 200 characters"),

  body("address.city")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("City cannot exceed 100 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("City can only contain letters and spaces"),

  body("address.state")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("State cannot exceed 100 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("State can only contain letters and spaces"),

  body("address.zipCode")
    .optional()
    .trim()
    .matches(/^\d{5}(-\d{4})?$/)
    .withMessage("Please provide a valid ZIP code"),

  body("address.country")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Country cannot exceed 100 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Country can only contain letters and spaces"),

  handleValidationErrors,
]

// Product validation
const validateProduct = [
  body("name").trim().isLength({ min: 2, max: 200 }).withMessage("Product name must be between 2 and 200 characters"),

  body("description")
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Description must be between 10 and 1000 characters"),

  body("price").isFloat({ min: 0 }).withMessage("Price must be a positive number"),

  body("category").trim().notEmpty().withMessage("Category is required"),

  body("stock").isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),

  handleValidationErrors,
]

// Validate MongoDB ObjectId
const validateObjectId = (paramName = "id") => [
  param(paramName).custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error("Invalid ID format")
    }
    return true
  }),
  handleValidationErrors,
]

// Pagination validation
const validatePagination = [
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),
  handleValidationErrors,
]

module.exports = {
  handleValidationErrors,
  validateRegister,
  validateLogin,
  validateChangePassword,
  validateForgotPassword,
  validateResetPassword,
  validateUpdateProfile,
  validateProduct,
  validateObjectId,
  validatePagination,
}
