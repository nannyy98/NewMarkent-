import { api } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import { CartItem, Product } from '../../types';

export interface CartResponse {
  items: CartItem[];
  total: number;
  count: number;
}

export interface AddToCartRequest {
  product_id: string;
  quantity: number;
  variant?: string;
}

export interface UpdateCartRequest {
  quantity: number;
}

export const cartService = {
  // Get cart items
  getCart: async (): Promise<CartResponse> => {
    try {
      return await api.get<CartResponse>(API_ENDPOINTS.CART.GET);
    } catch (error) {
      console.error('Get cart failed:', error);
      throw error;
    }
  },

  // Add item to cart
  addToCart: async (item: AddToCartRequest): Promise<CartResponse> => {
    try {
      return await api.post<CartResponse>(API_ENDPOINTS.CART.ADD, item);
    } catch (error) {
      console.error('Add to cart failed:', error);
      throw error;
    }
  },

  // Update cart item quantity
  updateCartItem: async (itemId: string, data: UpdateCartRequest): Promise<CartResponse> => {
    try {
      return await api.put<CartResponse>(API_ENDPOINTS.CART.UPDATE(itemId), data);
    } catch (error) {
      console.error('Update cart item failed:', error);
      throw error;
    }
  },

  // Remove item from cart
  removeFromCart: async (itemId: string): Promise<CartResponse> => {
    try {
      return await api.delete<CartResponse>(API_ENDPOINTS.CART.REMOVE(itemId));
    } catch (error) {
      console.error('Remove from cart failed:', error);
      throw error;
    }
  },

  // Clear entire cart
  clearCart: async (): Promise<void> => {
    try {
      await api.delete(API_ENDPOINTS.CART.CLEAR);
    } catch (error) {
      console.error('Clear cart failed:', error);
      throw error;
    }
  },
};