const express = require('express');
const router = express.Router();
const { getPendingVendors, approveVendor, releasePayment } = require('../controllers/admin.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

// Admin Routes
router.use(protect, restrictTo('admin'));

// Vendors Approve 
router.get('/vendors/pending', getPendingVendors);
router.put('/vendors/:id/approve', approveVendor);

// Payments Release 
router.put('/payments/:id/release', releasePayment);

module.exports = router;