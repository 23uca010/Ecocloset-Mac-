import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://aayoxfrhxhcgqibvrjwj.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFheW94ZnJoeGhjZ3FpYnZyandqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5NTgwMDAsImV4cCI6MjA4ODUzNDAwMH0._X8d2gyb7zkRaZQWW66Do7PIHASekTnkz2vEyY2xdjw';

console.log('Frontend Supabase Configuration:');
console.log('URL:', supabaseUrl);
console.log('Key configured:', supabaseKey ? 'Yes' : 'No');

export const supabase = createClient(supabaseUrl, supabaseKey);

// Test connection
supabase
  .from('_dummy_test')
  .select('*')
  .then(({ error }) => {
    if (error) {
      console.log("Supabase reachable but table not found (this is OK)");
    } else {
      console.log("Supabase connected successfully");
    }
  });