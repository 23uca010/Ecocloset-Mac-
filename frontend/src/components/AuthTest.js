import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthTest = () => {
  const [testResults, setTestResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const testSupabaseConnection = async () => {
    setIsLoading(true);
    const results = {};

    // Test 1: Basic connection
    try {
      const { data, error } = await supabase.from('ngos').select('count').single();
      results.connection = {
        success: !error,
        data: data,
        error: error?.message
      };
    } catch (err) {
      results.connection = {
        success: false,
        error: err.message
      };
    }

    // Test 2: Check if auth is working
    try {
      const { data, error } = await supabase.auth.getSession();
      results.authSession = {
        success: !error,
        hasSession: !!data.session,
        error: error?.message
      };
    } catch (err) {
      results.authSession = {
        success: false,
        error: err.message
      };
    }

    // Test 3: Try to create a test user
    try {
      const testEmail = `test${Date.now()}@example.com`;
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: 'testpassword123',
        options: {
          data: {
            firstName: 'Test',
            lastName: 'User',
            username: `testuser${Date.now()}`
          }
        }
      });
      
      results.signup = {
        success: !error,
        data: data,
        error: error?.message,
        testEmail: testEmail
      };

      // If signup successful, try to login
      if (!error && data.user) {
        try {
          const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
            email: testEmail,
            password: 'testpassword123'
          });
          
          results.login = {
            success: !loginError,
            data: loginData,
            error: loginError?.message
          };

          // Clean up - delete the test user
          if (!loginError) {
            await supabase.auth.signOut();
          }
        } catch (loginErr) {
          results.login = {
            success: false,
            error: loginErr.message
          };
        }
      }
    } catch (err) {
      results.signup = {
        success: false,
        error: err.message
      };
    }

    setTestResults(results);
    setIsLoading(false);
  };

  const clearResults = () => {
    setTestResults({});
  };

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f8f9fa', 
      margin: '20px 0', 
      borderRadius: '8px',
      border: '1px solid #dee2e6'
    }}>
      <h3>🧪 Supabase Authentication Test</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testSupabaseConnection}
          disabled={isLoading}
          style={{
            padding: '10px 20px',
            backgroundColor: isLoading ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            marginRight: '10px'
          }}
        >
          {isLoading ? 'Testing...' : 'Run Authentication Tests'}
        </button>
        
        <button 
          onClick={clearResults}
          style={{
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Clear Results
        </button>
      </div>

      {Object.keys(testResults).length > 0 && (
        <div>
          <h4>Test Results:</h4>
          
          {/* Connection Test */}
          <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: testResults.connection?.success ? '#d4edda' : '#f8d7da', borderRadius: '4px' }}>
            <strong>🔗 Database Connection:</strong> {testResults.connection?.success ? '✅ Success' : '❌ Failed'}
            {testResults.connection?.error && <div><small>Error: {testResults.connection.error}</small></div>}
          </div>

          {/* Auth Session Test */}
          <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: testResults.authSession?.success ? '#d4edda' : '#f8d7da', borderRadius: '4px' }}>
            <strong>🔐 Auth Session:</strong> {testResults.authSession?.success ? '✅ Working' : '❌ Failed'}
            {testResults.authSession?.hasSession && <div><small>Active session found</small></div>}
            {testResults.authSession?.error && <div><small>Error: {testResults.authSession.error}</small></div>}
          </div>

          {/* Signup Test */}
          <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: testResults.signup?.success ? '#d4edda' : '#f8d7da', borderRadius: '4px' }}>
            <strong>📝 User Signup:</strong> {testResults.signup?.success ? '✅ Success' : '❌ Failed'}
            {testResults.signup?.testEmail && <div><small>Test email: {testResults.signup.testEmail}</small></div>}
            {testResults.signup?.error && <div><small>Error: {testResults.signup.error}</small></div>}
          </div>

          {/* Login Test */}
          {testResults.login && (
            <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: testResults.login?.success ? '#d4edda' : '#f8d7da', borderRadius: '4px' }}>
              <strong>🔑 User Login:</strong> {testResults.login?.success ? '✅ Success' : '❌ Failed'}
              {testResults.login?.error && <div><small>Error: {testResults.login.error}</small></div>}
            </div>
          )}

          {/* Recommendations */}
          <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
            <h4>💡 Recommendations:</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              {!testResults.connection?.success && (
                <li>Set up your Supabase project at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer">supabase.com</a></li>
              )}
              {!testResults.connection?.success && (
                <li>Run the SQL schema from <code>supabase-schema.sql</code></li>
              )}
              {testResults.signup?.error?.includes('already registered') && (
                <li>Try a different email or check existing users</li>
              )}
              {testResults.signup?.error?.includes('Invalid') && (
                <li>Check your Supabase URL and anon key configuration</li>
              )}
              {testResults.connection?.success && testResults.signup?.success && (
                <li>✅ Everything looks good! Try the normal signup/login pages.</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthTest;
