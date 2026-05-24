const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  method: {
    type: String,
    enum: ['Wave', 'Orange Money', 'Free Money'],
    required: true
  },
  sender: {
    type: String,
    required: true
  },
  clientName: {
    type: String,
    default: 'Client'
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    default: 'income'
  },
  status: {
    type: String,
    enum: ['completed', 'pending', 'failed'],
    default: 'completed'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Transaction', transactionSchema);
