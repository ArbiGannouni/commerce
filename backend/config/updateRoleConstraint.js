import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, '..', 'ecommerce.db');

const db = new sqlite3.Database(dbPath);

console.log('🔧 Updating users table to allow "manager" role...\n');

db.serialize(() => {
    // Create a new table with the updated constraint
    db.run(`
        CREATE TABLE IF NOT EXISTS users_new (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'customer' CHECK(role IN ('admin', 'lowadmin', 'manager', 'customer', 'superadmin')),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('❌ Error creating new users table:', err);
            return;
        }
        console.log('✅ Created new users table with updated constraint');
    });

    // Copy data from old table to new table
    db.run(`
        INSERT INTO users_new (id, name, email, password, role, created_at)
        SELECT id, name, email, password, role, created_at
        FROM users
    `, (err) => {
        if (err) {
            console.error('❌ Error copying users data:', err);
            return;
        }
        console.log('✅ Copied all user data to new table');
    });

    // Drop the old table
    db.run('DROP TABLE users', (err) => {
        if (err) {
            console.error('❌ Error dropping old users table:', err);
            return;
        }
        console.log('✅ Dropped old users table');
    });

    // Rename new table to users
    db.run('ALTER TABLE users_new RENAME TO users', (err) => {
        if (err) {
            console.error('❌ Error renaming table:', err);
            return;
        }
        console.log('✅ Renamed users_new to users');
        console.log('\n🎉 Database update complete! The "manager" role is now allowed.\n');
        db.close();
    });
});
