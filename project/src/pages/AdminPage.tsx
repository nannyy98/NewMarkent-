import React from 'react';
import { Navigate } from 'react-router-dom';
import { AdminDashboard } from '../components/Admin/AdminDashboard';

export function AdminPage() {
  // Check if admin is logged in
  const isAdminLoggedIn = localStorage.getItem('admin_session') === 'true';
  
  if (!isAdminLoggedIn) {
    return <Navigate to="/admin-login" />;
  }
  
  return <AdminDashboard />;
}