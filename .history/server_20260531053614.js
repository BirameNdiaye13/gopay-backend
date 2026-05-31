require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({
    message: '🚀 GoPay Backend API',
    version: '1.0.0',
    status: 'active',
    endpoints: {
      auth: '/api/auth',
      shops: '/api/shops',
      transactions: '/api/transactions',
      expenses: '/api/expenses'
    }
  });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/shops', require('./routes/shops'));
app.use('/api/shops', require('./routes/shopMembers'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/expenses', require('./routes/expenses'));

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connecté à MongoDB Atlas'))
  .catch(err => console.error('❌ Erreur MongoDB:', err));

// ✅ CORRECTION : Utiliser le port de Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📍 URL: ${process.env.RENDER_EXTERNAL_URL || 'http://localhost:' + PORT}`);
});
