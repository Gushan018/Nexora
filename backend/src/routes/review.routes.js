const express = require('express');
const router = express.Router();
const { submitReview, getMyReviews } = require('../controllers/review.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

router.post('/', protect, restrictTo('customer'), submitReview);
router.get('/my', protect, restrictTo('customer'), getMyReviews);

module.exports = router;
