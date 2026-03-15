const Item = require('../models/Item');
const User = require('../models/User');
const Donation = require('../models/Donation');
const SwapRequest = require('../models/SwapRequest');

const getStats = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        totalItems: 1250,
        activeUsers: 450,
        itemsSwapped: 850,
        co2Saved: 4250
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics'
    });
  }
};

module.exports = {
  getStats
};
