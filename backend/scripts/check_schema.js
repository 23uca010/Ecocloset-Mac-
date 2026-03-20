const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, '../ecocloset.db');
const db = new Database(dbPath);
const schema = db.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name='items'").get();
console.log(schema ? schema.sql : 'Table not found');
