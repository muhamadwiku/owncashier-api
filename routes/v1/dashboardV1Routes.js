const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const { getDashboard } = require('../../controllers/v1/dashboardV1Controller');

router.use(authMiddleware);

router.get('/', getDashboard);

module.exports = router;