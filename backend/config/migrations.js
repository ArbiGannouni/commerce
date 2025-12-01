import db from './database.js';

// Migration to update order status constraint
export const migrateOrderStatuses = () => {
    return new Promise((resolve, reject) => {
        console.log('Migrating order status values...');

        // SQLite doesn't support ALTER COLUMN with CHECK constraints
        // We need to recreate the table
        db.serialize(() => {
            // Create new table with updated statuses
            db.run(`
        CREATE TABLE IF NOT EXISTS orders_new (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          total_amount REAL NOT NULL,
          status TEXT DEFAULT 'pending',
          payment_method TEXT DEFAULT 'card',
          shipping_address TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
        )
      `, (err) => {
                if (err) {
                    console.error('Error creating orders_new table:', err);
                    reject(err);
                    return;
                }

                // Copy data from old table
                db.run(`
          INSERT INTO orders_new (id, user_id, total_amount, status, shipping_address, created_at, updated_at)
          SELECT id, user_id, total_amount, 
                 CASE 
                   WHEN status = 'shipped' THEN 'on-the-way'
                   WHEN status = 'cancelled' THEN 'canceled'
                   ELSE status
                 END as status,
                 shipping_address, created_at, 
                 COALESCE(updated_at, created_at) as updated_at
          FROM orders
        `, (err) => {
                    if (err) {
                        console.error('Error copying order data:', err);
                        // If this fails, the table might not exist yet, which is okay
                    }

                    // Drop old table
                    db.run('DROP TABLE IF EXISTS orders', (err) => {
                        if (err) {
                            console.error('Error dropping old orders table:', err);
                        }

                        // Rename new table
                        db.run('ALTER TABLE orders_new RENAME TO orders', (err) => {
                            if (err) {
                                console.error('Error renaming orders table:', err);
                                reject(err);
                            } else {
                                console.log('Order status migration completed successfully');
                                resolve();
                            }
                        });
                    });
                });
            });
        });
    });
};

// Migration to add category to custom_components
export const migrateComponentCategories = () => {
    return new Promise((resolve, reject) => {
        // Check if column exists
        db.all("PRAGMA table_info(custom_components)", [], (err, columns) => {
            if (err) {
                console.error('Error checking custom_components schema:', err);
                reject(err);
                return;
            }

            const hasCategory = columns.some(col => col.name === 'category');

            if (!hasCategory) {
                console.log('Adding category column to custom_components table...');
                db.run(
                    "ALTER TABLE custom_components ADD COLUMN category TEXT DEFAULT 'custom'",
                    [],
                    (err) => {
                        if (err) {
                            console.error('Error adding category column:', err);
                            reject(err);
                        } else {
                            console.log('Successfully added category column');
                            resolve();
                        }
                    }
                );
            } else {
                console.log('category column already exists');
                resolve();
            }
        });
    });
};
