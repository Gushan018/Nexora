const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { getConversations, getMessages, sendMessage } = require('../controllers/messages.controller');

router.use(protect);
router.get('/conversations', getConversations);
router.get('/messages/:conversationId', getMessages);
router.get('/:conversationId', getMessages);
router.post('/messages', sendMessage);
router.post('/send', sendMessage);

module.exports = router;
