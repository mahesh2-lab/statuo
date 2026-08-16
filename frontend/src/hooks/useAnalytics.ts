import { useQuery } from '@tanstack/react-query';
import { pulseApi } from '../api/client';
import type { AnalyticsResponse } from '../types/pulse';

export const ANALYTICS_QUERY_KEY = ['analytics'] as const;

export function useAnalytics() {
  return useQuery<AnalyticsResponse>({
    queryKey: ANALYTICS_QUERY_KEY,
    queryFn: async () => {
      return await pulseApi.getAnalytics();
    },
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 30, // Auto-refresh metrics every 30 seconds
  });
}
