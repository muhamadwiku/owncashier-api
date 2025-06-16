const Customer = require('../models/customer');

// Helper function untuk escape regex
const escapeRegex = (text) => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

// Create
exports.createCustomer = async (req, res) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).json(customer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// // Read All
// exports.getAllCustomers = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const customers = await Customer?.find()
//       .skip((page - 1) * limit)
//       .limit(limit);

//     res.json(customers);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// Read All dengan Pencarian
exports.getAllCustomer = async (req, res) => {
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

    const customers = await Customer.find(query)
      .skip((parsedPage - 1) * parsedLimit)
      .limit(parsedLimit);

    const total = await Customer.countDocuments(query);

    res.json({
      data: customers,
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
exports.getCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update
exports.updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete
exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json({ message: 'Customer deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};