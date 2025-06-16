const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: false
  },
  numberPlate: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: false,
    match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
  },
  phoneNumber: {
    type: String,
    required: false,
    match: /^[\d\+\-\(\) ]{7,15}$/ // Validasi nomor HP dasar (angka, '+', '-', '()', dan spasi)
  }
}, { timestamps: true });

module.exports = mongoose.model('CustomerV1', customerSchema, 'owncashier-customer-v1');