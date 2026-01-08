import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/lib/api';
import type { User } from '@/lib/api';

export function useUserStats() {
  return useQuery({
    queryKey: ['user', 'stats'],
    queryFn: () => userApi.stats(),
    staleTime: 60 * 1000, // 1 minute
  });
}

export function useUpdateUserName() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (displayName: string) => userApi.updateName(displayName),
    onSuccess: (response, displayName) => {
      // Обновляем имя в кэше пользователя
      queryClient.setQueryData(['user', 'me'], (oldData: User | undefined) => {
        if (!oldData) return oldData;
        return { ...oldData, name: displayName };
      });
    },
  });
}
