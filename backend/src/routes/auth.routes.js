const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/auth.middleware');

const {
  registerCustomer,
  loginCustomer,
  registerVendor,
  loginVendor,
  registerSeller,
  loginSeller,
  registerCompany,
  loginAdmin,
  loginUnified,
  changePassword,
  forgotPassword,
  resetPassword
} = require('../controllers/auth.controller');

// Unified Login
router.post('/login', loginUnified);

// Customer Routes
router.post('/register/customer', registerCustomer);
router.post('/login/customer', loginCustomer);

// Vendor (Service Provider) Routes
router.post('/register/vendor', registerVendor);
router.post('/login/vendor', loginVendor);

// Seller Routes
router.post('/register/seller', registerSeller);
router.post('/login/seller', loginSeller);

// Event Company Routes
router.post('/register/company', registerCompany);

// Admin Login
router.post('/login/admin', loginAdmin);

// Forgot & Reset Password Routes
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected Password Change
router.put('/change-password', protect, changePassword);

module.exports = router;