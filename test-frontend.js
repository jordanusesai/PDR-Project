const axios = require('axios');

async function testFrontendAccess() {
  try {
    console.log('Testing frontend access...');
    
    const response = await axios.get('http://localhost:3000', {
      timeout: 5000,
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });
    
    console.log('✅ Frontend accessible:', response.status);
    console.log('Content type:', response.headers['content-type']);
    
  } catch (error) {
    console.log('❌ Frontend access failed:');
    console.log('Status:', error.response?.status);
    console.log('Error:', error.message);
  }
}

testFrontendAccess();
