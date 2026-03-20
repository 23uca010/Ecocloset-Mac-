const db = require('../database/sqlite');
const fs = require('fs');
const path = require('path');

// ABSOLUTE PATH for reliability on Windows
const logFile = path.join(__dirname, 'swap_debug.log');
fs.appendFileSync(logFile, `[${new Date().toISOString()}] Module swapController.js loaded\n`);

const createSwapRequest = (req, res) => {
  try {
    fs.appendFileSync(logFile, `[${new Date().toISOString()}] Entering createSwapRequest\n`);
    let { itemRequestedId, itemOfferedId, message } = req.body;
    let userId = req.userId;

    // defensive conversion to numbers
    if (itemRequestedId) itemRequestedId = Number(itemRequestedId);
    if (itemOfferedId) itemOfferedId = Number(itemOfferedId);
    if (userId) userId = Number(userId);

    const logMsg = `[${new Date().toISOString()}] DEBUG: Creating swap request: itemRequestedId=${itemRequestedId}, itemOfferedId=${itemOfferedId}, userId=${userId}, message="${message}"\n`;
    fs.appendFileSync(logFile, logMsg);

    // INLINE SCHEMA CHECK
    const schema = db.prepare("PRAGMA table_info(swaps)").all();
    const columnNames = schema.map(c => c.name);
    fs.appendFileSync(logFile, `SCHEMA CHECK: Columns in swaps table: ${columnNames.join(', ')}\n`);

    if (!itemRequestedId || isNaN(itemRequestedId)) {
      return res.status(400).json({ success: false, message: 'Requested item ID is missing or invalid.' });
    }

    if (!itemOfferedId || isNaN(itemOfferedId)) {
      return res.status(400).json({ success: false, message: 'Offered item ID (your item) is required for a swap.' });
    }

    // Get owner of requested item
    const requestedItem = db.prepare('SELECT user_id FROM items WHERE id = ?').get(itemRequestedId);
    if (!requestedItem) {
      fs.appendFileSync(logFile, `ERROR: Requested item ${itemRequestedId} not found\n`);
      return res.status(404).json({ success: false, message: 'Requested item not found in database.' });
    }

    if (requestedItem.user_id === userId) {
      return res.status(400).json({ success: false, message: 'You cannot swap with your own item.' });
    }

    // Attempt to add column if message is missing (Dynamic Fix)
    if (!columnNames.includes('message')) {
      fs.appendFileSync(logFile, "MIGRATION: Adding missing 'message' column dynamically...\n");
      db.exec("ALTER TABLE swaps ADD COLUMN message TEXT");
    }

    // Try insert
    const insertSQL = `
      INSERT INTO swaps (user_a_id, user_b_id, item_a_id, item_b_id, message, status)
      VALUES (?, ?, ?, ?, ?, 'pending')
    `;
    const info = db.prepare(insertSQL).run(userId, requestedItem.user_id, itemOfferedId, itemRequestedId, message || "");

    fs.appendFileSync(logFile, `SUCCESS: Swap request created with ID ${info.lastInsertRowid}\n`);

    res.status(201).json({
      success: true,
      message: 'Swap request created successfully!',
      swapId: info.lastInsertRowid
    });
  } catch (error) {
    console.error('Create swap request error:', error);
    fs.appendFileSync(logFile, `FATAL ERROR: ${error.message}\n`);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
};

// Get user swap requests
const getSwapRequests = (req, res) => {
  try {
    const userId = req.userId;
    const swaps = db.prepare(`
      SELECT s.*, 
             ua.name as requester_name, ub.name as owner_name,
             ia.title as item_a_title, ib.title as item_b_title,
             ia.image as item_a_image, ib.image as item_b_image
      FROM swaps s
      JOIN users ua ON s.user_a_id = ua.id
      JOIN users ub ON s.user_b_id = ub.id
      LEFT JOIN items ia ON s.item_a_id = ia.id
      JOIN items ib ON s.item_b_id = ib.id
      WHERE s.user_a_id = ? OR s.user_b_id = ?
      ORDER BY s.created_at DESC
    `).all(userId, userId);

    res.status(200).json({ success: true, swaps });
  } catch (error) {
    console.error('Get swap requests error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

const getSwapRequestById = (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const swap = db.prepare(`
      SELECT s.*, 
             ua.name as requester_name, ub.name as owner_name,
             ia.title as item_a_title, ib.title as item_b_title,
             ia.image as item_a_image, ib.image as item_b_image
      FROM swaps s
      JOIN users ua ON s.user_a_id = ua.id
      JOIN users ub ON s.user_b_id = ub.id
      LEFT JOIN items ia ON s.item_a_id = ia.id
      JOIN items ib ON s.item_b_id = ib.id
      WHERE s.id = ?
    `).get(id);

    if (!swap) return res.status(404).json({ success: false, message: 'Swap not found.' });

    if (swap.user_a_id != userId && swap.user_b_id != userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized.' });
    }

    res.status(200).json({ success: true, swap });
  } catch (error) {
    console.error('Get swap by id error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// Respond to swap request (Step 3 & 4)
const respondToSwapRequest = (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'accepted' or 'declined'
    const userId = req.userId;

    const swap = db.prepare('SELECT * FROM swaps WHERE id = ?').get(id);
    if (!swap) return res.status(404).json({ success: false, message: 'Swap not found.' });

    if (swap.user_b_id != userId) {
      return res.status(403).json({ success: false, message: 'Only the item owner can respond.' });
    }

    db.prepare('UPDATE swaps SET status = ? WHERE id = ?').run(status, id);

    res.status(200).json({ success: true, message: `Swap request ${status}.` });
  } catch (error) {
    console.error('Respond to swap error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// Complete swap request (Step 5)
const completeSwapRequest = (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const swap = db.prepare('SELECT * FROM swaps WHERE id = ?').get(id);
    if (!swap) return res.status(404).json({ success: false, message: 'Swap not found.' });

    if (swap.user_a_id != userId && swap.user_b_id != userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized.' });
    }

    db.prepare("UPDATE swaps SET status = 'completed' WHERE id = ?").run(id);

    res.status(200).json({ success: true, message: 'Swap completed successfully!' });
  } catch (error) {
    console.error('Complete swap error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// Cancel swap request
const cancelSwapRequest = (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const swap = db.prepare('SELECT * FROM swaps WHERE id = ?').get(id);
    if (!swap) return res.status(404).json({ success: false, message: 'Swap not found.' });

    if (swap.user_a_id != userId) {
      return res.status(403).json({ success: false, message: 'Only the requester can cancel.' });
    }

    db.prepare("UPDATE swaps SET status = 'cancelled' WHERE id = ?").run(id);

    res.status(200).json({ success: true, message: 'Swap request cancelled.' });
  } catch (error) {
    console.error('Cancel swap error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = {
  createSwapRequest,
  getSwapRequests,
  getSwapRequestById,
  respondToSwapRequest,
  completeSwapRequest,
  cancelSwapRequest
};
