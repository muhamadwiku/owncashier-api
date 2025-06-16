const User = require('../models/user');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  try {
    const { pin } = req.body;
    if (!/^\d{4}$/.test(pin)) {
      return res.status(400).json({ error: "PIN harus 4 digit angka" });
    }

    const user = await User.findOne({});
    if (!user || !(await user.verifyPin(pin))) {
      return res.status(401).json({ error: "PIN salah" });
    }

    user.lastLogin = Date.now();
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role, branch: user.branchName },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ 
      role: user.role,
      branchName: user.branchName,
      token 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { login };