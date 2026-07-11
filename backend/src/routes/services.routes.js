const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth.middleware');
const { getAllServices, getServiceById, createService, updateService, deleteService } = require('../controllers/services.controller');

router.get('/', getAllServices);
router.get('/:id', getServiceById);
router.post('/', protect, restrictTo('vendor', 'service_provider', 'event_company'), createService);
router.put('/:id', protect, restrictTo('vendor', 'service_provider', 'event_company'), updateService);
router.delete('/:id', protect, restrictTo('vendor', 'service_provider', 'event_company'), deleteService);

module.exports = router;
