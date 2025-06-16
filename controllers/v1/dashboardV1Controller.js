const Transaction = require('../../models/v1/transactionV1');
const Product = require('../../models/v1/productV1');
const Customer = require('../../models/v1/customerV1');
const User = require('../../models/v1/userV1');

const getDashboard = async (req, res) => {
  try {
    // Total variant terjual (jumlah semua item di semua transaksi)
    const transactions = await Transaction.find();
    let totalTransaction = 0;
    let totalRevenue = 0;
    transactions.forEach(trx => {
      totalTransaction += trx.items.reduce((sum, item) => sum + item.quantity, 0);
      totalRevenue += trx.items.reduce((sum, item) => sum + item.total, 0);
    });

    // Total semua variant di product
    const products = await Product.find();
    let totalProduct = 0;
    products.forEach(prod => {
      totalProduct += Array.isArray(prod.variants) ? prod.variants.length : 0;
    });

    // Total customer
    const totalCustomer = await Customer.countDocuments();

    // Dapatkan daftar branch unik dari transaksi
    const branchNames = [...new Set(transactions.map(trx => trx.branchName).filter(Boolean))];

    // Hitung total transaksi per branch
    const branchReport = branchNames.map(branchName => ({
      branchName,
      totalTransaction: transactions.filter(trx => trx.branchName === branchName).length
    }));

    res.json({
      totalTransaction,
      totalRevenue,
      totalProduct,
      totalCustomer,
      branchReport
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getDashboard };