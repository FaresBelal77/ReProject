const mongoose = require('mongoose');

const safetyAlertSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['cyberbullying', 'explicit_content', 'inappropriate_language', 'suspicious_activity'],
    required: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  detectedAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  context: {
    gameId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game'
    },
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session'
    },
    detectedContent: String,
    location: String
  },
  alertMessage: {
    type: String,
    required: true
  },
  educationalGuidance: {
    title: String,
    content: String,
    resources: [String]
  },
  actionTaken: {
    type: String,
    enum: ['alert_only', 'content_blocked', 'session_paused', 'parent_notified'],
    default: 'alert_only'
  },
  status: {
    type: String,
    enum: ['active', 'resolved', 'false_positive'],
    default: 'active'
  },
  resolvedAt: {
    type: Date
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

// Index for efficient queries
safetyAlertSchema.index({ userId: 1, detectedAt: -1 });
safetyAlertSchema.index({ status: 1, severity: 1 });

module.exports = mongoose.model('SafetyAlert', safetyAlertSchema);

