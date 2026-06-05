const Expense = require('../models/Expense');
const ShopMember = require('../models/ShopMember');
const logActivity = require('../utils/logActivity');

// Obtenir les dépenses d'une boutique (tout membre actif)
exports.getExpenses = async (req, res) => {
  try {
    const { shopId } = req.params;

    const member = await ShopMember.findOne({ shopId, userId: req.user.id, status: 'active' });
    if (!member) {
      return res.status(403).json({ message: 'Accès refusé à cette boutique' });
    }

    const expenses = await Expense.find({ shopId }).sort('-createdAt');
    res.json({ success: true, expenses });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Créer une dépense (tout membre actif)
exports.createExpense = async (req, res) => {
  try {
    const { shopId, amount, category, note } = req.body;

    const member = await ShopMember.findOne({ shopId, userId: req.user.id, status: 'active' });
    if (!member) {
      return res.status(403).json({ message: 'Accès refusé à cette boutique' });
    }

    const expense = await Expense.create({
      shopId,
      amount,
      category,
      note
    });

    await logActivity({
      shopId,
      user: req.user,
      userRole: member.role,
      action: 'expense_added',
      description: `a ajouté une dépense de ${amount} FCFA${category ? ' (' + category + ')' : ''}`,
      amount,
    });

    res.status(201).json({ success: true, expense });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Supprimer une dépense (réservé au propriétaire)
exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const expense = await Expense.findById(id);
    if (!expense) {
      return res.status(404).json({ message: 'Dépense non trouvée' });
    }

    // Vérifier que l'utilisateur est OWNER de la boutique de cette dépense
    const member = await ShopMember.findOne({
      shopId: expense.shopId,
      userId: req.user.id,
      status: 'active',
    });

    if (!member || member.role !== 'OWNER') {
      return res.status(403).json({ message: 'Action réservée au propriétaire' });
    }

    await expense.deleteOne();

    await logActivity({
      shopId: expense.shopId,
      user: req.user,
      userRole: member.role,
      action: 'expense_deleted',
      description: `a supprimé une dépense de ${expense.amount} FCFA`,
      amount: expense.amount,
    });

    res.json({ success: true, message: 'Dépense supprimée' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
