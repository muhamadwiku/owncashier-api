const express = require('express');
const router = express.Router();
const {
  createPackage,
  getAllPackages,
  getPackage,
  updatePackage,
  deletePackage
} = require('../controllers/packageController');

router.post('/', createPackage);
router.get('/', getAllPackages);
router.get('/:id', getPackage);
router.put('/:id', updatePackage);
router.delete('/:id', deletePackage);

module.exports = router;