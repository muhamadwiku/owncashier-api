const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true },
  price: {
    type: Number,
    required: true
  }
}, { _id: false });

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true // produk aktif secara default
  },
  variants: [variantSchema]
}, { timestamps: true });

module.exports = mongoose.model('ProductV1', productSchema, 'owncashier-product-v1');