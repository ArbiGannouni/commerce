import jwt from 'jsonwebtoken';
import db from '../config/database.js';

// Verify JWT token
export const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from database
        db.get(
            'SELECT id, name, email, role FROM users WHERE id = ?',
            [decoded.userId],
            (err, user) => {
                if (err || !user) {
                    return res.status(401).json({ message: 'Invalid token' });
                }

                req.user = user;
                next();
            }
        );
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

// Check if user is admin
export const adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
        return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    next();
};

// Check if user is low admin or higher (includes admin)
export const lowAdminMiddleware = (req, res, next) => {
    if (req.user.role !== 'admin' && req.user.role !== 'lowadmin' && req.user.role !== 'manager' && req.user.role !== 'superadmin') {
        return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
    next();
};

// Check if user is super admin (for sensitive features like Page Builder)
export const superAdminMiddleware = (req, res, next) => {
    if (req.user.role !== 'superadmin') {
        return res.status(403).json({ message: 'Access denied. Super Admin only.' });
    }
    next();
};
