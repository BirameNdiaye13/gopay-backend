const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Shop = require('../models/Shop');
const ShopMember = require('../models/ShopMember');
const authenticate = require('../middleware/authenticate');

// ✅ INVITER UN GÉRANT
router.post('/:shopId/invite', authenticate, async (req, res) => {
  try {
    const { shopId } = req.params;
    const { managerPhone } = req.body;
    const userId = req.user.id;

    // Vérifier que la boutique existe
    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({ success: false, message: 'Boutique non trouvée' });
    }

    // Vérifier que l'utilisateur est propriétaire
    const member = await ShopMember.findOne({ shopId, userId });
    if (!member || member.role !== 'OWNER') {
      return res.status(403).json({ success: false, message: 'Seul le propriétaire peut inviter' });
    }

    // Chercher l'utilisateur par téléphone
    const managerUser = await User.findOne({ phone: managerPhone });
    if (!managerUser) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    }

    // Vérifier si déjà membre
    const existingMember = await ShopMember.findOne({ shopId, userId: managerUser._id });
    if (existingMember) {
      return res.status(400).json({ success: false, message: 'Cet utilisateur est déjà membre' });
    }

    // Créer l'invitation
    const newMember = new ShopMember({
      shopId,
      userId: managerUser._id,
      role: 'MANAGER',
      status: 'invited',
      invitedAt: new Date(),
      invitedBy: userId
    });

    await newMember.save();

    res.json({
      success: true,
      message: 'Invitation envoyée !',
      data: { member: newMember }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ LISTER LES MEMBRES D'UNE BOUTIQUE
router.get('/:shopId/members', authenticate, async (req, res) => {
  try {
    const { shopId } = req.params;

    const members = await ShopMember.find({ shopId })
      .populate('userId', 'phone name role')
      .populate('invitedBy', 'phone name');

    res.json({
      success: true,
      data: { members }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ VOIR LES INVITATIONS EN ATTENTE
router.get('/invitations/pending', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    const invitations = await ShopMember.find({ userId, status: 'invited' })
      .populate('shopId', 'name icon')
      .populate('invitedBy', 'phone name');

    res.json({
      success: true,
      data: { invitations }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ ACCEPTER UNE INVITATION
router.post('/invitations/:memberId/accept', authenticate, async (req, res) => {
  try {
    const { memberId } = req.params;
    const userId = req.user.id;

    const member = await ShopMember.findById(memberId);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Invitation non trouvée' });
    }

    // Vérifier que c'est bien pour ce user
    if (member.userId.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Non autorisé' });
    }

    // Accepter l'invitation
    member.status = 'active';
    member.joinedAt = new Date();
    await member.save();

    res.json({
      success: true,
      message: 'Invitation acceptée !',
      data: { member }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ REJETER UNE INVITATION
router.post('/invitations/:memberId/reject', authenticate, async (req, res) => {
  try {
    const { memberId } = req.params;
    const userId = req.user.id;

    const member = await ShopMember.findById(memberId);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Invitation non trouvée' });
    }

    // Vérifier que c'est bien pour ce user
    if (member.userId.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Non autorisé' });
    }

    // Rejeter l'invitation
    member.status = 'rejected';
    await member.save();

    res.json({
      success: true,
      message: 'Invitation rejetée'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ LISTER LES BOUTIQUES DE L'UTILISATEUR (OWNER + MANAGER)
router.get('/user/shops', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    // Trouver toutes les boutiques où l'utilisateur est membre (actif)
    const members = await ShopMember.find({ userId, status: 'active' })
      .populate('shopId');

    const shops = members.map(m => ({
      ...m.shopId.toObject(),
      userRole: m.role
    }));

    res.json({
      success: true,
      data: { shops }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;