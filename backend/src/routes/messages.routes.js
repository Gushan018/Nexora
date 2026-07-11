const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { getConversations, getMessages, sendMessage } = require('../controllers/messages.controller');

router.use(protect);
router.get('/conversations', getConversations);
router.get('/:conversationId', getMessages);
router.post('/send', sendMessage);

module.exports = router;
