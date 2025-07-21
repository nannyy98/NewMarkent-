import { Product, User, Order, CartItem } from '../types';

// Supabase configuration (will be set up when user connects)
let supabaseUrl = '';
let supabaseKey = '';

// API service class for backend integration
export class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
  }

  // Products
  async getProducts(filters?: any): Promise<Product[]> {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(`${this.baseUrl}/products?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      return await response.json();
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback to mock data
      return [];
    }
  }

  async getProduct(id: string): Promise<Product | null> {
    try {
      const response = await fetch(`${this.baseUrl}/products/${id}`);
      if (!response.ok) throw new Error('Failed to fetch product');
      return await response.json();
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  }

  async createProduct(product: Omit<Product, 'id'>): Promise<Product> {
    try {
      const response = await fetch(`${this.baseUrl}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      if (!response.ok) throw new Error('Failed to create product');
      return await response.json();
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  // Orders
  async createOrder(order: Omit<Order, 'id'>): Promise<Order> {
    try {
      const response = await fetch(`${this.baseUrl}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });
      if (!response.ok) throw new Error('Failed to create order');
      return await response.json();
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  async getOrders(userId: string): Promise<Order[]> {
    try {
      const response = await fetch(`${this.baseUrl}/orders?userId=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch orders');
      return await response.json();
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  }

  // Analytics
  async getSellerAnalytics(sellerId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/analytics/seller/${sellerId}`);
      if (!response.ok) throw new Error('Failed to fetch analytics');
      return await response.json();
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return null;
    }
  }

  // Search
  async searchProducts(query: string, filters?: any): Promise<Product[]> {
    try {
      const params = new URLSearchParams({ q: query, ...filters });
      const response = await fetch(`${this.baseUrl}/search?${params}`);
      if (!response.ok) throw new Error('Failed to search products');
      return await response.json();
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  }

  // Notifications
  async sendNotification(notification: {
    userId: string;
    type: 'email' | 'push' | 'sms';
    title: string;
    message: string;
    data?: any;
  }): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notification),
      });
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }
}

export const apiService = new ApiService();