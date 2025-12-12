const express = require('express');
const router = express.Router();
const {
  getMonitoringData,
  updateDailyMonitoring,
  getChildren
} = require('../controllers/monitoringController');
const { verifyToken } = require('../controllers/authController');

// All monitoring routes require authentication
router.use(verifyToken);

router.get('/children', getChildren);
router.get('/:userId', getMonitoringData);
router.post('/update', updateDailyMonitoring);

module.exports = router;

