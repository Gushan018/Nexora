const express = require('express');
const router = express.Router();


const { 
  registerCustomer, 
  loginCustomer, 
  registerVendor, 
  loginVendor,
  loginAdmin               
} = require('../controllers/auth.controller');

// Customer Routes
router.post('/register/customer', registerCustomer);
router.post('/login/customer', loginCustomer);

// Vendor Routes 
router.post('/register/vendor', registerVendor);
router.post('/login/vendor', loginVendor);
router.post('/login/admin', loginAdmin);

module.exports = router;