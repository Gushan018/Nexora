const express = require('express');
const router = express.Router();
const { submitReview, getMyReviews, getSellerReviews, replyToReview, deleteReviewReply, reportReview, unreportReview, getPublicReviews } = require('../controllers/review.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

router.get('/public', getPublicReviews);
router.post('/', protect, submitReview);
router.get('/my', protect, getMyReviews);
router.get('/seller', protect, getSellerReviews);
router.get('/vendor', protect, getSellerReviews);

router.post('/:id/reply', protect, replyToReview);
router.put('/:id/reply', protect, replyToReview);
router.delete('/:id/reply', protect, deleteReviewReply);
router.put('/:id/report', protect, reportReview);
router.put('/:id/unreport', protect, unreportReview);

module.exports = router;
