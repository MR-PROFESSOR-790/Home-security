const jwt = require("jsonwebtoken")

const generateToken = (payload, secret = process.env.JWT_SECRET, expiresIn = process.env.JWT_EXPIRE) => {
  return jwt.sign(payload, secret, { expiresIn })
}

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE,
  })
}

const verifyToken = (token, secret = process.env.JWT_SECRET) => {
  return jwt.verify(token, secret)
}

module.exports = {
  generateToken,
  generateRefreshToken,
  verifyToken,
}
