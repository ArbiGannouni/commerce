# Full-Stack E-Commerce Application

A modern e-commerce platform built with React, Node.js, Express, and SQLite. Features include JWT authentication, role-based access control (admin/customer), shopping cart, and product management.

## 🚀 Features

- **Authentication**: JWT-based authentication with role-based access (Admin/Customer)
- **Product Management**: Full CRUD operations for products (Admin only)
- **Shopping Cart**: Add, update, and remove items
- **Checkout**: Simple checkout flow with order placement
- **Real-time Updates**: Zustand state management for instant UI updates
- **Responsive Design**: Mobile-friendly UI with TailwindCSS
- **Image Upload**: Multer integration for product images

## 📁 Project Structure

```
├── backend/
│   ├── config/
│   │   ├── database.js        # SQLite database setup
│   │   └── seed.js            # Seed data script
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT authentication middleware
│   ├── routes/
│   │   ├── authRoutes.js      # Authentication routes
│   │   ├── productRoutes.js   # Product CRUD routes
│   │   ├── cartRoutes.js      # Shopping cart routes
│   │   └── orderRoutes.js     # Order management routes
│   ├── uploads/               # Uploaded product images
│   ├── server.js              # Express server
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/        # Reusable components
    │   ├── pages/             # Page components
    │   ├── store/             # Zustand stores
    │   ├── App.jsx            # Main app component
    │   └── main.jsx           # Entry point
    ├── package.json
    └── vite.config.js
```

## 🛠️ Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Initialize database and seed data:
```bash
npm run seed
```

5. Start the server:
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## 👤 Test Accounts

After running the seed script, you can use these accounts:

**Admin Account:**
- Email: `admin@ecommerce.com`
- Password: `admin123`

**Customer Account:**
- Email: `customer@example.com`
- Password: `customer123`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item quantity
- `DELETE /api/cart/:id` - Remove item from cart

### Orders
- `POST /api/orders` - Create order from cart
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order details

## 🎨 Technologies Used

**Frontend:**
- React 18
- Vite
- TailwindCSS
- Zustand (State Management)
- React Router
- Axios

**Backend:**
- Node.js
- Express
- SQLite3
- JWT (jsonwebtoken)
- bcryptjs
- Multer (File uploads)
- CORS

## 🔑 Key Features Explained

### Real-time Updates
When an admin updates a product, the changes are immediately reflected across all pages thanks to Zustand's reactive state management.

### Role-Based Access
- Customers can browse products, manage cart, and place orders
- Admins can manage products (create, update, delete)
- Protected routes ensure secure access

### Image Upload
Product images are stored locally in the `backend/uploads/` directory. For production, consider using cloud storage (AWS S3, Cloudinary).

## 📝 License

MIT

## 👨‍💻 Author

Built with ❤️ for learning purposes
