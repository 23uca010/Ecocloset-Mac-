const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const {
  getDashboardStats,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAdminItems,
  getAdminSwaps,
  getAdminDonations,
  getSystemReports
} = require('../controllers/adminController');

// All admin routes require admin role
router.use(authenticate, authorize('admin'));

// Dashboard and statistics
router.get('/dashboard/stats', getDashboardStats);
router.get('/reports', getSystemReports);

// User management
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Item management
router.get('/items', getAdminItems);

// Swap management
router.get('/swaps', getAdminSwaps);

// Donation management
router.get('/donations', getAdminDonations);

module.exports = router;
