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
  },
  fingerprint: {
    type: String,
    default: null
  }
});

// Index unique partiel : empêche deux paiements identiques (même empreinte)
// dans une même boutique. Ne s'applique que si fingerprint existe (string),
// donc les transactions manuelles (sans empreinte) ne sont pas affectées.
transactionSchema.index(
  { shopId: 1, fingerprint: 1 },
  {
    unique: true,
    partialFilterExpression: { fingerprint: { $type: 'string' } }
  }
);

module.exports = mongoose.model('Transaction', transactionSchema);
