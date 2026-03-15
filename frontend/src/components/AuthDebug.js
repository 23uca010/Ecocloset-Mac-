import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';

const AuthDebug = () => {
  const { user, isAuthenticated, login, register, logout, error, loading } = useAuth();
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    const checkSupabaseConnection = async () => {
      try {
        const { data, error } = await supabase.from('ngos').select('count').single();
        setDebugInfo({
          supabaseConnected: !error,
          error: error?.message,
          user: user,
          isAuthenticated: isAuthenticated,
          loading: loading
        });
      } catch (err) {
        setDebugInfo({
          supabaseConnected: false,
          error: err.message,
          user: user,
          isAuthenticated: isAuthenticated,
          loading: loading
        });
      }
    };

    checkSupabaseConnection();
  }, [user, isAuthenticated, loading]);

  const handleTestRegister = async () => {
    try {
      await register({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      });
    } catch (err) {
      console.error('Test register error:', err);
    }
  };

  const handleTestLogin = async () => {
    try {
      await login('test@example.com', 'password123');
    } catch (err) {
      console.error('Test login error:', err);
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', margin: '20px', borderRadius: '8px' }}>
      <h3>Authentication Debug Info</h3>
      <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
      
      <div style={{ marginTop: '20px' }}>
        <button onClick={handleTestRegister} style={{ marginRight: '10px', padding: '8px 16px' }}>
          Test Register
        </button>
        <button onClick={handleTestLogin} style={{ marginRight: '10px', padding: '8px 16px' }}>
          Test Login
        </button>
        <button onClick={logout} style={{ padding: '8px 16px' }}>
          Logout
        </button>
      </div>
      
      {error && (
        <div style={{ marginTop: '10px', color: 'red' }}>
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
};

export default AuthDebug;
