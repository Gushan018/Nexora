const express = require('express');
const router = express.Router();
const { makePayment, getMyPayments } = require('../controllers/payment.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

// Customer Routes
router.use(protect, restrictTo('customer'));

// POST /api/payments/pay 
router.post('/pay', makePayment);

// GET /api/payments/my 
router.get('/my', getMyPayments);

module.exports = router;