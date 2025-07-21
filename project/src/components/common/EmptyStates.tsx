import React from 'react';
import { ShoppingCart, Heart, Package, Search, Wifi, AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ icon, title, description, action, className = '' }: EmptyStateProps) {
  return (
    <div className={`text-center py-12 px-4 ${className}`}>
      <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-sm mx-auto">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

export function EmptyCart({ onContinueShopping }: { onContinueShopping: () => void }) {
  return (
    <EmptyState
      icon={<ShoppingCart className="w-full h-full" />}
      title="Your cart is empty"
      description="Add some products to get started with your shopping"
      action={{
        label: "Start Shopping",
        onClick: onContinueShopping
      }}
    />
  );
}

export function EmptyFavorites({ onBrowseProducts }: { onBrowseProducts: () => void }) {
  return (
    <EmptyState
      icon={<Heart className="w-full h-full" />}
      title="No favorites yet"
      description="Save products you love to easily find them later"
      action={{
        label: "Browse Products",
        onClick: onBrowseProducts
      }}
    />
  );
}

export function EmptyOrders({ onStartShopping }: { onStartShopping: () => void }) {
  return (
    <EmptyState
      icon={<Package className="w-full h-full" />}
      title="No orders yet"
      description="When you place your first order, it will appear here"
      action={{
        label: "Start Shopping",
        onClick: onStartShopping
      }}
    />
  );
}

export function NoSearchResults({ query, onClearSearch }: { query: string; onClearSearch: () => void }) {
  return (
    <EmptyState
      icon={<Search className="w-full h-full" />}
      title={`No results for "${query}"`}
      description="Try adjusting your search terms or browse our categories"
      action={{
        label: "Clear Search",
        onClick: onClearSearch
      }}
    />
  );
}

export function OfflineState({ onRetry }: { onRetry: () => void }) {
  return (
    <EmptyState
      icon={<Wifi className="w-full h-full" />}
      title="Нет подключения к интернету"
      description="Пожалуйста, проверьте ваше соединение и попробуйте снова"
      action={{
        label: "Повторить",
        onClick: onRetry
      }}
    />
  );
}

export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <EmptyState
      icon={<AlertCircle className="w-full h-full" />}
      title="Something went wrong"
      description="We're having trouble loading this content. Please try again."
      action={{
        label: "Retry",
        onClick: onRetry
      }}
    />
  );
}