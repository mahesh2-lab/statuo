import { useQuery } from '@tanstack/react-query';
import { pulseApi } from '../api/client';
import type { GetJobLogsQueryParams, JobLogsResponse } from '../types/pulse';

export function useJobLogs(id: string, params?: GetJobLogsQueryParams) {
  return useQuery<JobLogsResponse>({
    queryKey: ['jobLogs', id, params],
    queryFn: async () => {
      return await pulseApi.getJobLogs(id, params);
    },
    enabled: Boolean(id),
    staleTime: 1000 * 15,
  });
}
