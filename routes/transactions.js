const express = require('express');
const router = express.Router();
const {
  getTransactions,
  createTransaction,
  getStats
} = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/', createTransaction);
router.get('/:shopId', getTransactions);
router.get('/:shopId/stats', getStats);

module.exports = router;
