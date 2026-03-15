const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  createSwapRequest,
  getSwapRequests,
  getSwapRequestById,
  respondToSwapRequest,
  completeSwapRequest,
  cancelSwapRequest
} = require('../controllers/swapController');

// All routes are protected
router.post('/', authenticate, createSwapRequest);
router.get('/', authenticate, getSwapRequests);
router.get('/:id', authenticate, getSwapRequestById);
router.put('/:id/respond', authenticate, respondToSwapRequest);
router.put('/:id/complete', authenticate, completeSwapRequest);
router.put('/:id/cancel', authenticate, cancelSwapRequest);

module.exports = router;
