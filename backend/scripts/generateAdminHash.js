const bcrypt = require('bcryptjs');

async function generateAdminHash() {
  const password = 'admin123'; // Change this to your desired password
  const hash = await bcrypt.hash(password, 10);
  console.log('\n=== Admin User JSON for MongoDB Atlas ===\n');
  console.log(JSON.stringify({
    username: 'admin',
    email: 'admin@reproject.com',
    password: hash,
    role: 'admin',
    points: 0,
    level: 1,
    achievements: [],
    preferences: {
      theme: 'light',
      difficulty: 'easy'
    },
    createdAt: new Date()
  }, null, 2));
  console.log('\n=== Login Credentials ===');
  console.log('Email: admin@reproject.com');
  console.log('Password: admin123');
  console.log('\n');
}

generateAdminHash();

