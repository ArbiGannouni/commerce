// Direct SQL insertion - bypasses all constraints
import bcrypt from 'bcryptjs';
import db from './config/database.js';

const SUPER_ADMIN = {
    name: 'Super Admin',
    email: 'ganoniarbi@gmail.com',
    password: 'IndexOf@13112021'
};

console.log('🚀 Creating your Super Admin account directly...\n');

bcrypt.hash(SUPER_ADMIN.password, 10, (err, hashedPassword) => {
    if (err) {
        console.error('❌ Error hashing password:', err);
        process.exit(1);
    }

    // Use raw SQL with PRAGMA to temporarily disable foreign keys and constraints
    db.serialize(() => {
        db.run('PRAGMA foreign_keys = OFF', (err) => {
            if (err) console.error('Error disabling foreign keys:', err);

            // Try to insert directly, ignore constraint
            db.run(
                `INSERT OR REPLACE INTO users (name, email, password, role, created_at) 
                 VALUES (?, ?, ?, 'superadmin', datetime('now'))`,
                [SUPER_ADMIN.name, SUPER_ADMIN.email, hashedPassword],
                function (err) {
                    db.run('PRAGMA foreign_keys = ON'); // Re-enable

                    if (err) {
                        console.error('❌ Error:', err.message);
                        console.log('\n⚠️  Trying alternative method...\n');

                        // Try updating if user exists
                        db.run(
                            'UPDATE users SET role = ?, password = ? WHERE email = ?',
                            ['superadmin', hashedPassword, SUPER_ADMIN.email],
                            function (err) {
                                if (err || this.changes === 0) {
                                    console.error('❌ Could not create super admin.');
                                    console.log('\n📝 MANUAL STEPS:');
                                    console.log('1. Restart backend (Ctrl+C, then npm run dev)');
                                    console.log('2. Register at /register with:');
                                    console.log(`   Email: ${SUPER_ADMIN.email}`);
                                    console.log(`   Password: ${SUPER_ADMIN.password}`);
                                    console.log('3. Then run: node promoteToSuperAdmin.js ' + SUPER_ADMIN.email);
                                    process.exit(1);
                                } else {
                                    console.log('✅ Updated existing user to Super Admin!\n');
                                    printSuccess();
                                    process.exit(0);
                                }
                            }
                        );
                    } else {
                        console.log('✅ Super Admin created successfully!\n');
                        printSuccess();
                        process.exit(0);
                    }
                }
            );
        });
    });
});

function printSuccess() {
    console.log('═══════════════════════════════════════════════');
    console.log('🎉 YOUR SUPER ADMIN ACCOUNT IS READY!');
    console.log('═══════════════════════════════════════════════');
    console.log(`👤 Name:     ${SUPER_ADMIN.name}`);
    console.log(`📧 Email:    ${SUPER_ADMIN.email}`);
    console.log(`🔑 Password: ${SUPER_ADMIN.password}`);
    console.log(`👑 Role:     Super Admin`);
    console.log('═══════════════════════════════════════════════');
    console.log('\n🎯 LOGIN NOW AT:');
    console.log('   http://localhost:5173/login\n');
    console.log('📍 After login, access:');
    console.log('   • Page Builder: /admin/page-builder');
    console.log('   • User Management: /admin/users');
    console.log('   • All Admin Features\n');
}
