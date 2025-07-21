import React, { useState } from 'react';
import { Filter, X, Star, Truck, DollarSign, Tag } from 'lucide-react';

interface ProductFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterState) => void;
  currentFilters: FilterState;
}

export interface FilterState {
  priceRange: [number, number];
  rating: number;
  freeShipping: boolean;
  categories: string[];
  brands: string[];
  discount: boolean;
  inStock: boolean;
  sortBy: 'price-low' | 'price-high' | 'rating' | 'popularity' | 'newest' | 'discount';
}

const categories = ['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Beauty', 'Automotive'];
const brands = ['Apple', 'Samsung', 'Nike', 'Adidas', 'Sony', 'LG', 'Xiaomi', 'Huawei'];

export function ProductFilters({ isOpen, onClose, onApplyFilters, currentFilters }: ProductFiltersProps) {
  const [filters, setFilters] = useState<FilterState>(currentFilters);

  if (!isOpen) return null;

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: FilterState = {
      priceRange: [0, 1000],
      rating: 0,
      freeShipping: false,
      categories: [],
      brands: [],
      discount: false,
      inStock: false,
      sortBy: 'popularity',
    };
    setFilters(resetFilters);
  };

  const toggleCategory = (category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const toggleBrand = (brand: string) => {
    setFilters(prev => ({
      ...prev,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter(b => b !== brand)
        : [...prev.brands, brand]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-2">
            <Filter className="h-6 w-6 text-gray-600" />
            <h2 className="text-xl font-bold text-gray-900">Advanced Filters</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Sort By */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Sort By</h3>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="popularity">Most Popular</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="discount">Biggest Discount</option>
            </select>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Price Range</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <DollarSign className="h-5 w-5 text-gray-400" />
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={filters.priceRange[1]}
                  onChange={(e) => setFilters({
                    ...filters,
                    priceRange: [filters.priceRange[0], parseInt(e.target.value)]
                  })}
                  className="flex-1"
                />
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>$0</span>
                <span>${filters.priceRange[1]}</span>
              </div>
            </div>
          </div>

          {/* Quick Filters */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Quick Filters</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.freeShipping}
                  onChange={(e) => setFilters({ ...filters, freeShipping: e.target.checked })}
                  className="rounded text-orange-500"
                />
                <div className="flex items-center space-x-2">
                  <Truck className="h-5 w-5 text-green-600" />
                  <span className="text-gray-900">Free Shipping</span>
                </div>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.discount}
                  onChange={(e) => setFilters({ ...filters, discount: e.target.checked })}
                  className="rounded text-orange-500"
                />
                <div className="flex items-center space-x-2">
                  <Tag className="h-5 w-5 text-red-600" />
                  <span className="text-gray-900">On Sale</span>
                </div>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={(e) => setFilters({ ...filters, inStock: e.target.checked })}
                  className="rounded text-orange-500"
                />
                <span className="text-gray-900">In Stock Only</span>
              </label>
            </div>
          </div>

          {/* Rating */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Minimum Rating</h3>
            <div className="space-y-2">
              {[4, 3, 2, 1].map((rating) => (
                <label key={rating} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    checked={filters.rating === rating}
                    onChange={() => setFilters({ ...filters, rating })}
                    className="text-orange-500"
                  />
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-600">& up</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Categories</h3>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {categories.map((category) => (
                <label key={category} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(category)}
                    onChange={() => toggleCategory(category)}
                    className="rounded text-orange-500"
                  />
                  <span className="text-gray-700">{category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Brands */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Brands</h3>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {brands.map((brand) => (
                <label key={brand} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.brands.includes(brand)}
                    onChange={() => toggleBrand(brand)}
                    className="rounded text-orange-500"
                  />
                  <span className="text-gray-700">{brand}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex space-x-3 p-6 border-t">
          <button
            onClick={handleReset}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Reset All
          </button>
          <button
            onClick={handleApply}
            className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}