const User = require('../models/User');
const Game = require('../models/Game');
const Session = require('../models/Session');
const Achievement = require('../models/Achievement');

// Get Dashboard Data (FR-01)
exports.getDashboard = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId)
      .populate('achievements')
      .select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get available games by subject
    const games = await Game.find({ isActive: true })
      .select('title subject category difficulty pointsReward estimatedTime');

    // Get recent sessions
    const recentSessions = await Session.find({ userId })
      .populate('gameId', 'title subject')
      .sort({ startTime: -1 })
      .limit(5);

    // Get leaderboard (top 10 users by points)
    const leaderboard = await User.find({ role: 'child' })
      .select('username points level achievements')
      .populate('achievements', 'title icon')
      .sort({ points: -1 })
      .limit(10);

    // Organize games by subject
    const gamesBySubject = {
      math: games.filter(g => g.subject === 'math'),
      physics: games.filter(g => g.subject === 'physics'),
      chemistry: games.filter(g => g.subject === 'chemistry'),
      language: games.filter(g => g.subject === 'language'),
      coding: games.filter(g => g.subject === 'coding'),
      creative: games.filter(g => g.subject === 'creative')
    };

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          points: user.points,
          level: user.level,
          achievements: user.achievements
        },
        gamesBySubject,
        recentSessions,
        leaderboard: leaderboard.map(u => ({
          username: u.username,
          points: u.points,
          level: u.level,
          achievements: u.achievements
        })),
        gamifiedElements: {
          points: user.points,
          level: user.level,
          achievements: user.achievements,
          nextLevelPoints: user.level * 100
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data',
      error: error.message
    });
  }
};

// Get Games by Subject (FR-02)
exports.getGamesBySubject = async (req, res) => {
  try {
    const { subject } = req.params;

    const validSubjects = ['math', 'physics', 'chemistry', 'language', 'coding'];
    if (!validSubjects.includes(subject)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subject'
      });
    }

    const games = await Game.find({
      subject,
      isActive: true
    }).sort({ difficulty: 1, createdAt: -1 });

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

// Get Creative Activities (FR-03)
exports.getCreativeActivities = async (req, res) => {
  try {
    const creativeGames = await Game.find({
      $or: [
        { subject: 'creative' },
        { category: 'creative' },
        { category: 'sandbox' }
      ],
      isActive: true
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { creativeGames }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching creative activities',
      error: error.message
    });
  }
};

// Get Achievement Details
exports.getAchievements = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).populate('achievements');

    const allAchievements = await Achievement.find();
    const userAchievementIds = user.achievements.map(a => a._id.toString());

    const achievements = allAchievements.map(achievement => ({
      ...achievement.toObject(),
      unlocked: userAchievementIds.includes(achievement._id.toString())
    }));

    res.json({
      success: true,
      data: { achievements }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching achievements',
      error: error.message
    });
  }
};

