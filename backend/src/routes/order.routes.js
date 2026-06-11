const express = require('express');
const router = express.Router();
const { placeOrder, getMyOrders } = require('../controllers/order.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

// Customer Routes
router.use(protect, restrictTo('customer'));

// POST /api/orders/checkout 
router.post('/checkout', placeOrder);

// GET /api/orders/my 
router.get('/my', getMyOrders);

module.exports = router;