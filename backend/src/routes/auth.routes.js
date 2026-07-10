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
  loginAdmin,
  loginUnified,
  changePassword
} = require('../controllers/auth.controller');

// Unified Login
router.post('/login', loginUnified);

// Customer Routes
router.post('/register/customer', registerCustomer);
router.post('/login/customer', loginCustomer);

// Vendor Routes
router.post('/register/vendor', registerVendor);
router.post('/login/vendor', loginVendor);

// Seller Routes
router.post('/register/seller', registerSeller);
router.post('/login/seller', loginSeller);

// Admin Login
router.post('/login/admin', loginAdmin);

// Protected Routes
router.put('/change-password', protect, changePassword);

module.exports = router;