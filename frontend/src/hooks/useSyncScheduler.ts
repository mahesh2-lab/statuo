import { useMutation, useQueryClient } from '@tanstack/react-query';
import { pulseApi } from '../api/client';
import { JOBS_QUERY_KEY, ANALYTICS_QUERY_KEY } from './useJobs';
import { toast } from 'sonner';

export function useSyncScheduler() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      return await pulseApi.syncScheduler();
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Scheduler synced successfully', {
        description: data.count !== undefined ? `${data.count} monitors scheduled` : undefined,
      });
      queryClient.invalidateQueries({ queryKey: JOBS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ANALYTICS_QUERY_KEY });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to sync scheduler');
    },
  });
}
