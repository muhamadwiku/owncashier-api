const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  price: {
    type: Number,
    required: false },
  productName: {
    type: String,
    required: false },
  quantity: {
    type: Number,
    required: false },
  total: {
    type: Number,
    required: false },
  variantName: {
    type: String,
    required: false }
}, { _id: false });

const transactionSchema = new mongoose.Schema({
  numberPlate: {
    type: String,
    required: false
  },
  branchName: {
    type: String,
    required: false // Tambahkan field branchName
  },
  items: [itemSchema]
}, { timestamps: true });

module.exports = mongoose.model('TransactionV1', transactionSchema, 'owncashier-transaction-v1');