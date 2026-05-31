const mongoose = require('mongoose');

const shopMemberSchema = new mongoose.Schema({
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
  role: {
    type: String,
    enum: ['OWNER', 'MANAGER'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'invited', 'rejected'],
    default: 'active'
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  invitedAt: {
    type: Date,
    default: null
  },
  invitedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
});

// Index pour éviter les doublons
shopMemberSchema.index({ shopId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('ShopMember', shopMemberSchema);