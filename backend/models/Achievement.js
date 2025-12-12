const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: '🏆'
  },
  category: {
    type: String,
    enum: ['points', 'games', 'streak', 'subject', 'creative', 'safety'],
    required: true
  },
  requirement: {
    type: {
      type: String,
      enum: ['points', 'games_completed', 'streak_days', 'subject_mastery', 'creative_projects'],
      required: true
    },
    value: {
      type: Number,
      required: true
    },
    subject: {
      type: String,
      enum: ['math', 'physics', 'chemistry', 'language', 'coding', null],
      default: null
    }
  },
  pointsReward: {
    type: Number,
    default: 50
  },
  rarity: {
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary'],
    default: 'common'
  }
});

module.exports = mongoose.model('Achievement', achievementSchema);

