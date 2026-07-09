const express = require('express');
const router = express.Router();
const { getAllCategories } = require('../controllers/category.controller');

// GET /api/categories
router.get('/', getAllCategories);

module.exports = router;