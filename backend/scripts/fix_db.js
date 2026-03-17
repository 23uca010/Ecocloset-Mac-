const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, 'ecocloset.db');
const db = new Database(dbPath);

try {
  db.exec('ALTER TABLE users ADD COLUMN status TEXT DEFAULT "active"');
  console.log("Successfully added status column");
} catch(e) {
  console.log("Error:", e.message);
}
