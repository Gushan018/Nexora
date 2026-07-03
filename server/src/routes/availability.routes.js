const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth.middleware');
const { getVendorAvailability, setAvailability, setBulkAvailability, deleteAvailability } = require('../controllers/availability.controller');

router.get('/:vendorId', getVendorAvailability);
router.post('/', protect, restrictTo('vendor'), setAvailability);
router.post('/bulk', protect, restrictTo('vendor'), setBulkAvailability);
router.delete('/:id', protect, restrictTo('vendor'), deleteAvailability);

module.exports = router;
