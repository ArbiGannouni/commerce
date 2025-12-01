// Script to promote a user to super admin
// Usage: node promoteToSuperAdmin.js <email>

import db from './config/database.js';

const email = process.argv[2];

if (!email) {
    console.log('Usage: node promoteToSuperAdmin.js <email>');
    process.exit(1);
}

db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) {
        console.error('Database error:', err);
        process.exit(1);
    }

    if (!user) {
        console.error(`User with email "${email}" not found`);
        process.exit(1);
    }

    db.run('UPDATE users SET role = ? WHERE email = ?', ['superadmin', email], (err) => {
        if (err) {
            console.error('Error updating user role:', err);
            process.exit(1);
        }

        console.log(`✅ Successfully promoted ${email} to super admin!`);
        console.log(`User can now access the Page Builder and all admin features.`);
        process.exit(0);
    });
});
