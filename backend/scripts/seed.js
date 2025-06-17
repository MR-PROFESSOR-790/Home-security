const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const dotenv = require("dotenv")
const path = require("path")
const User = require("../models/User")
const Product = require("../models/Product")
const Order = require("../models/Order")
const Category = require("../models/Category")

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../.env") })

// Check if MongoDB URI is available
const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI

if (!mongoURI) {
  console.error("❌ Error: MongoDB URI is not defined in environment variables")
  console.log("Please make sure you have a .env file in the backend directory with MONGODB_URI or MONGO_URI defined")
  console.log("Example: MONGODB_URI=mongodb://localhost:27017/securehome")
  process.exit(1)
}

// Connect to MongoDB
console.log("🔄 Connecting to MongoDB...")
mongoose
  .connect(mongoURI)
  .then(() => console.log("✅ MongoDB connected for seeding..."))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err)
    process.exit(1)
  })

// Sample data
const users = [
  {
    firstName: "Admin",
    lastName: "User",
    email: "admin@securehome.com",
    password: "Admin123!",
    role: "admin",
    isActive: true,
    emailVerified: true,
  },
  {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    password: "User123!",
    role: "user",
    isActive: true,
    emailVerified: true,
  },
  {
    firstName: "Jane",
    lastName: "Smith",
    email: "jane@example.com",
    password: "User123!",
    role: "user",
    isActive: true,
    emailVerified: true,
  },
]

const categories = [
  {
    name: "Security Cameras",
    slug: "security-cameras",
    description: "Indoor and outdoor security cameras for home surveillance",
  },
  {
    name: "Smart Locks",
    slug: "smart-locks",
    description: "Smart door locks with keyless entry and remote access",
  },
  {
    name: "Alarm Systems",
    slug: "alarm-systems",
    description: "Complete home alarm systems for security",
  },
  {
    name: "Motion Sensors",
    slug: "motion-sensors",
    description: "Detect movement in and around your home",
  },
  {
    name: "Video Doorbells",
    slug: "video-doorbells",
    description: "See and speak with visitors from anywhere",
  },
  {
    name: "Security Lighting",
    slug: "security-lighting",
    description: "Smart lighting for enhanced security",
  },
  {
    name: "Access Control",
    slug: "access-control",
    description: "Control and monitor access to your property",
  },
]

