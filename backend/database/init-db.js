const db = require('./sqlite');

console.log('Updating database schema...');

db.exec(`
    -- Add status to users if not exists
    ALTER TABLE users ADD COLUMN status TEXT DEFAULT 'active';
`);

db.exec(`
    -- Add status to items if not exists
    ALTER TABLE items ADD COLUMN status TEXT DEFAULT 'active';
`);

db.exec(`
    -- Add gamification columns to users if they don't exist
    ALTER TABLE users ADD COLUMN eco_score INTEGER DEFAULT 0;
    ALTER TABLE users ADD COLUMN xp INTEGER DEFAULT 0;
    ALTER TABLE users ADD COLUMN level INTEGER DEFAULT 1;
    ALTER TABLE users ADD COLUMN streak INTEGER DEFAULT 0;
    ALTER TABLE users ADD COLUMN next_level_xp INTEGER DEFAULT 100;
`).catch(() => {}); // Catch if already exists

db.exec(`
    -- Donations table
    CREATE TABLE IF NOT EXISTS donations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        ngo_name TEXT,
        items_count INTEGER,
        description TEXT,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
    );

    -- Achievements and Badges Definition Table
    CREATE TABLE IF NOT EXISTS definitions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT, -- 'achievement' or 'badge'
        name TEXT,
        description TEXT,
        icon TEXT,
        color TEXT
    );

    -- User Earned Achievements/Badges
    CREATE TABLE IF NOT EXISTS user_rewards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        definition_id INTEGER,
        earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(definition_id) REFERENCES definitions(id)
    );
`);

// Seed initial definitions if empty
const defCount = db.prepare('SELECT COUNT(*) as count FROM definitions').get().count;
if (defCount === 0) {
    console.log('Seeding initial achievements and badges...');
    const defs = [
        ['achievement', 'First Swap', 'Complete your first swap', 'Trophy', 'yellow'],
        ['achievement', 'Eco Warrior', 'Donate 10 items', 'Leaf', 'green'],
        ['achievement', 'Social Butterfly', 'Connect with 20 users', 'Users', 'blue'],
        ['badge', 'Green Hero', 'Platform contributor', 'BadgeCheck', 'bg-green-500'],
        ['badge', 'Swap Master', 'Active swapper', 'Medal', 'bg-blue-500']
    ];
    const insert = db.prepare('INSERT INTO definitions (type, name, description, icon, color) VALUES (?, ?, ?, ?, ?)');
    defs.forEach(def => insert.run(def));
}

console.log('Database schema update complete.');
