const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const {
  getNGODashboard,
  getAvailableItems,
  getNGOProfile,
  updateNGOProfile,
  getDonationHistory,
  generateImpactReport,
  getPickupSchedule
} = require('../controllers/ngoController');

// All NGO routes require NGO role
router.use(authenticate, authorize('ngo'));

// NGO Dashboard
router.get('/dashboard', getNGODashboard);

// NGO Profile
router.get('/profile', getNGOProfile);
router.put('/profile', updateNGOProfile);

// Available items for donation
router.get('/items/available', getAvailableItems);

// Donation management
router.get('/donations', getDonationHistory);
router.get('/donations/impact-report', generateImpactReport);

// Pickup management
router.get('/pickups', getPickupSchedule);

module.exports = router;
