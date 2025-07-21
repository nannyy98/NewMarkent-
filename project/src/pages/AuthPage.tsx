import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthModal } from '../components/Auth/AuthModal';

export function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleClose = () => {
    navigate(from);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <AuthModal
          isOpen={true}
          onClose={handleClose}
          initialMode="login"
        />
      </div>
    </div>
  );
}