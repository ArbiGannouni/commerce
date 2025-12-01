import db from './config/database.js';

// Migration to update user role constraint
export const migrateUserRoles = () => {
    return new Promise((resolve, reject) => {
        console.log('Migrating user roles to support superadmin...');

        // SQLite doesn't support ALTER COLUMN, we need to recreate the table
        db.serialize(() => {
            // Create new table without role constraint
            db.run(`
        CREATE TABLE IF NOT EXISTS users_new (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT DEFAULT 'user',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
                if (err) {
                    console.error('Error creating users_new table:', err);
                    reject(err);
                    return;
                }

                // Copy data from old table
                db.run(`
          INSERT INTO users_new (id, name, email, password, role, created_at)
          SELECT id, name, email, password, 
                 CASE 
                   WHEN role = 'customer' THEN 'user'
                   ELSE role
                 END as role,
                 created_at
          FROM users
        `, (err) => {
                    if (err) {
                        console.error('Error copying user data:', err);
                        // Table might not exist yet, that's okay
                    }

                    // Drop old table
                    db.run('DROP TABLE IF EXISTS users', (err) => {
                        if (err) {
                            console.error('Error dropping old users table:', err);
                        }

                        // Rename new table
                        db.run('ALTER TABLE users_new RENAME TO users', (err) => {
                            if (err) {
                                console.error('Error renaming users table:', err);
                                reject(err);
                            } else {
                                console.log('User role migration completed successfully');
                                resolve();
                            }
                        });
                    });
                });
            });
        });
    });
};
