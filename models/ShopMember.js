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

const members = await ShopMember.find({ userId, status: 'active' }).populate('shopId');
const shops = members.map(m => ({ ...m.shopId.toObject(), userRole: m.role }));

module.exports = mongoose.model('ShopMember', shopMemberSchema);
