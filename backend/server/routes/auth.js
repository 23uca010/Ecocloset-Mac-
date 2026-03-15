const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../database/db");

// Register
router.post("/register", async (req, res) => {
  const { name, email, password, phone, city } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = `INSERT INTO users (name, email, password, phone, city) VALUES (?, ?, ?, ?, ?)`;
    
    db.run(sql, [name, email, hashedPassword, phone, city], function(err) {
      if (err) {
        if (err.message.includes("UNIQUE constraint failed")) {
          return res.status(400).json({ success: false, message: "Email already exists" });
        }
        return res.status(500).json({ success: false, message: err.message });
      }
      res.status(201).json({ 
        success: true, 
        message: "User registered successfully",
        data: { id: this.lastID, name, email }
      });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = `SELECT * FROM users WHERE email = ?`;
  db.get(sql, [email], async (err, user) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!user) return res.status(401).json({ success: false, message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Invalid email or password" });

    // In a real app, generate a JWT here. For now, just return user info.
    res.json({
      success: true,
      data: {
        token: "fake-jwt-token", // Placeholder for actual implementation if needed later
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          city: user.city
        }
      }
    });
  });
});

module.exports = router;
