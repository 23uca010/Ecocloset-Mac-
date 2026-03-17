const db = require('./backend/database/sqlite');
const fs = require('fs');
let output = '';
try {
    const schema = db.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name='swaps'").get();
    output += 'SWAPS SCHEMA: ' + (schema ? schema.sql : 'NOT FOUND') + '\n';
    
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    output += 'ALL TABLES: ' + tables.map(t => t.name).join(', ') + '\n';
    
    const itemsSchema = db.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name='items'").get();
    output += 'ITEMS SCHEMA: ' + (itemsSchema ? itemsSchema.sql : 'NOT FOUND') + '\n';

    fs.writeFileSync('db_check_output.txt', output);
    console.log('Output written to db_check_output.txt');
} catch (e) {
    fs.writeFileSync('db_check_output.txt', 'ERROR: ' + e.message);
    console.error('ERROR CHECKING SCHEMA:', e.message);
}
