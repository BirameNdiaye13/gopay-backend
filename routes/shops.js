const express = require('express');
const router = express.Router();
const {
  getShops,
  createShop,
  updateShop,
  deleteShop,
  inviteManager
} = require('../controllers/shopController');
const { protect } = require('../middleware/auth');

router.use(protect); // Toutes les routes nécessitent l'authentification

router.route('/')
  .get(getShops)
  .post(createShop);

router.route('/:id')
  .put(updateShop)
  .delete(deleteShop);

  const shops = await Shop.find({ userId: req.user.id });

// Inviter un gérant dans une boutique
router.post('/:shopId/invite', inviteManager);

module.exports = router;