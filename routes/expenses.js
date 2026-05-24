const express = require('express');
const router = express.Router();
const {
  getExpenses,
  createExpense,
  deleteExpense
} = require('../controllers/expenseController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/', createExpense);
router.get('/:shopId', getExpenses);
router.delete('/:id', deleteExpense);

module.exports = router;
