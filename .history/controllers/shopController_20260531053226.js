const Shop = require('../models/Shop');
const ShopMember = require('../models/ShopMember');

// Obtenir toutes les boutiques de l'utilisateur
exports.getShops = async (req, res) => {
  try {
    const shops = await Shop.find({ userId: req.user.id }).sort('-createdAt');
    res.json({ success: true, shops });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Créer une boutique
exports.createShop = async (req, res) => {
  try {
    const { name, icon, phoneNumber, isActive } = req.body;
    
    // 1️⃣ Créer la boutique
    const shop = await Shop.create({
      userId: req.user.id,
      name,
      icon,
      phoneNumber,
      isActive
    });

    // 2️⃣ AJOUTER le propriétaire comme OWNER dans ShopMember
    const shopMember = await ShopMember.create({
      shopId: shop._id,
      userId: req.user.id,
      role: 'OWNER',
      status: 'active',
      joinedAt: new Date()
    });

    res.status(201).json({ 
      success: true, 
      shop,
      message: 'Boutique créée et vous êtes enregistré comme propriétaire !'
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Modifier une boutique
exports.updateShop = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const shop = await Shop.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      updates,
      { new: true }
    );

    if (!shop) {
      return res.status(404).json({ message: 'Boutique non trouvée' });
    }

    res.json({ success: true, shop });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Supprimer une boutique
exports.deleteShop = async (req, res) => {
  try {
    const { id } = req.params;

    const shop = await Shop.findOneAndDelete({ _id: id, userId: req.user.id });

    if (!shop) {
      return res.status(404).json({ message: 'Boutique non trouvée' });
    }

    res.json({ success: true, message: 'Boutique supprimée' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
