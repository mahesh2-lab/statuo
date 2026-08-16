import { useQuery } from '@tanstack/react-query';
import { pulseApi } from '../api/client';
import type { GetEventsQueryParams, EventsResponse } from '../types/pulse';

export const EVENTS_QUERY_KEY = ['events'] as const;

export function useEvents(params?: GetEventsQueryParams) {
  return useQuery<EventsResponse>({
    queryKey: [...EVENTS_QUERY_KEY, params],
    queryFn: async () => {
      return await pulseApi.getEvents(params);
    },
    staleTime: 1000 * 10, // 10 seconds
    refetchInterval: 1000 * 15, // Real-time poll every 15s
  });
}
