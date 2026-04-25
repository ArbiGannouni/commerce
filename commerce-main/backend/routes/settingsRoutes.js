import express from 'express';
import db from '../config/database.js';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get site settings
router.get('/', (req, res) => {
    db.get('SELECT * FROM site_settings WHERE id = 1', [], (err, row) => {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
        }

        if (!row) {
            // Return default settings
            return res.json({
                siteName: 'E-Commerce',
                siteTagline: 'Your one-stop shop',
                logoUrl: '',
                primaryColor: '#f47b25',
                favicon: '',
            });
        }

        res.json({
            siteName: row.site_name,
            siteTagline: row.site_tagline,
            logoUrl: row.logo_url,
            primaryColor: row.primary_color,
            favicon: row.favicon,
        });
    });
});

// Save site settings (admin only)
router.post('/', authMiddleware, adminMiddleware, (req, res) => {
    const { siteName, siteTagline, logoUrl, primaryColor, favicon } = req.body;

    // Check if settings exist
    db.get('SELECT id FROM site_settings WHERE id = 1', [], (err, row) => {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
        }

        if (row) {
            // Update existing settings
            db.run(
                `UPDATE site_settings SET 
          site_name = ?, 
          site_tagline = ?, 
          logo_url = ?, 
          primary_color = ?, 
          favicon = ?,
          updated_at = CURRENT_TIMESTAMP 
        WHERE id = 1`,
                [siteName, siteTagline, logoUrl, primaryColor, favicon],
                function (err) {
                    if (err) {
                        return res.status(500).json({ message: 'Error updating settings' });
                    }
                    res.json({ message: 'Settings updated successfully' });
                }
            );
        } else {
            // Insert new settings
            db.run(
                `INSERT INTO site_settings (id, site_name, site_tagline, logo_url, primary_color, favicon) 
         VALUES (1, ?, ?, ?, ?, ?)`,
                [siteName, siteTagline, logoUrl, primaryColor, favicon],
                function (err) {
                    if (err) {
                        return res.status(500).json({ message: 'Error saving settings' });
                    }
                    res.json({ message: 'Settings saved successfully' });
                }
            );
        }
    });
});

export default router;
