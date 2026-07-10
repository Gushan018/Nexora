const express = require('express');
const router = express.Router();
const { placeOrder, getMyOrders, getSellerOrders, updateOrderStatus } = require('../controllers/order.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

// Customer Routes
router.post('/checkout', protect, restrictTo('customer'), placeOrder);
router.get('/my', protect, restrictTo('customer'), getMyOrders);

// Seller Routes
router.get('/seller-orders', protect, restrictTo('seller', 'vendor'), getSellerOrders);
router.put('/:id/status', protect, restrictTo('seller', 'vendor', 'admin'), updateOrderStatus);

module.exports = router;