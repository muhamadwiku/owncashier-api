const express = require('express');
const router = express.Router();
const { listActiveProducts } = require('../../../controllers/v1/branch/productBranchController');

router.get('/', listActiveProducts);

module.exports = router;