const products = [
  {
    name: "SecureView Pro Outdoor Camera",
    description:
      "High-definition outdoor security camera with night vision, motion detection, and weather resistance. Connects to your home Wi-Fi for 24/7 monitoring and alerts.",
    price: 129.99,
    originalPrice: 149.99,
    images: [
      {
        url: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&auto=format&fit=crop",
        alt: "SecureView Pro Outdoor Camera - Front View",
        isPrimary: true,
      },
      {
        url: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&auto=format&fit=crop",
        alt: "SecureView Pro Outdoor Camera - Side View",
        isPrimary: false,
      },
    ],
    category: "Security Cameras",
    brand: "SecureView",
    sku: "SV-OC-001",
    stock: 45,
    featured: true,
    isActive: true,
    rating: 4.7,
    reviewCount: 124,
    tags: ["outdoor", "wireless", "night-vision", "weather-resistant"],
    specifications: new Map([
      ["resolution", "1080p HD"],
      ["fieldOfView", "130°"],
      ["nightVision", "Up to 30ft"],
      ["storage", "Cloud + Local SD"],
      ["powerSource", "Wired with battery backup"],
      ["connectivity", "Wi-Fi 2.4GHz"],
      ["weatherRating", "IP65"],
      ["dimensions", "3.5 x 2.8 x 2.8 inches"],
    ]),
  },
  {
    name: "SmartLock Touch",
    description:
      "Keyless entry smart lock with fingerprint recognition, PIN code, and smartphone control. Integrates with your smart home system for seamless security.",
    price: 199.99,
    originalPrice: 249.99,
    images: [
      {
        url: "https://images.unsplash.com/photo-1587574293340-e0011c4e8ecf?w=800&auto=format&fit=crop",
        alt: "SmartLock Touch - Main View",
        isPrimary: true,
      },
    ],
    category: "Smart Locks",
    brand: "HomeSafe",
    sku: "HS-SL-002",
    stock: 32,
    featured: true,
    isActive: true,
    rating: 4.5,
    reviewCount: 86,
    tags: ["smart-lock", "fingerprint", "keyless", "app-controlled"],
    specifications: new Map([
      ["unlockMethods", "Fingerprint, PIN, App, Key"],
      ["batteryLife", "Up to 6 months"],
      ["connectivity", "Bluetooth, Wi-Fi"],
      ["compatibility", "iOS, Android"],
      ["doorThickness", "1.38 to 2.75 inches"],
      ["finish", "Satin Nickel"],
      ["warranty", "2 years"],
    ]),
  },
  {
    name: "HomeGuard Complete Alarm System",
    description:
      "Comprehensive home security system including control panel, door/window sensors, motion detectors, and siren. Professional monitoring available with monthly subscription.",
    price: 299.99,
    originalPrice: 349.99,
    images: [
      {
        url: "https://images.unsplash.com/photo-1563459802257-2a97df940f11?w=800&auto=format&fit=crop",
        alt: "HomeGuard Complete Alarm System",
        isPrimary: true,
      },
    ],
    category: "Alarm Systems",
    brand: "HomeGuard",
    sku: "HG-AS-003",
    stock: 18,
    featured: true,
    isActive: true,
    rating: 4.8,
    reviewCount: 152,
    tags: ["alarm", "sensors", "monitoring", "wireless"],
    specifications: new Map([
      ["components", "1 Base Station, 2 Motion Sensors, 4 Door/Window Sensors, 1 Keypad, 1 Siren"],
      ["connectivity", "Wi-Fi, Cellular Backup"],
      ["powerSource", "Wired with 24hr battery backup"],
      ["monitoring", "Self or Professional"],
      ["installationType", "DIY or Professional"],
      ["warranty", "3 years"],
      ["mobileApp", "iOS, Android"],
    ]),
  },
  {
    name: "MotionAlert Pro Sensor",
    description:
      "Advanced motion sensor with pet immunity, adjustable sensitivity, and instant alerts. Covers up to 40 feet with a 90-degree field of view.",
    price: 49.99,
    originalPrice: 59.99,
    images: [
      {
        url: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&auto=format&fit=crop",
        alt: "MotionAlert Pro Sensor",
        isPrimary: true,
      },
    ],
    category: "Motion Sensors",
    brand: "SafeZone",
    sku: "SZ-MS-004",
    stock: 65,
    featured: false,
    isActive: true,
    rating: 4.3,
    reviewCount: 78,
    tags: ["motion", "wireless", "pet-immune", "indoor"],
    specifications: new Map([
      ["range", "Up to 40ft"],
      ["fieldOfView", "90°"],
      ["petImmunity", "Up to 40lbs"],
      ["batteryLife", "2 years"],
      ["connectivity", "Z-Wave, Zigbee"],
      ["dimensions", "2.5 x 2.5 x 1.8 inches"],
      ["mountingOptions", "Wall or Corner"],
    ]),
  },
  {
    name: "DoorGuard Video Doorbell",
    description:
      "Smart video doorbell with HD video, two-way audio, and motion detection. Get alerts when someone approaches your door and speak to visitors from anywhere.",
    price: 179.99,
    originalPrice: 199.99,
    images: [
      {
        url: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&auto=format&fit=crop",
        alt: "DoorGuard Video Doorbell",
        isPrimary: true,
      },
    ],
    category: "Video Doorbells",
    brand: "DoorGuard",
    sku: "DG-VD-005",
    stock: 27,
    featured: true,
    isActive: true,
    rating: 4.6,
    reviewCount: 103,
    tags: ["doorbell", "video", "two-way-audio", "motion-detection"],
    specifications: new Map([
      ["resolution", "1080p HD"],
      ["fieldOfView", "160° diagonal"],
      ["nightVision", "Infrared LEDs"],
      ["powerSource", "Hardwired or Battery"],
      ["storage", "Cloud (subscription required)"],
      ["connectivity", "Wi-Fi 2.4GHz"],
      ["weatherRating", "IP65"],
      ["dimensions", "4.5 x 1.8 x 1 inches"],
    ]),
  },
  {
    name: "SmartHome Security Hub",
    description:
      "Central hub for your smart home security devices. Controls cameras, sensors, locks, and alarms from one interface with voice control compatibility.",
    price: 149.99,
    originalPrice: 179.99,
    images: [
      {
        url: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop",
        alt: "SmartHome Security Hub",
        isPrimary: true,
      },
    ],
    category: "Access Control",
    brand: "SmartLife",
    sku: "SL-SH-006",
    stock: 23,
    featured: true,
    isActive: true,
    rating: 4.4,
    reviewCount: 91,
    tags: ["hub", "automation", "voice-control", "smart-home"],
    specifications: new Map([
      ["compatibility", "Z-Wave, Zigbee, Wi-Fi, Bluetooth"],
      ["voiceAssistants", "Alexa, Google Assistant, HomeKit"],
      ["connectivity", "Ethernet, Wi-Fi"],
      ["backup", "Cellular, Battery (8hr)"],
      ["maxDevices", "100+"],
      ["dimensions", "5.9 x 5.9 x 1.3 inches"],
      ["powerSource", "AC adapter with battery backup"],
    ]),
  },
  {
    name: "NightOwl Indoor Camera",
    description:
      "Compact indoor security camera with 360° rotation, two-way audio, and AI person detection. Perfect for monitoring your home interior.",
    price: 89.99,
    originalPrice: 109.99,
    images: [
      {
        url: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&auto=format&fit=crop",
        alt: "NightOwl Indoor Camera",
        isPrimary: true,
      },
    ],
    category: "Security Cameras",
    brand: "NightOwl",
    sku: "NO-IC-007",
    stock: 38,
    featured: false,
    isActive: true,
    rating: 4.2,
    reviewCount: 56,
    tags: ["indoor", "pan-tilt", "two-way-audio", "AI"],
    specifications: new Map([
      ["resolution", "1080p HD"],
      ["rotation", "360° horizontal, 90° vertical"],
      ["nightVision", "Up to 25ft"],
      ["storage", "Cloud + MicroSD (up to 128GB)"],
      ["powerSource", "AC adapter"],
      ["connectivity", "Wi-Fi 2.4GHz"],
      ["dimensions", "3.2 x 3.2 x 4.5 inches"],
      ["specialFeatures", "Person detection, pet monitoring"],
    ]),
  },
]

