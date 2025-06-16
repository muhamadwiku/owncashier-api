const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const { getGlobalTransaction } = require('../../controllers/v1/globalTransactionV1Controller');

router.use(authMiddleware);

router.get('/', getGlobalTransaction);

module.exports = router;