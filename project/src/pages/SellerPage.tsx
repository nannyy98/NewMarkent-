import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SellerDashboard } from '../components/Seller/SellerDashboard';

export function SellerPage() {
  const navigate = useNavigate();

  return (
    <SellerDashboard onBack={() => navigate('/')} />
  );
}