const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const { listTransactionByDay } = require('../../controllers/v1/listTransactionV1Controller');

router.use(authMiddleware);

router.get('/', listTransactionByDay);

module.exports = router;