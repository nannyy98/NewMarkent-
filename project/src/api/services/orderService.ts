import { api } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import { Order, Address, CartItem } from '../../types';
import { PaginatedResponse } from '../client';

export interface CreateOrderRequest {
  items: Array<{
    product_id: string;
    quantity: number;
    price: number;
  }>;
  shipping_address: Address;
  payment_method: string;
  notes?: string;
}

export interface OrderFilters {
  status?: Order['status'];
  date_from?: string;
  date_to?: string;
  page?: number;
  limit?: number;
}

export interface TrackingInfo {
  status: string;
  location: string;
  timestamp: string;
  description: string;
}

export const orderService = {
  // Get user orders
  getOrders: async (filters: OrderFilters = {}): Promise<PaginatedResponse<Order>> => {
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });

      return await api.get<PaginatedResponse<Order>>(
        `${API_ENDPOINTS.ORDERS.LIST}?${params.toString()}`
      );
    } catch (error) {
      console.error('Get orders failed:', error);
      throw error;
    }
  },

  // Get single order
  getOrder: async (id: string): Promise<Order> => {
    try {
      return await api.get<Order>(API_ENDPOINTS.ORDERS.DETAIL(id));
    } catch (error) {
      console.error('Get order failed:', error);
      throw error;
    }
  },

  // Create new order
  createOrder: async (orderData: CreateOrderRequest): Promise<Order> => {
    try {
      return await api.post<Order>(API_ENDPOINTS.ORDERS.CREATE, orderData);
    } catch (error) {
      console.error('Create order failed:', error);
      throw error;
    }
  },

  // Update order (for sellers)
  updateOrder: async (id: string, data: Partial<Order>): Promise<Order> => {
    try {
      return await api.put<Order>(API_ENDPOINTS.ORDERS.UPDATE(id), data);
    } catch (error) {
      console.error('Update order failed:', error);
      throw error;
    }
  },

  // Cancel order
  cancelOrder: async (id: string, reason?: string): Promise<Order> => {
    try {
      return await api.post<Order>(API_ENDPOINTS.ORDERS.CANCEL(id), { reason });
    } catch (error) {
      console.error('Cancel order failed:', error);
      throw error;
    }
  },

  // Track order
  trackOrder: async (id: string): Promise<TrackingInfo[]> => {
    try {
      return await api.get<TrackingInfo[]>(API_ENDPOINTS.ORDERS.TRACK(id));
    } catch (error) {
      console.error('Track order failed:', error);
      throw error;
    }
  },
};