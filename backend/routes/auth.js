const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../database/db");

// POST /api/auth/register
router.post("/register", async (req, res) => {
    const { name, email, password, phone, city } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = "INSERT INTO users (name, email, password, phone, city) VALUES (?, ?, ?, ?, ?)";
        db.run(sql, [name, email, hashedPassword, phone, city], function(err) {
            if (err) return res.status(400).json({ success: false, message: err.message });
            res.status(201).json({ success: true, message: "User registered", data: { id: this.lastID } });
        });
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
});

// POST /api/auth/login
router.post("/login", (req, res) => {
    const { email, password } = req.body;
    db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ success: false, message: "Invalid credentials" });

        res.json({
            success: true,
            data: {
                token: "mock-token",
                user: { id: user.id, name: user.name, email: user.email }
            }
        });
    });
});

module.exports = router;
