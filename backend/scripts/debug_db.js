const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "ecocloset.db");
const db = new Database(dbPath);

try {
    const users = db.prepare("SELECT id, name, email, role FROM users").all();
    console.log("Current Users in DB:");
    users.forEach(u => {
        console.log(`ID: ${u.id} | Email: ${u.email} | Role: ${u.role} | Name: ${u.name}`);
    });
} catch (err) {
    console.error("Error reading database:", err.message);
}
