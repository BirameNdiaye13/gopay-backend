const Activity = require('../models/Activity');

async function logActivity({ shopId, user, action, description, amount = null, userRole = '' }) {
  try {
    await Activity.create({
      shopId,
      userId: user.id,
      userName: user.name || '',
      userRole,
      action,
      description,
      amount,
    });
  } catch (error) {
    console.error('⚠️ logActivity a échoué (action principale non affectée):', error.message);
  }
}

module.exports = logActivity;
