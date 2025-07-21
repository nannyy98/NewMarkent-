import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Product, CartItem, User, Order } from '../types';
import { OrderNotifications } from '../services/notifications';
import { mockUser, mockAdmin } from '../data/mockData';

interface AppState {
  user: User | null;
  cart: CartItem[];
  favorites: Product[];
  orders: Order[];
  currency: 'USD' | 'UZS';
  language: 'en' | 'ru' | 'uz';
}

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'ADD_TO_CART'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'ADD_TO_FAVORITES'; payload: Product }
  | { type: 'REMOVE_FROM_FAVORITES'; payload: string }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'SET_CURRENCY'; payload: 'USD' | 'UZS' }
  | { type: 'SET_LANGUAGE'; payload: 'en' | 'ru' | 'uz' };

const initialState: AppState = {
  user: mockAdmin, // Используем админа для демонстрации
  cart: [],
  favorites: [],
  orders: [],
  currency: 'USD',
  language: 'en',
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'ADD_TO_CART':
      const existingItem = state.cart.find(item => item.product.id === action.payload.product.id);
      if (existingItem) {
        OrderNotifications.productAddedToCart(action.payload.product.title);
        return {
          ...state,
          cart: state.cart.map(item =>
            item.product.id === action.payload.product.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      }
      OrderNotifications.productAddedToCart(action.payload.product.title);
      return {
        ...state,
        cart: [...state.cart, { product: action.payload.product, quantity: action.payload.quantity }],
      };
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.product.id !== action.payload),
      };
    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.product.id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    case 'ADD_TO_FAVORITES':
      OrderNotifications.productAddedToFavorites(action.payload.title);
      return { ...state, favorites: [...state.favorites, action.payload] };
    case 'REMOVE_FROM_FAVORITES':
      return {
        ...state,
        favorites: state.favorites.filter(product => product.id !== action.payload),
      };
    case 'ADD_ORDER':
      OrderNotifications.orderCreated(action.payload.id);
      return { ...state, orders: [...state.orders, action.payload] };
    case 'SET_CURRENCY':
      return { ...state, currency: action.payload };
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}