import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const QuickFix = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState([]);

  const runQuickFix = async () => {
    setIsRunning(true);
    const fixResults = [];

    // Fix 1: Check environment variables
    const envCheck = {
      name: 'Environment Variables',
      status: 'checking',
      message: 'Checking configuration...'
    };
    fixResults.push(envCheck);

    const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
    const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      envCheck.status = 'error';
      envCheck.message = 'Missing environment variables. Please create .env.local file.';
      envCheck.solution = 'Create frontend/.env.local with REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY';
    } else {
      envCheck.status = 'success';
      envCheck.message = 'Environment variables found';
    }

    // Fix 2: Test basic connection
    const connectionCheck = {
      name: 'Basic Connection',
      status: 'checking',
      message: 'Testing Supabase connection...'
    };
    fixResults.push(connectionCheck);

    try {
      const { data, error } = await supabase.auth.getSession();
      if (!error) {
        connectionCheck.status = 'success';
        connectionCheck.message = 'Connection successful via auth service';
      } else {
        throw error;
      }
    } catch (err) {
      connectionCheck.status = 'error';
      connectionCheck.message = 'Connection failed';
      connectionCheck.solution = 'Check your Supabase URL and anon key in .env.local';
    }

    // Fix 3: Check authentication
    const authCheck = {
      name: 'Authentication',
      status: 'checking',
      message: 'Testing authentication...'
    };
    fixResults.push(authCheck);

    try {
      const { data, error } = await supabase.auth.getUser();
      if (!error) {
        authCheck.status = 'success';
        authCheck.message = data.user ? 'User is logged in' : 'No active session (normal)';
      } else {
        authCheck.status = 'warning';
        authCheck.message = 'Auth check completed (no active session)';
      }
    } catch (err) {
      authCheck.status = 'error';
      authCheck.message = 'Authentication error';
      authCheck.solution = 'Try refreshing the page or clearing browser cache';
    }

    // Fix 4: Common solutions
    const solutionsCheck = {
      name: 'Common Solutions',
      status: 'info',
      message: 'Recommended fixes:',
      solutions: [
        '1. Restart your development server (npm start)',
        '2. Clear browser cache and localStorage',
        '3. Check .env.local file is in frontend folder',
        '4. Verify Supabase project is active',
        '5. Check internet connection'
      ]
    };
    fixResults.push(solutionsCheck);

    setResults(fixResults);
    setIsRunning(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50';
      case 'error': return 'text-red-600 bg-red-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'info': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '🔄';
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Fix Tool</h2>
        <p className="text-gray-600 mb-6">
          Automatically diagnose and fix common connection issues
        </p>

        <button
          onClick={runQuickFix}
          disabled={isRunning}
          className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition-colors font-medium mb-6"
        >
          {isRunning ? 'Running Diagnostics...' : 'Run Quick Fix'}
        </button>

        {results.length > 0 && (
          <div className="space-y-3">
            {results.map((result, index) => (
              <div key={index} className={`p-4 rounded-lg ${getStatusColor(result.status)}`}>
                <div className="flex items-start">
                  <span className="text-lg mr-3">{getStatusIcon(result.status)}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{result.name}</h3>
                    <p className="text-sm mb-2">{result.message}</p>
                    {result.solution && (
                      <div className="mt-2 p-2 bg-white bg-opacity-50 rounded text-sm">
                        <strong>Solution:</strong> {result.solution}
                      </div>
                    )}
                    {result.solutions && (
                      <div className="mt-2 text-sm">
                        <ul className="list-disc list-inside space-y-1">
                          {result.solutions.map((solution, idx) => (
                            <li key={idx}>{solution}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {results.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Next Steps:</h3>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Fix any errors shown above</li>
              <li>2. Restart your development server</li>
              <li>3. Refresh your browser</li>
              <li>4. Try registering/logging in again</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickFix;
