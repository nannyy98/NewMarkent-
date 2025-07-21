import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { NotificationService } from '../services/notifications';

// API Configuration
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Create axios instance
const apiClient: AxiosInstance = axios.create(API_CONFIG);

// Request interceptor
apiClient.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // Handle relative URLs for better platform compatibility
    if (config.url && !config.url.startsWith('http') && !config.url.startsWith('/')) {
      config.url = `/api/${config.url}`;
    }
    
    // Check if online
    if (!navigator.onLine) {
      return Promise.reject(new Error('Нет подключения к интернету'));
    }
    
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() };
    
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error: AxiosError) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Update online status
    window.dispatchEvent(new Event('online'));
    
    // Calculate request duration
    const duration = new Date().getTime() - response.config.metadata?.startTime?.getTime();
    console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} (${duration}ms)`);
    
    return response;
  },
  (error: AxiosError) => {
    // Check if network error
    if (!error.response && !navigator.onLine) {
      window.dispatchEvent(new Event('offline'));
    }
    
    const duration = error.config?.metadata?.startTime 
      ? new Date().getTime() - error.config.metadata.startTime.getTime()
      : 0;
    
    console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url} (${duration}ms)`, error);
    
    // Handle different error types
    handleApiError(error);
    
    return Promise.reject(error);
  }
);

// Error handling function
function handleApiError(error: AxiosError) {
  if (!error.response) {
    // Check if offline
    if (!navigator.onLine) {
      NotificationService.show('Нет подключения к интернету. Пожалуйста, проверьте соединение.', 'error');
    }
    // Network error
    NotificationService.show('Network error. Please check your connection.', 'error');
    return;
  }

  const { status, data } = error.response;
  
  // If offline, show offline message
  if (!navigator.onLine) {
    NotificationService.show('Нет подключения к интернету. Пожалуйста, проверьте соединение.', 'error');
    return;
  }
  
  switch (status) {
    case 400:
      NotificationService.show(data?.message || 'Invalid request', 'error');
      break;
    case 401:
      // Unauthorized - redirect to login
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      NotificationService.show('Session expired. Please login again.', 'error');
      window.location.href = '/auth';
      break;
    case 403:
      NotificationService.show('Access denied', 'error');
      break;
    case 404:
      NotificationService.show('Resource not found', 'error');
      break;
    case 422:
      // Validation errors
      if (data?.errors) {
        Object.values(data.errors).forEach((error: any) => {
          NotificationService.show(error[0], 'error');
        });
      } else {
        NotificationService.show(data?.message || 'Validation error', 'error');
      }
      break;
    case 429:
      NotificationService.show('Too many requests. Please try again later.', 'warning');
      break;
    case 500:
      NotificationService.show('Server error. Please try again later.', 'error');
      break;
    default:
      NotificationService.show('Something went wrong. Please try again.', 'error');
  }
  
  // If we get here, we're online
  if (status !== 0) {
    window.dispatchEvent(new Event('online'));
  }
}

// API Response types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  code?: string;
}

// Generic API methods
export const api = {
  // GET request
  get: async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.get<ApiResponse<T>>(url, config);
    return response.data.data;
  },

  // POST request
  post: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.post<ApiResponse<T>>(url, data, config);
    return response.data.data;
  },

  // PUT request
  put: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.put<ApiResponse<T>>(url, data, config);
    return response.data.data;
  },

  // PATCH request
  patch: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.patch<ApiResponse<T>>(url, data, config);
    return response.data.data;
  },

  // DELETE request
  delete: async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.delete<ApiResponse<T>>(url, config);
    return response.data.data;
  },

  // Upload file
  upload: async <T = any>(url: string, file: File, onProgress?: (progress: number) => void): Promise<T> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<ApiResponse<T>>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });

    return response.data.data;
  },
};

export default apiClient;