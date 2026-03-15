const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'ecocloset.db');
const db = new Database(dbPath);

console.log('Targeting database:', dbPath);

const columnsToAdd = [
    { name: 'eco_score', type: 'INTEGER DEFAULT 0' },
    { name: 'xp', type: 'INTEGER DEFAULT 0' },
    { name: 'level', type: 'INTEGER DEFAULT 1' },
    { name: 'streak', type: 'INTEGER DEFAULT 0' },
    { name: 'next_level_xp', type: 'INTEGER DEFAULT 100' }
];

const results = [];

columnsToAdd.forEach(col => {
    try {
        db.exec(`ALTER TABLE users ADD COLUMN ${col.name} ${col.type}`);
        results.push(`Successfully added ${col.name}`);
    } catch (e) {
        if (e.message.includes('duplicate column name')) {
            results.push(`Column ${col.name} already exists`);
        } else {
            results.push(`Error adding ${col.name}: ${e.message}`);
        }
    }
});

// Also ensure other tables exist
const tables = [
    `CREATE TABLE IF NOT EXISTS swaps (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_a_id INTEGER,
        user_b_id INTEGER,
        item_a_id INTEGER,
        item_b_id INTEGER,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS donations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        items_count INTEGER DEFAULT 1,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS definitions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT, -- achievement, badge
        name TEXT,
        description TEXT,
        icon TEXT,
        requirement TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS user_rewards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        definition_id INTEGER,
        earned_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`
];

tables.forEach((sql, index) => {
    try {
        db.exec(sql);
        results.push(`Table check ${index} successful`);
    } catch (e) {
        results.push(`Error in table check ${index}: ${e.message}`);
    }
});

const output = {
    timestamp: new Date().toISOString(),
    results,
    finalSchema: db.prepare('PRAGMA table_info(users)').all()
};

fs.writeFileSync(path.join(__dirname, 'schema_fix_report.json'), JSON.stringify(output, null, 2));
console.log('Schema fix report generated.');
process.exit(0);
