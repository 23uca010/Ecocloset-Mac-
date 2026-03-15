const db = require('../database/sqlite');

// Get dashboard statistics
const getDashboardStats = (req, res) => {
  try {
    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users WHERE role = "user"').get().count;
    const totalItems = db.prepare('SELECT COUNT(*) as count FROM items').get().count;
    const activeListings = db.prepare('SELECT COUNT(*) as count FROM items WHERE status = "active"').get().count;
    const pendingListings = db.prepare('SELECT COUNT(*) as count FROM items WHERE status = "pending"').get().count;
    const totalSwaps = db.prepare('SELECT COUNT(*) as count FROM swaps').get().count;
    const reportedItems = db.prepare('SELECT COUNT(*) as count FROM reports WHERE target_type = "item" AND status = "pending"').get().count;

    // Get recent activity
    const recentUsers = db.prepare('SELECT id, name, email, role, created_at, status FROM users WHERE role = "user" ORDER BY created_at DESC LIMIT 5').all();
    const recentItems = db.prepare('SELECT id, title, category, status, created_at FROM items ORDER BY created_at DESC LIMIT 5').all();

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalListings: totalItems,
          activeListings,
          pendingListings,
          totalSwaps,
          reportedItems
        },
        recentUsers,
        recentItems
      }
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error processing statistics.'
    });
  }
};

// Get all users
const getUsers = (req, res) => {
  try {
    const { search } = req.query;
    let query = 'SELECT id, name, email, role, location, phone, status, created_at FROM users WHERE role = "user"';
    let params = [];

    if (search) {
      query += ' AND (name LIKE ? OR email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY created_at DESC';
    
    // Add listings count for each user
    const users = db.prepare(query).all(...params);
    const usersWithCounts = users.map(user => {
      const listingCount = db.prepare('SELECT COUNT(*) as count FROM items WHERE user_id = ?').get(user.id).count;
      return { ...user, listingsCount: listingCount };
    });

    res.status(200).json({
      success: true,
      data: { users: usersWithCounts }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching users.'
    });
  }
};

// Update user status (suspend/ban)
const updateUserStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // active, suspended, banned

    db.prepare('UPDATE users SET status = ? WHERE id = ?').run(status, id);

    res.status(200).json({
      success: true,
      message: `User status updated to ${status}`
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating user status.'
    });
  }
};

// Delete user
const deleteUser = (req, res) => {
  try {
    const { id } = req.params;
    
    // In a real app, we might want to cascade delete or soft delete
    db.prepare('DELETE FROM users WHERE id = ?').run(id);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting user.'
    });
  }
};

// Get all items/listings
const getAdminItems = (req, res) => {
  try {
    const items = db.prepare(`
      SELECT i.*, u.name as owner_name 
      FROM items i
      LEFT JOIN users u ON i.user_id = u.id
      ORDER BY i.created_at DESC
    `).all();

    res.status(200).json({
      success: true,
      data: { items }
    });
  } catch (error) {
    console.error('Get admin items error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching listings.'
    });
  }
};

// Approve/Reject listing
const updateItemStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // active, rejected, pending

    db.prepare('UPDATE items SET status = ? WHERE id = ?').run(status, id);

    res.status(200).json({
      success: true,
      message: `Listing status updated to ${status}`
    });
  } catch (error) {
    console.error('Update item status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating listing.'
    });
  }
};

// Delete listing
const deleteItem = (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM items WHERE id = ?').run(id);

    res.status(200).json({
      success: true,
      message: 'Listing deleted successfully'
    });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting listing.'
    });
  }
};

// Get all swaps
const getAdminSwaps = (req, res) => {
  try {
    const swaps = db.prepare(`
      SELECT s.*, 
             ua.name as user_a_name, ub.name as user_b_name,
             ia.title as item_a_title, ib.title as item_b_title
      FROM swaps s
      JOIN users ua ON s.user_a_id = ua.id
      JOIN users ub ON s.user_b_id = ub.id
      JOIN items ia ON s.item_a_id = ia.id
      JOIN items ib ON s.item_b_id = ib.id
      ORDER BY s.created_at DESC
    `).all();

    res.status(200).json({
      success: true,
      data: { swaps }
    });
  } catch (error) {
    console.error('Get admin swaps error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching swaps.'
    });
  }
};

// Get all reports
const getSystemReports = (req, res) => {
  try {
    const reports = db.prepare(`
      SELECT r.*, u.name as reporter_name
      FROM reports r
      JOIN users u ON r.reporter_id = u.id
      ORDER BY r.created_at DESC
    `).all();

    res.status(200).json({
      success: true,
      data: { reports }
    });
  } catch (error) {
    console.error('Get system reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching reports.'
    });
  }
};

module.exports = {
  getDashboardStats,
  getUsers,
  updateUserStatus,
  deleteUser,
  getAdminItems,
  updateItemStatus,
  deleteItem,
  getAdminSwaps,
  getSystemReports
};
