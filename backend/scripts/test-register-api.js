const axios = require('axios');

async function testRegistration() {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Test Volkov',
      email: `testvolkov_${Date.now()}@example.com`,
      password: 'password123',
      phone: '1234567890',
      location: 'Test City'
    });
    
    console.log('Registration Response:', JSON.stringify(response.data, null, 2));
    
    if (response.data.success) {
      console.log('✅ Registration Test PASSED');
    } else {
      console.log('❌ Registration Test FAILED:', response.data.message);
    }
  } catch (error) {
    if (error.response) {
      console.log('❌ Registration Test FAILED:', error.response.status, JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('❌ Registration Test FAILED:', error.message);
    }
  }
}

testRegistration();
