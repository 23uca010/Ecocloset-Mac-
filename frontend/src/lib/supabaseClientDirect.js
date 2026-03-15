import { createClient } from "@supabase/supabase-js";

// Hardcoded configuration to avoid environment variable issues
const SUPABASE_URL = 'https://aayoxfrhxhcgqibvrjwj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFheW94ZnJoeGhjZ3FpYnZyandqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5NTgwMDAsImV4cCI6MjA4ODUzNDAwMH0._X8d2gyb7zkRaZQWW66Do7PIHASekTnkz2vEyY2xdjw';

// Create Supabase client with hardcoded values
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Test connection immediately
console.log('🔗 Supabase Client Initialized');
console.log('🌐 URL:', SUPABASE_URL);
console.log('🔑 Key:', SUPABASE_ANON_KEY ? 'Present' : 'Missing');

// Test connection
supabase.auth.getSession().then(({ error }) => {
  if (error) {
    console.error('❌ Supabase connection test failed:', error.message);
  } else {
    console.log('✅ Supabase connection test passed');
  }
}).catch(err => {
  console.error('❌ Supabase client initialization error:', err);
});

export default supabase;
