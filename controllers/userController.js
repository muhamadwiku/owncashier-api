const User = require('../models/user');

// Helper function untuk escape regex
const escapeRegex = (text) => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

// Create
exports.createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// // Read All
// exports.getAllUsers = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const users = await User?.find()
//       .skip((page - 1) * limit)
//       .limit(limit);

//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// Read All dengan Pencarian
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);

    // Membuat query pencarian
    let query = {};
    if (search) {
      const regex = new RegExp(escapeRegex(search), 'gi');
      query = {
        $or: [
          // { customerName: regex },
          // { email: regex },
          { numberPlates: regex },
          // Tambahkan field lain yang ingin dicari
        ]
      };
    }

    const users = await User.find(query)
      .skip((parsedPage - 1) * parsedLimit)
      .limit(parsedLimit);

    const total = await User.countDocuments(query);

    res.json({
      data: users,
      meta: {
        currentPage: parsedPage,
        totalPages: Math.ceil(total / parsedLimit),
        totalItems: total
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Read One
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};