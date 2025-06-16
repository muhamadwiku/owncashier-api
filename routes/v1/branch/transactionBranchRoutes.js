// routes/v1/branch/transactionBranchRoutes.js
const express = require('express');
const router = express.Router();
const { listBranchTransactions } = require('../../../controllers/v1/branch/transactionBranchController');
// const authBranch = require('../../../middlewares/authBranch');

router.get('/', listBranchTransactions);

module.exports = router;