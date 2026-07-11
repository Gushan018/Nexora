const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { getMyNotifications, markAsRead, markAllAsRead, deleteNotification } = require('../controllers/notifications.controller');

router.use(protect);
router.get('/', getMyNotifications);
router.get('/my', getMyNotifications);
router.put('/read-all', markAllAsRead);
router.put('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

module.exports = router;
