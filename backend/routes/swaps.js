const express = require('express');
const router = express.Router();
const { isAuth } = require('../middleware/auth');
const {
  createSwapRequest,
  getSwapRequests,
  getSwapRequestById,
  respondToSwapRequest,
  completeSwapRequest,
  cancelSwapRequest
} = require('../controllers/swapController');

// All routes are protected
router.post('/', isAuth, createSwapRequest);
router.get('/', isAuth, getSwapRequests);
router.get('/:id', isAuth, getSwapRequestById);
router.put('/:id/respond', isAuth, respondToSwapRequest);
router.put('/:id/complete', isAuth, completeSwapRequest);
router.put('/:id/cancel', isAuth, cancelSwapRequest);

module.exports = router;
