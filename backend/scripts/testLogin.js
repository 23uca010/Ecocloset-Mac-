const { supabase } = require('./config/supabaseClientDirect');

const testLoginSupabase = async () => {
  try {
    console.log('🔗 Testing Supabase Login...');
    
    // Test 1: Direct Supabase authentication
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'test123'
    });
    
    console.log('🔐 Supabase Auth Response:');
    console.log('Error:', error);
    console.log('Data:', data);
    
    if (error) {
      console.log('❌ Supabase login failed!');
      console.log('Error message:', error.message);
      
      // Test 2: Try with different credentials
      console.log('\n🔄 Trying with different credentials...');
      const { data: data2, error: error2 } = await supabase.auth.signInWithPassword({
        email: 'user@example.com',
        password: 'password123'
      });
      
      if (error2) {
        console.log('❌ Second login also failed:', error2.message);
      } else {
        console.log('✅ Second login successful!');
        console.log('User:', data2.user);
        console.log('Session:', data2.session);
      }
    } else {
      console.log('✅ Supabase login successful!');
      console.log('User:', data.user);
      console.log('Session:', data.session);
      console.log('Access Token:', data.session?.access_token ? 'Present' : 'Missing');
    }
    
    // Test 3: Check current session
    console.log('\n🔍 Checking current session...');
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.log('❌ Session check failed:', sessionError.message);
    } else {
      console.log('✅ Session check successful!');
      console.log('Active User:', sessionData.user?.email || 'No active user');
    }
    
  } catch (error) {
    console.error('❌ Supabase Login Test Error:');
    console.error('Error:', error.message);
  }
};

// Test Supabase connection first
console.log('🧪 Testing Supabase connection...');
supabase.auth.getSession().then(({ error }) => {
  if (error) {
    console.error('❌ Supabase connection test failed:', error.message);
  } else {
    console.log('✅ Supabase connection test passed');
    console.log('🔐 Now testing login functionality...\n');
    testLoginSupabase();
  }
}).catch(err => {
  console.error('❌ Supabase client initialization error:', err);
});

module.exports = { testLoginSupabase };
