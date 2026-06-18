const express = require('express');
const router = express.Router();
const { getCustomerProfile, updateCustomerProfile, getDashboardStats } = require('../controllers/customer.controller');
const { protect } = require('../middleware/auth.middleware');

// Protect all routes
router.use(protect);

router.get('/profile', getCustomerProfile);
router.put('/profile', updateCustomerProfile);
router.get('/dashboard-stats', getDashboardStats);

module.exports = router;
