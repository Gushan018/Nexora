const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth.middleware');
const {
  getMyPackages,
  createPackage,
  getPackageById,
  updatePackage,
  deletePackage,
  getAllPublicPackages,
} = require('../controllers/package.controller');

// Public route - no auth required
router.get('/public', getAllPublicPackages);

// Vendor-only routes
router.use(protect, restrictTo('vendor'));

router.get('/', getMyPackages);
router.post('/', createPackage);
router.get('/:id', getPackageById);
router.put('/:id', updatePackage);
router.delete('/:id', deletePackage);

module.exports = router;
