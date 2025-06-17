const express = require("express")
const { getCart, addToCart, updateCartItem, removeFromCart, clearCart } = require("../controllers/cartController")
const { protect } = require("../middlewares/auth")
const { validateCartItem, validateObjectId } = require("../middlewares/validation")

const router = express.Router()

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/", protect, getCart)

/**
 * @swagger
 * /api/cart/add:
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 description: Product ID
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 99
 *     responses:
 *       200:
 *         description: Item added to cart successfully
 *       400:
 *         description: Invalid request or insufficient stock
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
router.post("/add", protect, validateCartItem, addToCart)

/**
 * @swagger
 * /api/cart/update:
 *   put:
 *     summary: Update cart item quantity
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 description: Product ID
 *               quantity:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 99
 *     responses:
 *       200:
 *         description: Cart updated successfully
 *       400:
 *         description: Invalid request or insufficient stock
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cart or product not found
 */
router.put("/update", protect, validateCartItem, updateCartItem)

/**
 * @swagger
 * /api/cart/remove/{productId}:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID to remove
 *     responses:
 *       200:
 *         description: Item removed from cart successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cart not found
 */
router.delete("/remove/:productId", protect, validateObjectId("productId"), removeFromCart)

/**
 * @swagger
 * /api/cart/clear:
 *   delete:
 *     summary: Clear entire cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cart not found
 */
router.delete("/clear", protect, clearCart)

module.exports = router
