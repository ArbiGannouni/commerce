import express from 'express';
import db from '../config/database.js';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Save or update page layout (admin only)
router.post('/save', authMiddleware, adminMiddleware, (req, res) => {
    const { page_name, layout_data, page_settings } = req.body;

    if (!page_name || !layout_data) {
        return res.status(400).json({ message: 'Page name and layout data are required' });
    }

    // Check if page already exists
    db.get('SELECT id FROM page_layouts WHERE page_name = ?', [page_name], (err, row) => {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
        }

        const layoutJson = JSON.stringify(layout_data);
        const settingsJson = JSON.stringify(page_settings || {});

        if (row) {
            // Update existing layout
            db.run(
                'UPDATE page_layouts SET layout_data = ?, page_settings = ?, updated_at = CURRENT_TIMESTAMP WHERE page_name = ?',
                [layoutJson, settingsJson, page_name],
                function (err) {
                    if (err) {
                        return res.status(500).json({ message: 'Error updating layout' });
                    }
                    res.json({ message: 'Page layout updated successfully', page_name });
                }
            );
        } else {
            // Insert new layout
            db.run(
                'INSERT INTO page_layouts (page_name, layout_data, page_settings) VALUES (?, ?, ?)',
                [page_name, layoutJson, settingsJson],
                function (err) {
                    if (err) {
                        return res.status(500).json({ message: 'Error saving layout' });
                    }
                    res.json({ message: 'Page layout saved successfully', page_name });
                }
            );
        }
    });
});

// Get page layout by name
router.get('/:pageName', (req, res) => {
    const { pageName } = req.params;

    db.get('SELECT * FROM page_layouts WHERE page_name = ?', [pageName], (err, row) => {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
        }

        if (!row) {
            return res.status(404).json({ message: 'Page layout not found' });
        }

        res.json({
            page_name: row.page_name,
            layout_data: JSON.parse(row.layout_data),
            page_settings: row.page_settings ? JSON.parse(row.page_settings) : {},
            created_at: row.created_at,
            updated_at: row.updated_at
        });
    });
});

// Get all page layouts (admin only)
router.get('/', authMiddleware, adminMiddleware, (req, res) => {
    db.all('SELECT page_name, created_at, updated_at FROM page_layouts', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
        }
        res.json(rows);
    });
});

// Delete page layout (admin only)
router.delete('/:pageName', authMiddleware, adminMiddleware, (req, res) => {
    const { pageName } = req.params;

    db.run('DELETE FROM page_layouts WHERE page_name = ?', [pageName], function (err) {
        if (err) {
            return res.status(500).json({ message: 'Error deleting layout' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ message: 'Page layout not found' });
        }

        res.json({ message: 'Page layout deleted successfully' });
    });
});

export default router;
