import { api } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import { Product } from '../../types';
import { PaginatedResponse } from '../client';

export interface ProductFilters {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  brands?: string[];
  freeShipping?: boolean;
  sortBy?: 'price-low' | 'price-high' | 'rating' | 'popularity' | 'newest';
  page?: number;
  limit?: number;
}

export interface ProductReview {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar: string;
  rating: number;
  comment: string;
  images?: string[];
  created_at: string;
  helpful_count: number;
}

export interface CreateReviewRequest {
  rating: number;
  comment: string;
  images?: File[];
}

export const productService = {
  // Get products with filters and pagination
  getProducts: async (filters: ProductFilters = {}): Promise<PaginatedResponse<Product>> => {
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(item => params.append(`${key}[]`, item.toString()));
          } else {
            params.append(key, value.toString());
          }
        }
      });

      const response = await api.get<PaginatedResponse<Product>>(
        `${API_ENDPOINTS.PRODUCTS.LIST}?${params.toString()}`
      );
      
      return response;
    } catch (error) {
      console.error('Get products failed:', error);
      throw error;
    }
  },

  // Get single product by ID
  getProduct: async (id: string): Promise<Product> => {
    try {
      return await api.get<Product>(API_ENDPOINTS.PRODUCTS.DETAIL(id));
    } catch (error) {
      console.error('Get product failed:', error);
      throw error;
    }
  },

  // Search products
  searchProducts: async (query: string, filters: Omit<ProductFilters, 'search'> = {}): Promise<PaginatedResponse<Product>> => {
    try {
      const params = new URLSearchParams({ search: query });
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(item => params.append(`${key}[]`, item.toString()));
          } else {
            params.append(key, value.toString());
          }
        }
      });

      return await api.get<PaginatedResponse<Product>>(
        `${API_ENDPOINTS.PRODUCTS.SEARCH}?${params.toString()}`
      );
    } catch (error) {
      console.error('Search products failed:', error);
      throw error;
    }
  },

  // Get product categories
  getCategories: async (): Promise<string[]> => {
    try {
      return await api.get<string[]>(API_ENDPOINTS.PRODUCTS.CATEGORIES);
    } catch (error) {
      console.error('Get categories failed:', error);
      throw error;
    }
  },

  // Get product brands
  getBrands: async (): Promise<string[]> => {
    try {
      return await api.get<string[]>(API_ENDPOINTS.PRODUCTS.BRANDS);
    } catch (error) {
      console.error('Get brands failed:', error);
      throw error;
    }
  },

  // Get product reviews
  getReviews: async (productId: string, page = 1): Promise<PaginatedResponse<ProductReview>> => {
    try {
      return await api.get<PaginatedResponse<ProductReview>>(
        `${API_ENDPOINTS.PRODUCTS.REVIEWS(productId)}?page=${page}`
      );
    } catch (error) {
      console.error('Get reviews failed:', error);
      throw error;
    }
  },

  // Add product review
  addReview: async (productId: string, review: CreateReviewRequest): Promise<ProductReview> => {
    try {
      const formData = new FormData();
      formData.append('rating', review.rating.toString());
      formData.append('comment', review.comment);
      
      if (review.images) {
        review.images.forEach((image, index) => {
          formData.append(`images[${index}]`, image);
        });
      }

      return await api.post<ProductReview>(
        API_ENDPOINTS.PRODUCTS.ADD_REVIEW(productId),
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
    } catch (error) {
      console.error('Add review failed:', error);
      throw error;
    }
  },

  // Create product (for sellers)
  createProduct: async (productData: Omit<Product, 'id'>): Promise<Product> => {
    try {
      return await api.post<Product>(API_ENDPOINTS.PRODUCTS.CREATE, productData);
    } catch (error) {
      console.error('Create product failed:', error);
      throw error;
    }
  },

  // Update product (for sellers)
  updateProduct: async (id: string, productData: Partial<Product>): Promise<Product> => {
    try {
      return await api.put<Product>(API_ENDPOINTS.PRODUCTS.UPDATE(id), productData);
    } catch (error) {
      console.error('Update product failed:', error);
      throw error;
    }
  },

  // Delete product (for sellers)
  deleteProduct: async (id: string): Promise<void> => {
    try {
      await api.delete(API_ENDPOINTS.PRODUCTS.DELETE(id));
    } catch (error) {
      console.error('Delete product failed:', error);
      throw error;
    }
  },
};