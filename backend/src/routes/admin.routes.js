const express = require('express');
const router = express.Router();
const {
  getPendingVendors,
  approveVendor,
  releasePayment,
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getAdminProfile,
  updateAdminProfile,
} = require('../controllers/admin.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

// Admin Routes
router.use(protect, restrictTo('admin'));

// Customers CRUD
router.get('/users', getCustomers);
router.get('/users/:id', getCustomerById);
router.post('/users', createCustomer);
router.put('/users/:id', updateCustomer);
router.delete('/users/:id', deleteCustomer);

router.get('/profile', getAdminProfile);
router.put('/profile', updateAdminProfile);

// Vendors Approve 
router.get('/vendors/pending', getPendingVendors);
router.put('/vendors/:id/approve', approveVendor);

// Payments Release 
router.put('/payments/:id/release', releasePayment);

module.exports = router;