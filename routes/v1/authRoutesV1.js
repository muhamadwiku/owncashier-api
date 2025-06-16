const express = require('express');
const router = express.Router();
const { login } = require('../../controllers/v1/authV1Controller');

router.post('/', login);
module.exports = router;