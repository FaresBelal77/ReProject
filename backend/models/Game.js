const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    enum: ['math', 'physics', 'chemistry', 'language', 'coding', 'creative'],
    required: true
  },
  category: {
    type: String,
    enum: ['serious', 'creative', 'sandbox'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'easy'
  },
  ageRange: {
    min: {
      type: Number,
      default: 5
    },
    max: {
      type: Number,
      default: 18
    }
  },
  pointsReward: {
    type: Number,
    default: 10
  },
  estimatedTime: {
    type: Number, // in minutes
    default: 15
  },
  content: {
    instructions: String,
    tasks: [{
      question: String,
      options: [String],
      correctAnswer: Number,
      explanation: String
    }],
    creativeElements: {
      type: Map,
      of: String
    }
  },
  curriculumAlignment: {
    grade: [Number],
    topics: [String]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Game', gameSchema);

