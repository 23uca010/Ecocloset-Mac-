const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, 'ecocloset.db');
const db = new Database(dbPath);

const requiredColumns = [
  { name: 'status', type: 'TEXT DEFAULT "active"' },
  { name: 'eco_score', type: 'INTEGER DEFAULT 0' },
  { name: 'xp', type: 'INTEGER DEFAULT 0' },
  { name: 'level', type: 'INTEGER DEFAULT 1' },
  { name: 'streak', type: 'INTEGER DEFAULT 0' },
  { name: 'next_level_xp', type: 'INTEGER DEFAULT 100' },
  { name: 'created_at', type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP' },
  { name: 'role', type: 'TEXT DEFAULT "user"' },
  { name: 'phone', type: 'TEXT' },
  { name: 'location', type: 'TEXT' },
  { name: 'avatar', type: 'TEXT' }
];

requiredColumns.forEach(col => {
  try {
    db.exec(`ALTER TABLE users ADD COLUMN ${col.name} ${col.type}`);
    console.log(`Added column: ${col.name}`);
  } catch (e) {
    if (!e.message.includes('duplicate column name')) {
        console.log(`Error adding column ${col.name}:`, e.message);
    }
  }
});

console.log("Current schema for users:");
console.log(db.prepare('PRAGMA table_info(users)').all());
