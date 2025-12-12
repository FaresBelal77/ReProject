const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getCurrentUser
} = require('../controllers/authController');
const { verifyToken } = require('../controllers/authController');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', verifyToken, getCurrentUser);

module.exports = router;

