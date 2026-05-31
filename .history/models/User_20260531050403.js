const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  pin: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['OWNER', 'MANAGER'],
    default: 'OWNER'  // ← Par défaut propriétaire
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hasher le PIN avant de sauvegarder
userSchema.pre('save', async function() {
  if (!this.isModified('pin')) return;
  this.pin = await bcrypt.hash(this.pin, 10);
});

// Méthode pour comparer le PIN
userSchema.methods.comparePin = async function(candidatePin) {
  return await bcrypt.compare(candidatePin, this.pin);
};

module.exports = mongoose.model('User', userSchema);