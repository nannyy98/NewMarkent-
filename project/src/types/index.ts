export interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  image: string;
  images: string[];
  description: string;
  category: string;
  seller: Seller;
  shipping: ShippingInfo;
  specifications: Record<string, string>;
  inStock: boolean;
  soldCount: number;
}

export interface Seller {
  id: string;
  name: string;
  rating: number;
  yearInBusiness: number;
  responseRate: string;
  avatar: string;
}

export interface ShippingInfo {
  free: boolean;
  days: string;
  from: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  subcategories?: Category[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinDate: string;
  role: 'customer' | 'seller' | 'admin';
  permissions: string[];
  isEmailVerified: boolean;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: CartItem[];
  shippingAddress: Address;
}

export interface Address {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  country: string;
  zipCode: string;
  phone: string;
}

export interface FlashDeal {
  id: string;
  product: Product;
  originalPrice: number;
  dealPrice: number;
  discount: number;
  soldCount: number;
  totalCount: number;
  endTime: Date;
}