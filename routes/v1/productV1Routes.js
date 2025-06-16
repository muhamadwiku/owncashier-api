const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const { listProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../../controllers/v1/productV1Controller');

router.use(authMiddleware);

router.get('/', listProducts);
router.get('/:id', getProduct);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;