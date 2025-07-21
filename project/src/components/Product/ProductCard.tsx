import React from 'react';
import { Star, ShoppingCart, Heart, Truck, Shield, BarChart3 } from 'lucide-react';
import { Product } from '../../types';
import { useApp } from '../../contexts/AppContext';
import { useTranslation } from '../../hooks/useTranslation';

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
  showCompareButton?: boolean;
  onCompare?: (product: Product) => void;
}

export function ProductCard({ product, onClick, showCompareButton = false, onCompare }: ProductCardProps) {
  const { state, dispatch } = useApp();
  const { t } = useTranslation();
  
  const currencySymbol = state.currency === 'USD' ? '$' : 'сум';
  const price = state.currency === 'USD' ? product.price : product.price * 12500;
  const originalPrice = state.currency === 'USD' ? product.originalPrice : product.originalPrice ? product.originalPrice * 12500 : undefined;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: 'ADD_TO_CART', payload: { product, quantity: 1 } });
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    const isFavorite = state.favorites.some(fav => fav.id === product.id);
    if (isFavorite) {
      dispatch({ type: 'REMOVE_FROM_FAVORITES', payload: product.id });
    } else {
      dispatch({ type: 'ADD_TO_FAVORITES', payload: product });
    }
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onCompare) {
      onCompare(product);
    }
  };

  const isFavorite = state.favorites.some(fav => fav.id === product.id);

  return (
    <div 
      className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group hover:border-orange-300 active:scale-95 touch-manipulation h-full flex flex-col"
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-200 cursor-pointer"
          onClick={onClick}
        />
        {product.discount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
            -{product.discount}%
          </div>
        )}
        <button
          onClick={handleToggleFavorite}
          className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors opacity-0 group-hover:opacity-100 sm:opacity-100 active:scale-90"
        >
          <Heart className={`h-4 w-4 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
        </button>
        
        {showCompareButton && (
          <button
            onClick={handleCompare}
            className="absolute top-12 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors opacity-0 group-hover:opacity-100 sm:opacity-100 active:scale-90"
          >
            <BarChart3 className="h-4 w-4 text-gray-400" />
          </button>
        )}
      </div>
      
      <div className="p-3 flex-1 flex flex-col">
        <h3 
          className="text-sm text-gray-900 mb-2 line-clamp-2 h-8 hover:text-orange-600 transition-colors cursor-pointer leading-tight"
          onClick={onClick}
        >
          {product.title}
        </h3>
        
        <div className="flex items-center justify-between mb-3 text-xs">
          <div className="flex items-center">
            <Star className="h-3 w-3 text-yellow-400 fill-current" />
            <span className="text-gray-600 ml-1">{product.rating}</span>
            <span className="text-gray-500 ml-1">
              ({product.reviewCount})
            </span>
          </div>
          <span className="text-gray-500">
            {product.soldCount} sold
          </span>
        </div>
        
        <div className="mb-4">
          <div className="flex items-baseline space-x-2">
            <span className="text-base font-bold text-red-600">
              {currencySymbol}
              {state.currency === 'USD' ? price.toFixed(2) : price.toLocaleString()}
            </span>
            {originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {currencySymbol}
                {state.currency === 'USD' ? originalPrice.toFixed(2) : originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          {product.discount && (
            <span className="inline-block bg-red-100 text-red-600 text-xs px-2 py-1 rounded mt-1">
              -{product.discount}% OFF
            </span>
          )}
        </div>
        
        <div className="flex items-center text-xs text-gray-500 mb-3 space-x-2">
          {product.shipping.free && (
            <div className="flex items-center">
              <Truck className="h-3 w-3 text-green-600 mr-0.5" />
              <span className="text-green-600">Free shipping</span>
            </div>
          )}
          <div className="flex items-center">
            <Shield className="h-3 w-3 text-blue-600 mr-0.5" />
            <span className="text-blue-600">Protected</span>
          </div>
        </div>
        
        <button
          onClick={handleAddToCart}
          className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white py-2 px-3 rounded-lg transition-colors duration-200 text-sm font-medium flex items-center justify-center space-x-1 active:scale-95 touch-manipulation mt-auto"
        >
          <ShoppingCart className="h-4 w-4" />
          <span>{t('product.addToCart')}</span>
        </button>
      </div>
    </div>
  );
}