const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth.middleware');
const { getAllVendors, getVendorById, getMyProfile, updateMyProfile, getDashboard, getReports, exportReportPDF, exportReportExcel, getMyServices, getMyProducts, getVendorPayments } = require('../controllers/vendor.controller');
const { getAllCategories } = require('../controllers/categories.controller');
const { getMyPackages, createPackage, updatePackage, deletePackage } = require('../controllers/package.controller');
const { getAllServices, getServiceById, createService, updateService, deleteService } = require('../controllers/services.controller');

// GET /api/vendors/categories
router.get('/categories', getAllCategories);

// Vendor Packages Aliases
router.get('/packages', protect, restrictTo('vendor'), getMyPackages);
router.post('/packages', protect, restrictTo('vendor'), createPackage);
router.put('/packages/:id', protect, restrictTo('vendor'), updatePackage);
router.delete('/packages/:id', protect, restrictTo('vendor'), deletePackage);

// GET /api/vendors/ 
router.get('/', getAllVendors);

// GET /api/vendors/profile  (must be before /:id)
router.get('/profile', protect, restrictTo('vendor', 'seller', 'service_provider', 'event_company', 'company'), getMyProfile);

// PUT /api/vendors/profile
router.put('/profile', protect, restrictTo('vendor', 'seller', 'service_provider', 'event_company', 'company'), updateMyProfile);

// GET /api/vendors/dashboard & /api/vendors/stats
router.get('/dashboard', protect, restrictTo('vendor', 'seller', 'service_provider', 'event_company', 'company'), getDashboard);
router.get('/stats', protect, restrictTo('vendor', 'seller', 'service_provider', 'event_company', 'company'), getDashboard);
router.get('/dashboard-stats', protect, restrictTo('vendor', 'seller', 'service_provider', 'event_company', 'company'), getDashboard);

// GET /api/vendors/reports & /api/vendors/report
router.get('/reports', protect, restrictTo('vendor', 'seller', 'service_provider', 'event_company', 'company'), getReports);
router.get('/report', protect, restrictTo('vendor', 'seller', 'service_provider', 'event_company', 'company'), getReports);

// GET /api/vendors/reports/export/pdf
router.get('/reports/export/pdf', protect, restrictTo('vendor', 'seller', 'service_provider', 'event_company', 'company'), exportReportPDF);

// GET /api/vendors/reports/export/excel
router.get('/reports/export/excel', protect, restrictTo('vendor', 'seller', 'service_provider', 'event_company', 'company'), exportReportExcel);

// GET /api/vendors/my-services & /api/vendors/services
router.get('/my-services', protect, restrictTo('vendor', 'seller', 'service_provider', 'event_company', 'company'), getMyServices);
router.get('/services', protect, restrictTo('vendor', 'seller', 'service_provider', 'event_company', 'company'), getMyServices);
router.get('/services/:id', protect, restrictTo('vendor', 'seller', 'service_provider', 'event_company', 'company'), getServiceById);
router.post('/services', protect, restrictTo('vendor', 'seller', 'service_provider', 'event_company', 'company'), createService);
router.put('/services/:id', protect, restrictTo('vendor', 'seller', 'service_provider', 'event_company', 'company'), updateService);
router.delete('/services/:id', protect, restrictTo('vendor', 'seller', 'service_provider', 'event_company', 'company'), deleteService);

// GET /api/vendors/my-products
router.get('/my-products', protect, restrictTo('vendor', 'seller', 'service_provider', 'event_company', 'company'), getMyProducts);

// GET /api/vendors/payments
router.get('/payments', protect, restrictTo('vendor', 'seller', 'service_provider', 'event_company', 'company'), getVendorPayments);

// GET /api/vendors/123 
router.get('/:id', getVendorById);

module.exports = router;