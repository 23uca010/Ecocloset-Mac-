const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const db = require("../database/db");

// Setup Multer for image uploads
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Create Item
router.post("/create", upload.single("image"), (req, res) => {
  const { user_id, title, brand, price, description, category, size, color, condition, listingType } = req.body;
  const image = req.file ? req.file.path : "";

  const sql = `INSERT INTO items (user_id, title, brand, price, description, category, size, color, condition, listingType, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
  db.run(sql, [user_id, title, brand, price, description, category, size, color, condition, listingType, image], function(err) {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.status(201).json({ success: true, message: "Item created", data: { id: this.lastID } });
  });
});

// Get All Items
router.get("/", (req, res) => {
  const sql = `SELECT * FROM items ORDER BY created_at DESC`;
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, data: rows });
  });
});

// Get Single Item
router.get("/:id", (req, res) => {
  const sql = `SELECT * FROM items WHERE id = ?`;
  db.get(sql, [req.params.id], (err, item) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });
    res.json({ success: true, data: item });
  });
});

// Delete Item
router.delete("/:id", (req, res) => {
  const sql = `DELETE FROM items WHERE id = ?`;
  db.run(sql, [req.params.id], function(err) {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, message: "Item deleted" });
  });
});

module.exports = router;
