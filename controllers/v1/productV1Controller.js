const Product = require('../../models/v1/productV1');

// List semua product
const listProducts = async (req, res) => {
  try {
    const products = await Product.find();

    // Hitung total produk
    const totalProducts = products.length;

    // Hitung total semua varian dari seluruh produk
    const totalVariants = products.reduce((sum, product) => sum + (product.variants?.length || 0), 0);

    res.json({
      totalProducts,
      totalVariants,
      products
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get detail 1 product
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: "Product tidak ditemukan" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Tambah product baru
const createProduct = async (req, res) => {
  try {
    const { productName, variants, isActive } = req.body;
    if (!productName || !Array.isArray(variants)) {
      return res.status(400).json({ error: "productName dan variants wajib diisi" });
    }
    const product = new Product({ productName, variants, isActive });
    await product.save();
    res.status(201).json({ message: "Product berhasil dibuat", productId: product._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { productName, variants, isActive } = req.body;
    const updateData = { productName, variants };
    if (typeof isActive !== 'undefined') updateData.isActive = isActive;
    const product = await Product.findByIdAndUpdate(id, updateData, { new: true });
    if (!product) return res.status(404).json({ error: "Product tidak ditemukan" });
    res.json({ message: "Product berhasil diupdate" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Hapus product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) return res.status(404).json({ error: "Product tidak ditemukan" });
    res.json({ message: "Product berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { listProducts, getProduct, createProduct, updateProduct, deleteProduct };