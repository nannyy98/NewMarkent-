import React from 'react';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from '../common/LoadingSpinner';

interface ProductGridProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  loading?: boolean;
  viewMode?: 'grid' | 'list';
}

export function ProductGrid({ products, onProductClick, loading = false, viewMode = 'grid' }: ProductGridProps) {
  if (loading) {
    return (
      <div className={`grid gap-4 ${
        viewMode === 'grid' 
          ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' 
          : 'grid-cols-1'
      }`}>
        {Array.from({ length: 12 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
        <p className="text-gray-600">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className={`grid gap-3 ${
      viewMode === 'grid' 
        ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' 
        : 'grid-cols-1 max-w-4xl mx-auto'
    }`}>
      {products.map((product) => (
        <div
          key={product.id}
          className={viewMode === 'list' ? 'max-w-none' : ''}
        >
          <ProductCard
            product={product}
            onClick={() => onProductClick(product)}
          />
        </div>
      ))}
    </div>
  );
}