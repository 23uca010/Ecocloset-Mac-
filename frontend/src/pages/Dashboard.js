import React from 'react';
import { Navigate } from 'react-router-dom';

// This file redirects to the InnovativeDashboard
// The original Dashboard.js had JSX syntax errors and was renamed to Dashboard_broken.js
const Dashboard = () => {
  return <Navigate to="/dashboard" replace />;
};

export default Dashboard;
