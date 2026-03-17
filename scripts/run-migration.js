const db = require('./backend/database/sqlite');
const fs = require('fs');

const reportFile = 'migration_report.txt';
fs.writeFileSync(reportFile, 'Starting migration report...\n');

try {
    const columns = db.prepare("PRAGMA table_info(swaps)").all();
    const columnNames = columns.map(c => c.name);
    fs.appendFileSync(reportFile, 'Current columns: ' + columnNames.join(', ') + '\n');

    if (!columnNames.includes('message')) {
        fs.appendFileSync(reportFile, 'Adding "message" column...\n');
        db.exec("ALTER TABLE swaps ADD COLUMN message TEXT");
        fs.appendFileSync(reportFile, 'Successfully added "message" column.\n');
    } else {
        fs.appendFileSync(reportFile, '"message" column already exists.\n');
    }

    // Double check items table for status column
    const itemColumns = db.prepare("PRAGMA table_info(items)").all().map(c => c.name);
    if (!itemColumns.includes('status')) {
        fs.appendFileSync(reportFile, 'Adding "status" column to items...\n');
        db.exec("ALTER TABLE items ADD COLUMN status TEXT DEFAULT 'active'");
    }

} catch (e) {
    fs.appendFileSync(reportFile, 'ERROR: ' + e.message + '\n');
}

fs.appendFileSync(reportFile, 'Migration completed.\n');
console.log('Migration report written to migration_report.txt');
