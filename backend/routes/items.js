const express = require("express");
const router = express.Router();
const db = require("../database/db");
const multer = require("multer");
const path = require("path");

// Setup Multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// POST /api/items/create
router.post("/create", upload.single("image"), (req, res) => {
    const { title, brand, price, description, category, size, color, condition, listingType, user_id } = req.body;
    const image = req.file ? req.file.path : "";

    const sql = "INSERT INTO items (title, brand, price, description, category, size, color, condition, listingType, image, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const params = [title, brand, price, description, category, size, color, condition, listingType, image, user_id || null];

    db.run(sql, params, function(err) {
        if (err) {
            console.error("Insert error:", err.message);
            return res.status(500).json({ success: false, message: err.message });
        }
        res.status(201).json({ success: true, message: "Item listed successfully", id: this.lastID });
    });
});

// GET /api/items
router.get("/", (req, res) => {
    db.all("SELECT * FROM items ORDER BY created_at DESC", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
        res.json({ success: true, data: rows });
    });
});

// GET /api/items/:id
router.get("/:id", (req, res) => {
    db.get("SELECT * FROM items WHERE id = ?", [req.params.id], (err, row) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
        if (!row) {
            return res.status(404).json({ success: false, message: "Item not found" });
        }
        res.json({ success: true, data: row });
    });
});

// DELETE /api/items/:id
router.delete("/:id", (req, res) => {
    db.run("DELETE FROM items WHERE id = ?", [req.params.id], function(err) {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
        res.json({ success: true, message: "Item deleted" });
    });
});

module.exports = router;
