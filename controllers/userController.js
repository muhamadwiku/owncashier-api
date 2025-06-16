const User = require('../models/user');

// Create User
exports.createUser = async (req, res) => {
  try {
    const { pin, role, branchName } = req.body;
    if (!/^\d{4}$/.test(pin)) {
      return res.status(400).json({ error: "PIN harus 4 digit angka" });
    }
    if (role === 'branchClient' && !['Baron', 'Gentan'].includes(branchName)) {
      return res.status(400).json({ error: "Branch tidak valid" });
    }

    const newUser = await User.create({ pin, role, branchName });
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-pin');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update User
exports.updateUser = async (req, res) => {
  try {
    const { pin, branchName } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User tidak ditemukan" });

    if (pin) {
      if (!/^\d{4}$/.test(pin)) return res.status(400).json({ error: "PIN harus 4 digit" });
      user.pin = pin;
    }
    if (branchName && user.role === 'branchClient') user.branchName = branchName;

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// module.exports = { createUser, getAllUsers, updateUser, deleteUser };