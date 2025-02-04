const express = require('express');
const { getChatHistory, saveMessage } = require('../controllers/chatController');

const router = express.Router();

// Get chat history between two users
router.get('/:userId/:otherUserId', getChatHistory);

// Save message (Optional API, since WebSocket handles real-time messaging)
router.post('/send', saveMessage);

module.exports = router;
