const express = require('express');
const router = express.Router();
const { addProduct, getAllProducts, getProductById } = require('../controllers/product.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

// Public Routes 
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Seller Only Route 
router.post('/', protect, restrictTo('seller', 'vendor'), addProduct);

module.exports = router;