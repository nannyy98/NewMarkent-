import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProductDetail } from '../components/Product/ProductDetail';
import { mockProducts } from '../data/mockData';

export function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = mockProducts.find(p => p.id === id);

  if (!product) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
        <button
          onClick={() => navigate('/')}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <ProductDetail
      product={product}
      onBack={() => navigate(-1)}
    />
  );
}