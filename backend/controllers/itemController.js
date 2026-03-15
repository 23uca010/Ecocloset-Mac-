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
    const { user_id, title, brand, price, description, category, size, color, condition, listingType, image } = req.body;
    
    // Status defaults to 'pending' for new listings in admin review workflow
    const status = 'pending';

    const info = db.prepare(`
      INSERT INTO items (user_id, title, brand, price, description, category, size, color, condition, listingType, image, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(user_id, title, brand, price, description, category, size, color, condition, listingType, image, status);

    res.status(201).json({
      success: true,
      message: 'Item listed successfully and is pending approval.',
      data: { id: info.lastInsertRowid }
    });
  } catch (error) {
    console.error('Create item error:', error);
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
    const { user_id } = req.body;

    const item = db.prepare('SELECT user_id FROM items WHERE id = ?').get(id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    if (item.user_id !== user_id) {
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

module.exports = {
  getItems,
  createItem,
  getItem,
  deleteItem,
  getItemById: getItem
};
