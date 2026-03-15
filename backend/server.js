const express = require("express")
const cors = require("cors")
const Database = require("better-sqlite3")
const path = require("path")
const bcrypt = require("bcrypt")
const multer = require("multer")
const fs = require("fs")

const app = express()

app.use(cors())
app.use(express.json())
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Ensure uploads directory exists
if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads")
}

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname)
    }
})
const upload = multer({ storage: storage })

// Use better-sqlite3
const dbPath = path.join(__dirname, "ecocloset.db")
const db = new Database(dbPath)

// Initialize tables
console.log("Initializing database...")
db.exec(`
    CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        role TEXT DEFAULT 'user',
        phone TEXT,
        location TEXT,
        avatar TEXT
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
    );
`);

// Initialize Default Admin Account
const adminEmail = 'admin@gmail.com';
const adminPassword = '123456';
const adminName = 'Eco Admin';

try {
    const hashedPassword = bcrypt.hashSync(adminPassword, 10);
    const existingAdmin = db.prepare("SELECT * FROM users WHERE email = ?").get(adminEmail);
    
    if (!existingAdmin) {
        console.log("Creating default admin account...");
        db.prepare("INSERT INTO users(name, email, password, role) VALUES(?,?,?,?)").run(
            adminName, adminEmail, hashedPassword, 'admin'
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

// Migrations (for existing databases)
try {
    db.prepare("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user'").run()
} catch (e) {}
try {
    db.prepare("ALTER TABLE users ADD COLUMN phone TEXT").run()
} catch (e) {}
try {
    db.prepare("ALTER TABLE users ADD COLUMN location TEXT").run()
} catch (e) {}
try {
    db.prepare("ALTER TABLE users ADD COLUMN avatar TEXT").run()
} catch (e) {}
try {
    db.prepare("ALTER TABLE items ADD COLUMN user_id INTEGER").run()
} catch (e) {}

// Root route
app.get("/", (req, res) => {
    res.json({ message: "EcoCloset Backend API is running (better-sqlite3)" });
});

// Login API
app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body
    console.log(`[LOGIN] Attempt for email: ${email}`);

    try {
        const row = db.prepare("SELECT * FROM users WHERE email=?").get(email)

        if (!row) {
            console.log(`[LOGIN] User NOT found: ${email}`);
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            })
        }

        console.log(`[LOGIN] User found, checking password for: ${email}`);
        // Check password using bcrypt
        const isMatch = bcrypt.compareSync(password, row.password);
        
        if (!isMatch) {
            console.log(`[LOGIN] Password mismatch for: ${email}`);
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            })
        }

        console.log(`[LOGIN] Success for: ${email} (Role: ${row.role})`);
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
                    avatar: row.avatar
                },
                token: "mock-jwt-token-" + row.id
            }
        })
    } catch (err) {
        res.status(500).json({ 
            success: false,
            message: "Database error",
            error: err.message 
        })
    }
})

app.post("/api/auth/register", (req, res) => {
    const { name, email, password, phone, location, avatar } = req.body
    try {
        const hashedPassword = bcrypt.hashSync(password, 10);
        const info = db.prepare("INSERT INTO users(name, email, password, phone, location, avatar) VALUES(?,?,?,?,?,?)").run(
            name, email, hashedPassword, phone || "", location || "", avatar || ""
        );
        res.json({ success: true, message: "User registered successfully", id: info.lastInsertRowid });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
})

// Profile API (for session persistence)
app.get("/api/auth/profile", (req, res) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    
    // Simple mock token verification (extracting user ID)
    if (!token.startsWith("mock-jwt-token-")) {
        return res.status(401).json({ success: false, message: "Invalid token" });
    }

    const userId = token.split("-")[3];

    try {
        const row = db.prepare("SELECT id, email, name, role, phone, location, avatar FROM users WHERE id = ?").get(userId);

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
                    avatar: row.avatar
                }
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
})

// Item APIs
app.post("/api/items/create", upload.single("image"), (req, res) => {
    const { user_id, title, brand, price, description, category, size, color, condition, listingType } = req.body
    const image = req.file ? req.file.path.replace(/\\/g, '/') : ""
    
    try {
        const info = db.prepare(
            "INSERT INTO items(user_id, title, brand, price, description, category, size, color, condition, listingType, image) VALUES(?,?,?,?,?,?,?,?,?,?,?)"
        ).run(user_id, title, brand, parseFloat(price) || 0, description, category, size, color, condition, listingType, image)

        res.json({ 
            success: true, 
            message: "Item listed successfully", 
            id: info.lastInsertRowid 
        })
    } catch (err) {
        console.error("Item creation error:", err.message)
        res.status(500).json({ success: false, error: err.message })
    }
})

app.get("/api/items", (req, res) => {
    try {
        const rows = db.prepare(`
            SELECT 
                i.*, 
                u.name as owner_name, 
                u.phone as owner_phone, 
                u.location as owner_location, 
                u.avatar as owner_avatar 
            FROM items i
            LEFT JOIN users u ON i.user_id = u.id
            ORDER BY i.created_at DESC
        `).all()
        res.json({ success: true, data: rows })
    } catch (err) {
        res.status(500).json({ success: false, error: err.message })
    }
})

app.delete("/api/items/:id", (req, res) => {
    const { id } = req.params
    const { requester_id, requester_role } = req.body
    
    try {
        // Find item to check ownership
        const item = db.prepare("SELECT * FROM items WHERE id = ?").get(id)
        
        if (!item) {
            return res.status(404).json({ success: false, message: "Item not found" })
        }
        
        // Authorization check: owner or admin
        if (item.user_id != requester_id && requester_role !== 'admin') {
            return res.status(403).json({ success: false, message: "Unauthorized to delete this item" })
        }
        
        db.prepare("DELETE FROM items WHERE id = ?").run(id)
        res.json({ success: true, message: "Item deleted successfully" })
    } catch (err) {
        res.status(500).json({ success: false, error: err.message })
    }
})

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`EcoCloset backend running on port ${PORT}`)
})
 
