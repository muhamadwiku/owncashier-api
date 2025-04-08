// routes/combinedRoutes.js
const express = require('express');
const router = express.Router();
const { getAllData } = require('../controllers/allDataController');

router.get('/', getAllData);

module.exports = router;