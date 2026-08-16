import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/client';
import type { User, AuthSessionResponse } from '../types/pulse';

export const AUTH_QUERY_KEY = ['auth', 'session'] as const;

export function useSession() {
  return useQuery<AuthSessionResponse | User | null>({
    queryKey: AUTH_QUERY_KEY,
    queryFn: async () => {
      return await authApi.getSession();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });
}

export function useSignIn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      return await authApi.signIn(credentials);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, data);
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
    },
  });
}

export function useSignUp() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; email: string; password: string }) => {
      return await authApi.signUp(data);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, data);
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
    },
  });
}

export function useSignOut() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      return await authApi.signOut();
    },
    onSuccess: () => {
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
    },
  });
}
