const express = require('express');
const router = express.Router();
const {
  requestRefund,
  getMyRefundRequests,
  getSellerRefundRequests,
  updateRefundStatus
} = require('../controllers/refund.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

router.post('/', protect, restrictTo('customer'), requestRefund);
router.get('/my', protect, restrictTo('customer'), getMyRefundRequests);
router.get('/seller', protect, restrictTo('seller', 'vendor'), getSellerRefundRequests);
router.put('/:id/status', protect, restrictTo('seller', 'vendor'), updateRefundStatus);

module.exports = router;
