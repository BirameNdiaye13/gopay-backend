const mongoose = require('mongoose');

const shopMemberSchema = new mongoose.Schema({
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['OWNER', 'MANAGER'], default: 'MANAGER' },
  status: { type: String, enum: ['active', 'invited', 'rejected'], default: 'active' },
  joinedAt: { type: Date, default: Date.now },
  invitedAt: { type: Date },
  invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });


module.exports = mongoose.model('ShopMember', shopMemberSchema);