// Generate order number
const generateOrderNumber = () => {
  const timestamp = Date.now().toString().slice(-9)
  return `SH-${timestamp}`
}

// Generate random dates within the last 30 days
const getRandomDate = () => {
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  return new Date(thirtyDaysAgo.getTime() + Math.random() * (now.getTime() - thirtyDaysAgo.getTime()))
}

// Generate random order data
const generateOrders = async (userIds, productIds) => {
  const orderStatuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]
  const paymentStatuses = ["pending", "paid", "failed", "refunded"]
  const paymentMethods = ["card", "paypal", "bank_transfer", "cash_on_delivery"]

  const orders = []

  // Generate 50 random orders
  for (let i = 0; i < 50; i++) {
    try {
      // Select a random user
      const userId = userIds[Math.floor(Math.random() * userIds.length)]

      // Generate between 1 and 5 order items
      const itemCount = Math.floor(Math.random() * 5) + 1
      const items = []
      let subtotal = 0

      for (let j = 0; j < itemCount; j++) {
        // Select a random product
        const productIndex = Math.floor(Math.random() * productIds.length)
        const productId = productIds[productIndex]
        const product = await Product.findById(productId)

        if (!product) continue

        // Generate a random quantity between 1 and 3
        const quantity = Math.floor(Math.random() * 3) + 1
        const price = product.price
        const itemTotal = price * quantity

        items.push({
          product: productId,
          name: product.name,
          price,
          quantity,
          total: itemTotal,
        })

        subtotal += itemTotal
      }

      if (items.length === 0) continue

      // Calculate order totals
      const tax = Number.parseFloat((subtotal * 0.08).toFixed(2))
      const shipping = subtotal > 100 ? 0 : 9.99
      const total = Number.parseFloat((subtotal + tax + shipping).toFixed(2))

      // Select random statuses
      const orderStatus = orderStatuses[Math.floor(Math.random() * orderStatuses.length)]
      const paymentStatus =
        orderStatus === "cancelled" ? "refunded" : paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)]
      const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)]

      // Create order object
      const order = {
        orderNumber: generateOrderNumber(),
        user: userId,
        items,
        subtotal,
        tax,
        shipping,
        total,
        orderStatus,
        paymentStatus,
        paymentMethod,
        shippingAddress: {
          firstName: "John",
          lastName: "Doe",
          street: "123 Main St",
          city: "Anytown",
          state: "CA",
          zipCode: "12345",
          country: "USA",
          phone: "555-123-4567",
        },
        billingAddress: {
          firstName: "John",
          lastName: "Doe",
          street: "123 Main St",
          city: "Anytown",
          state: "CA",
          zipCode: "12345",
          country: "USA",
          phone: "555-123-4567",
        },
        createdAt: getRandomDate(),
      }

      orders.push(order)
    } catch (error) {
      console.log(`Skipping order ${i + 1} due to error:`, error.message)
    }
  }

  return orders
}

