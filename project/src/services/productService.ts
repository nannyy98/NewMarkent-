import { productService as apiProductService } from '../api/services/productService';
import { Product } from '../types';
import { mockProducts } from '../data/mockData';

export class ProductService {
  private static useApi = import.meta.env.VITE_USE_API === 'true';

  static async getProducts(filters?: {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    rating?: number;
    page?: number;
    limit?: number;
  }): Promise<{ products: Product[]; total: number }> {
    try {
      if (this.useApi) {
        // Use real API
        const response = await apiProductService.getProducts(filters || {});
        return {
          products: response.data,
          total: response.pagination.total,
          totalPages: response.pagination.last_page,
        };
      }

      // Fallback to mock data
      let products = [...mockProducts];
      
      if (filters?.category) {
        products = products.filter(p => 
          p.category.toLowerCase() === filters.category.toLowerCase() ||
          p.category.toLowerCase().replace(/\s+/g, '') === filters.category.toLowerCase().replace(/\s+/g, '')
        );
      }
      
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        products = products.filter(p => 
          p.title.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower)
        );
      }
      
      if (filters?.minPrice !== undefined) {
        products = products.filter(p => p.price >= filters.minPrice!);
      }
      
      if (filters?.maxPrice !== undefined) {
        products = products.filter(p => p.price <= filters.maxPrice!);
      }
      
      if (filters?.rating) {
        products = products.filter(p => p.rating >= filters.rating!);
      }

      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      return {
        products: products.slice(startIndex, endIndex),
        total: products.length,
        totalPages: Math.ceil(products.length / limit),
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback to mock data on API error
      return this.getMockProducts(filters);
    }
  }

  static async getProduct(id: string): Promise<Product | null> {
    try {
      if (this.useApi) {
        return await apiProductService.getProduct(id);
      }
      
      // Fallback to mock data
      return mockProducts.find(p => p.id === id) || null;
    } catch (error) {
      console.error('Error fetching product:', error);
      return mockProducts.find(p => p.id === id) || null;
    }
  }

  static async searchProducts(query: string): Promise<Product[]> {
    try {
      if (this.useApi) {
        const response = await apiProductService.searchProducts(query);
        return response.data;
      }
      
      // Fallback to mock data
      const searchLower = query.toLowerCase();
      return mockProducts.filter(p => 
        p.title.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.category.toLowerCase().includes(searchLower)
      );
    } catch (error) {
      console.error('Error searching products:', error);
      const searchLower = query.toLowerCase();
      return mockProducts.filter(p => 
        p.title.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.category.toLowerCase().includes(searchLower)
      );
    }
  }

  static async getCategories(): Promise<string[]> {
    try {
      if (this.useApi) {
        return await apiProductService.getCategories();
      }
      
      // Fallback to mock data
      return [...new Set(mockProducts.map(p => p.category))];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [...new Set(mockProducts.map(p => p.category))];
    }
  }

  // Helper method for mock data
  private static getMockProducts(filters?: any): { products: Product[]; total: number; totalPages: number } {
    let products = [...mockProducts];
    
    if (filters?.category) {
      products = products.filter(p => p.category === filters.category);
    }
    
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      products = products.filter(p => 
        p.title.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      );
    }
    
    if (filters?.minPrice !== undefined) {
      products = products.filter(p => p.price >= filters.minPrice);
    }
    
    if (filters?.maxPrice !== undefined) {
      products = products.filter(p => p.price <= filters.maxPrice);
    }
    
    if (filters?.rating) {
      products = products.filter(p => p.rating >= filters.rating);
    }
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return {
      products: products.slice(startIndex, endIndex),
      total: products.length,
      totalPages: Math.ceil(products.length / limit),
    };
  }
}