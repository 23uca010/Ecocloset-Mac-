const mongoose = require('mongoose');
const User = require('./models/User');

const recreateTestUser = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/ecocloset');
    
    // Delete existing test user
    await User.deleteOne({ username: 'test' });
    console.log('Deleted existing test user');
    
    // Create new test user
    const newUser = new User({
      username: 'test',
      email: 'test@example.com',
      password: 'test123',
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
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
};

recreateTestUser();
