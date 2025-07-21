import React from 'react';
import { Heart, ShoppingCart, X, Star } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useTranslation } from '../../hooks/useTranslation';

interface ProductWishlistProps {
  onProductClick: (productId: string) => void;
}

export function ProductWishlist({ onProductClick }: ProductWishlistProps) {
  const { state, dispatch } = useApp();
  const { t } = useTranslation();
  
  const currencySymbol = state.currency === 'USD' ? '$' : 'сум';
  const exchangeRate = state.currency === 'USD' ? 1 : 12500;

  const handleRemoveFromWishlist = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_FAVORITES', payload: productId });
  };

  const handleAddToCart = (productId: string) => {
    const product = state.favorites.find(p => p.id === productId);
    if (product) {
      dispatch({ type: 'ADD_TO_CART', payload: { product, quantity: 1 } });
    }
  };

  if (state.favorites.length === 0) {
    return (
      <div className="text-center py-16">
        <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
        <p className="text-gray-600 mb-6">Save products you love to easily find them later</p>
        <button
          onClick={() => window.history.back()}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
        <span className="text-gray-600">{state.favorites.length} items</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {state.favorites.map((product) => (
          <div key={product.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-48 object-cover cursor-pointer"
                onClick={() => onProductClick(product.id)}
              />
              <button
                onClick={() => handleRemoveFromWishlist(product.id)}
                className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors"
              >
                <X className="h-4 w-4 text-gray-600" />
              </button>
              {product.discount && (
                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                  -{product.discount}%
                </div>
              )}
            </div>
            
            <div className="p-4">
              <h3 
                className="font-medium text-gray-900 mb-2 line-clamp-2 cursor-pointer hover:text-orange-600 transition-colors"
                onClick={() => onProductClick(product.id)}
              >
                {product.title}
              </h3>
              
              <div className="flex items-center mb-3">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                <span className="text-sm text-gray-500 ml-1">({product.reviewCount})</span>
              </div>
              
              <div className="flex items-baseline space-x-2 mb-4">
                <span className="text-lg font-bold text-red-600">
                  {currencySymbol}
                  {state.currency === 'USD' 
                    ? product.price.toFixed(2)
                    : (product.price * exchangeRate).toLocaleString()
                  }
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    {currencySymbol}
                    {state.currency === 'USD' 
                      ? product.originalPrice.toFixed(2)
                      : (product.originalPrice * exchangeRate).toLocaleString()
                    }
                  </span>
                )}
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleAddToCart(product.id)}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 px-3 rounded-lg transition-colors flex items-center justify-center space-x-1"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span className="text-sm">Add to Cart</span>
                </button>
                <button
                  onClick={() => onProductClick(product.id)}
                  className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}