const Monitoring = require('../models/Monitoring');
const Session = require('../models/Session');
const User = require('../models/User');

// Get Monitoring Data (FR-04)
exports.getMonitoringData = async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;

    // Verify if requester is parent/teacher/admin
    const requester = await User.findById(req.userId);
    const targetUser = await User.findById(userId);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check permissions
    let canView = false;
    
    if (requester.role === 'admin' || requester.role === 'teacher') {
      canView = true; // Admins and teachers can view any user
    } else if (requester.role === 'parent') {
      // Parents can only view their own children
      if (targetUser.role === 'child' && targetUser.parentId?.toString() === requester._id.toString()) {
        canView = true;
      } else {
        return res.status(403).json({
          success: false,
          message: 'You can only view progress of your own children'
        });
      }
    } else if (requester._id.toString() === userId) {
      canView = true; // Users can view their own data
    }

    if (!canView) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to view this data'
      });
    }

    // Build date query
    const dateQuery = {};
    if (startDate || endDate) {
      dateQuery.date = {};
      if (startDate) dateQuery.date.$gte = new Date(startDate);
      if (endDate) dateQuery.date.$lte = new Date(endDate);
    }

    // Get monitoring data
    const monitoringData = await Monitoring.find({
      userId,
      ...dateQuery
    }).sort({ date: -1 });

    // Get session statistics
    const sessionQuery = { userId };
    if (startDate || endDate) {
      sessionQuery.startTime = {};
      if (startDate) sessionQuery.startTime.$gte = new Date(startDate);
      if (endDate) sessionQuery.startTime.$lte = new Date(endDate);
    }

    const sessions = await Session.find(sessionQuery)
      .populate('gameId', 'title subject category')
      .sort({ startTime: -1 });

    // Calculate aggregated statistics
    const totalScreenTime = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    const contentAccessed = {};
    const subjectTime = {
      math: 0,
      physics: 0,
      chemistry: 0,
      language: 0,
      coding: 0,
      creative: 0
    };

    sessions.forEach(session => {
      if (session.gameId) {
        const subject = session.gameId.subject;
        subjectTime[subject] = (subjectTime[subject] || 0) + (session.duration || 0);

        const gameId = session.gameId._id.toString();
        if (!contentAccessed[gameId]) {
          contentAccessed[gameId] = {
            gameId: session.gameId._id,
            title: session.gameId.title,
            subject: session.gameId.subject,
            timesAccessed: 0,
            totalTime: 0
          };
        }
        contentAccessed[gameId].timesAccessed++;
        contentAccessed[gameId].totalTime += session.duration || 0;
      }
    });

    // Calculate behavioral patterns
    const hourActivity = {};
    sessions.forEach(session => {
      const hour = new Date(session.startTime).getHours();
      hourActivity[hour] = (hourActivity[hour] || 0) + 1;
    });

    const peakHours = Object.entries(hourActivity)
      .map(([hour, activity]) => ({ hour: parseInt(hour), activity }))
      .sort((a, b) => b.activity - a.activity)
      .slice(0, 5);

    const totalSubjectTime = Object.values(subjectTime).reduce((a, b) => a + b, 0);
    const preferredSubjects = Object.entries(subjectTime)
      .map(([subject, time]) => ({
        subject,
        percentage: totalSubjectTime > 0 ? Math.round((time / totalSubjectTime) * 100) : 0
      }))
      .sort((a, b) => b.percentage - a.percentage);

    res.json({
      success: true,
      data: {
        user: {
          id: targetUser._id,
          username: targetUser.username,
          role: targetUser.role
        },
        screenTime: {
          total: totalScreenTime,
          bySubject: subjectTime,
          averagePerSession: sessions.length > 0 ? Math.round(totalScreenTime / sessions.length) : 0
        },
        sessions: {
          count: sessions.length,
          averageDuration: sessions.length > 0 
            ? Math.round(totalScreenTime / sessions.length) 
            : 0,
          completed: sessions.filter(s => s.completed).length
        },
        contentAccessed: Object.values(contentAccessed),
        behavioralPatterns: {
          peakHours,
          preferredSubjects,
          engagementLevel: sessions.length > 0 ? 'high' : 'low'
        },
        progress: {
          gamesCompleted: sessions.filter(s => s.completed).length,
          pointsEarned: targetUser.points,
          achievementsUnlocked: targetUser.achievements?.length || 0
        },
        dailyData: monitoringData
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching monitoring data',
      error: error.message
    });
  }
};

// Update Daily Monitoring (called after sessions)
exports.updateDailyMonitoring = async (req, res) => {
  try {
    const userId = req.userId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get today's sessions
    const todaySessions = await Session.find({
      userId,
      startTime: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    }).populate('gameId', 'subject');

    // Calculate daily stats
    const screenTime = {
      total: 0,
      bySubject: {
        math: 0,
        physics: 0,
        chemistry: 0,
        language: 0,
        coding: 0,
        creative: 0
      }
    };

    const contentAccessed = {};

    todaySessions.forEach(session => {
      if (session.gameId) {
        const subject = session.gameId.subject;
        const duration = session.duration || 0;
        screenTime.total += duration;
        screenTime.bySubject[subject] = (screenTime.bySubject[subject] || 0) + duration;

        const gameId = session.gameId._id.toString();
        if (!contentAccessed[gameId]) {
          contentAccessed[gameId] = {
            gameId: session.gameId._id,
            subject: session.gameId.subject,
            timesAccessed: 0,
            totalTime: 0
          };
        }
        contentAccessed[gameId].timesAccessed++;
        contentAccessed[gameId].totalTime += duration;
      }
    });

    // Update or create monitoring record
    let monitoring = await Monitoring.findOne({
      userId,
      date: today
    });

    if (monitoring) {
      monitoring.screenTime = screenTime;
      monitoring.sessions.count = todaySessions.length;
      monitoring.sessions.averageDuration = todaySessions.length > 0
        ? Math.round(screenTime.total / todaySessions.length)
        : 0;
      monitoring.contentAccessed = Object.values(contentAccessed);
    } else {
      monitoring = new Monitoring({
        userId,
        date: today,
        screenTime,
        sessions: {
          count: todaySessions.length,
          averageDuration: todaySessions.length > 0
            ? Math.round(screenTime.total / todaySessions.length)
            : 0
        },
        contentAccessed: Object.values(contentAccessed)
      });
    }

    await monitoring.save();

    res.json({
      success: true,
      message: 'Monitoring data updated',
      data: { monitoring }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating monitoring data',
      error: error.message
    });
  }
};

// Get Children List (for parents/teachers)
exports.getChildren = async (req, res) => {
  try {
    const requester = await User.findById(req.userId);

    let children;
    if (requester.role === 'admin' || requester.role === 'teacher') {
      // Admins and teachers can see all children
      children = await User.find({ role: 'child' })
        .select('username email age points level lastLogin')
        .populate('parentId', 'username');
    } else if (requester.role === 'parent') {
      // Parents can only see their own children
      children = await User.find({
        role: 'child',
        parentId: requester._id
      }).select('username email age points level lastLogin');
    } else {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    res.json({
      success: true,
      data: { children }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching children list',
      error: error.message
    });
  }
};

