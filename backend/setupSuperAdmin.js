// Setup Super Admin Account
// This script creates the super admin account with your credentials

import bcrypt from 'bcryptjs';
import db from './config/database.js';

const SUPER_ADMIN = {
    name: 'Super Admin',
    email: 'ganoniarbi@gmail.com',
    password: 'IndexOf@13112021',
    role: 'superadmin'
};

console.log('🚀 Setting up Super Admin account...\n');

// Check if user exists
db.get('SELECT * FROM users WHERE email = ?', [SUPER_ADMIN.email], async (err, user) => {
    if (err) {
        console.error('❌ Database error:', err);
        process.exit(1);
    }

    if (user) {
        // User exists, just promote to superadmin
        db.run('UPDATE users SET role = ? WHERE email = ?', ['superadmin', SUPER_ADMIN.email], (err) => {
            if (err) {
                console.error('❌ Error updating user role:', err);
                process.exit(1);
            }
            console.log('✅ User already exists - promoted to Super Admin!');
            console.log(`\n📧 Email: ${SUPER_ADMIN.email}`);
            console.log(`🔑 Password: ${SUPER_ADMIN.password}`);
            console.log(`\n🎯 You can now login at: /login\n`);
            process.exit(0);
        });
    } else {
        // User doesn't exist, create new super admin
        bcrypt.hash(SUPER_ADMIN.password, 10, (err, hashedPassword) => {
            if (err) {
                console.error('❌ Error hashing password:', err);
                process.exit(1);
            }

            db.run(
                'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
                [SUPER_ADMIN.name, SUPER_ADMIN.email, hashedPassword, SUPER_ADMIN.role],
                function (err) {
                    if (err) {
                        console.error('❌ Error creating user:', err);
                        process.exit(1);
                    }

                    console.log('✅ Super Admin account created successfully!');
                    console.log(`\n👤 Name: ${SUPER_ADMIN.name}`);
                    console.log(`📧 Email: ${SUPER_ADMIN.email}`);
                    console.log(`🔑 Password: ${SUPER_ADMIN.password}`);
                    console.log(`👑 Role: Super Admin`);
                    console.log(`\n🎯 You can now login at: /login\n`);
                    process.exit(0);
                }
            );
        });
    }
});
