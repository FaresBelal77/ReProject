const express = require('express');
const router = express.Router();
const {
  isAdmin,
  getAllGames,
  createGame,
  updateGame,
  toggleGameStatus,
  deleteGame,
  getAllUsers
} = require('../controllers/adminController');
const { verifyToken } = require('../controllers/authController');

// All admin routes require authentication and admin role
router.use(verifyToken);
router.use(isAdmin);

router.get('/games', getAllGames);
router.post('/games', createGame);
router.put('/games/:gameId', updateGame);
router.patch('/games/:gameId/toggle', toggleGameStatus);
router.delete('/games/:gameId', deleteGame);
router.get('/users', getAllUsers);

module.exports = router;

