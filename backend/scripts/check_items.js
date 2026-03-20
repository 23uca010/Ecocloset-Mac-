const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'ecocloset.db');
const db = new Database(dbPath);

try {
    const items = db.prepare('SELECT * FROM items').all();
    console.log('Items in database:', JSON.stringify(items, null, 2));
} catch (err) {
    console.error('Error reading database:', err.message);
}
db.close();
