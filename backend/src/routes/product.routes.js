const express = require('express');
const router = express.Router();
const { 
  addProduct, 
  getAllProducts, 
  getProductById, 
  getSellerProducts, 
  updateProduct, 
  deleteProduct 
} = require('../controllers/product.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

// Seller/Vendor Only Routes 
router.get('/my-products', protect, restrictTo('seller', 'vendor'), getSellerProducts);
router.post('/', protect, restrictTo('seller', 'vendor'), addProduct);
router.put('/:id', protect, restrictTo('seller', 'vendor'), updateProduct);
router.delete('/:id', protect, restrictTo('seller', 'vendor'), deleteProduct);

// Public Routes 
router.get('/', getAllProducts);
router.get('/:id', getProductById);

module.exports = router;