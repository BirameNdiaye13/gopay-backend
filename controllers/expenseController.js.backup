const Expense = require('../models/Expense');
const Shop = require('../models/Shop');

// Obtenir les dépenses d'une boutique
exports.getExpenses = async (req, res) => {
  try {
    const { shopId } = req.params;

    // Vérifier que la boutique appartient à l'utilisateur
    const shop = await Shop.findOne({ _id: shopId, userId: req.user.id });
    if (!shop) {
      return res.status(404).json({ message: 'Boutique non trouvée' });
    }

    const expenses = await Expense.find({ shopId }).sort('-createdAt');
    res.json({ success: true, expenses });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Créer une dépense
exports.createExpense = async (req, res) => {
  try {
    const { shopId, amount, category, note } = req.body;

    // Vérifier que la boutique appartient à l'utilisateur
    const shop = await Shop.findOne({ _id: shopId, userId: req.user.id });
    if (!shop) {
      return res.status(404).json({ message: 'Boutique non trouvée' });
    }

    const expense = await Expense.create({
      shopId,
      amount,
      category,
      note
    });

    res.status(201).json({ success: true, expense });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Supprimer une dépense
exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const expense = await Expense.findById(id).populate('shopId');
    if (!expense) {
      return res.status(404).json({ message: 'Dépense non trouvée' });
    }

    // Vérifier que la boutique appartient à l'utilisateur
    if (expense.shopId.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    await expense.deleteOne();
    res.json({ success: true, message: 'Dépense supprimée' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
