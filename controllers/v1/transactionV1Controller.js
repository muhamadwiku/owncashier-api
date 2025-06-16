const Transaction = require('../../models/v1/transactionV1');
const Product = require('../../models/v1/productV1');

// List semua transaksi
const listTransactions = async (req, res) => {
  try {
    // Hitung per bulan
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    // Filter transaksi 1 bulan terakhir
    const filter = {
      createdAt: { $gte: startOfMonth, $lte: endOfMonth }
    };

    const transactions = await Transaction.find(filter);
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Rangkuman transaksi per hari
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
    result.sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get trasaction summary
const getTransactionSummary = async (req, res) => {
  try {

    // Hitung per bulan
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);


    // Filter transaksi 1 bulan terakhir
    const filter = {
      createdAt: { $gte: startOfMonth, $lte: endOfMonth }
    };

    const transactions = await Transaction.find(filter);

    // Total quantity terjual di seluruh branch
    const totalTransaction = transactions.reduce((sum, trx) => {
      if (Array.isArray(trx.items)) {
        return sum + trx.items.reduce((s, item) => s + (item.quantity || 0), 0);
      }
      return sum;
    }, 0);

    // Total revenue (jumlah semua total item di semua transaksi)
    const totalRevenue = transactions.reduce((sum, trx) => {
      if (Array.isArray(trx.items)) {
        return sum + trx.items.reduce((s, item) => s + (item.total || 0), 0);
      }
      return sum;
    }, 0);

    // Rangkuman per cabang: jumlah quantity di semua items pada branch tersebut
    const branchMap = {};
    transactions.forEach(trx => {
      const branch = trx.branchName || 'Unknown';
      if (!branchMap[branch]) branchMap[branch] = [];
      branchMap[branch].push(...(trx.items || []));
    });

    const branchReport = Object.entries(branchMap).map(([branchName, itemsArr]) => ({
      branchName,
      transaction: itemsArr.reduce((sum, item) => sum + (item.quantity || 0), 0) // jumlah quantity per branch
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

// Get detail 1 transaksi
const getTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findById(id);
    if (!transaction) return res.status(404).json({ error: "Transaksi tidak ditemukan" });
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Tambah transaksi baru
const createTransaction = async (req, res) => {
  try {
    const { numberPlate, branchName, items } = req.body;
    if (!numberPlate || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "numberPlate dan items wajib diisi" });
    }
    const transaction = new Transaction({ numberPlate, branchName, items });
    await transaction.save();
    res.status(201).json({ message: "Transaksi berhasil dibuat", transactionId: transaction._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update transaksi
const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { numberPlate, branchName, items } = req.body;
    const updateData = { numberPlate, branchName, items };
    const transaction = await Transaction.findByIdAndUpdate(id, updateData, { new: true });
    if (!transaction) return res.status(404).json({ error: "Transaksi tidak ditemukan" });
    res.json({ message: "Transaksi berhasil diupdate" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Hapus transaksi
const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findByIdAndDelete(id);
    if (!transaction) return res.status(404).json({ error: "Transaksi tidak ditemukan" });
    res.json({ message: "Transaksi berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


//Get detail transaksi berdasarkan branch
const getDetailTransactionByBranch = async (req, res) => {
  try {

    // Hitung per bulan
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    // Filter transaksi 1 bulan terakhir
    const filter = {
      createdAt: { $gte: startOfMonth, $lte: endOfMonth }
    };

    // parameter branch mana yang di inginkan
    const { branchName } = req.query;
    if (branchName) filter.branchName = branchName;

    // Ambil semua produk dan transaksi (filtered)
    const products = await Product.find();
    const transactions = await Transaction.find(filter);

    // Flatten semua items dari transaksi yang sudah difilter
    const allItems = transactions.flatMap(trx => trx.items || []);

    // Hitung total quantity dan revenue (dari transaksi yang sudah difilter)
    const totalTransaction = allItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const totalRevenue = allItems.reduce((sum, item) => sum + (item.total || 0), 0);

    // Hitung per produk
    const productsSummary = products.map(product => {
      // Cari semua item yang productName-nya mengandung nama produk (pakai regex agar fleksibel)
      const regex = new RegExp(product.productName, 'i');
      // Untuk owner: allItems sudah semua transaksi
      // Untuk branch: allItems sudah terfilter per branch
      const relatedItems = allItems.filter(item => regex.test(item.productName));
      const revenue = relatedItems.reduce((sum, item) => sum + (item.total || 0), 0);
      const soldCount = relatedItems.reduce((sum, item) => sum + (item.quantity || 0), 0);

      return {
        productName: product.productName,
        revenue,
        soldCount
      };
    });

    res.json({
      totalTransaction,
      totalRevenue,
      products: productsSummary
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  listTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionSummary,
  listTransactionByDay,
  getDetailTransactionByBranch
};