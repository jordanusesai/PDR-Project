const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function createJordanUser() {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pdr-split';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Connected to MongoDB');
    
    // Check if Jordan user exists
    const existingUser = await User.findOne({ username: 'Jordan' });
    if (existingUser) {
      console.log('Jordan user already exists');
      
      // Test password
      const isMatch = await existingUser.comparePassword('Testing123');
      console.log('Password test result:', isMatch);
      
      if (!isMatch) {
        console.log('Updating password...');
        existingUser.password = 'Testing123';
        await existingUser.save();
        console.log('Password updated successfully');
      }
    } else {
      // Create Jordan user
      const jordanUser = new User({
        username: 'Jordan',
        email: 'jordan@example.com',
        password: 'Testing123'
      });
      
      await jordanUser.save();
      console.log('Jordan user created successfully!');
    }
    
    // Test the login
    const testUser = await User.findOne({ username: 'Jordan' });
    const isMatch = await testUser.comparePassword('Testing123');
    console.log('Login test result:', isMatch);
    
    if (isMatch) {
      console.log('✅ Jordan user ready for login!');
      console.log('Username: Jordan');
      console.log('Password: Testing123');
    }
    
    // List all users
    const users = await User.find({});
    console.log('All users in database:');
    users.forEach(user => {
      console.log(`- ${user.username} (${user.email})`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

createJordanUser();
