// Test API connection from frontend perspective
const axios = require('axios');

async function testAPIConnection() {
  try {
    console.log('Testing API connection...');
    
    const response = await axios.get('http://localhost:5000/api/auth/test', {
      timeout: 5000
    });
    
    console.log('✅ API connection successful:', response.data);
  } catch (error) {
    console.log('❌ API connection failed:');
    console.log('Status:', error.response?.status);
    console.log('Error:', error.message);
    
    // Test if backend is reachable at all
    try {
      await axios.get('http://localhost:5000/', { timeout: 3000 });
      console.log('✅ Backend server is reachable');
    } catch (err) {
      console.log('❌ Backend server not reachable:', err.message);
    }
  }
}

testAPIConnection();
