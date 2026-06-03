const express = require('express');
const router = express.Router();
const {
  getBudget,
  updateTotalBudget,
  addCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/budget.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

// All budget routes are protected and for customers only
router.use(protect);
router.use(restrictTo('customer'));

router.get('/', getBudget);
router.put('/total', updateTotalBudget);
router.post('/categories', addCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

module.exports = router;
