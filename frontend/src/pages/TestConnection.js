import React, { useState } from 'react';
import { testSupabaseConnection } from '../utils/testConnection';
import { checkConfig } from '../utils/debugConfig';

const TestConnection = () => {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const runTest = async () => {
    setLoading(true);
    setTestResult(null);
    
    const result = await testSupabaseConnection();
    
    setTestResult({
      success: result,
      message: result ? 'Connection successful!' : 'Connection failed',
      timestamp: new Date().toLocaleString()
    });
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Supabase Connection Test</h1>
        
        <button
          onClick={runTest}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        >
          {loading ? 'Testing...' : 'Test Connection'}
        </button>

        {testResult && (
          <div className={`mt-4 p-4 rounded-lg ${testResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            <h3 className="font-semibold mb-2">
              {testResult.success ? '✅ Success' : '❌ Failed'}
            </h3>
            <p className="text-sm">{testResult.message}</p>
            <p className="text-xs text-gray-600 mt-2">Tested at: {testResult.timestamp}</p>
          </div>
        )}

        <div className="mt-6 text-xs text-gray-600">
          <p><strong>Environment:</strong></p>
          <p>URL: {checkConfig().urlConfigured ? '✅ Configured' : '❌ Not configured'}</p>
          <p>Key: {checkConfig().keyConfigured ? '✅ Configured' : '❌ Not configured'}</p>
          {checkConfig().url && <p className="mt-2"><strong>URL:</strong> {checkConfig().url}</p>}
          {checkConfig().keyPreview && <p className="mt-1"><strong>Key Preview:</strong> {checkConfig().keyPreview}</p>}
        </div>
      </div>
    </div>
  );
};

export default TestConnection;
