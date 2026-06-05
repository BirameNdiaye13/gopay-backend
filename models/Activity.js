const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    default: ''
  },
  userRole: {
    type: String,
    default: ''
  },
  action: {
    type: String,
    enum: [
      'payment_received',
      'expense_added',
      'expense_deleted',
      'manager_invited',
      'manager_removed',
      'shop_updated'
    ],
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  amount: {
    type: Number,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Activity', activitySchema);
