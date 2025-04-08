const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  numberPlates: {
    type: String,
    required: true,
    // match: /^[A-Z0-9]{1,10}$/  //pembatasan maksimal 10 digit
  },
  packageName: {
    type: String,
    required: true
  }
}, { timestamps: true });

// // Tambahkan index
// transactionSchema.index({ numberPlates: 1 });
// transactionSchema.index({ email: 1 }, { 
//   partialFilterExpression: { email: { $exists: true } } 
// });

// Di model Transaction
transactionSchema.index({ numberPlates: 1 });
transactionSchema.index({ packageName: 1 });

module.exports = mongoose.model('Transaction', transactionSchema, "owncashier-transaction");