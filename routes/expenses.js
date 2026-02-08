const express = require('express');
const auth = require('../middleware/auth');
const {
  createExpense,
  getGroupExpenses,
  updateExpense,
  deleteExpense,
  calculateBalances
} = require('../controllers/expenseController');

const router = express.Router();

// All routes require authentication
router.use(auth);

// Create expense
router.post('/', createExpense);

// Get group expenses
router.get('/group/:groupId', getGroupExpenses);

// Calculate group balances
router.get('/group/:groupId/balances', calculateBalances);

// Update expense
router.put('/:expenseId', updateExpense);

// Delete expense
router.delete('/:expenseId', deleteExpense);

module.exports = router;
