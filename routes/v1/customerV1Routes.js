const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const { listCustomers, getCustomer, createCustomer, updateCustomer, deleteCustomer } = require('../../controllers/v1/customerV1Controller');

router.use(authMiddleware);

router.get('/', listCustomers);
router.get('/:id', getCustomer);
router.post('/', createCustomer);
router.put('/:id', updateCustomer);
router.delete('/:id', deleteCustomer);

module.exports = router;