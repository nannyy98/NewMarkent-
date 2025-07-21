import { useState, useEffect, useCallback } from 'react';
import { AxiosError } from 'axios';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: AxiosError) => void;
}

export function useApi<T = any>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: UseApiOptions = {}
) {
  const { immediate = false, onSuccess, onError } = options;
  
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (...args: any[]) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await apiFunction(...args);
      setState({ data: result, loading: false, error: null });
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      
      if (onError && error instanceof AxiosError) {
        onError(error);
      }
      
      throw error;
    }
  }, [apiFunction, onSuccess, onError]);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return {
    ...state,
    execute,
    reset,
  };
}

// Specialized hook for paginated data
export function usePaginatedApi<T = any>(
  apiFunction: (page: number, ...args: any[]) => Promise<{ data: T[]; pagination: any }>,
  options: UseApiOptions = {}
) {
  const [page, setPage] = useState(1);
  const [allData, setAllData] = useState<T[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  
  const { execute, loading, error } = useApi(apiFunction, {
    ...options,
    onSuccess: (result) => {
      if (page === 1) {
        setAllData(result.data);
      } else {
        setAllData(prev => [...prev, ...result.data]);
      }
      setPagination(result.pagination);
      
      if (options.onSuccess) {
        options.onSuccess(result);
      }
    },
  });

  const loadMore = useCallback(() => {
    if (pagination && page < pagination.last_page) {
      setPage(prev => prev + 1);
    }
  }, [pagination, page]);

  const refresh = useCallback(() => {
    setPage(1);
    setAllData([]);
    setPagination(null);
  }, []);

  useEffect(() => {
    execute(page);
  }, [page, execute]);

  return {
    data: allData,
    pagination,
    loading,
    error,
    loadMore,
    refresh,
    hasMore: pagination ? page < pagination.last_page : false,
  };
}