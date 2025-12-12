const express = require('express');
const router = express.Router();
const {
  detectUnsafeBehavior,
  getSafetyAlerts,
  resolveAlert,
  getSafetyStatistics
} = require('../controllers/safetyController');
const { verifyToken } = require('../controllers/authController');

// All safety routes require authentication
router.use(verifyToken);

router.post('/detect', detectUnsafeBehavior);
router.get('/alerts/:userId', getSafetyAlerts);
router.get('/statistics/:userId', getSafetyStatistics);
router.put('/alerts/:alertId/resolve', resolveAlert);

module.exports = router;

