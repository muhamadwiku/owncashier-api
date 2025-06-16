const Transaction = require('../../../models/v1/transactionV1');

const listBranchTransactions = async (req, res) => {
  try {
    // Ambil branchName dari query param (opsional)
    const { branchName } = req.query;

     // Filter transaksi bulan ini
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const filter = {
      ...(branchName ? { branchName } : {}),
      createdAt: { $gte: startOfMonth, $lte: endOfMonth }
    };
    
     // Urutkan terbaru ke atas
    const transactions = await Transaction.find(filter).sort({ createdAt: -1 });

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  listBranchTransactions
};