const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../ecocloset.db');
const db = new Database(dbPath);

console.log('Using shared SQLite database instance');

module.exports = db;
