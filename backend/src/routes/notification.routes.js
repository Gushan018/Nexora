const express = require('express');
const router = express.Router();
const { getMyNotifications, markAsRead } = require('../controllers/notification.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

router.get('/my', protect, restrictTo('customer'), getMyNotifications);
router.put('/:id/read', protect, restrictTo('customer'), markAsRead);

module.exports = router;
