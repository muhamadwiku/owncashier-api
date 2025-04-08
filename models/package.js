const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  packageName: {
    type: String,
    required: false
  },
  price: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false,
  }
}, { timestamps: true });

packageSchema.index({ packageName: 1 });


module.exports = mongoose.model('Package', packageSchema, "owncashier-package");