import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authService } from '../api/services/authService';
import { NotificationService } from '../services/notifications';

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isInitialized: boolean;
  loginAttempts: number;
  lastLoginAttempt: number | null;
}

type AuthAction =
  | { type: 'INITIALIZE_START' }
  | { type: 'INITIALIZE_SUCCESS'; payload: { user: User; token: string; refreshToken: string } }
  | { type: 'INITIALIZE_FAILURE' }
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string; refreshToken: string } }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'TOKEN_REFRESH_SUCCESS'; payload: { token: string; refreshToken: string } }
  | { type: 'TOKEN_REFRESH_FAILURE' }
  | { type: 'SET_USER'; payload: User }
  | { type: 'INCREMENT_LOGIN_ATTEMPTS' }
  | { type: 'RESET_LOGIN_ATTEMPTS' };

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isLoading: false,
  isAuthenticated: false,
  isInitialized: false,
  loginAttempts: 0,
  lastLoginAttempt: null,
};

const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, email: string, password: string) => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  isBlocked: () => boolean;
} | null>(null);

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'INITIALIZE_START':
      return { ...state, isLoading: true };
    
    case 'INITIALIZE_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        isLoading: false,
        isAuthenticated: true,
        isInitialized: true,
      };
    
    case 'INITIALIZE_FAILURE':
      return { 
        ...state, 
        isLoading: false, 
        isAuthenticated: false, 
        isInitialized: true 
      };
    
    case 'LOGIN_START':
      return { ...state, isLoading: true };
    
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        isLoading: false,
        isAuthenticated: true,
        loginAttempts: 0,
        lastLoginAttempt: null,
      };
    
    case 'LOGIN_FAILURE':
      return { 
        ...state, 
        isLoading: false, 
        isAuthenticated: false,
        loginAttempts: state.loginAttempts + 1,
        lastLoginAttempt: Date.now(),
      };
    
    case 'LOGOUT':
      return { 
        ...initialState, 
        isInitialized: true 
      };
    
    case 'TOKEN_REFRESH_SUCCESS':
      return {
        ...state,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
      };
    
    case 'TOKEN_REFRESH_FAILURE':
      return { 
        ...initialState, 
        isInitialized: true 
      };
    
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    case 'INCREMENT_LOGIN_ATTEMPTS':
      return {
        ...state,
        loginAttempts: state.loginAttempts + 1,
        lastLoginAttempt: Date.now(),
      };
    
    case 'RESET_LOGIN_ATTEMPTS':
      return {
        ...state,
        loginAttempts: 0,
        lastLoginAttempt: null,
      };
    
    default:
      return state;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state on app start
  useEffect(() => {
    initializeAuth();
  }, []);

  // Auto refresh token before expiry
  useEffect(() => {
    if (state.token && state.isAuthenticated) {
      const tokenData = parseJWT(state.token);
      if (tokenData?.exp) {
        const expiryTime = tokenData.exp * 1000;
        const currentTime = Date.now();
        const timeUntilExpiry = expiryTime - currentTime;
        
        // Refresh token 5 minutes before expiry
        const refreshTime = Math.max(timeUntilExpiry - 5 * 60 * 1000, 60 * 1000);
        
        const timer = setTimeout(() => {
          refreshTokenHandler();
        }, refreshTime);

        return () => clearTimeout(timer);
      }
    }
  }, [state.token, state.isAuthenticated]);

  const initializeAuth = async () => {
    dispatch({ type: 'INITIALIZE_START' });
    
    try {
      const token = localStorage.getItem('auth_token');
      const refreshToken = localStorage.getItem('refresh_token');
      const userData = localStorage.getItem('user');
      
      if (token && refreshToken && userData) {
        // Check if token is still valid
        const tokenData = parseJWT(token);
        const currentTime = Date.now() / 1000;
        
        if (tokenData?.exp && tokenData.exp > currentTime) {
          // Token is still valid
          const user = JSON.parse(userData);
          dispatch({ 
            type: 'INITIALIZE_SUCCESS', 
            payload: { user, token, refreshToken } 
          });
        } else {
          // Token expired, try to refresh
          await refreshTokenHandler();
        }
      } else {
        dispatch({ type: 'INITIALIZE_FAILURE' });
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
      clearAuthData();
      dispatch({ type: 'INITIALIZE_FAILURE' });
    }
  };

  const login = async (email: string, password: string, rememberMe = false) => {
    // Check if user is temporarily blocked
    if (isBlocked()) {
      throw new Error('Слишком много неудачных попыток входа. Пожалуйста, попробуйте позже.');
    }
    
    // Check internet connection
    if (!navigator.onLine) {
      throw new Error('Нет подключения к интернету. Пожалуйста, проверьте соединение и попробуйте снова.');
    }

    dispatch({ type: 'LOGIN_START' });
    
    try {
      const response = await authService.login({ email, password });
      
      // Store tokens and user data
      storeAuthData(response.token, response.refreshToken, response.user, rememberMe);
      
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: { 
          user: response.user, 
          token: response.token, 
          refreshToken: response.refreshToken 
        } 
      });
      
      NotificationService.show('Login successful!', 'success');
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });

    // Check internet connection
    if (!navigator.onLine) {
      throw new Error('Нет подключения к интернету. Пожалуйста, проверьте соединение и попробуйте снова.');
    }
    
    try {
      const response = await authService.register({ 
        name, 
        email, 
        password, 
        password_confirmation: password 
      });
      
      // Store tokens and user data
      storeAuthData(response.token, response.refreshToken, response.user);
      
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: { 
          user: response.user, 
          token: response.token, 
          refreshToken: response.refreshToken 
        } 
      });
      
      NotificationService.show('Registration successful!', 'success');
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Check internet connection
      if (!navigator.onLine) {
        throw new Error('Нет подключения к интернету. Изменения будут применены только локально.');
      }
      
      await authService.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      clearAuthData();
      dispatch({ type: 'LOGOUT' });
      NotificationService.show('Logged out successfully', 'info');
    }
  };

  const refreshTokenHandler = async () => {
    try {
      // Check internet connection
      if (!navigator.onLine) {
        throw new Error('Нет подключения к интернету. Невозможно обновить токен.');
      }
      
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await authService.refreshToken();
      
      // Update stored tokens
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('refresh_token', response.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      dispatch({ 
        type: 'TOKEN_REFRESH_SUCCESS', 
        payload: { 
          token: response.token, 
          refreshToken: response.refreshToken 
        } 
      });
    } catch (error) {
      console.error('Token refresh failed:', error);
      clearAuthData();
      dispatch({ type: 'TOKEN_REFRESH_FAILURE' });
      NotificationService.show('Session expired. Please login again.', 'warning');
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      // Check internet connection
      if (!navigator.onLine) {
        throw new Error('Нет подключения к интернету. Пожалуйста, проверьте соединение и попробуйте снова.');
      }
      
      await authService.forgotPassword({ email });
      NotificationService.show('Password reset email sent!', 'success');
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (token: string, email: string, password: string) => {
    try {
      // Check internet connection
      if (!navigator.onLine) {
        throw new Error('Нет подключения к интернету. Пожалуйста, проверьте соединение и попробуйте снова.');
      }
      
      await authService.resetPassword({ 
        token, 
        email, 
        password, 
        password_confirmation: password 
      });
      NotificationService.show('Password reset successful!', 'success');
    } catch (error) {
      throw error;
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      // Check internet connection
      if (!navigator.onLine) {
        throw new Error('Нет подключения к интернету. Пожалуйста, проверьте соединение и попробуйте снова.');
      }
      
      const updatedUser = await authService.updateProfile(userData);
      
      // Update stored user data
      localStorage.setItem('user', JSON.stringify(updatedUser));
      dispatch({ type: 'SET_USER', payload: updatedUser });
      
      NotificationService.show('Profile updated successfully!', 'success');
    } catch (error) {
      throw error;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      // Check internet connection
      if (!navigator.onLine) {
        throw new Error('Нет подключения к интернету. Пожалуйста, проверьте соединение и попробуйте снова.');
      }
      
      await authService.changePassword({ currentPassword, newPassword });
      NotificationService.show('Password changed successfully!', 'success');
    } catch (error) {
      throw error;
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!state.user?.permissions) return false;
    return state.user.permissions.includes(permission);
  };

  const hasRole = (role: string): boolean => {
    if (!state.user?.role) return false;
    return state.user.role === role;
  };

  const isBlocked = (): boolean => {
    if (state.loginAttempts < 5) return false;
    if (!state.lastLoginAttempt) return false;
    
    const blockDuration = 15 * 60 * 1000; // 15 minutes
    const timeSinceLastAttempt = Date.now() - state.lastLoginAttempt;
    
    return timeSinceLastAttempt < blockDuration;
  };

  // Helper functions
  const storeAuthData = (token: string, refreshToken: string, user: User, rememberMe = false) => {
    if (rememberMe) {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('refresh_token', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      sessionStorage.setItem('auth_token', token);
      sessionStorage.setItem('refresh_token', refreshToken);
      sessionStorage.setItem('user', JSON.stringify(user));
    }
  };

  const clearAuthData = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('refresh_token');
    sessionStorage.removeItem('user');
  };

  const parseJWT = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing JWT:', error);
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      state, 
      dispatch, 
      login, 
      register, 
      logout, 
      refreshToken: refreshTokenHandler,
      forgotPassword,
      resetPassword,
      updateProfile,
      changePassword,
      hasPermission,
      hasRole,
      isBlocked,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}