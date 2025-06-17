const mongoose = require("mongoose")

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: Category name
 *         slug:
 *           type: string
 *           description: URL-friendly category name
 *         description:
 *           type: string
 *           description: Category description
 *         image:
 *           type: string
 *           description: Category image URL
 *         parent:
 *           type: string
 *           description: Parent category ID
 *         isActive:
 *           type: boolean
 *           description: Whether category is active
 */

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      unique: true,
      maxlength: [100, "Category name cannot exceed 100 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    image: {
      type: String,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

// Index for better query performance
categorySchema.index({ slug: 1 })
categorySchema.index({ parent: 1 })
categorySchema.index({ isActive: 1 })

// Generate slug before saving
categorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }
  next()
})

// Virtual for subcategories
categorySchema.virtual("subcategories", {
  ref: "Category",
  localField: "_id",
  foreignField: "parent",
})

module.exports = mongoose.model("Category", categorySchema)
