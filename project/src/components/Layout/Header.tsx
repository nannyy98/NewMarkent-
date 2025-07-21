import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, User, Globe, DollarSign, Menu, Heart, Grid3X3, ChevronDown, X } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../auth/AuthContext';
import { useTranslation } from '../../hooks/useTranslation';
import { AuthModal } from '../Auth/AuthModal';
import { LanguageSwitcher, CurrencySwitcher } from '../common/LanguageSwitcher';

interface HeaderProps {
  onMenuClick: () => void;
  onSearch?: (query: string) => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { state, dispatch } = useApp();
  const { state: authState, logout } = useAuth();
  const { t, formatCurrency } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCategoriesMenu, setShowCategoriesMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileCategories, setShowMobileCategories] = useState(false);

  const cartItemsCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);

  const categories = [
    'Electronics',
    'Fashion',
    'Home & Garden',
    'Sports',
    'Beauty',
    'Automotive',
    'Books',
    'Toys'
  ];
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleUserClick = () => {
    if (authState.user) {
      navigate('/profile');
    } else {
      setShowAuthModal(true);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleCategoryClick = (category: string) => {
    navigate(`/catalog?category=${encodeURIComponent(category)}`);
    setShowCategoriesMenu(false);
  };

  return (
    <>
    <header className="bg-white shadow-sm border-b sticky top-0 z-40 safe-area-top">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowMobileMenu(true)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <div 
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => navigate('/')}
            >
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="font-bold text-xl text-gray-900 hidden sm:block">AliExpress</span>
            </div>
          </div>

          {/* Desktop Search and Categories */}
          <div className="flex-1 max-w-3xl mx-4 hidden md:flex items-center space-x-2">
            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowCategoriesMenu(!showCategoriesMenu)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-l-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
              >
                <Grid3X3 className="h-4 w-4" />
                <span className="text-sm font-medium">{t('nav.categories')}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              
              {showCategoriesMenu && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="p-2">
                    <button
                      onClick={() => {
                        navigate('/catalog');
                        setShowCategoriesMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded font-medium"
                    >
                      {t('categories.viewAll')}
                    </button>
                    <div className="border-t border-gray-200 my-2"></div>
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => handleCategoryClick(category)}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
                      >
                        {t(`categories.${category.toLowerCase().replace(/\s+/g, '')}`)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 flex">
              <input
                type="text"
                placeholder={t('search.placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 border-t border-b border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              />
              <button
                type="submit"
                className="px-6 bg-orange-500 hover:bg-orange-600 text-white rounded-r-lg transition-colors"
              >
                <Search className="h-5 w-5" />
              </button>
            </form>
          </div>

          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>

            {/* Currency Selector */}
            <div className="hidden sm:block">
              <CurrencySwitcher />
            </div>

            <button
              onClick={() => navigate('/profile')}
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors hidden sm:block"
            >
              <Heart className="h-6 w-6" />
              {state.favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {state.favorites.length}
                </span>
              )}
            </button>

            <button
              onClick={() => navigate('/cart')}
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {authState.user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                  <img
                    src={authState.user.avatar || 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100'}
                    alt={authState.user.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="hidden lg:block text-sm font-medium">{authState.user.name}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <button
                    onClick={() => navigate('/profile')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg"
                  >
                    {t('nav.profile')}
                  </button>
                  {authState.user?.role === 'admin' && (
                    <button
                      onClick={() => navigate('/admin')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Админ панель
                    </button>
                  )}
                  {authState.user?.role === 'seller' && (
                    <button
                      onClick={() => navigate('/seller')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Панель продавца
                    </button>
                  )}
                  <button
                    onClick={() => navigate('/profile')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {t('nav.orders')}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t border-gray-200 rounded-b-lg"
                  >
                    {t('nav.logout')}
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={handleUserClick}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <User className="h-6 w-6" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-4 pb-3 border-t border-gray-100">
        <div className="space-y-2">
          {/* Mobile Categories Button */}
          <button
            onClick={() => setShowMobileCategories(!showMobileCategories)}
            className="w-full flex items-center justify-between px-4 py-2 bg-gray-50 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <Grid3X3 className="h-4 w-4" />
              <span className="text-sm font-medium">{t('nav.categories')}</span>
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${showMobileCategories ? 'rotate-180' : ''}`} />
          </button>
          
          {/* Mobile Categories List */}
          {showMobileCategories && (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <button
                onClick={() => {
                  navigate('/catalog');
                  setShowMobileCategories(false);
                }}
                className="w-full text-left px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50 border-b border-gray-100"
              >
                {t('categories.viewAll')}
              </button>
              {categories.map((category, index) => (
                <button
                  key={category}
                  onClick={() => {
                    handleCategoryClick(category);
                    setShowMobileCategories(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors ${
                    index === categories.length - 1 ? '' : 'border-b border-gray-100'
                  }`}
                >
                  {t(`categories.${category.toLowerCase().replace(/\s+/g, '')}`)}
                </button>
              ))}
            </div>
          )}

          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              placeholder={t('search.placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base"
            />
            <button
              type="submit"
              className="px-6 bg-orange-500 hover:bg-orange-600 text-white rounded-r-lg transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </header>

    {/* Mobile Menu Overlay */}
    {showMobileMenu && (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
        <div className="fixed inset-y-0 left-0 w-80 bg-white shadow-xl">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="font-bold text-xl text-gray-900">AliExpress</span>
            </div>
            <button
              onClick={() => setShowMobileMenu(false)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-4 space-y-4">
            {/* User Section */}
            {authState.user ? (
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <img
                  src={authState.user.avatar}
                  alt={authState.user.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="font-medium text-gray-900">{authState.user.name}</div>
                  <div className="text-sm text-gray-600">{authState.user.email}</div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  setShowAuthModal(true);
                  setShowMobileMenu(false);
                }}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                {t('nav.login')} / {t('nav.register')}
              </button>
            )}

            {/* Menu Items */}
            <div className="space-y-2">
              <button
                onClick={() => {
                  navigate('/');
                  setShowMobileMenu(false);
                }}
                className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {t('nav.home')}
              </button>
              <button
                onClick={() => {
                  navigate('/profile');
                  setShowMobileMenu(false);
                }}
                className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-between"
              >
                <span>{t('nav.favorites')}</span>
                {state.favorites.length > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {state.favorites.length}
                  </span>
                )}
              </button>
            </div>

            {/* Settings */}
            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="text-sm text-gray-500 px-4">{t('nav.settings')}</div>
              
              {/* Language Selector */}
              <div className="px-4 py-2">
                <div className="text-sm font-medium text-gray-700 mb-2">{t('profile.language')}</div>
                <LanguageSwitcher variant="buttons" />
              </div>

              {/* Currency Selector */}
              <div className="px-4 py-2">
                <div className="text-sm font-medium text-gray-700 mb-2">{t('profile.currency')}</div>
                <CurrencySwitcher variant="buttons" />
              </div>
            </div>

            {/* Logout */}
            {authState.user && (
              <div className="border-t border-gray-200 pt-4">
                <button
                  onClick={() => {
                    handleLogout();
                    setShowMobileMenu(false);
                  }}
                  className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  {t('nav.logout')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )}
    
    <AuthModal
      isOpen={showAuthModal}
      onClose={() => setShowAuthModal(false)}
    />
    </>
  );
}