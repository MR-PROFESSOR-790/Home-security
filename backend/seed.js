const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const User = require("./models/User")
const Product = require("./models/Product")
const Category = require("./models/Category")
require("dotenv").config()

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("MongoDB connected")
  } catch (error) {
    console.error("Database connection error:", error)
    process.exit(1)
  }
}

const seedUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany({})

    // Create admin user
    const adminUser = await User.create({
      firstName: "Admin",
      lastName: "User",
      email: "admin@securehome.com",
      password: "Admin123!",
      role: "admin",
      isActive: true,
      emailVerified: true,
    })

    // Create regular user
    const regularUser = await User.create({
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password: "User123!",
      role: "user",
      phone: "+1234567890",
      address: {
        street: "123 Main St",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "US",
      },
      isActive: true,
      emailVerified: true,
    })

    console.log("✅ Users seeded successfully")
    console.log("Admin:", adminUser.email)
    console.log("User:", regularUser.email)
  } catch (error) {
    console.error("❌ Error seeding users:", error)
  }
}

const seedCategories = async () => {
  try {
    await Category.deleteMany({})

    const categories = [
      {
        name: "Security Cameras",
        description: "Indoor and outdoor security cameras",
        slug: "security-cameras",
        isActive: true,
      },
      {
        name: "Alarm Systems",
        description: "Home alarm and monitoring systems",
        slug: "alarm-systems",
        isActive: true,
      },
      {
        name: "Smart Locks",
        description: "Smart door locks and access control",
        slug: "smart-locks",
        isActive: true,
      },
      {
        name: "Sensors",
        description: "Motion, door, and window sensors",
        slug: "sensors",
        isActive: true,
      },
    ]

    await Category.insertMany(categories)
    console.log("✅ Categories seeded successfully")
  } catch (error) {
    console.error("❌ Error seeding categories:", error)
  }
}

const seedProducts = async () => {
  try {
    await Product.deleteMany({})

    const products = [
      {
        name: "SecureCam Pro 4K Security Camera",
        slug: "securecam-pro-4k-security-camera",
        description: "Professional 4K security camera with night vision, motion detection, and cloud storage.",
        longDescription:
          "The SecureCam Pro offers crystal-clear 4K resolution recording with advanced night vision capabilities. Features include intelligent motion detection, two-way audio, weather-resistant design, and seamless cloud storage integration. Perfect for both indoor and outdoor surveillance needs.",
        price: 299.99,
        originalPrice: 349.99,
        category: "Security Cameras",
        brand: "SecureHome",
        images: [
          "/placeholder.svg?height=400&width=400",
          "/placeholder.svg?height=400&width=400",
          "/placeholder.svg?height=400&width=400",
        ],
        features: [
          "4K Ultra HD Resolution",
          "Night Vision up to 100ft",
          "Motion Detection with AI",
          "Two-way Audio",
          "Weather Resistant (IP65)",
          "Cloud Storage Compatible",
        ],
        specifications: new Map([
          ["Resolution", "4K (3840x2160)"],
          ["Field of View", "110°"],
          ["Night Vision", "100ft"],
          ["Storage", "Cloud/Local"],
          ["Connectivity", "Wi-Fi, Ethernet"],
          ["Power", "PoE/DC 12V"],
        ]),
        stock: 50,
        rating: 4.5,
        reviewCount: 128,
        featured: true,
        isActive: true,
        tags: ["4K", "Night Vision", "Outdoor", "AI Detection"],
        weight: 1.2,
        dimensions: {
          length: 8.5,
          width: 3.2,
          height: 3.2,
        },
        warranty: {
          duration: 24,
          type: "Limited Warranty",
        },
        seoKeywords: ["4K security camera", "outdoor camera", "night vision camera"],
      },
      {
        name: "SmartGuard Alarm System",
        slug: "smartguard-alarm-system",
        description: "Complete home security system with 24/7 monitoring and smartphone control.",
        longDescription:
          "The SmartGuard Alarm System provides comprehensive home protection with professional monitoring services. Includes door/window sensors, motion detectors, and a central hub with cellular backup. Easy smartphone app control and instant alerts.",
        price: 199.99,
        originalPrice: 249.99,
        category: "Alarm Systems",
        brand: "SecureHome",
        images: [
          "/placeholder.svg?height=400&width=400",
          "/placeholder.svg?height=400&width=400",
          "/placeholder.svg?height=400&width=400",
        ],
        features: [
          "24/7 Professional Monitoring",
          "Smartphone App Control",
          "Cellular Backup",
          "Multiple Sensors Included",
          "Easy DIY Installation",
          "Battery Backup",
        ],
        specifications: new Map([
          ["Sensors Included", "4 Door/Window, 2 Motion"],
          ["Communication", "Wi-Fi, Cellular"],
          ["Battery Life", "24 hours backup"],
          ["App", "iOS/Android"],
          ["Monitoring", "24/7 Professional"],
          ["Installation", "DIY"],
        ]),
        stock: 30,
        rating: 4.3,
        reviewCount: 89,
        featured: true,
        isActive: true,
        tags: ["Alarm System", "24/7 Monitoring", "DIY", "Smartphone Control"],
        weight: 2.5,
        dimensions: {
          length: 12.0,
          width: 8.0,
          height: 2.5,
        },
        warranty: {
          duration: 36,
          type: "Full Warranty",
        },
        seoKeywords: ["home alarm system", "security monitoring", "DIY alarm"],
      },
    ]

    await Product.insertMany(products)
    console.log("✅ Products seeded successfully")
  } catch (error) {
    console.error("❌ Error seeding products:", error)
  }
}

const seedDatabase = async () => {
  try {
    await connectDB()
    console.log("🌱 Starting database seeding...")

    await seedUsers()
    await seedCategories()
    await seedProducts()

    console.log("🎉 Database seeding completed successfully!")
    console.log("\n📋 Login Credentials:")
    console.log("Admin: admin@securehome.com / Admin123!")
    console.log("User: john@example.com / User123!")

    process.exit(0)
  } catch (error) {
    console.error("❌ Error seeding database:", error)
    process.exit(1)
  }
}

seedDatabase()
