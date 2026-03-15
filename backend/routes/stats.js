const express = require("express");
const router = express.Router();
const db = require("../database/db");

// GET /api/stats
router.get("/", (req, res) => {
    const stats = {
        totalItems: 0,
        totalUsers: 0,
        totalNGOs: 0,
        itemsSwapped: 0,
        co2Saved: 0
    };

    db.get("SELECT COUNT(*) as count FROM items", [], (err, row) => {
        if (!err) stats.totalItems = row.count;
        
        db.get("SELECT COUNT(*) as count FROM users", [], (err, row) => {
            if (!err) stats.totalUsers = row.count;
            
            // For now, mock the others or return 0
            res.json({ success: true, data: stats });
        });
    });
});

module.exports = router;
