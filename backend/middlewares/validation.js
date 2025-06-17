const { body, param, query, validationResult } = require("express-validator")

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
        value: error.value,
      })),
    })
  }
  next()
}

// User validation rules
const validateRegister = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("First name can only contain letters and spaces"),

  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Last name can only contain letters and spaces"),

  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email address"),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    ),

  body("phone")
    .optional()
    .matches(/^\+?[\d\s-()]+$/)
    .withMessage("Please provide a valid phone number"),

  handleValidationErrors,
]

const validateLogin = [
  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email address"),

  body("password").notEmpty().withMessage("Password is required"),

  handleValidationErrors,
]

// Product validation rules
const validateProduct = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ min: 3, max: 200 })
    .withMessage("Product name must be between 3 and 200 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ min: 10, max: 1000 })
    .withMessage("Description must be between 10 and 1000 characters"),

  body("price").isFloat({ min: 0.01 }).withMessage("Price must be a positive number"),

  body("originalPrice").optional().isFloat({ min: 0.01 }).withMessage("Original price must be a positive number"),

  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isIn([
      "Security Cameras",
      "Smart Locks",
      "Alarm Systems",
      "Motion Sensors",
      "Video Doorbells",
      "Security Lighting",
      "Access Control",
      "Surveillance Systems",
    ])
    .withMessage("Please select a valid category"),

  body("brand")
    .trim()
    .notEmpty()
    .withMessage("Brand is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Brand must be between 2 and 50 characters"),

  body("stock").isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),

  body("features").optional().isArray().withMessage("Features must be an array"),

  handleValidationErrors,
]

// Cart validation rules
const validateCartItem = [
  body("productId").isMongoId().withMessage("Please provide a valid product ID"),

  body("quantity").isInt({ min: 1, max: 99 }).withMessage("Quantity must be between 1 and 99"),

  handleValidationErrors,
]

// Order validation rules
const validateOrder = [
  body("items").isArray({ min: 1 }).withMessage("Order must contain at least one item"),

  body("items.*.product").isMongoId().withMessage("Please provide valid product IDs"),

  body("items.*.quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),

  body("shippingAddress.firstName").trim().notEmpty().withMessage("First name is required"),

  body("shippingAddress.lastName").trim().notEmpty().withMessage("Last name is required"),

  body("shippingAddress.street").trim().notEmpty().withMessage("Street address is required"),

  body("shippingAddress.city").trim().notEmpty().withMessage("City is required"),

  body("shippingAddress.state").trim().notEmpty().withMessage("State is required"),

  body("shippingAddress.zipCode")
    .trim()
    .notEmpty()
    .matches(/^\d{5}(-\d{4})?$/)
    .withMessage("Please provide a valid ZIP code"),

  body("paymentMethod")
    .isIn(["card", "paypal", "bank_transfer", "cash_on_delivery"])
    .withMessage("Please provide a valid payment method"),

  handleValidationErrors,
]

// MongoDB ObjectId validation
const validateObjectId = (field = "id") => [
  param(field).isMongoId().withMessage(`Please provide a valid ${field}`),

  handleValidationErrors,
]

// Pagination validation
const validatePagination = [
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),

  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),

  handleValidationErrors,
]

// Search validation
const validateSearch = [
  query("search")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Search term must be between 2 and 100 characters"),

  handleValidationErrors,
]

module.exports = {
  validateRegister,
  validateLogin,
  validateProduct,
  validateCartItem,
  validateOrder,
  validateObjectId,
  validatePagination,
  validateSearch,
  handleValidationErrors,
  // Export individual validator functions
  body,
  param,
  query,
  validationResult,
}
