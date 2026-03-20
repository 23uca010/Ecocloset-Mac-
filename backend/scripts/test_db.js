const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'ecocloset.db');
const db = new Database(dbPath);

console.log('--- DATABASE TEST ---');
console.log('Path:', dbPath);

try {
    console.log('Adding columns...');
    db.exec(`
        ALTER TABLE users ADD COLUMN eco_score INTEGER DEFAULT 0;
        ALTER TABLE users ADD COLUMN xp INTEGER DEFAULT 0;
        ALTER TABLE users ADD COLUMN level INTEGER DEFAULT 1;
        ALTER TABLE users ADD COLUMN streak INTEGER DEFAULT 0;
        ALTER TABLE users ADD COLUMN next_level_xp INTEGER DEFAULT 100;
    `);
    console.log('Migration SUCCESS');
} catch (e) {
    console.log('Migration Note:', e.message);
}

const info = db.prepare("PRAGMA table_info(users)").all();
console.log('Columns found:', info.map(c => c.name).join(', '));

const hasCol = info.some(c => c.name === 'eco_score');
console.log('Verification:', hasCol ? 'PASS' : 'FAIL');

process.exit(hasCol ? 0 : 1);
