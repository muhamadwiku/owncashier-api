const Customer = require('../../models/v1/customerV1');

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

// List semua customer
const listCustomers = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      const regex = new RegExp(escapeRegex(search), 'i');
      query = {
        $or: [
          // { customerName: regex },
          // { email: regex },
          // { phoneNumber: regex },
          { numberPlate: regex }
        ]
      };
    }

    const customers = await Customer.find(query).sort({ createdAt: -1 });
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get detail 1 customer
const getCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id);
    if (!customer) return res.status(404).json({ error: "Customer tidak ditemukan" });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Tambah customer baru
const createCustomer = async (req, res) => {
  try {
    const { customerName, numberPlate, email, phoneNumber } = req.body;
    if (!numberPlate) {
      return res.status(400).json({ error: "Plat Nomor wajib diisi" });
    }

   // Hanya tambahkan field jika ada nilainya
    const data = { customerName, numberPlate };
    if (email) data.email = email;
    if (phoneNumber) data.phoneNumber = phoneNumber;
    

    const customer = new Customer({ customerName, numberPlate, email, phoneNumber });
    await customer.save();
    res.status(201).json({ message: "Customer berhasil dibuat", customerId: customer._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update customer
const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    let { customerName, numberPlate, email, phoneNumber } = req.body;
    const updateData = { customerName, numberPlate };

    if (email) updateData.email = email;
    else if (email === "") updateData.$unset = { ...updateData.$unset, email: "" };

    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    else if (phoneNumber === "") updateData.$unset = { ...updateData.$unset, phoneNumber: "" };

    const customer = await Customer.findByIdAndUpdate(id, updateData, { new: true });
    if (!customer) return res.status(404).json({ error: "Customer tidak ditemukan" });
    res.json({ message: "Customer berhasil diupdate" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Hapus customer
const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findByIdAndDelete(id);
    if (!customer) return res.status(404).json({ error: "Customer tidak ditemukan" });
    res.json({ message: "Customer berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { listCustomers, getCustomer, createCustomer, updateCustomer, deleteCustomer };