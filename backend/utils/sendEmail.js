const nodemailer = require("nodemailer")

const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })
}

const sendEmail = async (options) => {
  try {
    const transporter = createTransporter()

    const mailOptions = {
      from: `"SecureHome" <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log("Email sent:", info.messageId)
    return info
  } catch (error) {
    console.error("Email sending failed:", error)
    throw error
  }
}

const sendWelcomeEmail = async (user) => {
  const message = `
    Welcome to SecureHome, ${user.firstName}!
    
    Thank you for joining our community. We're excited to help you secure your home with our premium security products.
    
    Best regards,
    The SecureHome Team
  `

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Welcome to SecureHome!</h2>
      <p>Hi ${user.firstName},</p>
      <p>Thank you for joining our community. We're excited to help you secure your home with our premium security products.</p>
      <p>Explore our wide range of security cameras, smart locks, alarm systems, and more.</p>
      <p>Best regards,<br>The SecureHome Team</p>
    </div>
  `

  await sendEmail({
    email: user.email,
    subject: "Welcome to SecureHome!",
    message,
    html,
  })
}

const sendOrderConfirmation = async (user, order) => {
  const message = `
    Order Confirmation - ${order.orderNumber}
    
    Hi ${user.firstName},
    
    Thank you for your order! Your order has been confirmed and is being processed.
    
    Order Details:
    Order Number: ${order.orderNumber}
    Total: $${order.total.toFixed(2)}
    
    We'll send you another email when your order ships.
    
    Best regards,
    The SecureHome Team
  `

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Order Confirmation</h2>
      <p>Hi ${user.firstName},</p>
      <p>Thank you for your order! Your order has been confirmed and is being processed.</p>
      <div style="background: #f5f5f5; padding: 20px; margin: 20px 0;">
        <h3>Order Details</h3>
        <p><strong>Order Number:</strong> ${order.orderNumber}</p>
        <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
      </div>
      <p>We'll send you another email when your order ships.</p>
      <p>Best regards,<br>The SecureHome Team</p>
    </div>
  `

  await sendEmail({
    email: user.email,
    subject: `Order Confirmation - ${order.orderNumber}`,
    message,
    html,
  })
}

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendOrderConfirmation,
}
