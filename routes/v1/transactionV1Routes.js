const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const {
  listTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionSummary,
  listTransactionByDay,
 getDetailTransactionByBranch } = require('../../controllers/v1/transactionV1Controller');

router.use(authMiddleware);

router.get('/summary', getTransactionSummary);
router.get('/list', listTransactionByDay);
router.get('/branch', getDetailTransactionByBranch);
router.get('/', listTransactions);
router.get('/:id', getTransaction);
router.post('/', createTransaction);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

module.exports = router;