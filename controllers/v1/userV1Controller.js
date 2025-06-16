const UserV1 = require('../../models/v1/userV1');

// List semua user
const listUsers = async (req, res) => {
  try {
    const users = await UserV1.find({}, '-pin'); // Jangan tampilkan PIN
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get detail 1 user
const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserV1.findById(id, '-pin');
    if (!user) return res.status(404).json({ error: "User tidak ditemukan" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Tambah user baru
const createUser = async (req, res) => {
  try {
    const { name, pin, role, unit } = req.body;
    if (!name || !pin || !role) {
      return res.status(400).json({ error: "Data tidak lengkap" });
    }
    if (!/^\d{4}$/.test(pin)) {
      return res.status(400).json({ error: "PIN harus 4 digit angka" });
    }
    const user = new UserV1({ name, pin, role, unit });
    await user.save();
    res.status(201).json({ message: "User berhasil dibuat", userId: user._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, pin, role, unit } = req.body;
    const user = await UserV1.findById(id);
    if (!user) return res.status(404).json({ error: "User tidak ditemukan" });

    if (name) user.name = name;
    if (role) user.role = role;
    if (unit) user.unit = unit;
    if (pin) {
      if (!/^\d{4}$/.test(pin)) {
        return res.status(400).json({ error: "PIN harus 4 digit angka" });
      }
      user.pin = pin; // tanpa hash manual
    }
    await user.save(); // pre-save hook akan hash jika pin berubah
    res.json({ message: "User berhasil diupdate" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Hapus user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserV1.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ error: "User tidak ditemukan" });
    res.json({ message: "User berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


//Reset PIN user
const resetPin = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPin } = req.body;
    if (!/^\d{4}$/.test(newPin)) {
      return res.status(400).json({ error: "PIN harus 4 digit angka" });
    }
    const user = await UserV1.findById(id);
    if (!user) return res.status(404).json({ error: "User tidak ditemukan" });
    user.pin = newPin; // tanpa hash manual
    await user.save(); // pre-save hook akan hash
    res.json({ message: "PIN berhasil direset" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { listUsers, createUser, updateUser, deleteUser, getUser, resetPin };