const Transaction = require('../../models/v1/transactionV1');

const listTransactionByDay = async (req, res) => {
  try {
    // Hitung awal dan akhir bulan ini
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    // Ambil semua transaksi bulan ini
    const transactions = await Transaction.find({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth }
    });

    // Kelompokkan transaksi per hari
    const grouped = {};
    transactions.forEach(trx => {
      const date = trx.createdAt.toISOString().slice(0, 10); // yyyy-mm-dd
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(trx);
    });

    // Buat array hasil
    const result = Object.entries(grouped).map(([date, trxList]) => {
      // Total revenue hari itu
      const transactionRevenue = trxList.reduce(
        (sum, trx) => sum + trx.items.reduce((s, item) => s + (item.total || 0), 0),
        0
      );

      // Branch report hari itu
      const branchMap = {};
      trxList.forEach(trx => {
        if (!trx.branchName) return;
        if (!branchMap[trx.branchName]) branchMap[trx.branchName] = 0;
        branchMap[trx.branchName] += trx.items.reduce((s, item) => s + (item.total || 0), 0);
      });
      const branchReport = Object.entries(branchMap).map(([branchName, branchRevenue]) => ({
        branchName,
        branchRevenue
      }));

      return {
        transactionDate: date,
        transactionRevenue,
        branchReport
      };
    });

    // Urutkan berdasarkan tanggal naik
    result.sort((a, b) => new Date(a.transactionDate) - new Date(b.transactionDate));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { listTransactionByDay };