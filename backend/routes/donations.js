const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const {
  createDonationRequest,
  getUserDonations,
  getNGODonations,
  updateDonationStatus,
  getDonationById,
  respondToDonation,
  scheduleDonation,
  completeDonation,
  reviewDonation
} = require('../controllers/donationController');

// All routes are protected
router.get('/', authenticate, getUserDonations);
router.get('/:id', authenticate, getDonationById);

// NGO only routes
router.put('/:id/respond', authenticate, authorize('ngo', 'admin'), respondToDonation);
router.put('/:id/schedule', authenticate, authorize('ngo', 'admin'), scheduleDonation);
router.put('/:id/complete', authenticate, authorize('ngo', 'admin'), completeDonation);

// Review routes (donor or NGO)
router.put('/:id/review', authenticate, reviewDonation);

module.exports = router;
