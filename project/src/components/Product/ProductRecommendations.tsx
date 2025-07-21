import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';
import { mockProducts } from '../../data/mockData';

interface ProductRecommendationsProps {
  currentProduct?: Product;
  onProductClick: (product: Product) => void;
  title?: string;
  type?: 'similar' | 'viewed' | 'bought-together' | 'trending';
}

export function ProductRecommendations({ 
  currentProduct, 
  onProductClick, 
  title,
  type = 'similar' 
}: ProductRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Product[]>([]);

  useEffect(() => {
    generateRecommendations();
  }, [currentProduct, type]);

  const generateRecommendations = () => {
    let filtered = mockProducts.filter(p => p.id !== currentProduct?.id);
    
    switch (type) {
      case 'similar':
        if (currentProduct) {
          filtered = filtered.filter(p => p.category === currentProduct.category);
        }
        break;
      case 'trending':
        filtered = filtered.sort((a, b) => b.soldCount - a.soldCount);
        break;
      case 'viewed':
        // Simulate recently viewed products
        filtered = filtered.sort(() => Math.random() - 0.5);
        break;
      case 'bought-together':
        // Simulate frequently bought together
        filtered = filtered.sort(() => Math.random() - 0.5);
        break;
    }
    
    setRecommendations(filtered.slice(0, 6));
  };

  const getTitle = () => {
    if (title) return title;
    
    switch (type) {
      case 'similar':
        return 'Similar Products';
      case 'trending':
        return 'Trending Now';
      case 'viewed':
        return 'Recently Viewed';
      case 'bought-together':
        return 'Frequently Bought Together';
      default:
        return 'Recommended for You';
    }
  };

  if (recommendations.length === 0) return null;

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{getTitle()}</h2>
        <button className="flex items-center text-orange-600 hover:text-orange-700 font-medium">
          View All
          <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {recommendations.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={() => onProductClick(product)}
          />
        ))}
      </div>
    </div>
  );
}