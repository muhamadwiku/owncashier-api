const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  pin: {
    type: String,
    required: true,
    length: 4
  },
  role: {
    type: String,
    enum: ['owner', 'branch'],
    required: true
  },
  name: {
    type: String,
    enum: ['Baron', 'Gentan', null],
    default: null
  },
  lastLogin: Date
}, { timestamps: true });

// Hash PIN sebelum simpan
userSchema.pre('save', async function(next) {
  if (!this.isModified('pin')) return next();
  this.pin = await bcrypt.hash(this.pin, 10);
  next();
});

// Method verifikasi PIN
userSchema.methods.verifyPin = async function(pin) {
  return await bcrypt.compare(pin, this.pin);
};

module.exports = mongoose.model('User', userSchema,  "owncashier-user");