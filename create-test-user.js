const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function createTestUser() {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pdr-split';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Connected to MongoDB');
    
    // Check if test user exists
    const existingUser = await User.findOne({ username: 'testuser' });
    if (existingUser) {
      console.log('Test user already exists');
    } else {
      // Create test user
      const testUser = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'testpass123'
      });
      
      await testUser.save();
      console.log('Test user created successfully!');
      console.log('Username: testuser');
      console.log('Password: testpass123');
    }
    
    // List all users
    const users = await User.find({});
    console.log('Total users:', users.length);
    users.forEach(user => {
      console.log(`- ${user.username} (${user.email})`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

createTestUser();
