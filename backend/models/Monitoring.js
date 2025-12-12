const mongoose = require('mongoose');

const monitoringSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  screenTime: {
    total: {
      type: Number, // in seconds
      default: 0
    },
    bySubject: {
      math: { type: Number, default: 0 },
      physics: { type: Number, default: 0 },
      chemistry: { type: Number, default: 0 },
      language: { type: Number, default: 0 },
      coding: { type: Number, default: 0 },
      creative: { type: Number, default: 0 }
    }
  },
  sessions: {
    count: {
      type: Number,
      default: 0
    },
    averageDuration: {
      type: Number, // in seconds
      default: 0
    }
  },
  contentAccessed: [{
    gameId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game'
    },
    subject: String,
    timesAccessed: {
      type: Number,
      default: 1
    },
    totalTime: {
      type: Number, // in seconds
      default: 0
    }
  }],
  behavioralPatterns: {
    peakHours: [{
      hour: Number,
      activity: Number
    }],
    preferredSubjects: [{
      subject: String,
      percentage: Number
    }],
    engagementLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    }
  },
  progress: {
    gamesCompleted: {
      type: Number,
      default: 0
    },
    pointsEarned: {
      type: Number,
      default: 0
    },
    achievementsUnlocked: {
      type: Number,
      default: 0
    }
  }
});

// Index for efficient queries
monitoringSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('Monitoring', monitoringSchema);

