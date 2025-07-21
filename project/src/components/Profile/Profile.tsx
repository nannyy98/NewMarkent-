import React, { useState } from 'react';
import { User, Package, Heart, Settings, ArrowLeft, Star } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useTranslation } from '../../hooks/useTranslation';
import { mockUser } from '../../data/mockData';
import { UserSettings } from './UserSettings';
import { OrderSkeleton } from '../common/LoadingSpinner';
import { EmptyOrders, EmptyFavorites } from '../common/EmptyStates';
import { FadeIn, SlideIn } from '../common/Transitions';

interface ProfileProps {
  onBack: () => void;
  onProductClick: (productId: string) => void;
  loading?: boolean;
}

export function Profile({ onBack, onProductClick, loading = false }: ProfileProps) {
  const { state, dispatch } = useApp();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('orders');

  // Set mock user if not logged in
  React.useEffect(() => {
    if (!state.user) {
      dispatch({ type: 'SET_USER', payload: mockUser });
    }
  }, [state.user, dispatch]);

  const tabs = [
    { id: 'orders', label: t('profile.orders'), icon: Package },
    { id: 'favorites', label: t('profile.favorites'), icon: Heart },
    { id: 'settings', label: t('profile.settings'), icon: Settings },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'shipped': return 'text-blue-600 bg-blue-100';
      case 'processing': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const currencySymbol = state.currency === 'USD' ? '$' : 'сум';
  const exchangeRate = state.currency === 'USD' ? 1 : 12500;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 md:hidden"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Profile Sidebar */}
        <div className="lg:col-span-1">
          <SlideIn direction="left">
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <img
                    src={state.user?.avatar || mockUser.avatar}
                    alt="Profile"
                    className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-orange-100 hover:border-orange-200 transition-colors"
                  />
                  <div className="absolute bottom-4 right-0 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  {state.user?.name || mockUser.name}
                </h2>
                <p className="text-gray-600">{state.user?.email || mockUser.email}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Member since {new Date(state.user?.joinDate || mockUser.joinDate).getFullYear()}
                </p>
              </div>

              <nav className="space-y-2">
                {tabs.map((tab, index) => (
                  <FadeIn key={tab.id} delay={index * 100}>
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-orange-100 to-orange-50 text-orange-600 shadow-sm'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <tab.icon className="h-5 w-5" />
                      <span>{tab.label}</span>
                    </button>
                  </FadeIn>
                ))}
              </nav>
            </div>
          </SlideIn>
        </div>

        {/* Profile Content */}
        <div className="lg:col-span-3">
          <SlideIn direction="right">
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            {activeTab === 'orders' && (
              <div>
                <FadeIn>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">{t('profile.orders')}</h3>
                </FadeIn>
                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <OrderSkeleton key={index} />
                    ))}
                  </div>
                ) : state.orders.length === 0 ? (
                  <EmptyOrders onStartShopping={onBack} />
                ) : (
                  <div className="space-y-4">
                    {state.orders.map((order, index) => (
                      <FadeIn key={order.id} delay={index * 100}>
                        <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-orange-200">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-medium text-gray-900">Order #{order.id}</h4>
                            <p className="text-sm text-gray-600">
                              {new Date(order.date).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${getStatusColor(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                        <div className="space-y-2 mb-4">
                          {order.items.map((item) => (
                            <div key={item.product.id} className="flex items-center space-x-3">
                              <img
                                src={item.product.image}
                                alt={item.product.title}
                                className="w-12 h-12 object-cover rounded"
                              />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                  {item.product.title}
                                </p>
                                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">
                            Total: {currencySymbol}
                            {state.currency === 'USD'
                              ? order.total.toFixed(2)
                              : (order.total * exchangeRate).toLocaleString()
                            }
                          </span>
                          <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                            View Details
                          </button>
                        </div>
                        </div>
                      </FadeIn>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'favorites' && (
              <div>
                <FadeIn>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">{t('profile.favorites')}</h3>
                </FadeIn>
                {state.favorites.length === 0 ? (
                  <EmptyFavorites onBrowseProducts={onBack} />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {state.favorites.map((product, index) => (
                      <FadeIn key={product.id} delay={index * 100}>
                        <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-orange-200 hover:scale-105">
                        <div className="flex space-x-4">
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">
                              {product.title}
                            </h4>
                            <div className="flex items-center mb-2">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-red-600">
                                {currencySymbol}
                                {state.currency === 'USD'
                                  ? product.price.toFixed(2)
                                  : (product.price * exchangeRate).toLocaleString()
                                }
                              </span>
                              <button
                                onClick={() => onProductClick(product.id)}
                                className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                              >
                                View
                              </button>
                            </div>
                          </div>
                        </div>
                        </div>
                      </FadeIn>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <UserSettings />
            )}
            </div>
          </SlideIn>
        </div>
      </div>
    </div>
  );
}