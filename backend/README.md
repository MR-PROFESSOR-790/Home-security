# SecureHome Backend API

A complete Node.js backend for the SecureHome eCommerce platform, built with Express.js, MongoDB, and comprehensive security features.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Product Management**: Full CRUD operations with advanced filtering and search
- **Shopping Cart**: Persistent cart with stock validation
- **Order Processing**: Complete order lifecycle management
- **User Management**: Profile management and admin controls
- **Chatbot Integration**: Proxy to Django chatbot service
- **Security**: Rate limiting, CORS, input validation, and security headers
- **Documentation**: Swagger/OpenAPI documentation
- **Database**: MongoDB with Mongoose ODM

## Quick Start

### 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### 🛠️ Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd backend
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Environment Setup**
   \`\`\`bash
   cp .env.example .env
   \`\`\`
   
   Edit `.env` with your configuration:
   \`\`\`env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/securehome
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=30d
   # ... other variables
   \`\`\`

4. **Start MongoDB**
   \`\`\`bash
   # If using local MongoDB
   mongod
   \`\`\`

5. **Seed the database**
   \`\`\`bash
   npm run seed
   \`\`\`

6. **Start the server**
   \`\`\`bash
   # Development
   npm run dev
   
   # Production
   npm start
   \`\`\`

The API will be available at `http://localhost:5000`

## 📚 API Documentation

Once the server is running, visit:
- **API Base**: `http://localhost:5000/api`
- **Health Check**: `http://localhost:5000/health`
- **Swagger Docs**: `http://localhost:5000/api-docs` (if implemented)

## 🔐 Authentication

### Login Credentials (after seeding)

**Admin Account:**
- Email: `admin@securehome.com`
- Password: `admin123`

**User Accounts:**
- Email: `john@example.com` / Password: `user123`
- Email: `jane@example.com` / Password: `user123`

### Using JWT Tokens

Include the JWT token in the Authorization header:
\`\`\`
Authorization: Bearer <your-jwt-token>
\`\`\`

## 📖 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `GET /me` - Get current user profile
- `POST /logout` - User logout
- `POST /refresh` - Refresh access token

### Products (`/api/products`)
- `GET /` - Get all products (with filtering)
- `GET /featured` - Get featured products
- `GET /:id` - Get single product
- `GET /slug/:slug` - Get product by slug
- `POST /` - Create product (Admin)
- `PUT /:id` - Update product (Admin)
- `DELETE /:id` - Delete product (Admin)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create category (Admin)
- `PUT /api/categories/:id` - Update category (Admin)
- `DELETE /api/categories/:id` - Delete category (Admin)

### Cart (`/api/cart`)
- `GET /` - Get user's cart
- `POST /add` - Add item to cart
- `PUT /update` - Update cart item quantity
- `DELETE /remove/:productId` - Remove item from cart
- `DELETE /clear` - Clear entire cart

### Orders (`/api/orders`)
- `POST /` - Create new order
- `GET /` - Get user's orders
- `GET /:id` - Get single order
- `PUT /:id/cancel` - Cancel order

### Users (`/api/users`)
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `PUT /change-password` - Change password
- `DELETE /account` - Deactivate account

### Admin (`/api/admin`)
- `GET /dashboard` - Get dashboard stats
- `GET /users` - Get all users
- `GET /orders` - Get all orders
- `PUT /orders/:id/status` - Update order status
- `PUT /users/:id/toggle-status` - Toggle user status

### Chatbot (`/api/chatbot`)
- `GET /status` - Check chatbot service status
- `GET /index` - Get chatbot service info
- `POST /message` - Send message to chatbot
- `GET /history` - Get chat history
- `GET /health` - Chatbot proxy health check

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | Required |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRE` | JWT expiration time | `30d` |
| `JWT_REFRESH_SECRET` | Refresh token secret | Required |
| `JWT_REFRESH_EXPIRE` | Refresh token expiration | `7d` |
| `BCRYPT_ROUNDS` | Password hashing rounds | `12` |
| `CHATBOT_SERVICE_URL` | Django chatbot URL | `http://localhost:8000` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |

### Email Configuration (Optional)
\`\`\`env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
\`\`\`

## 🧪 Testing

\`\`\`bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
\`\`\`

## 📁 Project Structure

\`\`\`
backend/
├── config/
│   └── db.js                 # Database connection
├── controllers/
│   ├── authController.js     # Authentication logic
│   ├── productController.js  # Product management
│   ├── cartController.js     # Cart operations
│   ├── orderController.js    # Order processing
│   ├── userController.js     # User management
│   └── adminController.js    # Admin operations
├── middlewares/
│   ├── auth.js              # Authentication middleware
│   ├── validation.js        # Input validation
│   ├── errorHandler.js      # Error handling
│   └── notFound.js          # 404 handler
├── models/
│   ├── User.js              # User schema
│   ├── Product.js           # Product schema
│   ├── Cart.js              # Cart schema
│   └── Order.js             # Order schema
├── routes/
│   ├── auth.js              # Auth routes
│   ├── products.js          # Product routes
│   ├── cart.js              # Cart routes
│   ├── orders.js            # Order routes
│   ├── users.js             # User routes
│   ├── admin.js             # Admin routes
│   └── chatbot.js           # Chatbot proxy routes
├── utils/
│   ├── generateToken.js     # JWT utilities
│   └── sendEmail.js         # Email utilities
├── .env                     # Environment variables
├── server.js                # Main server file
├── seed.js                  # Database seeding
└── package.json             # Dependencies
\`\`\`

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with configurable rounds
- **Rate Limiting**: Prevent abuse with configurable limits
- **Input Validation**: express-validator for request validation
- **CORS Protection**: Configurable cross-origin resource sharing
- **Security Headers**: Helmet.js for security headers
- **Error Handling**: Comprehensive error handling and logging

## 🚀 Deployment

### Production Checklist

1. **Environment Variables**
   \`\`\`bash
   NODE_ENV=production
   # Set strong JWT secrets
   # Configure production MongoDB URI
   # Set up email service
   \`\`\`

2. **Security**
   - Use HTTPS in production
   - Set strong JWT secrets
   - Configure proper CORS origins
   - Enable rate limiting
   - Set up monitoring and logging

3. **Database**
   - Use MongoDB Atlas or dedicated MongoDB server
   - Set up database backups
   - Configure proper indexes

4. **Monitoring**
   - Set up application monitoring
   - Configure error tracking
   - Set up health checks

### Docker Deployment

\`\`\`dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation
- Review the error logs for debugging

## 🔄 Changelog

### v1.0.0
- Initial release
- Complete authentication system
- Product management
- Cart and order processing
- Admin dashboard
- Chatbot integration
- Comprehensive API documentation
