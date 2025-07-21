import React from 'react';
import { Minus, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useTranslation } from '../../hooks/useTranslation';

interface CartProps {
  onBack: () => void;
  onCheckout: () => void;
}

export function Cart({ onBack, onCheckout }: CartProps) {
  const { state, dispatch } = useApp();
  const { t } = useTranslation();
  
  const currencySymbol = state.currency === 'USD' ? '$' : 'сум';
  const exchangeRate = state.currency === 'USD' ? 1 : 12500;

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
    } else {
      dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { productId, quantity } });
    }
  };

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const totalAmount = state.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const displayTotal = totalAmount * exchangeRate;

  if (state.cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 sm:mb-6 p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Continue Shopping</span>
        </button>
        
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{t('cart.empty')}</h2>
          <p className="text-gray-600 mb-6">Add some products to get started</p>
          <button
            onClick={onBack}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 pb-20 sm:pb-8">
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 sm:mb-6 p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Continue Shopping</span>
      </button>

      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-8">{t('cart.title')}</h1>

      <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
        {state.cart.map((item) => (
          <div key={item.product.id} className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
            <div className="flex items-start sm:items-center space-x-3 sm:space-x-4">
              <img
                src={item.product.image}
                alt={item.product.title}
                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg flex-shrink-0"
              />
              
              <div className="flex-1">
                <h3 className="text-sm sm:text-lg font-medium text-gray-900 mb-2 line-clamp-2">
                  {item.product.title}
                </h3>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4">
                  <span className="text-base sm:text-lg font-bold text-red-600">
                    {currencySymbol}
                    {state.currency === 'USD' 
                      ? (item.product.price * item.quantity).toFixed(2)
                      : (item.product.price * item.quantity * exchangeRate).toLocaleString()
                    }
                  </span>
                  <span className="text-sm text-gray-500">
                    {currencySymbol}
                    {state.currency === 'USD'
                      ? item.product.price.toFixed(2)
                      : (item.product.price * exchangeRate).toLocaleString()
                    } each
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                <div className="flex items-center border border-gray-300 rounded text-sm">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="p-1.5 sm:p-2 text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-3 sm:px-4 py-1.5 sm:py-2 border-x border-gray-300 min-w-[50px] sm:min-w-[60px] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="p-1.5 sm:p-2 text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <button
                  onClick={() => removeItem(item.product.id)}
                  className="p-1.5 sm:p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sticky Total Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 sticky bottom-16 sm:static shadow-lg sm:shadow-none sm:bg-gray-50">
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <span className="text-base sm:text-lg font-medium text-gray-900">{t('cart.total')}:</span>
          <span className="text-xl sm:text-2xl font-bold text-red-600">
            {currencySymbol}
            {state.currency === 'USD' 
              ? displayTotal.toFixed(2)
              : displayTotal.toLocaleString()
            }
          </span>
        </div>
        
        <button
          onClick={onCheckout}
          className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white py-3 sm:py-4 px-6 rounded-lg font-medium transition-colors active:scale-95 touch-manipulation"
        >
          {t('cart.checkout')}
        </button>
      </div>
    </div>
  );
}