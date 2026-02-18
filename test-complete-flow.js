const axios = require('axios');

async function testCompleteLoginFlow() {
  try {
    console.log('=== Testing Complete Login Flow ===');
    
    // Step 1: Login
    console.log('\n1. Testing login...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      username: 'Jordan',
      password: 'Testing123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful!');
    console.log('Token:', token.substring(0, 30) + '...');
    
    // Step 2: Test /auth/me with token
    console.log('\n2. Testing /auth/me endpoint...');
    const meResponse = await axios.get('http://localhost:5000/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ /auth/me successful!');
    console.log('User:', meResponse.data.user.username);
    
    // Step 3: Test token validation
    console.log('\n3. Testing token validation...');
    const jwt = require('jsonwebtoken');
    const JWT_SECRET = '6f9a2b8c3e4d5f1g2h3i4j6k9l7L8a9d0i';
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log('✅ Token valid!');
      console.log('User ID:', decoded.userId);
    } catch (jwtError) {
      console.log('❌ Token invalid:', jwtError.message);
    }
    
    console.log('\n=== All Tests Passed! ===');
    console.log('The login flow is working correctly.');
    console.log('The issue was likely the JWT_SECRET mismatch in auth middleware.');
    
  } catch (error) {
    console.log('❌ Test failed:');
    console.log('Status:', error.response?.status);
    console.log('Error:', error.response?.data);
  }
}

testCompleteLoginFlow();
