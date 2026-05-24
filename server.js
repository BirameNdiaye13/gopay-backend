const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware - CORS pour autoriser Flutter
app.use(cors({
  origin: '*', // Autoriser toutes les origines en développement
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/shops', require('./routes/shops'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/expenses', require('./routes/expenses'));

// Connexion MongoDB et démarrage du serveur
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connecté');
    
    const PORT = process.env.PORT || 3000;
    const HOST = '0.0.0.0'; // ← Écouter sur toutes les interfaces
    
    app.listen(PORT, HOST, () => {
      console.log(`🚀 Serveur démarré`);
      console.log(`📍 Local:   http://localhost:${PORT}`);
      console.log(`📍 Réseau:  http://192.168.1.28:${PORT}`);
      console.log(`\n📋 Endpoints disponibles :`);
      console.log(`   POST   /api/auth/register`);
      console.log(`   POST   /api/auth/login`);
      console.log(`   GET    /api/auth/profile`);
      console.log(`   GET    /api/shops`);
      console.log(`   POST   /api/shops`);
      console.log(`   GET    /api/transactions/:shopId`);
      console.log(`   POST   /api/transactions`);
      console.log(`   GET    /api/transactions/:shopId/stats`);
      console.log(`   GET    /api/expenses/:shopId`);
      console.log(`   POST   /api/expenses`);
    });
  })
  .catch((err) => {
    console.error('❌ Erreur de connexion MongoDB:', err.message);
    process.exit(1);
  });
