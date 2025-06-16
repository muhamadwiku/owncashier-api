const express = require('express');
// const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const customerRoutes = require('./routes/customerRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const allData = require('./routes/allDataRoutes');
const packageRoutes = require('./routes/packageRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

// V1 Routes
const userV1Routes = require('./routes/v1/userV1Routes');
const authV1Routes = require('./routes/v1/authRoutesV1');
const customerV1Routes = require('./routes/v1/customerV1Routes');
const productV1Routes = require('./routes/v1/productV1Routes');
const transactionV1Routes = require('./routes/v1/transactionV1Routes');
const dashboardV1Routes = require('./routes/v1/dashboardV1Routes');
const globalTransactionV1Routes = require('./routes/v1/globalTransactionV1');
const downloadRoutes = require('./routes/v1/downloadRoutes');
const dbStatisticsRoutes = require('./routes/v1/dbStatisticsRoutes');
// const listTransactionV1Routes = require('./routes/v1/listTransactionV1Routes');

// V1 Branch Routes
const brachTransactionV1Routes = require('./routes/v1/branch/transactionBranchRoutes');
const branchProductRoutes = require('./routes/v1/branch/productBranchRoutes');

const app = express();

const helmet = require('helmet'); // jika pakai https buat production
const { db } = require('./models/customer');
app.use(helmet()); // jika pakai https di productions

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.json({ limit: '10kb' })); // Batasi 10kb

require('dotenv').config(); // Pastikan sudah install dotenv

// Koneksi MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Terhubung ke MongoDB'))
  .catch(err => console.error('❌ Gagal konek ke MongoDB:', err));

mongoose.connection.on('error', err => {
  console.error('❌ Error MongoDB:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB terputus!');
});


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/transaction', transactionRoutes);
app.use('/api', allData);
app.use('/api/package', packageRoutes);

// Routes V!
app.use('/api/v1/user', userV1Routes);
app.use('/api/v1/auth', authV1Routes);
app.use('/api/v1/customer', customerV1Routes);
app.use('/api/v1/product', productV1Routes);
app.use('/api/v1/transaction', transactionV1Routes);
app.use('/api/v1/dashboard', dashboardV1Routes);
app.use('/api/v1/global-transaction', globalTransactionV1Routes);
app.use('/api/v1/download', downloadRoutes);
app.use('/api/v1/db', dbStatisticsRoutes);

// Routes V! branch

app.use('/api/v1/branch/transaction', brachTransactionV1Routes);
app.use('/api/v1/branch/products', branchProductRoutes);

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Terjadi kesalahan server!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
