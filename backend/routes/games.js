const express = require('express');
const router = express.Router();
const {
  getAllGames,
  getGame,
  startGame,
  submitAnswer,
  saveCreativeWork,
  endGame
} = require('../controllers/gameController');
const { verifyToken } = require('../controllers/authController');

// All game routes require authentication
router.use(verifyToken);

router.get('/', getAllGames);
router.get('/:gameId', getGame);
router.post('/:gameId/start', startGame);
router.post('/session/:sessionId/answer', submitAnswer);
router.post('/session/:sessionId/creative', saveCreativeWork);
router.post('/session/:sessionId/end', endGame);

module.exports = router;

