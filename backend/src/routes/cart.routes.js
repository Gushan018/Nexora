const express = require('express');
const router = express.Router();
const { addItemToCart, getMyCart, removeItemFromCart } = require('../controllers/cart.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');


router.use(protect, restrictTo('customer'));

// GET /api/cart 
router.get('/', getMyCart);

// POST /api/cart/add 
router.post('/add', addItemToCart);

// DELETE /api/cart/item/123 
router.delete('/item/:cartItemId', removeItemFromCart);

module.exports = router;