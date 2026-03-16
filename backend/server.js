const express = require("express")
const cors = require("cors")
const path = require("path")
const bcrypt = require("bcrypt")
const multer = require("multer")
const fs = require("fs")
const db = require("./database/sqlite")

console.log("Modules loaded, initializing app...");
const app = express()

app.use(cors())
app.use(express.json())
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Ensure uploads directory exists
if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads")
}

// Multer configuration (kept for common use if needed)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname)
    }
})
const upload = multer({ storage: storage })

// Initialize tables (Simplified as init-db.js handles schema updates)
console.log("Ensuring core tables exist...")
db.exec(`
    CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        role TEXT DEFAULT 'user',
        phone TEXT,
        location TEXT,
        avatar TEXT,
        status TEXT DEFAULT 'active',
        eco_score INTEGER DEFAULT 0,
        xp INTEGER DEFAULT 0,
        level INTEGER DEFAULT 1,
        streak INTEGER DEFAULT 0,
        next_level_xp INTEGER DEFAULT 100,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS items(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        title TEXT,
        brand TEXT,
        price INTEGER,
        description TEXT,
        category TEXT,
        size TEXT,
        color TEXT,
        condition TEXT,
        listingType TEXT,
        image TEXT,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS swaps(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_a_id INTEGER,
        user_b_id INTEGER,
        item_a_id INTEGER,
        item_b_id INTEGER,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_a_id) REFERENCES users(id),
        FOREIGN KEY(user_b_id) REFERENCES users(id),
        FOREIGN KEY(item_a_id) REFERENCES items(id),
        FOREIGN KEY(item_b_id) REFERENCES items(id)
    );
    CREATE TABLE IF NOT EXISTS donations(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        ngo_id INTEGER,
        items_count INTEGER DEFAULT 1,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS definitions(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        description TEXT,
        icon TEXT,
        type TEXT, -- 'achievement' or 'badge'
        color TEXT
    );
    CREATE TABLE IF NOT EXISTS user_rewards(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        definition_id INTEGER,
        earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(definition_id) REFERENCES definitions(id)
    );
    CREATE TABLE IF NOT EXISTS messages(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sender_id INTEGER,
        receiver_id INTEGER,
        item_id INTEGER,
        content TEXT,
        is_read BOOLEAN DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(sender_id) REFERENCES users(id),
        FOREIGN KEY(receiver_id) REFERENCES users(id),
        FOREIGN KEY(item_id) REFERENCES items(id)
    );
`);

// Migration: Ensure users table has gamification columns
console.log("Running migrations...");
const columnsToAdd = [
    { name: 'eco_score', type: 'INTEGER DEFAULT 0' },
    { name: 'xp', type: 'INTEGER DEFAULT 0' },
    { name: 'level', type: 'INTEGER DEFAULT 1' },
    { name: 'streak', type: 'INTEGER DEFAULT 0' },
    { name: 'next_level_xp', type: 'INTEGER DEFAULT 100' }
];

columnsToAdd.forEach(col => {
    try {
        db.exec(`ALTER TABLE users ADD COLUMN ${col.name} ${col.type}`);
        console.log(`Added column: ${col.name}`);
    } catch (e) {
        if (!e.message.includes('duplicate column name')) {
            console.error(`Error adding column ${col.name}:`, e.message);
        }
    }
});

// Migration: Ensure messages table has messageStatus column
const messageColumnsToAdd = [
    { name: 'messageStatus', type: 'TEXT DEFAULT "sent"' }
];

messageColumnsToAdd.forEach(col => {
    try {
        db.exec(`ALTER TABLE messages ADD COLUMN ${col.name} ${col.type}`);
        console.log(`Added column: ${col.name} to messages`);
    } catch (e) {
        if (!e.message.includes('duplicate column name')) {
            console.error(`Error adding column ${col.name} to messages:`, e.message);
        }
    }
});

console.log("Migrations complete.");

// Initialize Default Admin Account
const adminEmail = 'admin@gmail.com';
const adminPassword = '123456';
const adminName = 'Eco Admin';

