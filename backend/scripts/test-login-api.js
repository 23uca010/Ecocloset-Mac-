const axios = require('axios');

async function testLogin() {
  const email = 'test_auth_fix@example.com';
  const password = 'password123';
  const url = 'http://localhost:5000/api/auth/login';

  console.log(`Attempting login for ${email}...`);

  try {
    const response = await axios.post(url, {
      email,
      password
    });

    console.log('Login Response:', JSON.stringify(response.data, null, 2));
    
    if (response.data.success) {
      console.log('✅ Login Test PASSED');
    } else {
      console.log('❌ Login Test FAILED');
    }
  } catch (error) {
    console.error('Login Error:', error.response ? error.response.data : error.message);
    console.log('❌ Login Test FAILED');
  }
}

testLogin();
