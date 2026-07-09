const express = require('express');
const router = express.Router();
const { releasePayment, getAllVendors, approveVendor, approveContent, getAllCustomers, getAllBookingsAdmin, getAllPaymentsAdmin, getAdminDashboard } = require('../controllers/admin.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

// Admin Routes
router.use(protect, restrictTo('admin'));

// Dashboard
router.get('/dashboard', getAdminDashboard);

// Vendor Management
router.get('/vendors', getAllVendors);
router.put('/vendors/:id/approve', approveVendor);

// Content Approval
router.put('/approve/:type/:id', approveContent);

// Customer Management
router.get('/customers', getAllCustomers);

// Bookings & Payments
router.get('/bookings', getAllBookingsAdmin);
router.get('/payments', getAllPaymentsAdmin);

// Payments Release 
router.put('/payments/:id/release', releasePayment);

module.exports = router;