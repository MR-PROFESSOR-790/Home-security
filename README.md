# Home Security E-commerce Platform

A full-stack e-commerce platform for home security products built with Next.js, Node.js, and MongoDB.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access
- **Product Management**: Full CRUD operations for security products
- **Shopping Cart**: Persistent cart functionality
- **User Profiles**: Complete user management and profile updates 
- **Responsive Design**: Built with Tailwind CSS and shadcn/ui
- **Admin Dashboard**: Product, user and order management
- **Secure Payments**: Integrated checkout process

## 📋 Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: JWT with refresh tokens
- **Styling**: Tailwind CSS with custom theme
- **State Management**: React Context
- **Database**: MongoDB with Mongoose

## 🛠️ Installation

1. Clone the repository
```sh
git clone <repository-url>
cd Home-security
```

2. Install dependencies for both frontend and backend
```sh
# Root directory (frontend)
npm install

# Backend directory
cd backend
npm install
```

3. Configure environment variables:

Create `.env` in root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Create `.env` in backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/home-security
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
```

4. Run the development servers

```sh
# Frontend (root directory)
npm run dev

# Backend (backend directory)
npm run dev
```

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── about/             # About page
│   ├── admin/             # Admin dashboard
│   ├── auth/              # Authentication pages
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Checkout process
│   └── products/          # Product pages
├── components/            # React components
├── backend/              # Express.js backend
│   ├── controllers/      # Route controllers
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   └── middleware/      # Custom middleware
├── lib/                 # Utility functions
└── public/             # Static assets
```

## 🔒 Security Features

- Password hashing with bcrypt
- JWT authentication
- Input validation
- Protected API routes
- Role-based access control

## 🚀 Deployment

1. Build the frontend
```sh
npm run build
```

2. Build and start the backend
```sh
cd backend
npm run build
npm start
```

## 📝 License

This project is licensed under the MIT License.

## 👥 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Submit a pull request
