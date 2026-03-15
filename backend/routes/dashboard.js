const express = require('express');
const router = express.Router();
const { getUserDashboardData } = require('../controllers/dashboardController');

router.get('/user/:userId', getUserDashboardData);

module.exports = router;
