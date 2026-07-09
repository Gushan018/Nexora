const express = require('express');
const router = express.Router();
const {
  releasePayment,
  getAllVendors,
  getAllCustomers,
  getAllUsers,
  getUserDetails,
  getAdminDashboardStats
} = require('../controllers/admin.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

// Admin Routes
router.use(protect, restrictTo('admin'));

// Dashboard
router.get('/dashboard/stats', getAdminDashboardStats);

// Users
router.get('/users', getAllUsers);
router.get('/users/:id', getUserDetails);

// Vendors
router.get('/vendors', getAllVendors);

// Customers
router.get('/customers', getAllCustomers);

// Payments
router.put('/payments/:id/release', releasePayment);

module.exports = router;
