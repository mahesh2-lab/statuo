import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pulseApi } from '../api/client';
import type {
  GetJobsQueryParams,
  JobsResponse,
  JobDetailResponse,
  CreateJobPayload,
  UpdateJobPayload,
  Job,
} from '../types/pulse';
import { toast } from 'sonner';

export const JOBS_QUERY_KEY = ['jobs'] as const;
export const ANALYTICS_QUERY_KEY = ['analytics'] as const;

export function useJobs(params?: GetJobsQueryParams) {
  return useQuery<JobsResponse>({
    queryKey: [...JOBS_QUERY_KEY, params],
    queryFn: async () => {
      return await pulseApi.getJobs(params);
    },
    staleTime: 1000 * 15, // 15 seconds
  });
}

export function useJobDetail(id: string) {
  return useQuery<JobDetailResponse>({
    queryKey: ['job', id],
    queryFn: async () => {
      return await pulseApi.getJobById(id);
    },
    enabled: Boolean(id),
    staleTime: 1000 * 10,
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateJobPayload) => {
      return await pulseApi.createJob(payload);
    },
    onSuccess: (newJob) => {
      toast.success(`Monitor "${newJob.name}" created successfully`);
      queryClient.invalidateQueries({ queryKey: JOBS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ANALYTICS_QUERY_KEY });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to create monitoring job');
    },
  });
}

export function useUpdateJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateJobPayload }) => {
      return await pulseApi.updateJob(id, payload);
    },
    onSuccess: (updatedJob, { id }) => {
      toast.success(`Monitor "${updatedJob.name}" updated successfully`);
      queryClient.invalidateQueries({ queryKey: JOBS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['job', id] });
      queryClient.invalidateQueries({ queryKey: ANALYTICS_QUERY_KEY });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update monitoring job');
    },
  });
}

export function useDeleteJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return await pulseApi.deleteJob(id);
    },
    onSuccess: () => {
      toast.success('Monitoring job deleted');
      queryClient.invalidateQueries({ queryKey: JOBS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ANALYTICS_QUERY_KEY });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to delete monitoring job');
    },
  });
}

export function useToggleJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive?: boolean }) => {
      return await pulseApi.toggleJobStatus(id, isActive);
    },
    onMutate: async ({ id, isActive }) => {
      await queryClient.cancelQueries({ queryKey: JOBS_QUERY_KEY });
      const previousJobs = queryClient.getQueryData(JOBS_QUERY_KEY);

      queryClient.setQueriesData({ queryKey: JOBS_QUERY_KEY }, (old: any) => {
        if (!old || !old.jobs) return old;
        return {
          ...old,
          jobs: old.jobs.map((j: Job) =>
            j.id === id
              ? {
                  ...j,
                  isActive: isActive !== undefined ? isActive : !j.isActive,
                  status: (isActive !== undefined ? isActive : !j.isActive) ? 'HEALTHY' : 'PAUSED',
                }
              : j
          ),
        };
      });

      return { previousJobs };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousJobs) {
        queryClient.setQueryData(JOBS_QUERY_KEY, context.previousJobs);
      }
      toast.error('Failed to update monitor status');
    },
    onSettled: (_data, _error, { id }) => {
      queryClient.invalidateQueries({ queryKey: JOBS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['job', id] });
      queryClient.invalidateQueries({ queryKey: ANALYTICS_QUERY_KEY });
    },
  });
}

export function useTriggerTest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return await pulseApi.triggerTest(id);
    },
    onSuccess: (result, id) => {
      if (result.ok) {
        toast.success(
          `Response: ${result.statusCode || 200} in ${result.responseTimeMs ? Math.round(result.responseTimeMs) : 0}ms`,
          { description: 'Ping check succeeded' }
        );
      } else {
        toast.error(
          result.errorMessage || `HTTP Status ${result.statusCode || 'Failure'}`,
          { description: 'Ping check failed' }
        );
      }
      queryClient.invalidateQueries({ queryKey: JOBS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['job', id] });
      queryClient.invalidateQueries({ queryKey: ['jobLogs', id] });
      queryClient.invalidateQueries({ queryKey: ANALYTICS_QUERY_KEY });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to trigger test ping');
    },
  });
}
