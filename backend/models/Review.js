const mongoose = require("mongoose")

/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       required:
 *         - user
 *         - product
 *         - rating
 *         - title
 *         - comment
 *       properties:
 *         user:
 *           type: string
 *           description: User ID
 *         product:
 *           type: string
 *           description: Product ID
 *         rating:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *         title:
 *           type: string
 *           description: Review title
 *         comment:
 *           type: string
 *           description: Review comment
 *         verified:
 *           type: boolean
 *           description: Whether this is a verified purchase
 *         helpful:
 *           type: number
 *           description: Number of helpful votes
 *         notHelpful:
 *           type: number
 *           description: Number of not helpful votes
 */

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    title: {
      type: String,
      required: [true, "Review title is required"],
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    comment: {
      type: String,
      required: [true, "Review comment is required"],
      maxlength: [1000, "Comment cannot exceed 1000 characters"],
    },
    verified: {
      type: Boolean,
      default: false,
    },
    helpful: {
      type: Number,
      default: 0,
    },
    notHelpful: {
      type: Number,
      default: 0,
    },
    images: [String],
  },
  {
    timestamps: true,
  },
)

// Compound index to ensure one review per user per product
reviewSchema.index({ user: 1, product: 1 }, { unique: true })
reviewSchema.index({ product: 1 })
reviewSchema.index({ rating: -1 })

// Populate user details
reviewSchema.pre(/^find/, function (next) {
  this.populate("user", "firstName lastName")
  next()
})

module.exports = mongoose.model("Review", reviewSchema)
