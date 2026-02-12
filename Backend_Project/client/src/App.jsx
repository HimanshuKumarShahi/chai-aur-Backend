import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';

// --- 👇 THESE ARE CRITICAL PLACEHOLDERS ---
// If you delete these lines, the app will crash because 
// <Register /> and <Dashboard /> won't exist!
const Register = () => (
  <div className="flex items-center justify-center h-screen bg-gray-100">
    <h1 className="text-2xl font-bold">Register Page (Coming Soon)</h1>
  </div>
);

const Dashboard = () => (
  <div className="flex items-center justify-center h-screen bg-green-100">
    <h1 className="text-2xl font-bold">Dashboard (Coming Soon)</h1>
  </div>
);
// ------------------------------------------

function App() {
  return (
    <Routes>
      {/* Redirect root URL to Login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* The Login Page */}
      <Route path="/login" element={<Login />} />
      
      {/* The Placeholder Pages */}
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;