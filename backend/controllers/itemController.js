const db = require('../database/sqlite');

// Get all items with filtering
const getItems = (req, res) => {
  try {
    const { category, search, status = 'active' } = req.query;
    let query = `
      SELECT i.*, u.name as owner_name 
      FROM items i
      LEFT JOIN users u ON i.user_id = u.id
      WHERE i.status = ?
    `;
    let params = [status];

    if (category) {
      query += ' AND i.category = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND (i.title LIKE ? OR i.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY i.created_at DESC';

    const items = db.prepare(query).all(...params);

    res.status(200).json({
      success: true,
      data: items
    });
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching items.'
    });
  }
};

// Create new item
const createItem = (req, res) => {
  try {
    const { user_id, title, brand, price, description, category, size, color, condition, listingType } = req.body;
    const image = req.file ? req.file.path.replace(/\\/g, '/') : null;
    
    // Make listings active immediately so they show up in Browse
    const status = 'active';

    const info = db.prepare(`
      INSERT INTO items (user_id, title, brand, price, description, category, size, color, condition, listingType, image, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(req.userId || user_id, title, brand, Number(price), description, category, size, color, condition, listingType, image, status);

    res.status(201).json({
      success: true,
      message: 'Item listed successfully.',
      data: { id: info.lastInsertRowid }
    });
  } catch (error) {
    console.error('CREATE ITEM EXCEPTION:', error);
    console.log('REQUEST BODY WAS:', req.body);
    console.log('REQUEST FILE WAS:', req.file);
    res.status(500).json({
      success: false,
      message: 'Server error creating listing.'
    });
  }
};

// Get single item
const getItem = (req, res) => {
  try {
    const { id } = req.params;
    const item = db.prepare(`
      SELECT i.*, u.name as owner_name, u.phone as owner_phone, u.location as owner_location
      FROM items i
      LEFT JOIN users u ON i.user_id = u.id
      WHERE i.id = ?
    `).get(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found.'
      });
    }

    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Get item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching item details.'
    });
  }
};

// Delete item (for user)
const deleteItem = (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, requester_id, requester_role } = req.body;
    
    // Support either field name
    const requestingUser = user_id || requester_id;

    const item = db.prepare('SELECT user_id FROM items WHERE id = ?').get(id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    // Admins can delete any item, otherwise it must match the item owner
    if (requester_role !== 'admin' && item.user_id !== parseInt(requestingUser)) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    db.prepare('DELETE FROM items WHERE id = ?').run(id);

    res.status(200).json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting item.'
    });
  }
};

// Get user items
const getUserItems = (req, res) => {
  try {
    const { userId } = req.params;
    let targetUserId = userId || req.userId;
    
    // Ensure ID is treated consistently, converting to number if possible
    if (targetUserId && !isNaN(targetUserId)) {
      targetUserId = Number(targetUserId);
    }
    
    console.log('DEBUG: Fetching items for target user ID:', targetUserId, '(Type:', typeof targetUserId, ')');

    const items = db.prepare(`
      SELECT i.*, u.name as owner_name 
      FROM items i
      LEFT JOIN users u ON i.user_id = u.id
      WHERE i.user_id = ?
      ORDER BY i.created_at DESC
    `).all(targetUserId);

    console.log(`DEBUG: Found ${items.length} items for user ID: ${targetUserId}`);
    if (items.length > 0) {
      console.log('DEBUG: First item user_id:', items[0].user_id, '(Type:', typeof items[0].user_id, ')');
    }

    res.status(200).json({
      success: true,
      data: items
    });
  } catch (error) {
    console.error('Get user items error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching user items.'
    });
  }
};

module.exports = {
  getItems,
  createItem,
  getItem,
  deleteItem,
  getItemById: getItem,
  getUserItems
};
