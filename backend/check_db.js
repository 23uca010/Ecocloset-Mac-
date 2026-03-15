const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, 'ecocloset.db');
const db = new Database(dbPath);

try {
    const items = db.prepare('SELECT * FROM items').all();
    console.log('--- ITEMS IN DATABASE ---');
    console.log(items);
    console.log('--- END ---');
} catch (error) {
    console.error('Error reading database:', error);
}
