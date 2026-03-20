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
  updateSwapStatus,
  deleteSwapRequest,
  getSystemReports,
  getAdminOrders
} = require('../controllers/adminController');
const { getAllDonations, updateDonationStatus, deleteDonation } = require('../controllers/donationController');

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
router.put('/swaps/:id', updateSwapStatus);
router.delete('/swaps/:id', deleteSwapRequest);
router.get('/reports', getSystemReports);
router.get('/orders', getAdminOrders);

// Donations management
router.get('/donations', getAllDonations);
router.patch('/donations/:id', updateDonationStatus);
router.delete('/donations/:id', deleteDonation);

module.exports = router;
