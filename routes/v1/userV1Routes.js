const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const { listUsers, createUser, updateUser, deleteUser, getUser, resetPin } = require('../../controllers/v1/userV1Controller');

router.use(authMiddleware); // Semua route di bawah ini butuh token

router.get('/', listUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.get('/:id', getUser);
router.put('/:id/reset-pin', resetPin);

module.exports = router;