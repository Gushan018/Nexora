const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth.middleware');
const { getVendorReviews, getServiceReviews, getProductReviews, createReview, deleteReview } = require('../controllers/reviews.controller');

router.get('/vendor/:id', getVendorReviews);
router.get('/service/:id', getServiceReviews);
router.get('/product/:id', getProductReviews);
router.post('/', protect, restrictTo('customer'), createReview);
router.delete('/:id', protect, restrictTo('customer'), deleteReview);

module.exports = router;
