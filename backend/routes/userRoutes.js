import express from 'express';
import db from '../config/database.js';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all users (admin only)
router.get('/all', authMiddleware, adminMiddleware, (req, res) => {
    db.all(
        'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC',
        [],
        (err, users) => {
            if (err) {
                return res.status(500).json({ message: 'Error fetching users' });
            }
            res.json(users);
        }
    );
});

// Update user role (admin only)
router.patch('/:id/role', authMiddleware, adminMiddleware, (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    // Validate role (accept both 'manager' and 'lowadmin' for backward compatibility)
    if (!['customer', 'lowadmin', 'manager', 'admin'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
    }

    // Prevent admin from demoting themselves
    if (parseInt(id) === req.user.id && role !== 'admin') {
        return res.status(400).json({ message: 'Cannot change your own role' });
    }

    db.run(
        'UPDATE users SET role = ? WHERE id = ?',
        [role, id],
        function (err) {
            if (err) {
                return res.status(500).json({ message: 'Error updating user role' });
            }

            if (this.changes === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json({ message: 'User role updated successfully' });
        }
    );
});

// Delete user (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, (req, res) => {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (parseInt(id) === req.user.id) {
        return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    db.run('DELETE FROM users WHERE id = ?', [id], function (err) {
        if (err) {
            return res.status(500).json({ message: 'Error deleting user' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    });
});

export default router;
