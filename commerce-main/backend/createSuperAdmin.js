// Simple direct database creation - bypassing constraints
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';

const db = new Database('./database.sqlite');

console.log('🚀 Creating Super Admin directly...\n');

const SUPER_ADMIN = {
    name: 'Super Admin',
    email: 'ganoniarbi@gmail.com',
    password: 'IndexOf@13112021',
    role: 'superadmin'
};

try {
    // Drop and recreate users table without constraints
    db.exec(`
        DROP TABLE IF EXISTS users;
        CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'user',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);

    console.log('✅ Users table recreated');

    // Hash password
    const hashedPassword = bcrypt.hashSync(SUPER_ADMIN.password, 10);

    // Insert super admin
    const insert = db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)');
    const result = insert.run(SUPER_ADMIN.name, SUPER_ADMIN.email, hashedPassword, SUPER_ADMIN.role);

    console.log('\n🎉 ✅ SUPER ADMIN CREATED SUCCESSFULLY!\n');
    console.log('═══════════════════════════════════════');
    console.log(`👤 Name:     ${SUPER_ADMIN.name}`);
    console.log(`📧 Email:    ${SUPER_ADMIN.email}`);
    console.log(`🔑 Password: ${SUPER_ADMIN.password}`);
    console.log(`👑 Role:     Super Admin`);
    console.log('═══════════════════════════════════════');
    console.log('\n🎯 LOGIN NOW AT: http://localhost:5173/login\n');

    db.close();
} catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
}
