const express = require('express');
const router = express.Router();
const { isAuth } = require('../middleware/auth');
const {
  createSwapRequest,
  getSwapRequests,
  getInboxRequests,
  getSwapRequestById,
  respondToSwapRequest,
  completeSwapRequest,
  cancelSwapRequest
} = require('../controllers/swapController');

// GET /api/swaps/inbox — requests received by the logged-in user (must be before /:id)
router.get('/inbox', isAuth, getInboxRequests);

// Standard CRUD
router.post('/',           isAuth, createSwapRequest);
router.get('/',            isAuth, getSwapRequests);
router.get('/:id',         isAuth, getSwapRequestById);
router.put('/:id/respond', isAuth, respondToSwapRequest);
router.put('/:id/complete',isAuth, completeSwapRequest);
router.put('/:id/cancel',  isAuth, cancelSwapRequest);

module.exports = router;
