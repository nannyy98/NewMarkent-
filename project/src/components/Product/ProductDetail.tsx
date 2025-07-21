import React, { useState } from 'react';
import { Star, ShoppingCart, Heart, ArrowLeft, Shield, Truck, MessageCircle } from 'lucide-react';
import { Product } from '../../types';
import { useApp } from '../../contexts/AppContext';
import { useTranslation } from '../../hooks/useTranslation';
import { ProductReviews } from './ProductReviews';
import { ReviewSystem } from '../Reviews/ReviewSystem';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
}

export function ProductDetail({ product, onBack }: ProductDetailProps) {
  const { state, dispatch } = useApp();
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description');
  
  const currencySymbol = state.currency === 'USD' ? '$' : 'сум';
  const price = state.currency === 'USD' ? product.price : product.price * 12500;
  const originalPrice = state.currency === 'USD' ? product.originalPrice : product.originalPrice ? product.originalPrice * 12500 : undefined;

  const handleAddToCart = () => {
    dispatch({ type: 'ADD_TO_CART', payload: { product, quantity } });
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to products</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
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
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              {product.title}
            </h1>
            
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="text-lg font-medium ml-1">{product.rating}</span>
              </div>
              <span className="text-gray-500">
                ({product.reviewCount} {t('product.reviews')})
              </span>
              <span className="text-gray-500">{product.soldCount} sold</span>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <span className="text-3xl font-bold text-red-600">
                {currencySymbol}{state.currency === 'USD' ? price.toFixed(2) : price.toLocaleString()}
              </span>
              {originalPrice && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    {currencySymbol}{state.currency === 'USD' ? originalPrice.toFixed(2) : originalPrice.toLocaleString()}
                  </span>
                  <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-medium">
                    -{product.discount}% OFF
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center space-x-4">
            <span className="text-gray-700 font-medium">Quantity:</span>
            <div className="flex items-center border border-gray-300 rounded">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 text-gray-600 hover:bg-gray-100"
              >
                -
              </button>
              <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 text-gray-600 hover:bg-gray-100"
              >
                +
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
              <span>{t('product.addToCart')}</span>
            </button>
            <button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-medium transition-colors">
              {t('product.buyNow')}
            </button>
            <button
              onClick={handleToggleFavorite}
              className="w-full border border-gray-300 hover:border-gray-400 text-gray-700 py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <Heart className={`h-5 w-5 ${isFavorite ? 'text-red-500 fill-current' : ''}`} />
              <span>Add to Favorites</span>
            </button>
          </div>

          {/* Shipping Info */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center space-x-3">
              <Truck className="h-5 w-5 text-green-600" />
              <div>
                <div className="font-medium">
                  {product.shipping.free ? 'Free Shipping' : 'Paid Shipping'}
                </div>
                <div className="text-sm text-gray-600">
                  Delivery in {product.shipping.days} days from {product.shipping.from}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-blue-600" />
              <div>
                <div className="font-medium">Buyer Protection</div>
                <div className="text-sm text-gray-600">Full refund if item not received</div>
              </div>
            </div>
          </div>

          {/* Seller Info */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <img
                src={product.seller.avatar}
                alt={product.seller.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <div className="font-medium">{product.seller.name}</div>
                <div className="text-sm text-gray-600">
                  {product.seller.yearInBusiness} years in business
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span>{product.seller.rating}</span>
              </div>
              <div>Response rate: {product.seller.responseRate}</div>
            </div>
            <button className="w-full mt-3 border border-gray-300 hover:border-gray-400 text-gray-700 py-2 px-4 rounded font-medium transition-colors flex items-center justify-center space-x-2">
              <MessageCircle className="h-4 w-4" />
              <span>Contact Seller</span>
            </button>
          </div>
        </div>
      </div>

      {/* Product Description and Specifications */}
      <div className="mt-12">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { id: 'description', label: 'Description' },
              { id: 'specifications', label: 'Specifications' },
              { id: 'reviews', label: `Reviews (${product.reviewCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        
        {/* Tab Content */}
        <div className="py-8">
          {activeTab === 'description' && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Product Description</h3>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">{product.description}</p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  This premium product offers exceptional quality and performance. Designed with attention to detail 
                  and built to last, it provides excellent value for your investment.
                </p>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Key Features:</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>High-quality materials and construction</li>
                  <li>Advanced technology for optimal performance</li>
                  <li>User-friendly design and interface</li>
                  <li>Comprehensive warranty coverage</li>
                  <li>Excellent customer support</li>
                </ul>
              </div>
            </div>
          )}
          
          {activeTab === 'specifications' && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Technical Specifications</h3>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-3 border-b border-gray-200">
                      <span className="text-gray-600 font-medium">{key}</span>
                      <span className="text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'reviews' && (
            <div>
              <ReviewSystem
                productId={product.id}
                type="product"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}