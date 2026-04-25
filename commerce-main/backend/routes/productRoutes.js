import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import db from '../config/database.js';
import { authMiddleware, lowAdminMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

// Get all products (with optional filters)
router.get('/', (req, res) => {
    const { category, search, minPrice, maxPrice } = req.query;

    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (category) {
        query += ' AND category = ?';
        params.push(category);
    }

    if (search) {
        query += ' AND (name LIKE ? OR description LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
    }

    if (minPrice) {
        query += ' AND price >= ?';
        params.push(parseFloat(minPrice));
    }

    if (maxPrice) {
        query += ' AND price <= ?';
        params.push(parseFloat(maxPrice));
    }

    query += ' ORDER BY created_at DESC';

    db.all(query, params, (err, products) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching products', error: err.message });
        }
        res.json(products);
    });
});

// Get single product
router.get('/:id', (req, res) => {
    db.get('SELECT * FROM products WHERE id = ?', [req.params.id], (err, product) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching product', error: err.message });
        }

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    });
});

// Create product (admin only)
router.post('/', authMiddleware, lowAdminMiddleware, upload.single('image'), (req, res) => {
    try {
        const { name, description, price, stock, category } = req.body;

        if (!name || !price) {
            return res.status(400).json({ message: 'Name and price are required' });
        }

        const image = req.file ? `/uploads/${req.file.filename}` : null;

        db.run(
            `INSERT INTO products (name, description, price, image, stock, category)
       VALUES (?, ?, ?, ?, ?, ?)`,
            [name, description || '', parseFloat(price), image, parseInt(stock) || 0, category || 'General'],
            function (err) {
                if (err) {
                    return res.status(500).json({ message: 'Error creating product', error: err.message });
                }

                db.get('SELECT * FROM products WHERE id = ?', [this.lastID], (err, product) => {
                    if (err) {
                        return res.status(500).json({ message: 'Product created but error fetching details' });
                    }
                    res.status(201).json({ message: 'Product created successfully', product });
                });
            }
        );
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update product (admin only)
router.put('/:id', authMiddleware, lowAdminMiddleware, upload.single('image'), (req, res) => {
    try {
        const { name, description, price, stock, category } = req.body;
        const productId = req.params.id;

        // Check if product exists
        db.get('SELECT * FROM products WHERE id = ?', [productId], (err, product) => {
            if (err) {
                return res.status(500).json({ message: 'Database error' });
            }

            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            const image = req.file ? `/uploads/${req.file.filename}` : product.image;

            db.run(
                `UPDATE products 
         SET name = ?, description = ?, price = ?, image = ?, stock = ?, category = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
                [
                    name || product.name,
                    description !== undefined ? description : product.description,
                    price ? parseFloat(price) : product.price,
                    image,
                    stock !== undefined ? parseInt(stock) : product.stock,
                    category || product.category,
                    productId
                ],
                function (err) {
                    if (err) {
                        return res.status(500).json({ message: 'Error updating product', error: err.message });
                    }

                    db.get('SELECT * FROM products WHERE id = ?', [productId], (err, updatedProduct) => {
                        if (err) {
                            return res.status(500).json({ message: 'Product updated but error fetching details' });
                        }
                        res.json({ message: 'Product updated successfully', product: updatedProduct });
                    });
                }
            );
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Delete product (admin only)
router.delete('/:id', authMiddleware, lowAdminMiddleware, (req, res) => {
    db.run('DELETE FROM products WHERE id = ?', [req.params.id], function (err) {
        if (err) {
            return res.status(500).json({ message: 'Error deleting product', error: err.message });
        }

        if (this.changes === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Product deleted successfully' });
    });
});

export default router;
