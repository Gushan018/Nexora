const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth.middleware');
const { getAllVendors, getVendorById, getMyProfile, updateMyProfile, getDashboard, getReports, exportReportPDF, exportReportExcel, getMyServices, getMyProducts, getVendorPayments } = require('../controllers/vendor.controller');

// GET /api/vendors/ 
router.get('/', getAllVendors);

// GET /api/vendors/profile  (must be before /:id)
router.get('/profile', protect, restrictTo('vendor'), getMyProfile);

// PUT /api/vendors/profile
router.put('/profile', protect, restrictTo('vendor'), updateMyProfile);

// GET /api/vendors/dashboard
router.get('/dashboard', protect, restrictTo('vendor'), getDashboard);

// GET /api/vendors/reports
router.get('/reports', protect, restrictTo('vendor'), getReports);

// GET /api/vendors/reports/export/pdf
router.get('/reports/export/pdf', protect, restrictTo('vendor'), exportReportPDF);

// GET /api/vendors/reports/export/excel
router.get('/reports/export/excel', protect, restrictTo('vendor'), exportReportExcel);

// GET /api/vendors/my-services
router.get('/my-services', protect, restrictTo('vendor'), getMyServices);

// GET /api/vendors/my-products
router.get('/my-products', protect, restrictTo('vendor'), getMyProducts);

// GET /api/vendors/payments
router.get('/payments', protect, restrictTo('vendor'), getVendorPayments);

// GET /api/vendors/123 
router.get('/:id', getVendorById);

module.exports = router;