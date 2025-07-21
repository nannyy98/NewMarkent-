import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { flashDeals } from '../../data/mockData';
import { ProductCard } from '../Product/ProductCard';
import { useTranslation } from '../../hooks/useTranslation';
import { ProductCardSkeleton } from '../common/LoadingSpinner';
import { FadeIn, StaggeredList } from '../common/Transitions';

interface FlashDealsProps {
  loading?: boolean;
}

export function FlashDeals({ loading = false }: FlashDealsProps) {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const updateTimers = () => {
      const newTimeLeft: { [key: string]: string } = {};
      
      flashDeals.forEach((deal) => {
        const now = new Date().getTime();
        const endTime = deal.endTime.getTime();
        const difference = endTime - now;

        if (difference > 0) {
          const hours = Math.floor(difference / (1000 * 60 * 60));
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((difference % (1000 * 60)) / 1000);
          
          newTimeLeft[deal.id] = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else {
          newTimeLeft[deal.id] = '00:00:00';
        }
      });
      
      setTimeLeft(newTimeLeft);
    };

    updateTimers();
    const timer = setInterval(updateTimers, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <FadeIn className="py-8">
      <FadeIn delay={100}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{t('flashdeals.title')}</h2>
          <div className="flex items-center space-x-2 text-red-600 animate-pulse">
            <Clock className="h-5 w-5" />
            <span className="text-sm font-medium">{t('flashdeals.ends')}</span>
          </div>
        </div>
      </FadeIn>
      
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {flashDeals.map((deal) => (
            <div key={deal.id} className="bg-white rounded-lg border border-red-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 hover:border-red-300 h-full flex flex-col">
              <ProductCard product={deal.product} />
              <div className="p-3 bg-gradient-to-r from-red-50 to-orange-50 mt-auto">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-red-600 font-bold text-base animate-pulse">${deal.dealPrice}</span>
                  <span className="text-gray-500 line-through text-xs">${deal.originalPrice}</span>
                </div>
                <div className="text-center text-red-600 font-mono text-xs mb-1 bg-red-100 rounded px-1 py-0.5">
                  {timeLeft[deal.id] || '00:00:00'}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${(deal.soldCount / deal.totalCount) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-gray-600 text-center mt-1">
                  <span className="font-medium text-red-600">{deal.soldCount}</span>/{deal.totalCount} sold
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </FadeIn>
  );
}