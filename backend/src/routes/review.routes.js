const express = require('express');
const router = express.Router();
const { submitReview, getMyReviews, getSellerReviews, replyToReview, deleteReviewReply, reportReview, unreportReview } = require('../controllers/review.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

router.post('/', protect, restrictTo('customer'), submitReview);
router.get('/my', protect, restrictTo('customer'), getMyReviews);
router.get('/seller', protect, restrictTo('seller', 'vendor'), getSellerReviews);
router.put('/:id/reply', protect, restrictTo('seller', 'vendor'), replyToReview);
router.delete('/:id/reply', protect, restrictTo('seller', 'vendor'), deleteReviewReply);
router.put('/:id/report', protect, restrictTo('seller', 'vendor'), reportReview);
router.put('/:id/unreport', protect, restrictTo('seller', 'vendor'), unreportReview);

module.exports = router;
