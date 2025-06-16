const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: false
  },
  numberPlates: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: false,
    unique: true,
    match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
  },
  phoneNumber: {
    type: String,
    required: false,
    unique: true, // Memastikan tidak ada duplikasi nomor HP
    match: /^[\d\+\-\(\) ]{7,15}$/ // Validasi nomor HP dasar (angka, '+', '-', '()', dan spasi)
  }
}, { timestamps: true });

// Di model User
customerSchema.index({ numberPlates: 1 });

module.exports = mongoose.model('Customer', customerSchema, "owncashier-customer");