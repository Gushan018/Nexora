const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getVendorBookings,      
  updateBookingStatus,
  getBookingById,
} = require('../controllers/booking.controller');

const { protect, restrictTo } = require('../middleware/auth.middleware');

// ====== Customer Routes ======
router.post('/', protect, restrictTo('customer'), createBooking);
router.get('/my', protect, restrictTo('customer'), getMyBookings);

// ====== Vendor Routes  ======
router.get('/vendor', protect, restrictTo('vendor'), getVendorBookings);
router.get('/:id', protect, getBookingById);
router.put('/:id/status', protect, restrictTo('vendor'), updateBookingStatus);

module.exports = router;