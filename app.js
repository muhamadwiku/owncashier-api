const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const allData = require('./routes/allDataRoutes');
const packageRoutes = require('./routes/packageRoutes');

const app = express();

const helmet = require('helmet'); // jika pakai https buat production
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
app.use('/api/users', userRoutes);
app.use('/api/transaction', transactionRoutes);
app.use('/api', allData);
app.use('/api/package', packageRoutes);


// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Terjadi kesalahan server!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
