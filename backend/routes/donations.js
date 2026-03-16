const express = require('express');
const router = express.Router();
const { createDonation } = require('../controllers/donationController');

// POST /api/donations - public endpoint
router.post('/', createDonation);

module.exports = router;
