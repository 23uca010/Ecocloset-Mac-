const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, 'backend', 'ecocloset.db');
const db = new Database(dbPath);

console.log('Running migration to fix swaps table schema...');

try {
    const columns = db.prepare("PRAGMA table_info(swaps)").all();
    const columnNames = columns.map(c => c.name);
    
    if (!columnNames.includes('message')) {
        console.log('Adding missing column "message" to swaps table...');
        db.exec("ALTER TABLE swaps ADD COLUMN message TEXT");
        console.log('Column "message" added successfully.');
    } else {
        console.log('Column "message" already exists.');
    }
    
    // Check if other columns from newer schema are missing
    const requiredColumns = [
        { name: 'user_a_id', type: 'INTEGER' },
        { name: 'user_b_id', type: 'INTEGER' },
        { name: 'item_a_id', type: 'INTEGER' },
        { name: 'item_b_id', type: 'INTEGER' }
    ];
    
    requiredColumns.forEach(col => {
        if (!columnNames.includes(col.name)) {
            console.log(`Adding missing column "${col.name}" to swaps table...`);
            db.exec(`ALTER TABLE swaps ADD COLUMN ${col.name} ${col.type}`);
            console.log(`Column "${col.name}" added successfully.`);
        }
    });

    console.log('Migration complete.');
} catch (e) {
    console.error('Migration failed:', e.message);
}
