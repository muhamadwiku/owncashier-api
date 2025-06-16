const express = require('express');
const router = express.Router();
const {
  createCustomer,
  getAllCustomer,
  getCustomer,
  updateCustomer,
  deleteCustomer
} = require('../controllers/customerController');

router.post('/', createCustomer);
router.get('/', getAllCustomer);
router.get('/:id', getCustomer);
router.put('/:id', updateCustomer);
router.delete('/:id', deleteCustomer);

module.exports = router;