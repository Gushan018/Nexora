const express = require('express');
const router = express.Router();
const { addProduct, getAllProducts, getProductById, updateProduct, deleteProduct, getMyProducts } = require('../controllers/product.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

// Public Routes 
router.get('/', getAllProducts);

// Seller & Vendor Routes (must be before /:id to avoid route capture)
router.get('/my-products', protect, restrictTo('seller', 'vendor'), getMyProducts);
router.get('/my/list', protect, restrictTo('seller', 'vendor'), getMyProducts);

router.get('/:id', getProductById);
router.post('/', protect, restrictTo('seller', 'vendor'), addProduct);
router.put('/:id', protect, restrictTo('seller', 'vendor'), updateProduct);
router.delete('/:id', protect, restrictTo('seller', 'vendor'), deleteProduct);

module.exports = router;