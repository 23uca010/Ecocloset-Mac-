import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const ConnectionTest = () => {
  const [testResults, setTestResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [projectInfo, setProjectInfo] = useState({});

  const runConnectionTests = async () => {
    setIsLoading(true);
    const results = {};

    // Test 1: Basic Supabase Connection
    try {
      // Try auth service first (more reliable)
      const { data: authData, error: authError } = await supabase.auth.getSession();
      if (!authError) {
        results.connection = {
          success: true,
          method: 'auth_service',
          data: authData
        };
      } else {
        throw authError;
      }
    } catch (authErr) {
      // If auth fails, try database connection
      try {
        const { data, error } = await supabase.from('ngos').select('count').single();
        if (!error) {
          results.connection = {
            success: true,
            method: 'database',
            data: data
          };
        } else {
          results.connection = {
            success: false,
            error: error.message,
            authError: authErr.message
          };
        }
      } catch (dbErr) {
        results.connection = {
          success: false,
          error: 'Both auth and database connection failed',
          authError: authErr.message,
          dbError: dbErr.message
        };
      }
    }

    // Test 2: Auth Service
    try {
      const { data, error } = await supabase.auth.getSession();
      results.auth = {
        success: !error,
        hasSession: !!data.session,
        error: error?.message
      };
    } catch (err) {
      results.auth = {
        success: false,
        error: err.message
      };
    }

    // Test 3: Database Tables
    const tables = ['users', 'items', 'ngos', 'donations', 'swaps'];
    results.tables = {};
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase.from(table).select('count').single();
        results.tables[table] = {
          success: !error,
          count: data?.count || 0,
          error: error?.message
        };
      } catch (err) {
        results.tables[table] = {
          success: false,
          error: err.message
        };
      }
    }

    // Test 4: User Registration Test
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
      
      results.signupTest = {
        success: !error,
        userCreated: !!data.user,
        error: error?.message
      };

      // Clean up - delete test user
      if (data.user && !error) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      results.signupTest = {
        success: false,
        error: err.message
      };
    }

    setTestResults(results);
    setIsLoading(false);
  };

  useEffect(() => {
    // Get project info
    setProjectInfo({
      url: supabase.supabaseUrl,
      hasKey: !!supabase.supabaseKey,
      keyLength: supabase.supabaseKey?.length || 0
    });
  }, []);

  const getStatusColor = (success) => success ? 'text-green-600' : 'text-red-600';
  const getBgColor = (success) => success ? 'bg-green-50' : 'bg-red-50';

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Supabase Connection Test</h2>
        
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Project Information:</h3>
          <div className="text-sm text-blue-800">
            <p><strong>URL:</strong> {projectInfo.url}</p>
            <p><strong>Has Key:</strong> {projectInfo.hasKey ? 'Yes' : 'No'}</p>
            <p><strong>Key Length:</strong> {projectInfo.keyLength} characters</p>
          </div>
        </div>

        <button
          onClick={runConnectionTests}
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium"
        >
          {isLoading ? 'Running Tests...' : 'Run Connection Tests'}
        </button>
      </div>

      {Object.keys(testResults).length > 0 && (
        <div className="space-y-4">
          {/* Connection Test */}
          <div className={`p-4 rounded-lg ${getBgColor(testResults.connection?.success)}`}>
            <h3 className="font-semibold mb-2">1. Basic Connection</h3>
            <p className={getStatusColor(testResults.connection?.success)}>
              {testResults.connection?.success ? 
                `✅ Connected via ${testResults.connection?.method || 'unknown'}` : 
                '❌ Connection Failed'
              }
            </p>
            {testResults.connection?.error && (
              <div className="mt-2">
                <p className="text-sm text-red-700">Error: {testResults.connection.error}</p>
                {testResults.connection?.authError && (
                  <p className="text-sm text-red-600">Auth Error: {testResults.connection.authError}</p>
                )}
                {testResults.connection?.dbError && (
                  <p className="text-sm text-red-600">DB Error: {testResults.connection.dbError}</p>
                )}
              </div>
            )}
            {testResults.connection?.success && (
              <p className="text-sm text-green-700 mt-1">
                {testResults.connection?.method === 'auth_service' ? 
                  'Auth service is working' : 
                  'Database connection is working'
                }
              </p>
            )}
          </div>

          {/* Auth Test */}
          <div className={`p-4 rounded-lg ${getBgColor(testResults.auth?.success)}`}>
            <h3 className="font-semibold mb-2">2. Auth Service</h3>
            <p className={getStatusColor(testResults.auth?.success)}>
              {testResults.auth?.success ? '✅ Auth Service Working' : '❌ Auth Service Failed'}
            </p>
            {testResults.auth?.hasSession && (
              <p className="text-sm text-green-700">User is logged in</p>
            )}
            {testResults.auth?.error && (
              <p className="text-sm text-red-700 mt-1">Error: {testResults.auth.error}</p>
            )}
          </div>

          {/* Tables Test */}
          <div className={`p-4 rounded-lg ${getBgColor(Object.values(testResults.tables).every(t => t.success))}`}>
            <h3 className="font-semibold mb-2">3. Database Tables</h3>
            {Object.entries(testResults.tables).map(([table, result]) => (
              <div key={table} className="flex justify-between items-center py-1">
                <span className="capitalize">{table}:</span>
                <span className={getStatusColor(result.success)}>
                  {result.success ? `✅ (${result.count} records)` : '❌ Failed'}
                </span>
              </div>
            ))}
          </div>

          {/* Signup Test */}
          <div className={`p-4 rounded-lg ${getBgColor(testResults.signupTest?.success)}`}>
            <h3 className="font-semibold mb-2">4. Registration Test</h3>
            <p className={getStatusColor(testResults.signupTest?.success)}>
              {testResults.signupTest?.success ? '✅ Registration Working' : '❌ Registration Failed'}
            </p>
            {testResults.signupTest?.userCreated && (
              <p className="text-sm text-green-700">Test user created successfully</p>
            )}
            {testResults.signupTest?.error && (
              <p className="text-sm text-red-700 mt-1">Error: {testResults.signupTest.error}</p>
            )}
          </div>

          {/* Overall Status */}
          <div className={`p-4 rounded-lg ${
            testResults.connection?.success && 
            testResults.auth?.success && 
            Object.values(testResults.tables).every(t => t.success) &&
            testResults.signupTest?.success 
              ? 'bg-green-50' : 'bg-red-50'
          }`}>
            <h3 className="font-bold text-lg mb-2">Overall Status</h3>
            <p className={`text-lg ${
              testResults.connection?.success && 
              testResults.auth?.success && 
              Object.values(testResults.tables).every(t => t.success) &&
              testResults.signupTest?.success 
                ? 'text-green-700' : 'text-red-700'
            }`}>
              {testResults.connection?.success && 
               testResults.auth?.success && 
               Object.values(testResults.tables).every(t => t.success) &&
               testResults.signupTest?.success 
                ? '🎉 ALL SYSTEMS WORKING!' : '❌ ISSUES DETECTED'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectionTest;
