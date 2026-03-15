const express = require("express");
const router = express.Router();
const db = require("../database/db");

// GET /api/users/profile
router.get("/profile", (req, res) => {
    const userId = req.headers.user_id || 1;
    db.get("SELECT id, name, email, phone, city FROM users WHERE id = ?", [userId], (err, user) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        res.json({ success: true, data: { user } });
    });
});

// PUT /api/users/profile
router.put("/profile", (req, res) => {
    const userId = req.headers.user_id || 1;
    const { name, phone, city } = req.body;
    db.run("UPDATE users SET name = ?, phone = ?, city = ? WHERE id = ?", [name, phone, city, userId], function(err) {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, message: "Profile updated" });
    });
});

module.exports = router;
