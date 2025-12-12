const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  gameId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true
  },
  startTime: {
    type: Date,
    default: Date.now,
    required: true
  },
  endTime: {
    type: Date
  },
  duration: {
    type: Number, // in seconds
    default: 0
  },
  score: {
    type: Number,
    default: 0
  },
  pointsEarned: {
    type: Number,
    default: 0
  },
  completed: {
    type: Boolean,
    default: false
  },
  progress: {
    type: Number, // percentage 0-100
    default: 0
  },
  answers: [{
    taskId: String,
    userAnswer: Number,
    isCorrect: Boolean,
    timeSpent: Number
  }],
  creativeWork: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
});

// Calculate duration before saving
sessionSchema.pre('save', function(next) {
  if (this.endTime && this.startTime) {
    this.duration = Math.floor((this.endTime - this.startTime) / 1000);
  }
  next();
});

module.exports = mongoose.model('Session', sessionSchema);

