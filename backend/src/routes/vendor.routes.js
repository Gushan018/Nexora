const express = require('express');
const router = express.Router();
const {
  getAllVendors,
  getVendorById,
  getVendorProfile,
  updateVendorProfile,
  createService,
  updateService,
  deleteService,
  getVendorServices,
  getServiceById,
  getCategories,
  createPackage,
  updatePackage,
  deletePackage,
  getVendorPackages,
  createAvailability,
  updateAvailability,
  deleteAvailability,
  getVendorAvailability,
  getVendorStats,
  generateReport
} = require('../controllers/vendor.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

// GET /api/vendors/
router.get('/', getAllVendors);

// GET /api/vendors/stats (Vendor Dashboard Stats)
router.get('/stats', protect, restrictTo('seller', 'vendor'), getVendorStats);

// GET /api/vendors/report (Download Report)
router.get('/report', protect, restrictTo('seller', 'vendor'), generateReport);

// GET /api/vendors/profile (Current Vendor)
router.get('/profile', protect, restrictTo('seller', 'vendor'), getVendorProfile);

// PUT /api/vendors/profile (Update Current Vendor)
router.put('/profile', protect, restrictTo('seller', 'vendor'), updateVendorProfile);

// GET /api/vendors/categories
router.get('/categories', getCategories);

// POST /api/vendors/services (Create Service)
router.post('/services', protect, restrictTo('seller', 'vendor'), createService);

// GET /api/vendors/services (Get all vendor services)
router.get('/services', protect, restrictTo('seller', 'vendor'), getVendorServices);

// GET /api/vendors/services/:serviceId (Get single service)
router.get('/services/:serviceId', protect, restrictTo('seller', 'vendor'), getServiceById);

// PUT /api/vendors/services/:serviceId (Update Service)
router.put('/services/:serviceId', protect, restrictTo('seller', 'vendor'), updateService);

// DELETE /api/vendors/services/:serviceId (Delete Service)
router.delete('/services/:serviceId', protect, restrictTo('seller', 'vendor'), deleteService);

// POST /api/vendors/packages (Create Package)
router.post('/packages', protect, restrictTo('seller', 'vendor'), createPackage);

// GET /api/vendors/packages (Get all vendor packages)
router.get('/packages', protect, restrictTo('seller', 'vendor'), getVendorPackages);

// PUT /api/vendors/packages/:packageId (Update Package)
router.put('/packages/:packageId', protect, restrictTo('seller', 'vendor'), updatePackage);

// DELETE /api/vendors/packages/:packageId (Delete Package)
router.delete('/packages/:packageId', protect, restrictTo('seller', 'vendor'), deletePackage);

// POST /api/vendors/availability (Create Availability)
router.post('/availability', protect, restrictTo('seller', 'vendor'), createAvailability);

// GET /api/vendors/availability (Get all vendor availability)
router.get('/availability', protect, restrictTo('seller', 'vendor'), getVendorAvailability);

// PUT /api/vendors/availability/:availabilityId (Update Availability)
router.put('/availability/:availabilityId', protect, restrictTo('seller', 'vendor'), updateAvailability);

// DELETE /api/vendors/availability/:availabilityId (Delete Availability)
router.delete('/availability/:availabilityId', protect, restrictTo('seller', 'vendor'), deleteAvailability);

// GET /api/vendors/123
router.get('/:id', getVendorById);

module.exports = router;