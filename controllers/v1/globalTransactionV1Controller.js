const Transaction = require('../../models/v1/transactionV1');

const getGlobalTransaction = async (req, res) => {
  try {
    // Hitung awal dan akhir bulan ini
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    // Ambil transaksi bulan ini
    const transactions = await Transaction.find({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth }
    });

    // Total transaksi bulan ini (jumlah dokumen transaksi)
    const totalTransaction = transactions.length;

    // Total revenue bulan ini (jumlah seluruh total dari items di semua transaksi)
    let totalRevenue = 0;
    transactions.forEach(trx => {
      totalRevenue += trx.items.reduce((sum, item) => sum + (item.total || 0), 0);
    });

    // Dapatkan daftar branch unik dari transaksi bulan ini
    const branchNames = [...new Set(transactions.map(trx => trx.branchName).filter(Boolean))];

    // Hitung transaksi per branch bulan ini
    const branchReport = branchNames.map(branchName => ({
      branchName,
      branchTransaction: transactions.filter(trx => trx.branchName === branchName).length
    }));

    res.json({
      totalTransaction,
      totalRevenue,
      branchReport
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getGlobalTransaction };