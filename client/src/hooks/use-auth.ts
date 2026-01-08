import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { apiClient, authApi, userApi } from '@/lib/api';
import type { User } from '@/lib/api';

export function useAuth() {
  const queryClient = useQueryClient();
  const [isInitialized, setIsInitialized] = useState(false);

  // Check if we have tokens on mount
  useEffect(() => {
    setIsInitialized(true);
  }, []);

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', 'me'],
    queryFn: () => userApi.me(),
    enabled: isInitialized && apiClient.isAuthenticated(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      queryClient.clear();
    }
  }, [queryClient]);

  return {
    user,
    isLoading: !isInitialized || isLoading,
    isAuthenticated: !!user,
    error,
    logout,
  };
}

export function useAuthInit() {
  return useMutation({
    mutationFn: () => authApi.init(),
  });
}

export function useAuthStatus(authToken: string | null, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['auth', 'status', authToken],
    queryFn: () => authApi.status(authToken!),
    enabled: !!authToken && options?.enabled !== false,
    refetchInterval: (query) => {
      // Stop polling if status is success/confirmed/expired
      const status = query.state.data?.status;
      if (status === 'success' || status === 'confirmed' || status === 'expired') {
        return false;
      }
      return 2000; // Poll every 2 seconds
    },
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tokens: { access_token: string; refresh_token: string }) => {
      apiClient.setTokens(tokens.access_token, tokens.refresh_token);
      return userApi.me();
    },
    onSuccess: (user) => {
      queryClient.setQueryData(['user', 'me'], user);
    },
  });
}
