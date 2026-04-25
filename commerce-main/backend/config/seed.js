import db from './database.js';
import bcrypt from 'bcryptjs';

const seedData = async () => {
    console.log('Seeding database...');

    try {
        // Create admin user
        const adminPassword = await bcrypt.hash('admin123', 10);
        db.run(`
      INSERT OR IGNORE INTO users (name, email, password, role)
      VALUES (?, ?, ?, ?)
    `, ['Admin User', 'admin@ecommerce.com', adminPassword, 'admin'], (err) => {
            if (err) console.error('Error creating admin:', err);
            else console.log('Admin user created: admin@ecommerce.com / admin123');
        });

        // Create customer user
        const customerPassword = await bcrypt.hash('customer123', 10);
        db.run(`
      INSERT OR IGNORE INTO users (name, email, password, role)
      VALUES (?, ?, ?, ?)
    `, ['John Doe', 'customer@example.com', customerPassword, 'customer'], (err) => {
            if (err) console.error('Error creating customer:', err);
            else console.log('Customer user created: customer@example.com / customer123');
        });

        // Sample products
        const products = [
            {
                name: 'Wireless Headphones',
                description: 'Premium noise-cancelling wireless headphones with 30-hour battery life. Experience crystal-clear sound with deep bass and comfortable over-ear design.',
                price: 199.99,
                image: '/uploads/headphones.jpg',
                stock: 50,
                category: 'Electronics'
            },
            {
                name: 'Smart Watch',
                description: 'Fitness tracking smartwatch with heart rate monitor, GPS, and 7-day battery life. Water-resistant design perfect for all your activities.',
                price: 249.00,
                image: '/uploads/smartwatch.jpg',
                stock: 30,
                category: 'Electronics'
            },
            {
                name: 'Instant Camera',
                description: 'Retro-style instant camera with automatic exposure and built-in flash. Capture and print memories instantly with this classic design.',
                price: 120.50,
                image: '/uploads/camera.jpg',
                stock: 25,
                category: 'Electronics'
            },
            {
                name: 'Leather Backpack',
                description: 'Genuine leather backpack with multiple compartments and padded laptop sleeve. Stylish and durable for everyday use.',
                price: 175.00,
                image: '/uploads/backpack.jpg',
                stock: 40,
                category: 'Accessories'
            },
            {
                name: 'Running Shoes',
                description: 'Lightweight running shoes with responsive cushioning and breathable mesh upper. Perfect for your daily runs and training.',
                price: 89.99,
                image: '/uploads/shoes.jpg',
                stock: 60,
                category: 'Apparel'
            },
            {
                name: 'Yoga Mat',
                description: 'Premium non-slip yoga mat with extra cushioning. Eco-friendly material perfect for yoga, pilates, and fitness exercises.',
                price: 45.00,
                image: '/uploads/yogamat.jpg',
                stock: 100,
                category: 'Sports'
            },
            {
                name: 'Coffee Maker',
                description: 'Programmable coffee maker with thermal carafe. Brew perfect coffee every morning with this easy-to-use machine.',
                price: 79.99,
                image: '/uploads/coffeemaker.jpg',
                stock: 35,
                category: 'Home'
            },
            {
                name: 'Electric Kettle',
                description: 'Fast-boiling electric kettle with temperature control. Stainless steel design with auto shut-off for safety.',
                price: 39.99,
                image: '/uploads/kettle.jpg',
                stock: 45,
                category: 'Home'
            }
        ];

        const insertPromises = products.map((product) => {
            return new Promise((resolve, reject) => {
                db.run(`
          INSERT OR IGNORE INTO products (name, description, price, image, stock, category)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [product.name, product.description, product.price, product.image, product.stock, product.category],
                    function (err) {
                        if (err) reject(err);
                        else resolve(this.lastID);
                    });
            });
        });

        await Promise.all(insertPromises);
        console.log(`${products.length} products seeded successfully`);
        console.log('\nSeed completed! You can now start using the application.');
        console.log('\nTest Accounts:');
        console.log('Admin: admin@ecommerce.com / admin123');
        console.log('Customer: customer@example.com / customer123');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

// Initialize and seed
import { initializeDatabase } from './database.js';
initializeDatabase().then(() => {
    seedData();
}).catch((err) => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
});
