const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, 'ecocloset.db');
const db = new Database(dbPath);

try {
  db.exec('ALTER TABLE users ADD COLUMN created_at TIMESTAMP DEFAULT "2024-01-01 00:00:00"');
  console.log("Successfully added created_at column");
} catch(e) {
  console.log("Error:", e.message);
}
