const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const createTestUser = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/ecocloset');
    
    // Delete existing test user
    await User.deleteOne({ username: 'test' });
    console.log('Deleted existing test user');
    
    // Hash password manually
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash('test123', salt);
    
    // Create new test user with pre-hashed password
    const newUser = new User({
      username: 'test',
      email: 'test@example.com',
      password: hashedPassword,
      firstName: 'Test',
      lastName: 'User',
      role: 'user'
    });
    
    await newUser.save();
    console.log('✅ New test user created successfully!');
    console.log('Username: test');
    console.log('Password: test123');
    
    // Test the password
    const isValid = await newUser.comparePassword('test123');
    console.log('Password verification test:', isValid ? '✅ PASSED' : '❌ FAILED');
    
    // Test login API
    const axios = require('axios');
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username: 'test',
        password: 'test123'
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Login API Test:');
      console.log('Status:', response.status);
      console.log('Success:', response.data.success);
      console.log('User:', response.data.data.user.firstName);
      
    } catch (error) {
      console.log('❌ Login API Error:', error.response?.data || error.message);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
};

createTestUser();