// Seed function
const seedDatabase = async () => {
  try {
    console.log("🗑️ Clearing existing data...")
    // Clear existing data
    await User.deleteMany({})
    await Product.deleteMany({})
    await Category.deleteMany({})
    await Order.deleteMany({})
    console.log("✅ Cleared existing data")

    console.log("👥 Creating users...")
    // Create users with proper password hashing
    const createdUsers = []
    for (const userData of users) {
      try {
        // Hash password before creating user
        const salt = await bcrypt.genSalt(12)
        const hashedPassword = await bcrypt.hash(userData.password, salt)

        const newUser = await User.create({
          ...userData,
          password: hashedPassword,
        })
        createdUsers.push(newUser)
        console.log(`✓ Created user: ${userData.email}`)
      } catch (error) {
        console.error(`✗ Failed to create user ${userData.email}:`, error.message)
      }
    }
    console.log(`✅ Created ${createdUsers.length} users`)

    console.log("📂 Creating categories...")
    // Create categories
    const createdCategories = await Category.insertMany(categories)
    console.log(`✅ Created ${createdCategories.length} categories`)

    console.log("📦 Creating products...")
    // Create products
    const createdProducts = []
    for (const productData of products) {
      try {
        const newProduct = await Product.create(productData)
        createdProducts.push(newProduct)
        console.log(`✓ Created product: ${productData.name}`)
      } catch (error) {
        console.error(`✗ Failed to create product ${productData.name}:`, error.message)
      }
    }
    console.log(`✅ Created ${createdProducts.length} products`)

    console.log("📋 Creating orders...")
    // Create orders
    const userIds = createdUsers.map((user) => user._id)
    const productIds = createdProducts.map((product) => product._id)

    if (userIds.length > 0 && productIds.length > 0) {
      const orders = await generateOrders(userIds, productIds)
      const createdOrders = []

      for (const orderData of orders) {
        try {
          const newOrder = await Order.create(orderData)
          createdOrders.push(newOrder)
        } catch (error) {
          console.log(`Skipping order due to validation error:`, error.message)
        }
      }
      console.log(`✅ Created ${createdOrders.length} orders`)
    }

    console.log("\n🎉 Database seeded successfully!")
    console.log("📊 Summary:")
    console.log(`   👥 Users: ${createdUsers.length}`)
    console.log(`   📂 Categories: ${createdCategories.length}`)
    console.log(`   📦 Products: ${createdProducts.length}`)

    console.log("\n🔑 Login credentials:")
    console.log("   Admin: admin@securehome.com / Admin123!")
    console.log("   User: john@example.com / User123!")

    process.exit(0)
  } catch (error) {
    console.error("❌ Error seeding database:", error)
    process.exit(1)
  }
}

// Run the seed function
seedDatabase()
