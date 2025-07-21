import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Smartphone } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Address } from '../../types';
import { PaymentSystem } from '../Payment/PaymentSystem';

interface CheckoutProps {
  onBack: () => void;
  onComplete: () => void;
}

export function Checkout({ onBack, onComplete }: CheckoutProps) {
  const { state, dispatch } = useApp();
  const [step, setStep] = useState(1);
  const [paymentStep, setPaymentStep] = useState(false);
  const [address, setAddress] = useState<Address>({
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    country: '',
    zipCode: '',
    phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('click');

  const currencySymbol = state.currency === 'USD' ? '$' : 'сум';
  const exchangeRate = state.currency === 'USD' ? 1 : 12500;
  const totalAmount = state.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const displayTotal = totalAmount * exchangeRate;

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentStep(true);
  };

  const handlePaymentComplete = (paymentId: string) => {
    // Create order
    const newOrder = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      status: 'pending' as const,
      total: totalAmount,
      items: [...state.cart],
      shippingAddress: address,
    };

    dispatch({ type: 'ADD_ORDER', payload: newOrder });
    dispatch({ type: 'CLEAR_CART' });
    onComplete();
  };

  const handlePaymentError = (error: string) => {
    alert(`Ошибка оплаты: ${error}`);
    setPaymentStep(false);
  };

  const paymentMethods = [
    { id: 'click', name: 'Click', icon: CreditCard },
    { id: 'payme', name: 'Payme', icon: Smartphone },
    { id: 'paypal', name: 'PayPal', icon: CreditCard },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to Cart</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {paymentStep ? (
            <PaymentSystem
              amount={totalAmount}
              onPaymentComplete={handlePaymentComplete}
              onPaymentError={handlePaymentError}
            />
          ) : step === 1 ? (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Address</h2>
              <form onSubmit={handleAddressSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={address.firstName}
                    onChange={(e) => setAddress({ ...address, firstName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={address.lastName}
                    onChange={(e) => setAddress({ ...address, lastName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <input
                  type="text"
                  placeholder="Street Address"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="City"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Country"
                    value={address.country}
                    onChange={(e) => setAddress({ ...address, country: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="ZIP Code"
                    value={address.zipCode}
                    onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                >
                  Continue to Payment
                </button>
              </form>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Method</h2>
              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center p-4 border rounded-lg cursor-pointer ${
                        paymentMethod === method.id ? 'border-orange-500 bg-orange-50' : 'border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="sr-only"
                      />
                      <method.icon className="h-6 w-6 text-gray-600 mr-3" />
                      <span className="font-medium">{method.name}</span>
                    </label>
                  ))}
                </div>
                <button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                >
                  Перейти к оплате
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-lg p-6 h-fit">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
          <div className="space-y-3 mb-4">
            {state.cart.map((item) => (
              <div key={item.product.id} className="flex justify-between">
                <span className="text-gray-600">
                  {item.product.title.slice(0, 30)}... x{item.quantity}
                </span>
                <span className="font-medium">
                  {currencySymbol}
                  {state.currency === 'USD'
                    ? (item.product.price * item.quantity).toFixed(2)
                    : (item.product.price * item.quantity * exchangeRate).toLocaleString()
                  }
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-300 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">Total:</span>
              <span className="text-xl font-bold text-red-600">
                {currencySymbol}
                {state.currency === 'USD'
                  ? displayTotal.toFixed(2)
                  : displayTotal.toLocaleString()
                }
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}