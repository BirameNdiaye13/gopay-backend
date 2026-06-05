const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const ShopMember = require('../models/ShopMember');
const { protect } = require('../middleware/auth');

router.use(protect);

// Obtenir l'historique d'une boutique (tout membre actif peut voir)
router.get('/:shopId', async (req, res) => {
  try {
    const { shopId } = req.params;

    // Vérifier que l'utilisateur est membre actif de la boutique
    const member = await ShopMember.findOne({ shopId, userId: req.user.id, status: 'active' });
    if (!member) {
      return res.status(403).json({ success: false, message: 'Accès refusé à cette boutique' });
    }

    const activities = await Activity.find({ shopId })
      .sort('-createdAt')
      .limit(100);

    res.json({ success: true, activities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
