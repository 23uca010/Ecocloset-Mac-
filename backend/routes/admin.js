const express = require('express');
const router = express.Router();
const { 
  getDashboardStats, 
  getUsers, 
  updateUserStatus, 
  deleteUser,
  getAdminItems,
  updateItemStatus,
  deleteItem,
  getAdminSwaps,
  getSystemReports
} = require('../controllers/adminController');

// All these routes should be protected by isAdmin middleware in server.js
// but here we just define the sub-routes

router.get('/dashboard/stats', getDashboardStats);
router.get('/users', getUsers);
router.put('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);
router.get('/items', getAdminItems);
router.put('/items/:id/status', updateItemStatus);
router.delete('/items/:id', deleteItem);
router.get('/swaps', getAdminSwaps);
router.get('/reports', getSystemReports);

module.exports = router;
