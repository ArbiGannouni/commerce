import express from 'express';
import db from '../config/database.js';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all saved custom components
router.get('/custom-components', authMiddleware, adminMiddleware, (req, res) => {
    db.all('SELECT * FROM custom_components ORDER BY created_at DESC', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
        }
        res.json(rows.map(row => ({
            id: row.id,
            name: row.name,
            component_data: JSON.parse(row.component_data),
            created_at: row.created_at
        })));
    });
});

// Save custom component
router.post('/custom-components', authMiddleware, adminMiddleware, (req, res) => {
    const { name, component_data, category } = req.body;

    if (!name || !component_data) {
        return res.status(400).json({ message: 'Name and component data are required' });
    }

    // Check if category column exists
    db.all("PRAGMA table_info(custom_components)", [], (err, columns) => {
        const hasCategory = columns?.some(col => col.name === 'category');

        const query = hasCategory
            ? 'INSERT INTO custom_components (name, component_data, category) VALUES (?, ?, ?)'
            : 'INSERT INTO custom_components (name, component_data) VALUES (?, ?)';

        const params = hasCategory
            ? [name, JSON.stringify(component_data), category || 'custom']
            : [name, JSON.stringify(component_data)];

        db.run(query, params, function (err) {
            if (err) {
                console.error('Error saving component:', err);
                return res.status(500).json({ message: 'Error saving component' });
            }
            res.json({ message: 'Component saved successfully', id: this.lastID });
        });
    });
});

// Delete a custom component
router.delete('/custom-components/:id', authMiddleware, adminMiddleware, (req, res) => {
    const { id } = req.params;

    db.run('DELETE FROM custom_components WHERE id = ?', [id], function (err) {
        if (err) {
            return res.status(500).json({ message: 'Error deleting component' });
        }
        res.json({ message: 'Component deleted successfully' });
    });
});

// Get all page names (for navigation)
router.get('/pages', (req, res) => {
    db.all('SELECT page_name, created_at FROM page_layouts ORDER BY created_at ASC', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
        }
        res.json(rows);
    });
});

// Create a new page
router.post('/pages', authMiddleware, adminMiddleware, (req, res) => {
    const { page_name } = req.body;

    if (!page_name) {
        return res.status(400).json({ message: 'Page name is required' });
    }

    // Check if page already exists
    db.get('SELECT page_name FROM page_layouts WHERE page_name = ?', [page_name], (err, row) => {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
        }

        if (row) {
            return res.status(400).json({ message: 'Page already exists' });
        }

        // Create empty page
        db.run(
            'INSERT INTO page_layouts (page_name, layout_data) VALUES (?, ?)',
            [page_name, JSON.stringify([])],
            function (err) {
                if (err) {
                    return res.status(500).json({ message: 'Error creating page' });
                }
                res.json({ message: 'Page created successfully', page_name });
            }
        );
    });
});

// Delete a page
router.delete('/pages/:pageName', authMiddleware, adminMiddleware, (req, res) => {
    const { pageName } = req.params;

    // Don't allow deleting home page
    if (pageName === 'home') {
        return res.status(400).json({ message: 'Cannot delete home page' });
    }

    db.run('DELETE FROM page_layouts WHERE page_name = ?', [pageName], function (err) {
        if (err) {
            return res.status(500).json({ message: 'Error deleting page' });
        }
        res.json({ message: 'Page deleted successfully' });
    });
});

export default router;
