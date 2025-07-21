import { Order, CartItem, Address } from '../types';

export class OrderService {
  private static baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  static async createOrder(orderData: {
    items: CartItem[];
    shippingAddress: Address;
    paymentMethod: string;
    total: number;
  }): Promise<Order> {
    try {
      const response = await fetch(`${this.baseUrl}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) throw new Error('Failed to create order');
      
      return await response.json();
    } catch (error) {
      console.error('Error creating order:', error);
      // Fallback - create mock order
      const mockOrder: Order = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        status: 'pending',
        total: orderData.total,
        items: orderData.items,
        shippingAddress: orderData.shippingAddress,
      };
      
      return mockOrder;
    }
  }

  static async getOrders(userId: string): Promise<Order[]> {
    try {
      const response = await fetch(`${this.baseUrl}/orders?userId=${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch orders');
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  }

  static async getOrder(orderId: string): Promise<Order | null> {
    try {
      const response = await fetch(`${this.baseUrl}/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch order');
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching order:', error);
      return null;
    }
  }

  static async updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error('Failed to update order status');
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }
}