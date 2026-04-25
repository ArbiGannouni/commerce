import express from 'express';
import db from '../config/database.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// All cart routes require authentication
router.use(authMiddleware);

// Get user's cart
router.get('/', (req, res) => {
    const query = `
    SELECT 
      cart.id,
      cart.quantity,
      cart.created_at,
      products.id as product_id,
      products.name,
      products.description,
      products.price,
      products.image,
      products.stock
    FROM cart
    JOIN products ON cart.product_id = products.id
    WHERE cart.user_id = ?
    ORDER BY cart.created_at DESC
  `;

    db.all(query, [req.user.id], (err, cartItems) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching cart', error: err.message });
        }
        res.json(cartItems);
    });
});

// Add item to cart
router.post('/', (req, res) => {
    const { product_id, quantity = 1 } = req.body;

    if (!product_id) {
        return res.status(400).json({ message: 'Product ID is required' });
    }

    // Check if product exists and has stock
    db.get('SELECT * FROM products WHERE id = ?', [product_id], (err, product) => {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
        }

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.stock < quantity) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        // Check if item already in cart
        db.get(
            'SELECT * FROM cart WHERE user_id = ? AND product_id = ?',
            [req.user.id, product_id],
            (err, existingItem) => {
                if (err) {
                    return res.status(500).json({ message: 'Database error' });
                }

                if (existingItem) {
                    // Update quantity
                    const newQuantity = existingItem.quantity + quantity;

                    if (product.stock < newQuantity) {
                        return res.status(400).json({ message: 'Insufficient stock' });
                    }

                    db.run(
                        'UPDATE cart SET quantity = ? WHERE id = ?',
                        [newQuantity, existingItem.id],
                        (err) => {
                            if (err) {
                                return res.status(500).json({ message: 'Error updating cart' });
                            }
                            res.json({ message: 'Cart updated successfully' });
                        }
                    );
                } else {
                    // Add new item
                    db.run(
                        'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
                        [req.user.id, product_id, quantity],
                        function (err) {
                            if (err) {
                                return res.status(500).json({ message: 'Error adding to cart' });
                            }
                            res.status(201).json({ message: 'Item added to cart', id: this.lastID });
                        }
                    );
                }
            }
        );
    });
});

// Update cart item quantity
router.put('/:id', (req, res) => {
    const { quantity } = req.body;
    const cartItemId = req.params.id;

    if (!quantity || quantity < 1) {
        return res.status(400).json({ message: 'Valid quantity is required' });
    }

    // Get cart item with product info
    db.get(
        `SELECT cart.*, products.stock 
     FROM cart 
     JOIN products ON cart.product_id = products.id 
     WHERE cart.id = ? AND cart.user_id = ?`,
        [cartItemId, req.user.id],
        (err, cartItem) => {
            if (err) {
                return res.status(500).json({ message: 'Database error' });
            }

            if (!cartItem) {
                return res.status(404).json({ message: 'Cart item not found' });
            }

            if (cartItem.stock < quantity) {
                return res.status(400).json({ message: 'Insufficient stock' });
            }

            db.run(
                'UPDATE cart SET quantity = ? WHERE id = ?',
                [quantity, cartItemId],
                (err) => {
                    if (err) {
                        return res.status(500).json({ message: 'Error updating cart' });
                    }
                    res.json({ message: 'Cart item updated successfully' });
                }
            );
        }
    );
});

// Remove item from cart
router.delete('/:id', (req, res) => {
    db.run(
        'DELETE FROM cart WHERE id = ? AND user_id = ?',
        [req.params.id, req.user.id],
        function (err) {
            if (err) {
                return res.status(500).json({ message: 'Error removing item' });
            }

            if (this.changes === 0) {
                return res.status(404).json({ message: 'Cart item not found' });
            }

            res.json({ message: 'Item removed from cart' });
        }
    );
});

// Clear cart
router.delete('/', (req, res) => {
    db.run('DELETE FROM cart WHERE user_id = ?', [req.user.id], (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error clearing cart' });
        }
        res.json({ message: 'Cart cleared successfully' });
    });
});

export default router;
