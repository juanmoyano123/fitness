import { useState, useCallback } from 'react';

interface UseApiCallResult<T> {
  execute: (apiCall: () => Promise<T>) => Promise<T | null>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

/**
 * Hook for consistent API call handling with loading and error states
 *
 * Features:
 * - Automatic loading state management
 * - User-friendly error messages
 * - Error display (can be customized with toast library)
 *
 * Usage:
 * ```tsx
 * const { execute, loading, error } = useApiCall();
 *
 * const loadData = async () => {
 *   const result = await execute(async () => {
 *     const response = await api.getClients();
 *     return response.data;
 *   });
 *
 *   if (result) {
 *     setClients(result);
 *   }
 * };
 * ```
 */
export function useApiCall<T = any>(): UseApiCallResult<T> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (apiCall: () => Promise<T>): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiCall();
      return result;
    } catch (err: any) {
      const errorMsg = err.message || 'Error desconocido';
      setError(errorMsg);

      // Optional: Integrate with toast notification library
      if (typeof window !== 'undefined') {
        console.error('API Error:', errorMsg);
      }

      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { execute, loading, error, clearError };
}
