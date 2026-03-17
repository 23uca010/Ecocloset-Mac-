const db = require('../database/sqlite');

// Get dashboard statistics
const getDashboardStats = (req, res) => {
  try {
    const totalUsers = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'user'").get().count;
    const totalItems = db.prepare('SELECT COUNT(*) as count FROM items').get().count;
    const totalSwaps = db.prepare('SELECT COUNT(*) as count FROM swaps').get().count;
    const pendingSwaps = db.prepare("SELECT COUNT(*) as count FROM swaps WHERE status = 'pending'").get().count;
    const completedSwaps = db.prepare("SELECT COUNT(*) as count FROM swaps WHERE status = 'completed'").get().count;
    const totalDonations = db.prepare('SELECT COUNT(*) as count FROM donations').get().count;
    
    // Platform Growth Data
    const currentYear = new Date().getFullYear();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const usersByMonth = db.prepare(`SELECT strftime('%m', created_at) as month, COUNT(*) as count FROM users WHERE role = 'user' AND strftime('%Y', created_at) = ? GROUP BY month`).all(currentYear.toString());
    const itemsByMonth = db.prepare(`SELECT strftime('%m', created_at) as month, COUNT(*) as count FROM items WHERE strftime('%Y', created_at) = ? GROUP BY month`).all(currentYear.toString());
    const completedSwapsByMonth = db.prepare(`SELECT strftime('%m', created_at) as month, COUNT(*) as count FROM swaps WHERE status = 'completed' AND strftime('%Y', created_at) = ? GROUP BY month`).all(currentYear.toString());
    const donationsByMonth = db.prepare(`SELECT strftime('%m', createdAt) as month, COUNT(*) as count FROM donations WHERE strftime('%Y', createdAt) = ? GROUP BY month`).all(currentYear.toString());

    const analytics = months.map((m, i) => {
      const monthNum = (i + 1).toString().padStart(2, '0');
      return {
        month: m,
        users: usersByMonth.find(r => r.month === monthNum)?.count || 0,
        listings: itemsByMonth.find(r => r.month === monthNum)?.count || 0,
        swaps: completedSwapsByMonth.find(r => r.month === monthNum)?.count || 0,
        donations: donationsByMonth.find(r => r.month === monthNum)?.count || 0
      };
    });

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalListings: totalItems,
          totalSwaps,
          pendingSwaps,
          completedSwaps,
          totalDonations
        },
        analytics
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ success: false, message: 'Server error processing statistics.' });
  }
};

// User Management
const getUsers = (req, res) => {
  try {
    const users = db.prepare("SELECT id, name, email, role, status, created_at FROM users WHERE role = 'user' ORDER BY created_at DESC").all();
    res.status(200).json({ success: true, data: { users } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching users.' });
  }
};

const updateUserStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    db.prepare('UPDATE users SET status = ? WHERE id = ?').run(status, id);
    res.status(200).json({ success: true, message: `User status updated to ${status}` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating user status.' });
  }
};

const deleteUser = (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM users WHERE id = ?').run(id);
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting user.' });
  }
};

// Item Management
const getAdminItems = (req, res) => {
  try {
    const items = db.prepare(`
      SELECT i.*, u.name as owner_name 
      FROM items i
      LEFT JOIN users u ON i.user_id = u.id
      ORDER BY i.created_at DESC
    `).all();
    res.status(200).json({ success: true, data: { items } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching listings.' });
  }
};

const updateItemStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    db.prepare('UPDATE items SET status = ? WHERE id = ?').run(status, id);
    res.status(200).json({ success: true, message: `Listing status updated to ${status}` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating listing.' });
  }
};

const deleteItem = (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM items WHERE id = ?').run(id);
    res.status(200).json({ success: true, message: 'Listing deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting listing.' });
  }
};

// Swap Management
const getAdminSwaps = (req, res) => {
  try {
    const swaps = db.prepare(`
      SELECT s.*, 
             ua.name as user_a_name, ub.name as user_b_name,
             ia.title as item_a_title, ib.title as item_b_title,
             ib.image as item_image
      FROM swaps s
      JOIN users ua ON s.user_a_id = ua.id
      JOIN users ub ON s.user_b_id = ub.id
      LEFT JOIN items ia ON s.item_a_id = ia.id
      JOIN items ib ON s.item_b_id = ib.id
      ORDER BY s.created_at DESC
    `).all();
    res.status(200).json({ success: true, data: { swaps } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching swaps.' });
  }
};

const updateSwapStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    db.prepare('UPDATE swaps SET status = ? WHERE id = ?').run(status, id);
    res.status(200).json({ success: true, message: `Swap status updated to ${status}` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating swap.' });
  }
};

const deleteSwapRequest = (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM swaps WHERE id = ?').run(id);
    res.status(200).json({ success: true, message: 'Swap request deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting swap.' });
  }
};

// Report Management
const getSystemReports = (req, res) => {
  try {
    const reports = db.prepare(`
      SELECT r.*, u.name as reporter_name
      FROM reports r
      JOIN users u ON r.reporter_id = u.id
      ORDER BY r.created_at DESC
    `).all();
    res.status(200).json({ success: true, data: { reports } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching reports.' });
  }
};

// Order Management
const getAdminOrders = (req, res) => {
  try {
    const orders = db.prepare(`
      SELECT o.*, u.name as buyer_name, i.title as item_name
      FROM orders o
      JOIN users u ON o.buyer_id = u.id
      JOIN items i ON o.item_id = i.id
      ORDER BY o.created_at DESC
    `).all();
    res.status(200).json({ success: true, data: { orders } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching orders.' });
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
  updateSwapStatus,
  deleteSwapRequest,
  getSystemReports,
  getAdminOrders
};
