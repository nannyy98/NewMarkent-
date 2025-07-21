import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroSlider } from '../components/Home/HeroSlider';
import { Categories } from '../components/Home/Categories';
import { FlashDeals } from '../components/Home/FlashDeals';
import { ProductGrid } from '../components/Product/ProductGrid';
import { ProductRecommendations } from '../components/Product/ProductRecommendations';
import { LiveChat } from '../components/Chat/LiveChat';
import { mockProducts } from '../data/mockData';
import { FadeIn } from '../components/common/Transitions';

export function HomePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const handleCategorySelect = (category: string) => {
    navigate(`/catalog/${encodeURIComponent(category)}`);
  };

  return (
    <div className="space-y-8">
      <HeroSlider />
      <Categories onCategorySelect={handleCategorySelect} loading={loading} />
      <FlashDeals loading={loading} />
      <FadeIn delay={300}>
        <div className="py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended for You</h2>
          <ProductGrid 
            products={mockProducts.slice(0, 20)} 
            onProductClick={(product) => handleProductClick(product.id)}
            loading={loading}
          />
        </div>
      </FadeIn>
      
      <ProductRecommendations
        type="trending"
        onProductClick={(product) => handleProductClick(product.id)}
      />
      
      <LiveChat />
    </div>
  );
}