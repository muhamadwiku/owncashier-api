const Product = require('../../../models/v1/productV1');

const listActiveProducts = async (req, res) => {
  try {
    // Ambil semua produk yang isActive !== false (true atau undefined)
    const products = await Product.find({ isActive: { $ne: false } });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  listActiveProducts
};