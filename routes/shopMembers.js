const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Shop = require('../models/Shop');
const ShopMember = require('../models/ShopMember');
const { protect } = require('../middleware/auth');  // ← CORRECTION : protect au lieu de authenticate
const { isOwner } = require('../middleware/isOwner');
const logActivity = require('../utils/logActivity');

// ✅ LISTER LES MEMBRES D'UNE BOUTIQUE
router.get('/:shopId/members', protect, async (req, res) => {
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

// ✅ RETIRER UN GÉRANT (réservé au propriétaire)
router.delete('/:shopId/members/:memberId', protect, isOwner, async (req, res) => {
  try {
    const { shopId, memberId } = req.params;

    const member = await ShopMember.findById(memberId).populate('userId', 'name phone');
    if (!member) {
      return res.status(404).json({ success: false, message: 'Membre non trouvé' });
    }

    // Sécurité : on ne peut pas retirer un propriétaire
    if (member.role === 'OWNER') {
      return res.status(400).json({ success: false, message: 'Impossible de retirer un propriétaire' });
    }

    const removedName = member.userId?.name || member.userId?.phone || 'un gérant';

    await member.deleteOne();

    await logActivity({
      shopId,
      user: req.user,
      userRole: 'OWNER',
      action: 'manager_removed',
      description: `a retiré ${removedName} de la boutique`,
    });

    res.json({ success: true, message: 'Gérant retiré' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ VOIR LES INVITATIONS EN ATTENTE
router.get('/invitations/pending', protect, async (req, res) => {
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
router.post('/invitations/:memberId/accept', protect, async (req, res) => {
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
router.post('/invitations/:memberId/reject', protect, async (req, res) => {
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
router.get('/user/shops', protect, async (req, res) => {
  try {
    const userId = req.user.id;

    // Trouver toutes les boutiques où l'utilisateur est membre (actif)
    const members = await ShopMember.find({ userId, status: 'active' })
      .populate('shopId');

    const shops = members
      .filter(m => m.shopId != null)
      .map(m => ({
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