const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://aayoxfrhxhcgqibvrjwj.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFheW94ZnJoeGhjZ3FpYnZyandqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5NTgwMDAsImV4cCI6MjA4ODUzNDAwMH0._X8d2gyb7zkRaZQWW66Do7PIHASekTnkz2vEyY2xdjw';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔗 Backend Supabase Configuration:');
console.log('🌐 URL:', supabaseUrl);
console.log('🔑 Key configured:', supabaseKey ? 'Yes' : 'No');

// Test connection
supabase.from('users').select('count').single()
  .then(({ data, error }) => {
    if (!error) {
      console.log('✅ Backend Supabase connection successful');
    } else {
      console.error('❌ Backend Supabase connection failed:', error.message);
    }
  })
  .catch(err => {
    console.error('❌ Backend Supabase client error:', err);
  });

module.exports = { supabase };