try {
    const hashedPassword = bcrypt.hashSync(adminPassword, 10);
    const existingAdmin = db.prepare("SELECT * FROM users WHERE email = ?").get(adminEmail);
    
    if (!existingAdmin) {
        console.log("Creating default admin account...");
        db.prepare("INSERT INTO users(name, email, password, role, status) VALUES(?,?,?,?,?)").run(
            adminName, adminEmail, hashedPassword, 'admin', 'active'
        );
    } else {
        console.log("Syncing admin account credentials...");
        db.prepare("UPDATE users SET password = ?, role = 'admin' WHERE email = ?").run(
            hashedPassword, adminEmail
        );
    }
} catch (error) {
    console.error("Error initializing admin:", error.message);
}

// Root route
app.get("/", (req, res) => {
    res.json({ message: "EcoCloset Backend API is running (better-sqlite3)" });
});

// Debug route to check DB schema
app.get("/api/debug/db", (req, res) => {
    try {
        const usersSchema = db.prepare("PRAGMA table_info(users)").all();
        const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
        res.json({
            success: true,
            database: "better-sqlite3",
            tables: tables.map(t => t.name),
            users_columns: usersSchema.map(c => c.name),
            full_users_schema: usersSchema
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Middleware to check if user is admin (Keeping it here for route protection)
const isAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token.startsWith("mock-jwt-token-")) {
        return res.status(401).json({ success: false, message: "Invalid token" });
    }

    const userId = token.split("-")[3];
    try {
        const user = db.prepare("SELECT role FROM users WHERE id = ?").get(userId);
        if (user && user.role === 'admin') {
            req.userId = userId;
            next();
        } else {
            res.status(403).json({ success: false, message: "Unauthorized. Admin access required." });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

// General Auth Middleware
const isAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token.startsWith("mock-jwt-token-")) {
        return res.status(401).json({ success: false, message: "Invalid token" });
    }

    const userId = token.split("-")[3];
    req.userId = userId;
    next();
};

// Auth APIs (Kept inline for simplicity as they are core, but can be modularized later)
app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body
    try {
        const row = db.prepare("SELECT * FROM users WHERE email=?").get(email)
        if (!row) {
            return res.status(401).json({ success: false, message: "Invalid credentials" })
        }
        const isMatch = bcrypt.compareSync(password, row.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" })
        }
        res.json({
            success: true,
            message: "Login successful",
            data: {
                user: {
                    id: row.id,
                    email: row.email,
                    name: row.name || row.email.split('@')[0],
                    role: row.role || 'user',
                    phone: row.phone,
                    location: row.location,
                    avatar: row.avatar,
                    status: row.status
                },
                token: "mock-jwt-token-" + row.id
            }
        })
    } catch (err) {
        res.status(500).json({ success: false, message: "Database error", error: err.message })
    }
})

app.post("/api/auth/register", (req, res) => {
    const { name, email, password, phone, location } = req.body
    try {
        const hashedPassword = bcrypt.hashSync(password, 10);
        const info = db.prepare("INSERT INTO users(name, email, password, phone, location) VALUES(?,?,?,?,?)").run(
            name, email, hashedPassword, phone || "", location || ""
        );
        res.json({ success: true, message: "User registered successfully", id: info.lastInsertRowid });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
})

app.get("/api/auth/profile", (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    if (!token.startsWith("mock-jwt-token-")) {
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
    const userId = token.split("-")[3];
    try {
        const row = db.prepare("SELECT id, email, name, role, phone, location, avatar, status FROM users WHERE id = ?").get(userId);
        if (!row) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.json({
            success: true,
            data: {
                user: {
                    id: row.id,
                    email: row.email,
                    name: row.name || row.email.split('@')[0],
                    role: row.role || 'user',
                    phone: row.phone,
                    location: row.location,
                    avatar: row.avatar,
                    status: row.status
                }
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
})

// Health check to verify modular routes
app.get("/health", (req, res) => {
    try {
        const columns = db.prepare("PRAGMA table_info(users)").all().map(c => c.name);
        res.json({
            status: "alive",
            database: "connected",
            users_columns: columns,
            routes: ["admin", "items", "categories", "dashboard"]
        });
    } catch (err) {
        res.json({
            status: "alive",
            database: "error",
            error: err.message
        });
    }
});

console.log("Registering modular routes...");
// Register Modular Routes
app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/admin", isAdmin, require("./routes/admin"));
app.use("/api/items", require("./routes/items"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/messages", isAuth, require("./routes/messages"));
app.use("/api/donations", require("./routes/donations"));
console.log("Modular routes registered.");

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`EcoCloset backend running on port ${PORT}`)
})
 
