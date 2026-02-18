// Test login endpoint directly
const axios = require('axios');

async function testLogin() {
  try {
    console.log('Testing login endpoint...');
    
    // Test with sample data
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      username: 'testuser',
      password: 'testpass'
    });
    
    console.log('Login successful:', response.data);
  } catch (error) {
    console.log('Login failed:', error.response?.status, error.response?.data);
  }
}

testLogin();
