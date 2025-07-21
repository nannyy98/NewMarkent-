import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Grid3X3, ShoppingCart, User, Heart } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../auth/AuthContext';
import { useTranslation } from '../../hooks/useTranslation';

export function MobileNav() {
  const { state } = useApp();
  const { state: authState } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  
  const cartItemsCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const favoritesCount = state.favorites.length;

  const navItems = [
    { id: '/', icon: Home, label: t('nav.home') },
    { id: '/catalog', icon: Grid3X3, label: t('nav.categories') },
    { id: '/cart', icon: ShoppingCart, label: t('nav.cart'), badge: cartItemsCount },
    { id: '/profile', icon: Heart, label: 'Favorites', badge: favoritesCount },
    { id: '/profile', icon: User, label: t('nav.profile') },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden safe-area-bottom">
      <div className="flex justify-around py-1">
        {navItems.map(({ id, icon: Icon, label, badge }) => (
          <button
            key={id}
            onClick={() => navigate(id)}
            className={`flex flex-col items-center py-2 px-1 min-w-0 flex-1 transition-colors ${
              location.pathname === id 
                ? 'text-orange-500' 
                : 'text-gray-600 hover:text-gray-800 active:text-orange-400'
            }`}
          >
            <div className="relative">
              <Icon className={`h-6 w-6 ${location.pathname === id ? 'scale-110' : ''} transition-transform`} />
              {badge !== undefined && badge > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center">
                  {badge > 99 ? '99+' : badge}
                </span>
              )}
            </div>
            <span className={`text-xs mt-1 truncate ${
              location.pathname === id ? 'font-medium' : ''
            }`}>
              {label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}