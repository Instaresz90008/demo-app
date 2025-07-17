
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import EnhancedLogin from '@/pages/prod-login';

/**
 * Shell for public/unauthenticated users
 */
const AppPublicShell: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/prod-login" element={<EnhancedLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/public-booking/:linkId" element={<div>Public Booking Page</div>} />
        <Route path="*" element={<Navigate to="/prod-login" replace />} />
      </Routes>
    </div>
  );
};

export default AppPublicShell;
