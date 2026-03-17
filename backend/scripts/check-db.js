const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'ecocloset.db');
const db = new Database(dbPath);

const users = db.prepare('SELECT * FROM users').all();
console.log('Users in database:', JSON.stringify(users, null, 2));

const user = db.prepare('SELECT * FROM users WHERE email = ?').get('test_auth_fix@example.com');
console.log('Target user search result:', user);
