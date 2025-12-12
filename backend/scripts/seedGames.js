// Script to seed sample games into the database
// Run this with: node scripts/seedGames.js

const mongoose = require('mongoose');
const Game = require('../models/Game');
const sampleGames = require('../data/sampleGames');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://omarabdalla_db_user:1234@cluster0.9nyfqde.mongodb.net/?appName=Cluster0';

const seedGames = async () => {
  try {
    // Connect to database
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if sample games already exist
    const existingSampleGames = await Game.find({ 
      title: { $in: sampleGames.map(g => g.title) } 
    });
    
    if (existingSampleGames.length === sampleGames.length) {
      console.log(`All sample games already exist in database (${existingSampleGames.length} games).`);
      console.log('Games are ready to use!');
      existingSampleGames.forEach(game => {
        console.log(`  - ${game.title} (${game.subject}) - ${game.isActive ? '✅ Active' : '❌ Inactive'}`);
      });
      process.exit(0);
    }

    // Delete existing sample games if they exist (to allow re-seeding)
    if (existingSampleGames.length > 0) {
      const titlesToDelete = existingSampleGames.map(g => g.title);
      await Game.deleteMany({ title: { $in: titlesToDelete } });
      console.log(`Deleted ${existingSampleGames.length} existing sample games for re-seeding.`);
    }

    // Insert sample games
    const insertedGames = await Game.insertMany(sampleGames);
    console.log(`✅ Successfully seeded ${insertedGames.length} games!`);
    console.log('\nGames created:');
    insertedGames.forEach(game => {
      console.log(`  - ${game.title} (${game.subject})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding games:', error);
    process.exit(1);
  }
};

seedGames();
