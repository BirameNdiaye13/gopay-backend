const ShopMember = require('../models/ShopMember');

// Middleware : vérifie que l'utilisateur connecté est OWNER de la boutique.
// Le shopId est cherché dans params.shopId, params.id, puis body.shopId.
exports.isOwner = async (req, res, next) => {
  try {
    const shopId = req.params.shopId || req.params.id || req.body.shopId;

    if (!shopId) {
      return res.status(400).json({ success: false, message: 'shopId manquant' });
    }

    const member = await ShopMember.findOne({
      shopId,
      userId: req.user.id,
      status: 'active',
    });

    if (!member || member.role !== 'OWNER') {
      return res.status(403).json({
        success: false,
        message: 'Action réservée au propriétaire',
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
  }
};
