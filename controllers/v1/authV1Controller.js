const UserV1 = require('../../models/v1/userV1');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  try {
    const { name, pin } = req.body;
    if (!/^\d{4}$/.test(pin)) {
      return res.status(400).json({ error: "PIN harus 4 digit angka" });
    }

    const user = await UserV1.findOne({name});
    if (!user || !(await user.verifyPin(pin))) {
      return res.status(401).json({ error: "PIN salah" });
    }

    user.lastLogin = Date.now();
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      role: user.role,
      name: user.name,
      token
    });
  } catch (err) {
    res.status(500).json({ error: err.message, message: err.message });
  }
};

module.exports = { login };