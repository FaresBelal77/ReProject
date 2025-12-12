const Game = require('../models/Game');
const User = require('../models/User');

// Middleware to check if user is admin
exports.isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error verifying admin access',
      error: error.message
    });
  }
};

// Get all games (admin view with inactive games)
exports.getAllGames = async (req, res) => {
  try {
    const games = await Game.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: { games }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching games',
      error: error.message
    });
  }
};

// Create a new game
exports.createGame = async (req, res) => {
  try {
    const {
      title,
      description,
      subject,
      category,
      difficulty,
      ageRange,
      pointsReward,
      estimatedTime,
      content,
      curriculumAlignment
    } = req.body;

    // Validation
    if (!title || !description || !subject || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, subject, and category are required'
      });
    }

    const validSubjects = ['math', 'physics', 'chemistry', 'language', 'coding', 'creative'];
    if (!validSubjects.includes(subject)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subject'
      });
    }

    const game = new Game({
      title,
      description,
      subject,
      category: category || 'serious',
      difficulty: difficulty || 'easy',
      ageRange: ageRange || { min: 5, max: 18 },
      pointsReward: pointsReward || 10,
      estimatedTime: estimatedTime || 15,
      content: content || { instructions: '', tasks: [] },
      curriculumAlignment: curriculumAlignment || { grade: [], topics: [] },
      isActive: true
    });

    await game.save();

    res.status(201).json({
      success: true,
      message: 'Game created successfully',
      data: { game }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating game',
      error: error.message
    });
  }
};

// Update game (activate/deactivate or edit)
exports.updateGame = async (req, res) => {
  try {
    const { gameId } = req.params;
    const updateData = req.body;

    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }

    // Update game fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        game[key] = updateData[key];
      }
    });

    await game.save();

    res.json({
      success: true,
      message: 'Game updated successfully',
      data: { game }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating game',
      error: error.message
    });
  }
};

// Toggle game active status
exports.toggleGameStatus = async (req, res) => {
  try {
    const { gameId } = req.params;

    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }

    game.isActive = !game.isActive;
    await game.save();

    res.json({
      success: true,
      message: `Game ${game.isActive ? 'activated' : 'deactivated'} successfully`,
      data: { game }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error toggling game status',
      error: error.message
    });
  }
};

// Delete game
exports.deleteGame = async (req, res) => {
  try {
    const { gameId } = req.params;

    const game = await Game.findByIdAndDelete(gameId);
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }

    res.json({
      success: true,
      message: 'Game deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting game',
      error: error.message
    });
  }
};

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({
      success: true,
      data: { users }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

