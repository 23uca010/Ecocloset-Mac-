const db = require('../database/sqlite');

// ─── Create Swap or Sell Request ────────────────────────────────────────────
// POST /api/swaps
// Body: { itemRequestedId, itemOfferedId?, type ('swap'|'sell'), message? }
const createSwapRequest = (req, res) => {
  try {
    let { itemRequestedId, itemOfferedId, message, type } = req.body;
    let userId = Number(req.userId);

    // Normalize
    if (itemRequestedId) itemRequestedId = Number(itemRequestedId);
    if (itemOfferedId)   itemOfferedId   = Number(itemOfferedId);
    const requestType = (type === 'sell') ? 'sell' : 'swap';

    if (!itemRequestedId || isNaN(itemRequestedId)) {
      return res.status(400).json({ success: false, message: 'Item ID is required.' });
    }

    // Get the item and its owner
    const requestedItem = db.prepare('SELECT id, user_id, title, status FROM items WHERE id = ?').get(itemRequestedId);
    if (!requestedItem) {
      return res.status(404).json({ success: false, message: 'Item not found.' });
    }

    const ownerId = Number(requestedItem.user_id);

    // Can't request your own item
    if (ownerId === userId) {
      return res.status(400).json({ success: false, message: 'You cannot make a request on your own item.' });
    }

    // Duplicate guard: block if a pending request already exists for this sender + item
    const existing = db.prepare(`
      SELECT id FROM swaps
      WHERE user_a_id = ? AND item_b_id = ? AND type = ? AND status = 'pending'
    `).get(userId, itemRequestedId, requestType);

    if (existing) {
      return res.status(409).json({
        success: false,
        message: `You already have a pending ${requestType} request for this item.`
      });
    }

    // For a swap, itemOfferedId is required
    if (requestType === 'swap') {
      if (!itemOfferedId || isNaN(itemOfferedId)) {
        return res.status(400).json({ success: false, message: 'You must offer one of your items for a swap.' });
      }
      // Ensure the offered item belongs to the requester
      const offeredItem = db.prepare('SELECT user_id FROM items WHERE id = ?').get(itemOfferedId);
      if (!offeredItem || Number(offeredItem.user_id) !== userId) {
        return res.status(400).json({ success: false, message: 'Offered item must belong to you.' });
      }
    }

    // Ensure schema has type column (self-healing)
    const schema = db.prepare('PRAGMA table_info(swaps)').all().map(c => c.name);
    if (!schema.includes('type')) {
      db.exec(`ALTER TABLE swaps ADD COLUMN type TEXT DEFAULT 'swap'`);
    }
    if (!schema.includes('message')) {
      db.exec(`ALTER TABLE swaps ADD COLUMN message TEXT`);
    }
    if (!schema.includes('sell_item_id')) {
      db.exec(`ALTER TABLE swaps ADD COLUMN sell_item_id INTEGER`);
    }

    const info = db.prepare(`
      INSERT INTO swaps (user_a_id, user_b_id, item_a_id, item_b_id, message, status, type, sell_item_id)
      VALUES (?, ?, ?, ?, ?, 'pending', ?, ?)
    `).run(
      userId,
      ownerId,
      requestType === 'swap' ? itemOfferedId : null,
      itemRequestedId,
      message || '',
      requestType,
      requestType === 'sell' ? itemRequestedId : null
    );

    return res.status(201).json({
      success: true,
      message: `${requestType === 'sell' ? 'Purchase' : 'Swap'} request sent successfully!`,
      requestId: info.lastInsertRowid
    });

  } catch (error) {
    console.error('Create request error:', error);
    return res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
};

// ─── Get All Requests (sent + received) ──────────────────────────────────────
// GET /api/swaps
const getSwapRequests = (req, res) => {
  try {
    const userId = Number(req.userId);
    const swaps = db.prepare(`
      SELECT s.*,
             ua.name  AS requester_name,
             ub.name  AS owner_name,
             ia.title AS item_a_title,
             ib.title AS item_b_title,
             ia.image AS item_a_image,
             ib.image AS item_b_image
      FROM swaps s
      JOIN users ua ON s.user_a_id = ua.id
      JOIN users ub ON s.user_b_id = ub.id
      LEFT JOIN items ia ON s.item_a_id = ia.id
      LEFT JOIN items ib ON s.item_b_id = ib.id
      WHERE s.user_a_id = ? OR s.user_b_id = ?
      ORDER BY s.created_at DESC
    `).all(userId, userId);

    return res.status(200).json({ success: true, swaps });
  } catch (error) {
    console.error('Get swap requests error:', error);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─── Get Inbox Requests (requests received by logged-in user) ────────────────
// GET /api/swaps/inbox
const getInboxRequests = (req, res) => {
  try {
    const userId = Number(req.userId);

    const requests = db.prepare(`
      SELECT
        s.id,
        s.status,
        s.type,
        s.message,
        s.created_at,
        u.id   AS sender_id,
        u.name AS sender_name,
        u.email AS sender_email,
        ib.id    AS item_id,
        ib.title AS item_title,
        ib.image AS item_image,
        ib.listingType AS item_listing_type,
        ia.title AS offered_item_title,
        ia.image AS offered_item_image
      FROM swaps s
      JOIN users u  ON s.user_a_id = u.id
      JOIN items ib ON s.item_b_id = ib.id
      LEFT JOIN items ia ON s.item_a_id = ia.id
      WHERE s.user_b_id = ?
      ORDER BY s.created_at DESC
    `).all(userId);

    // Count pending
    const pendingCount = requests.filter(r => r.status === 'pending').length;

    return res.status(200).json({ success: true, requests, pendingCount });
  } catch (error) {
    console.error('Get inbox error:', error);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─── Get Single Swap ──────────────────────────────────────────────────────────
const getSwapRequestById = (req, res) => {
  try {
    const { id } = req.params;
    const userId = Number(req.userId);

    const swap = db.prepare(`
      SELECT s.*,
             ua.name AS requester_name, ub.name AS owner_name,
             ia.title AS item_a_title, ib.title AS item_b_title,
             ia.image AS item_a_image, ib.image AS item_b_image
      FROM swaps s
      JOIN users ua ON s.user_a_id = ua.id
      JOIN users ub ON s.user_b_id = ub.id
      LEFT JOIN items ia ON s.item_a_id = ia.id
      JOIN items ib ON s.item_b_id = ib.id
      WHERE s.id = ?
    `).get(id);

    if (!swap) return res.status(404).json({ success: false, message: 'Request not found.' });

    if (Number(swap.user_a_id) !== userId && Number(swap.user_b_id) !== userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized.' });
    }

    return res.status(200).json({ success: true, swap });
  } catch (error) {
    console.error('Get swap by id error:', error);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─── Respond to Request (Accept / Reject) ────────────────────────────────────
// PUT /api/swaps/:id/respond
// Body: { status: 'accepted' | 'rejected' }
const respondToSwapRequest = (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = Number(req.userId);

    const validStatuses = ['accepted', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be "accepted" or "rejected".' });
    }

    const swap = db.prepare('SELECT * FROM swaps WHERE id = ?').get(id);
    if (!swap) return res.status(404).json({ success: false, message: 'Request not found.' });

    if (Number(swap.user_b_id) !== userId) {
      return res.status(403).json({ success: false, message: 'Only the item owner can respond to this request.' });
    }

    if (swap.status !== 'pending') {
      return res.status(400).json({ success: false, message: `Request is already ${swap.status}.` });
    }

    db.prepare('UPDATE swaps SET status = ? WHERE id = ?').run(status, id);

    return res.status(200).json({ success: true, message: `Request ${status} successfully.` });
  } catch (error) {
    console.error('Respond to request error:', error);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─── Complete Swap ────────────────────────────────────────────────────────────
const completeSwapRequest = (req, res) => {
  try {
    const { id } = req.params;
    const userId = Number(req.userId);

    const swap = db.prepare('SELECT * FROM swaps WHERE id = ?').get(id);
    if (!swap) return res.status(404).json({ success: false, message: 'Request not found.' });

    if (Number(swap.user_a_id) !== userId && Number(swap.user_b_id) !== userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized.' });
    }

    db.prepare("UPDATE swaps SET status = 'completed' WHERE id = ?").run(id);

    return res.status(200).json({ success: true, message: 'Request completed successfully!' });
  } catch (error) {
    console.error('Complete request error:', error);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─── Cancel Request ───────────────────────────────────────────────────────────
const cancelSwapRequest = (req, res) => {
  try {
    const { id } = req.params;
    const userId = Number(req.userId);

    const swap = db.prepare('SELECT * FROM swaps WHERE id = ?').get(id);
    if (!swap) return res.status(404).json({ success: false, message: 'Request not found.' });

    if (Number(swap.user_a_id) !== userId) {
      return res.status(403).json({ success: false, message: 'Only the requester can cancel.' });
    }

    db.prepare("UPDATE swaps SET status = 'cancelled' WHERE id = ?").run(id);

    return res.status(200).json({ success: true, message: 'Request cancelled.' });
  } catch (error) {
    console.error('Cancel request error:', error);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = {
  createSwapRequest,
  getSwapRequests,
  getInboxRequests,
  getSwapRequestById,
  respondToSwapRequest,
  completeSwapRequest,
  cancelSwapRequest
};
