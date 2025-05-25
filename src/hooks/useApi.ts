import { useState, useCallback } from 'react';
import { ApiError } from '@/utils/request';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiOptions {
  showErrorMessage?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: ApiError) => void;
}

/**
 * API请求Hook
 */
export function useApi<T = any>(options: UseApiOptions = {}) {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (apiCall: () => Promise<T>) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await apiCall();
      setState({
        data: result,
        loading: false,
        error: null,
      });

      if (options.onSuccess) {
        options.onSuccess(result);
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof ApiError 
        ? error.message 
        : '请求失败';

      setState({
        data: null,
        loading: false,
        error: errorMessage,
      });

      if (options.onError && error instanceof ApiError) {
        options.onError(error);
      }

      throw error;
    }
  }, [options.onSuccess, options.onError]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

/**
 * 分页数据Hook
 */
export function usePagination<T>(
  apiCall: (page: number, perPage: number) => Promise<{ data: { photos: T[]; pagination: any } }>,
  initialPerPage: number = 12
) {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(initialPerPage);
  const [allData, setAllData] = useState<T[]>([]);
  const [pagination, setPagination] = useState<any>(null);

  const { loading, error, execute } = useApi({
    onSuccess: (result) => {
      if (page === 1) {
        setAllData(result.data.photos);
      } else {
        setAllData(prev => [...prev, ...result.data.photos]);
      }
      setPagination(result.data.pagination);
    }
  });

  const loadData = useCallback((pageNum: number = 1) => {
    setPage(pageNum);
    return execute(() => apiCall(pageNum, perPage));
  }, [execute, apiCall, perPage]);

  const loadMore = useCallback(() => {
    if (pagination && page < pagination.pages) {
      return loadData(page + 1);
    }
  }, [loadData, pagination, page]);

  const refresh = useCallback(() => {
    setAllData([]);
    setPagination(null);
    return loadData(1);
  }, [loadData]);

  const hasMore = pagination ? page < pagination.pages : false;

  return {
    data: allData,
    pagination,
    loading,
    error,
    hasMore,
    page,
    perPage,
    setPerPage,
    loadData,
    loadMore,
    refresh,
  };
} 