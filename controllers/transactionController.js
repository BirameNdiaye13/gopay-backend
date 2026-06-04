const Transaction = require('../models/Transaction');
const Shop = require('../models/Shop');
const ShopMember = require('../models/ShopMember');

// Obtenir les transactions d'une boutique
exports.getTransactions = async (req, res) => {
  try {
    const { shopId } = req.params;

    // Vérifier que la boutique appartient à l'utilisateur
    const member = await ShopMember.findOne({ shopId, userId: req.user.id, status: 'active' });
    if (!member) {
      return res.status(403).json({ message: 'Accès refusé à cette boutique' });
    }

    const transactions = await Transaction.find({ shopId }).sort('-timestamp');
    res.json({ success: true, transactions });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Créer une transaction
exports.createTransaction = async (req, res) => {
  try {
    const { shopId, amount, method, sender, clientName, type } = req.body;

    // Vérifier que la boutique appartient à l'utilisateur
    const member = await ShopMember.findOne({ shopId, userId: req.user.id, status: 'active' });
    if (!member) {
      return res.status(403).json({ message: 'Accès refusé à cette boutique' });
    }

    const transaction = await Transaction.create({
      shopId,
      amount,
      method,
      sender,
      clientName,
      type
    });

    res.status(201).json({ success: true, transaction });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Obtenir les statistiques d'une boutique
exports.getStats = async (req, res) => {
  try {
    const { shopId } = req.params;

    // Vérifier que la boutique appartient à l'utilisateur
    const member = await ShopMember.findOne({ shopId, userId: req.user.id, status: 'active' });
    if (!member) {
      return res.status(403).json({ message: 'Accès refusé à cette boutique' });
    }

    const transactions = await Transaction.find({ shopId, type: 'income' });

    const total = transactions.reduce((sum, t) => sum + t.amount, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaySales = transactions
      .filter(t => t.timestamp >= today)
      .reduce((sum, t) => sum + t.amount, 0);

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekSales = transactions
      .filter(t => t.timestamp >= weekAgo)
      .reduce((sum, t) => sum + t.amount, 0);

    res.json({
      success: true,
      stats: {
        total,
        todaySales,
        weekSales,
        transactionCount: transactions.length
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
