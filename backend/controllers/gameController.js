const Game = require('../models/Game');
const Session = require('../models/Session');
const User = require('../models/User');
const Achievement = require('../models/Achievement');

// Start Game Session (FR-02)
exports.startGame = async (req, res) => {
  try {
    const { gameId } = req.params;
    const userId = req.userId;

    // Check if user is a child (only children can play games)
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.role !== 'child') {
      return res.status(403).json({
        success: false,
        message: 'Only children can play games. Parents and teachers can view games but cannot play them.'
      });
    }

    const game = await Game.findById(gameId);
    if (!game || !game.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Game not found or inactive'
      });
    }

    const session = new Session({
      userId,
      gameId,
      startTime: new Date()
    });

    await session.save();

    res.json({
      success: true,
      message: 'Game session started',
      data: {
        session: {
          id: session._id,
          game: {
            id: game._id,
            title: game.title,
            description: game.description,
            subject: game.subject,
            content: game.content
          },
          startTime: session.startTime
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error starting game session',
      error: error.message
    });
  }
};

// Submit Answer
exports.submitAnswer = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { taskId, userAnswer, timeSpent } = req.body;
    const userId = req.userId;

    // Check if user is a child
    const user = await User.findById(userId);
    if (!user || user.role !== 'child') {
      return res.status(403).json({
        success: false,
        message: 'Only children can play games'
      });
    }

    const session = await Session.findById(sessionId).populate('gameId');
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Verify session belongs to user
    if (session.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to submit answer for this session'
      });
    }

    // Find the task in game content
    const task = session.gameId.content.tasks.find(t => 
      t._id.toString() === taskId || t.question === taskId
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    const isCorrect = task.correctAnswer === userAnswer;
    
    // Add answer to session
    session.answers.push({
      taskId,
      userAnswer,
      isCorrect,
      timeSpent: timeSpent || 0
    });

    // Update score
    if (isCorrect) {
      session.score += 10;
    }

    // Update progress
    const totalTasks = session.gameId.content.tasks.length;
    session.progress = Math.round((session.answers.length / totalTasks) * 100);

    await session.save();

    res.json({
      success: true,
      data: {
        isCorrect,
        explanation: task.explanation,
        currentScore: session.score,
        progress: session.progress
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting answer',
      error: error.message
    });
  }
};

// Save Creative Work (FR-03)
exports.saveCreativeWork = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { creativeWork } = req.body;

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    session.creativeWork = creativeWork;
    await session.save();

    res.json({
      success: true,
      message: 'Creative work saved',
      data: { session }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error saving creative work',
      error: error.message
    });
  }
};

// End Game Session
exports.endGame = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.userId;

    // Check if user is a child
    const user = await User.findById(userId);
    if (!user || user.role !== 'child') {
      return res.status(403).json({
        success: false,
        message: 'Only children can play games'
      });
    }

    const session = await Session.findById(sessionId).populate('gameId');
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Verify session belongs to user
    if (session.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to end this session'
      });
    }

    if (session.completed) {
      return res.status(400).json({
        success: false,
        message: 'Session already completed'
      });
    }

    session.endTime = new Date();
    session.completed = true;

    // Calculate points earned based on score
    const basePoints = session.gameId.pointsReward || 10;
    const scoreMultiplier = session.score / 100;
    session.pointsEarned = Math.round(basePoints * (0.5 + scoreMultiplier * 0.5));

    // Update user points
    const gameUser = await User.findById(userId);
    gameUser.points += session.pointsEarned;

    // Check for level up
    const newLevel = Math.floor(gameUser.points / 100) + 1;
    if (newLevel > gameUser.level) {
      gameUser.level = newLevel;
    }

    // Check for achievements
    await checkAndAwardAchievements(userId, session);

    await session.save();
    await gameUser.save();

    res.json({
      success: true,
      message: 'Game session completed',
      data: {
        session: {
          id: session._id,
          score: session.score,
          pointsEarned: session.pointsEarned,
          duration: session.duration,
          progress: session.progress
        },
        user: {
          points: gameUser.points,
          level: gameUser.level
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error ending game session',
      error: error.message
    });
  }
};

// Get Game Details
exports.getGame = async (req, res) => {
  try {
    const { gameId } = req.params;

    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }

    res.json({
      success: true,
      data: { game }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching game',
      error: error.message
    });
  }
};

// Get All Games
exports.getAllGames = async (req, res) => {
  try {
    const { subject, category, difficulty } = req.query;
    const query = { isActive: true };

    if (subject) query.subject = subject;
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;

    const games = await Game.find(query).sort({ createdAt: -1 });

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

// Helper function to check and award achievements
async function checkAndAwardAchievements(userId, session) {
  const user = await User.findById(userId).populate('achievements');
  const allAchievements = await Achievement.find();
  
  for (const achievement of allAchievements) {
    // Skip if already unlocked
    if (user.achievements.some(a => a._id.toString() === achievement._id.toString())) {
      continue;
    }

    let shouldAward = false;

    switch (achievement.requirement.type) {
      case 'points':
        if (user.points >= achievement.requirement.value) {
          shouldAward = true;
        }
        break;
      case 'games_completed':
        const completedCount = await Session.countDocuments({
          userId,
          completed: true
        });
        if (completedCount >= achievement.requirement.value) {
          shouldAward = true;
        }
        break;
      case 'subject_mastery':
        if (achievement.requirement.subject === session.gameId.subject) {
          const subjectSessions = await Session.countDocuments({
            userId,
            'gameId': session.gameId._id,
            completed: true
          });
          if (subjectSessions >= achievement.requirement.value) {
            shouldAward = true;
          }
        }
        break;
    }

    if (shouldAward) {
      user.achievements.push(achievement._id);
      user.points += achievement.pointsReward;
    }
  }

  await user.save();
}

