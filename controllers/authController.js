const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Générer un JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Inscription
exports.register = async (req, res) => {
  try {
    const { phone, pin, name } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: 'Ce numéro est déjà enregistré' });
    }

    // Créer le nouvel utilisateur
    const user = await User.create({ phone, pin, name });

    // Générer le token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        phone: user.phone,
        name: user.name
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Connexion
exports.login = async (req, res) => {
  try {
    const { phone, pin } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(401).json({ message: 'Numéro ou PIN incorrect' });
    }

    // Vérifier le PIN
    const isMatch = await user.comparePin(pin);
    if (!isMatch) {
      return res.status(401).json({ message: 'Numéro ou PIN incorrect' });
    }

    // Générer le token
    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        phone: user.phone,
        name: user.name
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Obtenir le profil
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-pin');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
