const express = require('express');
const { getWishlist, addToWishlist, removeFromWishlist } = require('../controllers/wishlist.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect, restrictTo('customer'));

router.get('/my', getWishlist);
router.post('/add', addToWishlist);
router.delete('/:id', removeFromWishlist);

module.exports = router;
