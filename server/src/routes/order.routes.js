const express = require('express');
const router = express.Router();
const { placeOrder, getMyOrders, getAllOrders, updateOrderStatus } = require('../controllers/order.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

// Customer Routes
router.post('/checkout', protect, restrictTo('customer'), placeOrder);
router.get('/my', protect, restrictTo('customer'), getMyOrders);

// Vendor Routes
router.get('/vendor', protect, restrictTo('vendor'), getAllOrders);
router.put('/:id/status', protect, restrictTo('vendor'), updateOrderStatus);

module.exports = router;