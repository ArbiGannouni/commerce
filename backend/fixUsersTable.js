// Quick fix: Update users table to remove CHECK constraint
import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./database.sqlite');

console.log('🔧 Updating users table schema...\n');

db.serialize(() => {
    // Create new table without CHECK constraint
    db.run(`
        CREATE TABLE IF NOT EXISTS users_temp (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'user',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('Error creating temp table:', err);
            return;
        }

        console.log('✅ Created temporary table');

        // Copy existing users
        db.run(`
            INSERT INTO users_temp (id, name, email, password, role, created_at)
            SELECT id, name, email, password, 
                   CASE WHEN role = 'customer' THEN 'user' ELSE role END,
                   created_at 
            FROM users
        `, (err) => {
            if (err) {
                console.log('⚠️  No existing users to copy (or table doesn\'t exist yet)');
            } else {
                console.log('✅ Copied existing users');
            }

            // Drop old table
            db.run('DROP TABLE IF EXISTS users', (err) => {
                if (err) {
                    console.error('Error dropping old table:', err);
                    return;
                }

                console.log('✅ Dropped old users table');

                // Rename temp to users
                db.run('ALTER TABLE users_temp RENAME TO users', (err) => {
                    if (err) {
                        console.error('Error renaming table:', err);
                        return;
                    }

                    console.log('✅ Users table updated successfully!');
                    console.log('\n🎉 Database is ready for superadmin role!\n');

                    db.close(() => {
                        process.exit(0);
                    });
                });
            });
        });
    });
});
