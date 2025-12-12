const SafetyAlert = require('../models/SafetyAlert');
const Session = require('../models/Session');
const User = require('../models/User');

// Simple keyword detection (in production, use ML/AI services)
const unsafeKeywords = {
  cyberbullying: ['stupid', 'hate', 'kill', 'die', 'ugly', 'loser', 'worthless'],
  explicit_content: ['explicit', 'inappropriate', 'adult'],
  inappropriate_language: ['curse', 'bad word']
};

// Detect and Create Safety Alert (FR-05)
exports.detectUnsafeBehavior = async (req, res) => {
  try {
    const { sessionId, content, context } = req.body;
    const userId = req.userId;

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    const detectedIssues = [];
    const contentLower = (content || '').toLowerCase();

    // Check for cyberbullying
    if (unsafeKeywords.cyberbullying.some(keyword => contentLower.includes(keyword))) {
      detectedIssues.push({
        type: 'cyberbullying',
        severity: 'high',
        message: 'Potential cyberbullying language detected',
        guidance: {
          title: 'Be Kind Online',
          content: 'Remember to treat others with respect online, just like in real life. If you see something mean, tell a trusted adult.',
          resources: [
            'https://www.stopbullying.gov/cyberbullying/what-is-it',
            'https://www.commonsensemedia.org/articles/cyberbullying'
          ]
        }
      });
    }

    // Check for explicit content
    if (unsafeKeywords.explicit_content.some(keyword => contentLower.includes(keyword))) {
      detectedIssues.push({
        type: 'explicit_content',
        severity: 'critical',
        message: 'Inappropriate content detected',
        guidance: {
          title: 'Safe Content Guidelines',
          content: 'This content is not appropriate for your age. Let\'s focus on learning and fun activities that are safe for you.',
          resources: [
            'https://www.commonsensemedia.org/articles/internet-safety',
            'https://www.fbi.gov/how-we-can-help-you/safety-resources/scams-and-safety/common-scams-and-crimes/child-exploitation'
          ]
        }
      });
    }

    // Check for inappropriate language
    if (unsafeKeywords.inappropriate_language.some(keyword => contentLower.includes(keyword))) {
      detectedIssues.push({
        type: 'inappropriate_language',
        severity: 'medium',
        message: 'Inappropriate language detected',
        guidance: {
          title: 'Using Good Language',
          content: 'Let\'s use positive and respectful words. Good communication helps us learn and grow together.',
          resources: [
            'https://www.commonsensemedia.org/articles/how-to-talk-to-kids-about-online-speech'
          ]
        }
      });
    }

    // Create alerts for detected issues
    const createdAlerts = [];
    for (const issue of detectedIssues) {
      const alert = new SafetyAlert({
        userId,
        type: issue.type,
        severity: issue.severity,
        context: {
          sessionId: session._id,
          gameId: session.gameId,
          detectedContent: content,
          location: context?.location || 'game_session'
        },
        alertMessage: issue.message,
        educationalGuidance: issue.guidance,
        actionTaken: issue.severity === 'critical' ? 'session_paused' : 'alert_only'
      });

      await alert.save();
      createdAlerts.push(alert);

      // If critical, pause the session
      if (issue.severity === 'critical') {
        session.endTime = new Date();
        await session.save();
      }
    }

    res.json({
      success: true,
      message: detectedIssues.length > 0 
        ? 'Safety concerns detected and alerts created' 
        : 'No safety concerns detected',
      data: {
        alerts: createdAlerts,
        sessionPaused: detectedIssues.some(i => i.severity === 'critical')
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error detecting unsafe behavior',
      error: error.message
    });
  }
};

// Get Safety Alerts (FR-05)
exports.getSafetyAlerts = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, severity, type } = req.query;

    // Verify permissions
    const requester = await User.findById(req.userId);
    const targetUser = await User.findById(userId);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const canView = 
      requester.role === 'admin' ||
      requester.role === 'teacher' ||
      (requester.role === 'parent' && targetUser.parentId?.toString() === requester._id.toString()) ||
      requester._id.toString() === userId;

    if (!canView) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to view this data'
      });
    }

    const query = { userId };
    if (status) query.status = status;
    if (severity) query.severity = severity;
    if (type) query.type = type;

    const alerts = await SafetyAlert.find(query)
      .populate('sessionId', 'startTime endTime')
      .populate('context.gameId', 'title subject')
      .sort({ detectedAt: -1 });

    res.json({
      success: true,
      data: { alerts }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching safety alerts',
      error: error.message
    });
  }
};

// Resolve Safety Alert
exports.resolveAlert = async (req, res) => {
  try {
    const { alertId } = req.params;
    const { resolution } = req.body; // 'resolved' or 'false_positive'

    const alert = await SafetyAlert.findById(alertId);
    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    // Verify permissions
    const requester = await User.findById(req.userId);
    const canResolve = 
      requester.role === 'admin' ||
      requester.role === 'teacher' ||
      requester.role === 'parent';

    if (!canResolve) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to resolve alerts'
      });
    }

    alert.status = resolution === 'false_positive' ? 'false_positive' : 'resolved';
    alert.resolvedAt = new Date();
    alert.resolvedBy = requester._id;

    await alert.save();

    res.json({
      success: true,
      message: 'Alert resolved',
      data: { alert }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error resolving alert',
      error: error.message
    });
  }
};

// Get Safety Statistics
exports.getSafetyStatistics = async (req, res) => {
  try {
    const { userId } = req.params;

    const totalAlerts = await SafetyAlert.countDocuments({ userId });
    const activeAlerts = await SafetyAlert.countDocuments({ 
      userId, 
      status: 'active' 
    });
    const alertsByType = await SafetyAlert.aggregate([
      { $match: { userId } },
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);
    const alertsBySeverity = await SafetyAlert.aggregate([
      { $match: { userId } },
      { $group: { _id: '$severity', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        totalAlerts,
        activeAlerts,
        alertsByType: alertsByType.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        alertsBySeverity: alertsBySeverity.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching safety statistics',
      error: error.message
    });
  }
};

