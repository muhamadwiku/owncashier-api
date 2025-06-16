const express = require('express');
const router = express.Router();
const { 
  createUser, 
  getAllUsers, 
  updateUser, 
  deleteUser 
} = require('../controllers/userController');
const protect = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/checkRole');

router.post('/', protect, checkRole('owner'), createUser);
router.get('/', protect, checkRole('owner'), getAllUsers);
router.patch('/:id', protect, checkRole('owner'), updateUser);
router.delete('/:id', protect, checkRole('owner'), deleteUser);

module.exports = router;