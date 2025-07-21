import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Filter, Grid, List, ChevronDown, X } from 'lucide-react';
import { ProductGrid } from '../components/Product/ProductGrid';
import { mockProducts } from '../data/mockData';
import { useTranslation } from '../hooks/useTranslation';
import { Product } from '../types';

export function CatalogPage() {
  const { category } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('best-match');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Filter states
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [minRating, setMinRating] = useState(0);
  const [freeShipping, setFreeShipping] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';
  const categoryQuery = searchParams.get('category') || '';

  // Decode category from URL
  const decodedCategory = category ? decodeURIComponent(category).replace(/-/g, ' ') : categoryQuery;
  
  // Find matching category name
  const getCategoryDisplayName = (categoryParam: string) => {
    if (!categoryParam) return '';
    
    const categories = ['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Beauty', 'Automotive', 'Books', 'Toys', 'Health', 'Music'];
    const normalizedParam = categoryParam.toLowerCase().replace(/-/g, ' ');
    
    return categories.find(cat => 
      cat.toLowerCase() === normalizedParam ||
      cat.toLowerCase().replace(/\s+/g, '') === normalizedParam.replace(/\s+/g, '')
    ) || categoryParam;
  };

  const displayCategory = getCategoryDisplayName(decodedCategory);
  const sortOptions = [
    { value: 'best-match', label: 'Best Match' },
    { value: 'orders', label: 'Orders' },
    { value: 'newest', label: 'Newest' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Customer Rating' }
  ];

  const brands = ['Apple', 'Samsung', 'Xiaomi', 'Huawei', 'OnePlus', 'Sony', 'LG', 'Nike', 'Adidas'];

  useEffect(() => {
    fetchProducts();
  }, [displayCategory, searchQuery, sortBy, currentPage, priceRange, minRating, freeShipping, selectedBrands]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Filter mock products
      let filteredProducts = [...mockProducts];
      
      // Filter by category
      if (displayCategory) {
        filteredProducts = filteredProducts.filter(p => 
          p.category.toLowerCase() === displayCategory.toLowerCase()
        );
      }
      
      // Filter by search query
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        filteredProducts = filteredProducts.filter(p => 
          p.title.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower)
        );
      }
      
      // Filter by price range
      filteredProducts = filteredProducts.filter(p => 
        p.price >= priceRange[0] && p.price <= priceRange[1]
      );
      
      // Filter by rating
      if (minRating > 0) {
        filteredProducts = filteredProducts.filter(p => p.rating >= minRating);
      }
      
      // Filter by free shipping
      if (freeShipping) {
        filteredProducts = filteredProducts.filter(p => p.shipping.free);
      }
      
      // Sort products
      switch (sortBy) {
        case 'price-low':
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filteredProducts.sort((a, b) => b.rating - a.rating);
          break;
        case 'orders':
          filteredProducts.sort((a, b) => b.soldCount - a.soldCount);
          break;
        default:
          // Keep original order for best match
          break;
      }
      
      setProducts(filteredProducts);
      setTotalPages(Math.ceil(filteredProducts.length / 20));
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setPriceRange([0, 1000]);
    setMinRating(0);
    setFreeShipping(false);
    setSelectedBrands([]);
    setCurrentPage(1);
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const getPageTitle = () => {
    if (searchQuery) return `Search results for "${searchQuery}"`;
    if (displayCategory) return displayCategory;
    return 'All Products';
  };

  const getResultsCount = () => {
    const total = products.length;
    return `${total.toLocaleString()} results`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumbs */}
        <nav className="flex mb-4" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <button onClick={() => navigate('/')} className="text-gray-500 hover:text-gray-700">
                Home
              </button>
            </li>
            {displayCategory && (
              <>
                <span className="text-gray-400">/</span>
                <li>
                  <button onClick={() => navigate('/catalog')} className="text-gray-500 hover:text-gray-700">
                    All Categories
                  </button>
                </li>
                <span className="text-gray-400">/</span>
                <li className="text-gray-900 font-medium">{displayCategory}</li>
              </>
            )}
          </ol>
        </nav>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-orange-600 hover:text-orange-700"
                >
                  Clear all
                </button>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Customer Rating</h4>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="flex items-center">
                      <input
                        type="radio"
                        name="rating"
                        checked={minRating === rating}
                        onChange={() => setMinRating(rating)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">
                        {rating}+ stars
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Free Shipping */}
              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={freeShipping}
                    onChange={(e) => setFreeShipping(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Free Shipping</span>
                </label>
              </div>

              {/* Brands */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Brands</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {brands.map((brand) => (
                    <label key={brand} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
                  <p className="text-gray-600">{getResultsCount()}</p>
                </div>
                
                <div className="flex items-center gap-4">
                  {/* Mobile Filter Button */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <Filter className="h-4 w-4" />
                    Filters
                  </button>

                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  {/* View Mode */}
                  <div className="flex border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
                    >
                      <Grid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <ProductGrid 
              products={products} 
              onProductClick={(product) => navigate(`/product/${product.id}`)}
              loading={loading} 
              viewMode={viewMode} 
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 border rounded-lg ${
                          currentPage === page
                            ? 'bg-orange-500 text-white border-orange-500'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}