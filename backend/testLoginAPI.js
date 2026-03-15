const axios = require('axios');

const testLoginAPI = async () => {
  try {
    console.log('Testing login API...');
    
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      username: 'test',
      password: 'test123'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Login API Response:');
    console.log('Status:', response.status);
    console.log('Data:', response.data);
    
    if (response.data.success) {
      console.log('✅ Login successful!');
      console.log('User:', response.data.data.user);
      console.log('Token:', response.data.data.token ? 'Present' : 'Missing');
    } else {
      console.log('❌ Login failed!');
    }
    
  } catch (error) {
    console.error('❌ Login API Error:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
  }
};

testLoginAPI();
