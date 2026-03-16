const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

// All standard authenticated endpoints
// The auth token middleware validation is expected to be placed in server.js before this router
router.post('/send', messageController.sendMessage);
router.get('/conversations', messageController.getConversations);
router.get('/history/:userId', messageController.getConversationHistory);
router.put('/read/:senderId', messageController.markAsRead);

module.exports = router;
