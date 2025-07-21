import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  orderUpdates: boolean;
  promotions: boolean;
  newsletter: boolean;
}

export class NotificationService {
  // Toast notifications
  static show(message: string, type: NotificationType = 'info') {
    const options = {
      position: 'top-right' as const,
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    };

    switch (type) {
      case 'success':
        toast.success(message, options);
        break;
      case 'error':
        toast.error(message, options);
        break;
      case 'warning':
        toast.warning(message, options);
        break;
      default:
        toast.info(message, options);
    }
  }

  // Push notifications (PWA)
  static async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }

  static async showPushNotification(title: string, options?: NotificationOptions) {
    if (await this.requestPermission()) {
      const notification = new Notification(title, {
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        ...options,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      return notification;
    }
  }

  // Email notifications (via backend)
  static async sendEmail(to: string, subject: string, content: string, template?: string) {
    try {
      await fetch('/api/notifications/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, subject, content, template }),
      });
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  }

  // SMS notifications
  static async sendSMS(to: string, message: string) {
    try {
      await fetch('/api/notifications/sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, message }),
      });
    } catch (error) {
      console.error('Failed to send SMS:', error);
    }
  }

  // Telegram notifications
  static async sendTelegramNotification(chatId: string, message: string) {
    try {
      await fetch('/api/notifications/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId, message }),
      });
    } catch (error) {
      console.error('Failed to send Telegram notification:', error);
    }
  }

  // Notification preferences
  static getPreferences(): NotificationPreferences {
    const stored = localStorage.getItem('notification_preferences');
    return stored ? JSON.parse(stored) : {
      email: true,
      sms: false,
      push: true,
      orderUpdates: true,
      promotions: false,
      newsletter: false,
    };
  }

  static savePreferences(preferences: NotificationPreferences) {
    localStorage.setItem('notification_preferences', JSON.stringify(preferences));
  }

  // Bulk notification system
  static async sendBulkNotification(
    users: string[],
    message: string,
    type: 'email' | 'sms' | 'push',
    template?: string
  ) {
    try {
      await fetch('/api/notifications/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ users, message, type, template }),
      });
    } catch (error) {
      console.error('Failed to send bulk notification:', error);
    }
  }
}

// Order notifications
export const OrderNotifications = {
  orderCreated: (orderNumber: string) => {
    NotificationService.show(`Order #${orderNumber} created successfully!`, 'success');
    NotificationService.showPushNotification('Order Confirmed', {
      body: `Your order #${orderNumber} has been confirmed`,
      tag: 'order-created',
    });
  },

  orderShipped: (orderNumber: string) => {
    NotificationService.show(`Order #${orderNumber} has been shipped!`, 'info');
    NotificationService.showPushNotification('Order Shipped', {
      body: `Your order #${orderNumber} is on its way`,
      tag: 'order-shipped',
    });
  },

  orderDelivered: (orderNumber: string) => {
    NotificationService.show(`Order #${orderNumber} delivered!`, 'success');
    NotificationService.showPushNotification('Order Delivered', {
      body: `Your order #${orderNumber} has been delivered`,
      tag: 'order-delivered',
    });
  },

  productAddedToCart: (productName: string) => {
    NotificationService.show(`${productName} added to cart`, 'success');
  },

  productAddedToFavorites: (productName: string) => {
    NotificationService.show(`${productName} added to favorites`, 'success');
  },

  // Enhanced order notifications with multi-channel support
  orderStatusChanged: async (orderNumber: string, status: string, userEmail: string, userPhone?: string) => {
    const preferences = NotificationService.getPreferences();
    
    // Toast notification
    NotificationService.show(`Order #${orderNumber} status: ${status}`, 'info');
    
    // Push notification
    if (preferences.push && preferences.orderUpdates) {
      NotificationService.showPushNotification('Order Update', {
        body: `Your order #${orderNumber} is now ${status}`,
        tag: 'order-update',
      });
    }
    
    // Email notification
    if (preferences.email && preferences.orderUpdates) {
      await NotificationService.sendEmail(
        userEmail,
        `Order #${orderNumber} Update`,
        `Your order status has been updated to: ${status}`,
        'order-update'
      );
    }
    
    // SMS notification for important statuses
    if (preferences.sms && preferences.orderUpdates && userPhone && ['shipped', 'delivered'].includes(status)) {
      await NotificationService.sendSMS(
        userPhone,
        `Your order #${orderNumber} has been ${status}. Track: link.com/track/${orderNumber}`
      );
    }
  },

  // Promotional notifications
  sendPromotion: async (userEmail: string, userPhone: string, promoCode: string, discount: string) => {
    const preferences = NotificationService.getPreferences();
    
    if (preferences.email && preferences.promotions) {
      await NotificationService.sendEmail(
        userEmail,
        `🎉 Special Offer: ${discount} OFF!`,
        `Use code ${promoCode} to get ${discount} off your next order!`,
        'promotion'
      );
    }
    
    if (preferences.push && preferences.promotions) {
      NotificationService.showPushNotification('Special Offer!', {
        body: `Use code ${promoCode} for ${discount} off`,
        tag: 'promotion',
      });
    }
  },
};