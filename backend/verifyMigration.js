import db from './config/database.js';
import { migrateOrderStatuses } from './config/migrations.js';

console.log('🔍 Verifying database schema for orders table...\n');

// Check current schema
db.all("PRAGMA table_info(orders)", [], async (err, columns) => {
    if (err) {
        console.error('❌ Error checking schema:', err);
        process.exit(1);
    }

    console.log('📋 Current orders table schema:');
    columns.forEach(col => {
        console.log(`  - ${col.name}: ${col.type}${col.dflt_value ? ` (default: ${col.dflt_value})` : ''}`);
    });

    // Check if updated_at exists
    const hasUpdatedAt = columns.some(col => col.name === 'updated_at');
    const hasPaymentMethod = columns.some(col => col.name === 'payment_method');

    console.log('\n📊 Schema check results:');
    console.log(`  - updated_at column: ${hasUpdatedAt ? '✅ EXISTS' : '❌ MISSING'}`);
    console.log(`  - payment_method column: ${hasPaymentMethod ? '✅ EXISTS' : '❌ MISSING'}`);

    // Get sample order to check status values
    db.get("SELECT * FROM orders LIMIT 1", [], (err, order) => {
        if (order) {
            console.log(`\n📝 Sample order status: "${order.status}"`);
        }

        // Check for any orders with old status values
        db.all(`
            SELECT DISTINCT status FROM orders 
            WHERE status IN ('shipped', 'cancelled')
        `, [], async (err, oldStatuses) => {
            if (err) {
                console.error('❌ Error checking old statuses:', err);
            } else if (oldStatuses.length > 0) {
                console.log('\n⚠️  Found old status values:');
                oldStatuses.forEach(row => console.log(`  - "${row.status}"`));
                console.log('\n🔄 Running migration to fix statuses...');

                try {
                    await migrateOrderStatuses();
                    console.log('✅ Migration completed successfully!');
                } catch (migErr) {
                    console.error('❌ Migration failed:', migErr);
                    process.exit(1);
                }
            } else {
                console.log('\n✅ No old status values found');
            }

            if (!hasUpdatedAt || !hasPaymentMethod) {
                console.log('\n🔄 Running migration to add missing columns...');
                try {
                    await migrateOrderStatuses();
                    console.log('✅ Migration completed successfully!');
                } catch (migErr) {
                    console.error('❌ Migration failed:', migErr);
                    process.exit(1);
                }
            }

            console.log('\n✨ Database verification complete!');
            console.log('\n📌 Valid order statuses:');
            console.log('  - pending');
            console.log('  - processing');
            console.log('  - on-the-way');
            console.log('  - delivered');
            console.log('  - canceled');

            process.exit(0);
        });
    });
});
