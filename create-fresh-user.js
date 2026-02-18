const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function createFreshTestUser() {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pdr-split';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Connected to MongoDB');
    
    // Delete existing test user
    await User.deleteOne({ username: 'testuser' });
    console.log('Deleted existing test user');
    
    // Create new test user
    const testUser = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'testpass123'
    });
    
    await testUser.save();
    console.log('New test user created successfully!');
    
    // Test the password immediately
    const savedUser = await User.findOne({ username: 'testuser' });
    const isMatch = await savedUser.comparePassword('testpass123');
    console.log('Password test result:', isMatch);
    
    if (isMatch) {
      console.log('✅ Test user ready for login!');
      console.log('Username: testuser');
      console.log('Password: testpass123');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

createFreshTestUser();
