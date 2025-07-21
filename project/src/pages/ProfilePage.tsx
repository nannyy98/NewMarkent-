import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Profile } from '../components/Profile/Profile';

export function ProfilePage() {
  const navigate = useNavigate();

  return (
    <Profile
      onBack={() => navigate('/')}
      onProductClick={(productId) => navigate(`/product/${productId}`)}
    />
  );
}