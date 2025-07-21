import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Cart } from '../components/Cart/Cart';

export function CartPage() {
  const navigate = useNavigate();

  return (
    <Cart
      onBack={() => navigate('/')}
      onCheckout={() => navigate('/checkout')}
    />
  );
}