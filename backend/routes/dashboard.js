const express = require('express');
const router = express.Router();
const {
  getDashboard,
  getGamesBySubject,
  getCreativeActivities,
  getAchievements
} = require('../controllers/dashboardController');
const { verifyToken } = require('../controllers/authController');

// All dashboard routes require authentication
router.use(verifyToken);

router.get('/', getDashboard);
router.get('/games/subject/:subject', getGamesBySubject);
router.get('/creative', getCreativeActivities);
router.get('/achievements', getAchievements);

module.exports = router;

