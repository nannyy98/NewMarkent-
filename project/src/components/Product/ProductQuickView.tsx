import React, { useState } from 'react';
import { X, Star, ShoppingCart, Heart, Plus, Minus } from 'lucide-react';
import { Product } from '../../types';
import { useApp } from '../../contexts/AppContext';

interface ProductQuickViewProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onViewDetails: () => void;
}

export function ProductQuickView({ product, isOpen, onClose, onViewDetails }: ProductQuickViewProps) {
  const { state, dispatch } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  
  const currencySymbol = state.currency === 'USD' ? '$' : 'сум';
  const price = state.currency === 'USD' ? product.price : product.price * 12500;
  const originalPrice = state.currency === 'USD' ? product.originalPrice : product.originalPrice ? product.originalPrice * 12500 : undefined;

  if (!isOpen) return null;

  const handleAddToCart = () => {
    dispatch({ type: 'ADD_TO_CART', payload: { product, quantity } });
    onClose();
  };

  const handleToggleFavorite = () => {
    const isFavorite = state.favorites.some(fav => fav.id === product.id);
    if (isFavorite) {
      dispatch({ type: 'REMOVE_FROM_FAVORITES', payload: product.id });
    } else {
      dispatch({ type: 'ADD_TO_FAVORITES', payload: product });
    }
  };

  const isFavorite = state.favorites.some(fav => fav.id === product.id);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Quick View</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={product.images[selectedImage]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex space-x-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-orange-500' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.title}</h1>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="text-lg font-medium ml-1">{product.rating}</span>
                </div>
                <span className="text-gray-500">({product.reviewCount} reviews)</span>
                <span className="text-gray-500">{product.soldCount} sold</span>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-red-600">
                  {currencySymbol}
                  {state.currency === 'USD' ? price.toFixed(2) : price.toLocaleString()}
                </span>
                {originalPrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      {currencySymbol}
                      {state.currency === 'USD' ? originalPrice.toFixed(2) : originalPrice.toLocaleString()}
                    </span>
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-medium">
                      -{product.discount}% OFF
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-gray-700 line-clamp-3">{product.description}</p>
              
              {/* Quantity Selector */}
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 font-medium">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Add to Cart</span>
                </button>
                
                <div className="flex space-x-3">
                  <button
                    onClick={handleToggleFavorite}
                    className="flex-1 border border-gray-300 hover:border-gray-400 text-gray-700 py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    <Heart className={`h-5 w-5 ${isFavorite ? 'text-red-500 fill-current' : ''}`} />
                    <span>Wishlist</span>
                  </button>
                  
                  <button
                    onClick={onViewDetails}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>

            {/* Key Features */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Key Features:</h4>
              <div className="space-y-2">
                {Object.entries(product.specifications).slice(0, 3).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-gray-600">{key}:</span>
                    <span className="text-gray-900 font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}