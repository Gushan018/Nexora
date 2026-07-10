const express = require('express');
const router = express.Router();
const {
<<<<<<< HEAD
  releasePayment,
  getAllVendors,
  getAllCustomers,
  getAllUsers,
  getUserDetails,
  getAdminDashboardStats
=======
  getPendingVendors,
  approveVendor,
  rejectVendor,
  releasePayment,
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getAdminProfile,
  updateAdminProfile,
  getSystemSettings,
  updateSystemSettings,
  getAllVendors,
  getAdminVendorById,
  getAllDisputes,
  getAllBookingsForAdmin,
  getAdminPayments,
  updateDisputeStatus,
  toggleVendorBlock,
  getAdminDashboardStats,
  getAdminDisputeStats,
  getAdminEscrowStats,
  getAdminReviewStats,
  getAllFlaggedReviews,
  getAllReviewsForModeration,
  getPenaltyVendors,
  getBroadcastAudience,
  getBroadcasts,
  createBroadcast,
  impersonateUser,
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
} = require('../controllers/admin.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

// Admin Routes
router.use(protect, restrictTo('admin'));

<<<<<<< HEAD
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
=======
// Customers CRUD
router.get('/users', getCustomers);
router.get('/users/:id', getCustomerById);
router.post('/users', createCustomer);
router.put('/users/:id', updateCustomer);
router.delete('/users/:id', deleteCustomer);

router.get('/profile', getAdminProfile);
router.put('/profile', updateAdminProfile);
router.get('/settings', getSystemSettings);
router.put('/settings', updateSystemSettings);
router.get('/dashboard-stats', getAdminDashboardStats);
router.get('/disputes-stats', getAdminDisputeStats);
router.get('/reviews-stats', getAdminReviewStats);

// Vendors Management
router.get('/vendors', getAllVendors);
router.get('/vendors/:id', getAdminVendorById);
router.get('/vendors/pending', getPendingVendors);
router.put('/vendors/:id/approve', approveVendor);
router.put('/vendors/:id/reject', rejectVendor);
router.put('/vendors/:id/block', toggleVendorBlock);

// Disputes & Resolution
router.get('/disputes', getAllDisputes);
router.put('/disputes/:id/status', updateDisputeStatus);

// Reviews & Moderation
router.get('/reviews-flagged', getAllFlaggedReviews);
router.get('/reviews-all', getAllReviewsForModeration);
router.get('/penalty-vendors', getPenaltyVendors);

// Impersonation ("Login as User")
router.post('/impersonate/:role/:id', impersonateUser);

// Broadcast Notifications
router.get('/broadcasts', getBroadcasts);
router.get('/broadcasts/audience', getBroadcastAudience);
router.post('/broadcasts', createBroadcast);

// Bookings & Escrow
router.get('/bookings', getAllBookingsForAdmin);
router.get('/escrow-stats', getAdminEscrowStats);
router.get('/payments', getAdminPayments);
>>>>>>> e098d737a1e10ec8f5a43e47ec275c30b1f58b45
router.put('/payments/:id/release', releasePayment);

module.exports = router;
