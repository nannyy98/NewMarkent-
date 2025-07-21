import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { categories } from '../../data/mockData';
import { useTranslation } from '../../hooks/useTranslation';
import { CategorySkeleton } from '../common/LoadingSpinner';
import { FadeIn, StaggeredList } from '../common/Transitions';

interface CategoriesProps {
  onCategorySelect?: (categoryId: string) => void;
  loading?: boolean;
}

export function Categories({ onCategorySelect, loading = false }: CategoriesProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/catalog?category=${encodeURIComponent(categoryName)}`);
    if (onCategorySelect) {
      onCategorySelect(categoryName);
    }
  };

  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{t('categories')}</h2>
          <button
            onClick={() => navigate('/catalog')}
            className="flex items-center text-orange-600 hover:text-orange-700 font-medium"
          >
            {t('viewAll')}
            <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-4">
            {Array.from({ length: 10 }).map((_, index) => (
              <CategorySkeleton key={index} />
            ))}
          </div>
        ) : (
          <StaggeredList 
            staggerDelay={50}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-4"
          >
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.name)}
                className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 group hover:shadow-md hover:scale-105 active:scale-95 touch-manipulation"
              >
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-orange-200 transition-all duration-200 group-hover:scale-110">
                  <span className="text-orange-600 text-xl">{category.icon}</span>
                </div>
                <span className="text-sm font-medium text-gray-700 text-center leading-tight group-hover:text-orange-600 transition-colors">
                  {t(`categories.${category.name.toLowerCase().replace(/\s+/g, '')}`)}
                </span>
              </button>
            ))}
          </StaggeredList>
        )}
      </div>
    </section>
  );
}