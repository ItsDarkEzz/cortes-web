import { useQuery } from '@tanstack/react-query';
import { plansApi } from '@/lib/api';

export function usePlans() {
  return useQuery({
    queryKey: ['plans'],
    queryFn: () => plansApi.list(),
    staleTime: 10 * 60 * 1000, // 10 minutes - plans don't change often
  });
}
