const mongoose = require("mongoose")

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [200, "Product name cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    longDescription: {
      type: String,
      maxlength: [5000, "Long description cannot exceed 5000 characters"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    originalPrice: {
      type: Number,
      min: [0, "Original price cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      enum: [
        "Security Cameras",
        "Smart Locks",
        "Alarm Systems",
        "Motion Sensors",
        "Video Doorbells",
        "Security Lighting",
        "Access Control",
        "Surveillance Systems",
      ],
    },
    brand: {
      type: String,
      required: [true, "Product brand is required"],
      trim: true,
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        alt: String,
        isPrimary: {
          type: Boolean,
          default: false,
        },
      },
    ],
    features: [String],
    specifications: {
      type: Map,
      of: String,
    },
    stock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    rating: {
      type: Number,
      min: [0, "Rating cannot be negative"],
      max: [5, "Rating cannot exceed 5"],
      default: 0,
    },
    reviewCount: {
      type: Number,
      min: [0, "Review count cannot be negative"],
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    tags: [String],
    weight: {
      type: Number,
      min: [0, "Weight cannot be negative"],
    },
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
    },
    warranty: {
      duration: Number,
      unit: {
        type: String,
        enum: ["days", "months", "years"],
        default: "months",
      },
      description: String,
    },
    seoTitle: String,
    seoDescription: String,
    seoKeywords: [String],
  },
  {
    timestamps: true,
  },
)

// Indexes for better query performance
productSchema.index({ name: "text", description: "text" })
productSchema.index({ category: 1 })
productSchema.index({ brand: 1 })
productSchema.index({ price: 1 })
productSchema.index({ rating: -1 })
productSchema.index({ featured: -1 })
productSchema.index({ isActive: 1 })
productSchema.index({ slug: 1 })
productSchema.index({ stock: 1 })

// Generate slug before saving - improved version
productSchema.pre("save", function (next) {
  if (this.isModified("name") || !this.slug) {
    // Generate slug from name
    let baseSlug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    // Ensure slug is not empty
    if (!baseSlug) {
      baseSlug = "product-" + Date.now()
    }

    this.slug = baseSlug
  }
  next()
})

// Virtual for discount percentage
productSchema.virtual("discountPercentage").get(function () {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100)
  }
  return 0
})

// Virtual for in stock status
productSchema.virtual("inStock").get(function () {
  return this.stock > 0
})

// Virtual for primary image
productSchema.virtual("primaryImage").get(function () {
  const primaryImg = this.images.find((img) => img.isPrimary)
  return primaryImg ? primaryImg.url : this.images[0] ? this.images[0].url : null
})

module.exports = mongoose.model("Product", productSchema)
