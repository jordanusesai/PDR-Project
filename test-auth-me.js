const axios = require('axios');

async function testAuthMe() {
  try {
    console.log('Testing /auth/me endpoint...');
    
    // First login to get token
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      username: 'Jordan',
      password: 'Testing123'
    });
    
    const token = loginResponse.data.token;
    console.log('Got token:', token.substring(0, 20) + '...');
    
    // Now test /auth/me
    const meResponse = await axios.get('http://localhost:5000/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ /auth/me successful!');
    console.log('User data:', meResponse.data);
    
  } catch (error) {
    console.log('❌ /auth/me failed:');
    console.log('Status:', error.response?.status);
    console.log('Error:', error.response?.data);
  }
}

testAuthMe();
