import { supabase } from '../lib/supabaseClient';

export const testSupabaseConnection = async () => {
  console.log('Testing Supabase Connection...');
  console.log('URL:', process.env.REACT_APP_SUPABASE_URL);
  console.log('Key configured:', process.env.REACT_APP_SUPABASE_ANON_KEY ? 'Yes' : 'No');
  
  try {
    // Test 1: Basic auth service
    const { error } = await supabase.auth.getSession();
    if (!error) {
      console.log('✅ Auth service connection successful');
      return true;
    }
  } catch (err) {
    console.error('❌ Auth service failed:', err.message);
  }
  
  try {
    // Test 2: Database connection
    const { error } = await supabase.from('ngos').select('count').single();
    if (!error) {
      console.log('✅ Database connection successful');
      return true;
    } else {
      console.log('⚠️ Database test failed (table may not exist):', error.message);
    }
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
  }
  
  return false;
};
