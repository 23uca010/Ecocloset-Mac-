const express = require("express");
const router = express.Router();
const db = require("../database/db");

// Get Profile
router.get("/profile", (req, res) => {
  // In a real app, get user ID from authenticated token. 
  // For testing, accept user_id in query if token is not implemented.
  const userId = req.headers.user_id || 1; 

  const sql = `SELECT id, name, email, phone, city, created_at FROM users WHERE id = ?`;
  db.get(sql, [userId], (err, user) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, data: { user } });
  });
});

// Update Profile
router.put("/profile", (req, res) => {
  const userId = req.headers.user_id || 1;
  const { name, phone, city } = req.body;

  const sql = `UPDATE users SET name = ?, phone = ?, city = ? WHERE id = ?`;
  db.run(sql, [name, phone, city, userId], function(err) {
    if (err) return res.status(500).json({ success: false, message: err.message });
    
    // Fetch updated user
    db.get(`SELECT id, name, email, phone, city FROM users WHERE id = ?`, [userId], (err, user) => {
      res.json({ success: true, message: "Profile updated", data: { user } });
    });
  });
});

module.exports = router;
