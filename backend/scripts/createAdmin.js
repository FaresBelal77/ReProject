const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://omarabdalla_db_user:1234@cluster0.9nyfqde.mongodb.net/?appName=Cluster0';

const createAdminUser = async () => {
  try {
    // Connect to database
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ 
      $or: [
        { email: 'admin@reproject.com' },
        { username: 'admin' },
        { role: 'admin' }
      ]
    });

    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email:', existingAdmin.email);
      console.log('Username:', existingAdmin.username);
      console.log('\nTo update password, delete the existing admin and run this script again.');
      process.exit(0);
    }

    // Generate password hash
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const adminUser = new User({
      username: 'admin',
      email: 'admin@reproject.com',
      password: hashedPassword,
      role: 'admin',
      points: 0,
      level: 1,
      achievements: [],
      preferences: {
        theme: 'light',
        difficulty: 'easy'
      }
    });

    await adminUser.save();

    console.log('\n✅ Admin user created successfully!');
    console.log('\n=== Login Credentials ===');
    console.log('Email: admin@reproject.com');
    console.log('Password: admin123');
    console.log('\nYou can now login with these credentials.');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error.message);
    if (error.code === 11000) {
      console.error('\nA user with this email or username already exists.');
    }
    process.exit(1);
  }
};

createAdminUser();

