const express = require('express');
const router = express.Router();
const { getAllVendors, getVendorById } = require('../controllers/vendor.controller');

// GET /api/vendors/ 
router.get('/', getAllVendors);

// GET /api/vendors/123 
router.get('/:id', getVendorById);

module.exports = router;