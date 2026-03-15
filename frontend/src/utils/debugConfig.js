// Debug utility to check environment configuration
console.log('=== SUPABASE CONFIGURATION DEBUG ===');
console.log('Environment Variables:');
console.log('REACT_APP_SUPABASE_URL:', process.env.REACT_APP_SUPABASE_URL);
console.log('REACT_APP_SUPABASE_ANON_KEY:', process.env.REACT_APP_SUPABASE_ANON_KEY ? 'CONFIGURED' : 'MISSING');

// Test if variables are loaded
const url = process.env.REACT_APP_SUPABASE_URL;
const key = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('❌ CONFIGURATION ERROR: Missing environment variables');
  console.error('Expected: REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY');
  console.error('Check: frontend/.env.local file exists and contains correct values');
} else {
  console.log('✅ Environment variables are properly configured');
  console.log('URL:', url);
  console.log('Key:', key.substring(0, 20) + '...');
}

export const checkConfig = () => {
  return {
    urlConfigured: !!process.env.REACT_APP_SUPABASE_URL,
    keyConfigured: !!process.env.REACT_APP_SUPABASE_ANON_KEY,
    url: process.env.REACT_APP_SUPABASE_URL,
    keyPreview: process.env.REACT_APP_SUPABASE_ANON_KEY ? process.env.REACT_APP_SUPABASE_ANON_KEY.substring(0, 20) + '...' : null
  };
};
