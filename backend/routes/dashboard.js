const express = require('express');
const router = express.Router();
const { getUserDashboardData, getGeneralStats } = require('../controllers/dashboardController');
const { isAuth } = require('../middleware/auth');

// GET /api/dashboard — public site-wide stats (items count, users count, etc.)
router.get('/', getGeneralStats);

// GET /api/dashboard/user/:userId — protected per-user dashboard data
router.get('/user/:userId', isAuth, getUserDashboardData);

module.exports = router;
