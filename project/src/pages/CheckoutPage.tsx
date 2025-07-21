import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Checkout } from '../components/Checkout/Checkout';

export function CheckoutPage() {
  const navigate = useNavigate();

  return (
    <Checkout
      onBack={() => navigate('/cart')}
      onComplete={() => {
        navigate('/');
        // Show success message
        setTimeout(() => {
          alert('Order placed successfully!');
        }, 100);
      }}
    />
  );
}