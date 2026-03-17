const db = require('./backend/database/sqlite');
const fs = require('fs');
const results = {};
try {
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    results.tables = tables.map(t => t.name);
    
    for (const table of results.tables) {
        results[table] = {
            schema: db.prepare(`SELECT sql FROM sqlite_master WHERE type='table' AND name='${table}'`).get().sql,
            columns: db.prepare(`PRAGMA table_info(${table})`).all()
        };
    }
    fs.writeFileSync('db_status.json', JSON.stringify(results, null, 2));
} catch (e) {
    fs.writeFileSync('db_status.json', JSON.stringify({ error: e.message }, null, 2));
}
