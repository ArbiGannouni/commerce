import express from 'express';
import db from '../config/database.js';
import { authMiddleware, lowAdminMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// All order routes require authentication
router.use(authMiddleware);

// Get all orders with items (admin only)
router.get('/all', lowAdminMiddleware, (req, res) => {
    const query = `
    SELECT 
      orders.*,
      users.name as user_name,
      users.email as user_email
    FROM orders
    LEFT JOIN users ON orders.user_id = users.id
    ORDER BY orders.created_at DESC
  `;

    db.all(query, [], (err, orders) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching orders' });
        }

        // Get items for each order
        const ordersWithItems = orders.map(order => {
            return new Promise((resolve, reject) => {
                const itemsQuery = `
                    SELECT 
                      order_items.*,
                      products.name,
                      products.image
                    FROM order_items
                    JOIN products ON order_items.product_id = products.id
                    WHERE order_items.order_id = ?
                `;
                db.all(itemsQuery, [order.id], (err, items) => {
                    if (err) reject(err);
                    else resolve({ ...order, items });
                });
            });
        });

        Promise.all(ordersWithItems)
            .then(results => res.json(results))
            .catch(() => res.status(500).json({ message: 'Error fetching order details' }));
    });
});

// Create order from cart
router.post('/', (req, res) => {
    const { shipping_address, payment_method } = req.body;

    if (!shipping_address) {
        return res.status(400).json({ message: 'Shipping address is required' });
    }

    const cartQuery = `
    SELECT 
      cart.product_id,
      cart.quantity,
      products.price,
      products.stock,
      products.name
    FROM cart
    JOIN products ON cart.product_id = products.id
    WHERE cart.user_id = ?
  `;

    db.all(cartQuery, [req.user.id], (err, cartItems) => {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
        }

        if (cartItems.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        for (const item of cartItems) {
            if (item.stock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${item.name}` });
            }
        }

        const total_amount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // Check if payment_method column exists, if not use old query
        db.all("PRAGMA table_info(orders)", [], (err, columns) => {
            const hasPaymentMethod = columns?.some(col => col.name === 'payment_method');

            const query = hasPaymentMethod
                ? 'INSERT INTO orders (user_id, total_amount, shipping_address, payment_method, status) VALUES (?, ?, ?, ?, ?)'
                : 'INSERT INTO orders (user_id, total_amount, shipping_address, status) VALUES (?, ?, ?, ?)';

            const params = hasPaymentMethod
                ? [req.user.id, total_amount, shipping_address, payment_method || 'card', 'pending']
                : [req.user.id, total_amount, shipping_address, 'pending'];

            db.run(query, params,
                function (err) {
                    if (err) {
                        return res.status(500).json({ message: 'Error creating order' });
                    }

                    const orderId = this.lastID;
                    const orderItemsPromises = cartItems.map((item) => {
                        return new Promise((resolve, reject) => {
                            db.run(
                                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                                [orderId, item.product_id, item.quantity, item.price],
                                (err) => {
                                    if (err) reject(err);
                                    else {
                                        db.run('UPDATE products SET stock = stock - ? WHERE id = ?',
                                            [item.quantity, item.product_id],
                                            (err) => err ? reject(err) : resolve()
                                        );
                                    }
                                }
                            );
                        });
                    });

                    Promise.all(orderItemsPromises)
                        .then(() => {
                            db.run('DELETE FROM cart WHERE user_id = ?', [req.user.id], () => {
                                db.get('SELECT * FROM orders WHERE id = ?', [orderId], (err, order) => {
                                    if (err) {
                                        return res.status(500).json({ message: 'Order created but error fetching details' });
                                    }
                                    res.status(201).json({ message: 'Order created successfully', order });
                                });
                            });
                        })
                        .catch((err) => res.status(500).json({ message: 'Error creating order items', error: err.message }));
                }
            );
        }); // Close PRAGMA callback
    }); // Close cartQuery callback
});

// Get user's orders
router.get('/', (req, res) => {
    db.all(
        'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
        [req.user.id],
        (err, orders) => {
            if (err) {
                return res.status(500).json({ message: 'Error fetching orders' });
            }
            res.json(orders);
        }
    );
});

// Get single order with items
router.get('/:id', (req, res) => {
    const orderId = req.params.id;

    // Get order
    db.get(
        'SELECT * FROM orders WHERE id = ? AND user_id = ?',
        [orderId, req.user.id],
        (err, order) => {
            if (err) {
                return res.status(500).json({ message: 'Database error' });
            }

            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            // Get order items
            const itemsQuery = `
        SELECT 
          order_items.*,
          products.name,
          products.image
        FROM order_items
        JOIN products ON order_items.product_id = products.id
        WHERE order_items.order_id = ?
      `;

            db.all(itemsQuery, [orderId], (err, items) => {
                if (err) {
                    return res.status(500).json({ message: 'Error fetching order items' });
                }

                res.json({
                    ...order,
                    items
                });
            });
        }
    );
});

// Update order status (admin only)
router.patch('/:id/status', lowAdminMiddleware, (req, res) => {
    const { status } = req.body;
    const orderId = req.params.id;

    const validStatuses = ['pending', 'processing', 'on-the-way', 'delivered', 'canceled'];

    console.log(`📝 Order status update request: Order #${orderId} -> "${status}"`);

    if (!validStatuses.includes(status)) {
        console.error(`❌ Invalid status attempted: "${status}"`);
        return res.status(400).json({
            message: 'Invalid status',
            validStatuses,
            receivedStatus: status
        });
    }

    // Check if updated_at column exists
    db.all("PRAGMA table_info(orders)", [], (err, columns) => {
        const hasUpdatedAt = columns?.some(col => col.name === 'updated_at');

        const query = hasUpdatedAt
            ? 'UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
            : 'UPDATE orders SET status = ? WHERE id = ?';

        db.run(query, [status, orderId], function (err) {
            if (err) {
                console.error(`❌ Database error updating order #${orderId}:`, err.message);
                return res.status(500).json({
                    message: 'Error updating order status',
                    error: err.message
                });
            }
            if (this.changes === 0) {
                console.error(`❌ Order #${orderId} not found`);
                return res.status(404).json({ message: 'Order not found' });
            }
            console.log(`✅ Order #${orderId} status updated to "${status}"`);
            res.json({ message: 'Order status updated successfully', status });
        });
    });
});

export default router;
