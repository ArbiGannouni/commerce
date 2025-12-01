import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeDatabase } from './config/database.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import pageBuilderRoutes from './routes/pageBuilderRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import builderRoutes from './routes/builderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
const corsOptions = {
    origin: [
        'http://localhost:3000',
        'http://localhost:5173',
        'https://arbigannouni.github.io'
    ],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/page-builder', pageBuilderRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/builder', builderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Initialize database and start server
initializeDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`\n🚀 Server is running on port ${PORT}`);
            console.log(`📦 API Base URL: http://localhost:${PORT}/api`);
            console.log(`\n📝 Available endpoints:`);
            console.log(`   Auth:     POST /api/auth/register, /api/auth/login`);
            console.log(`   Products: GET  /api/products`);
            console.log(`   Cart:     GET  /api/cart`);
            console.log(`   Orders:   GET  /api/orders`);
            console.log(`\n💡 Run 'npm run seed' to populate the database with sample data\n`);
        });
    })
    .catch((err) => {
        console.error('Failed to initialize database:', err);
        process.exit(1);
    });
