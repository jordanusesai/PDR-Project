const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function checkUserPassword() {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pdr-split';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    const user = await User.findOne({ username: 'testuser' });
    if (user) {
      console.log('User found:', user.username);
      console.log('Email:', user.email);
      console.log('Password hash exists:', !!user.password);
      console.log('Password hash length:', user.password.length);
      
      // Test password comparison
      const isMatch = await user.comparePassword('testpass123');
      console.log('Password comparison result:', isMatch);
      
      // Test with different password
      const isMatch2 = await user.comparePassword('wrongpass');
      console.log('Wrong password comparison:', isMatch2);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

checkUserPassword();
