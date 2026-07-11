const express = require('express');
const router = express.Router();
const {
  getBudgetSummary,
  setTotalBudget,
  addBudgetItem,
  updateBudgetItem,
  deleteBudgetItem,
  syncBudgetFromBookingsAndOrders
} = require('../controllers/budget.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

router.use(protect, restrictTo('customer'));

router.get('/', getBudgetSummary);
router.post('/total', setTotalBudget);
router.put('/total', setTotalBudget);

// Item / Category routes
router.post('/items', addBudgetItem);
router.post('/categories', addBudgetItem);

router.put('/items/:id', updateBudgetItem);
router.put('/categories/:id', updateBudgetItem);

router.delete('/items/:id', deleteBudgetItem);
router.delete('/categories/:id', deleteBudgetItem);

router.post('/sync', syncBudgetFromBookingsAndOrders);

module.exports = router;
