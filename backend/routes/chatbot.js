const express = require("express")
const axios = require("axios")

const router = express.Router()

const CHATBOT_BASE_URL = process.env.CHATBOT_SERVICE_URL || "http://localhost:8000"

// Helper function to handle proxy requests
const proxyRequest = async (req, res, endpoint, method = "GET") => {
  try {
    const config = {
      method,
      url: `${CHATBOT_BASE_URL}${endpoint}`,
      timeout: 30000, // 30 seconds timeout
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "SecureHome-Backend/1.0",
      },
    }

    // Add request body for POST requests
    if (method === "POST" && req.body) {
      config.data = req.body
    }

    // Add query parameters
    if (req.query && Object.keys(req.query).length > 0) {
      config.params = req.query
    }

    const response = await axios(config)

    res.status(response.status).json({
      success: true,
      data: response.data,
    })
  } catch (error) {
    console.error(`Chatbot proxy error for ${endpoint}:`, error.message)

    if (error.code === "ECONNREFUSED") {
      return res.status(503).json({
        success: false,
        message: "Chatbot service is currently unavailable",
        error: "Service connection refused",
      })
    }

    if (error.code === "ETIMEDOUT") {
      return res.status(504).json({
        success: false,
        message: "Chatbot service timeout",
        error: "Request timeout",
      })
    }

    const status = error.response?.status || 500
    const message = error.response?.data?.message || "Chatbot service error"

    res.status(status).json({
      success: false,
      message,
      error: error.message,
    })
  }
}

/**
 * @swagger
 * /api/chatbot/status:
 *   get:
 *     summary: Check chatbot service status
 *     tags: [Chatbot]
 *     responses:
 *       200:
 *         description: Chatbot service is running
 *       503:
 *         description: Chatbot service unavailable
 */
router.get("/status", async (req, res) => {
  await proxyRequest(req, res, "/api/status/", "GET")
})

/**
 * @swagger
 * /api/chatbot/index:
 *   get:
 *     summary: Get chatbot service information
 *     tags: [Chatbot]
 *     responses:
 *       200:
 *         description: Chatbot service information retrieved
 *       503:
 *         description: Chatbot service unavailable
 */
router.get("/index", async (req, res) => {
  await proxyRequest(req, res, "/api/", "GET")
})

/**
 * @swagger
 * /api/chatbot/message:
 *   post:
 *     summary: Send message to chatbot
 *     tags: [Chatbot]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 description: User message to send to chatbot
 *               session_id:
 *                 type: string
 *                 description: Optional session ID for conversation continuity
 *               user_id:
 *                 type: string
 *                 description: Optional user ID
 *     responses:
 *       200:
 *         description: Chatbot response received
 *       400:
 *         description: Invalid request
 *       503:
 *         description: Chatbot service unavailable
 */
router.post("/message", async (req, res) => {
  // Validate request body
  if (!req.body.message || typeof req.body.message !== "string") {
    return res.status(400).json({
      success: false,
      message: "Message is required and must be a string",
    })
  }

  await proxyRequest(req, res, "/api/chat/", "POST")
})

/**
 * @swagger
 * /api/chatbot/history:
 *   get:
 *     summary: Get chat history
 *     tags: [Chatbot]
 *     parameters:
 *       - in: query
 *         name: session_id
 *         schema:
 *           type: string
 *         description: Session ID to get history for
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: string
 *         description: User ID to get history for
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Number of messages to retrieve
 *     responses:
 *       200:
 *         description: Chat history retrieved
 *       503:
 *         description: Chatbot service unavailable
 */
router.get("/history", async (req, res) => {
  await proxyRequest(req, res, "/api/chat-history/", "GET")
})

// Health check endpoint for the chatbot proxy
router.get("/health", async (req, res) => {
  try {
    const response = await axios.get(`${CHATBOT_BASE_URL}/api/status/`, {
      timeout: 5000,
    })

    res.json({
      success: true,
      message: "Chatbot proxy is healthy",
      chatbot_status: response.data,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    res.status(503).json({
      success: false,
      message: "Chatbot service is unavailable",
      error: error.message,
      timestamp: new Date().toISOString(),
    })
  }
})

module.exports = router
