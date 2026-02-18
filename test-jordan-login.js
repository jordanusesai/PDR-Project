const axios = require('axios');

async function testJordanLogin() {
  try {
    console.log('Testing Jordan login...');
    
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      username: 'Jordan',
      password: 'Testing123'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Jordan login successful!');
    console.log('Response:', response.data);
  } catch (error) {
    console.log('❌ Jordan login failed:');
    console.log('Status:', error.response?.status);
    console.log('Error:', error.response?.data);
  }
}

testJordanLogin();
