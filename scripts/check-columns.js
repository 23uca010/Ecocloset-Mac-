const db = require('./backend/database/sqlite');
const fs = require('fs');
try {
    const columns = db.prepare("PRAGMA table_info(swaps)").all();
    const columnNames = columns.map(c => c.name);
    fs.writeFileSync('columns_check.txt', 'COLUMNS: ' + columnNames.join(', '));
} catch (e) {
    fs.writeFileSync('error_check.txt', 'ERROR: ' + e.message);
}
