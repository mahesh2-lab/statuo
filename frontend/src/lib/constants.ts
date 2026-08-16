import type { JobStatus, LogStatus } from '../types/pulse';

export const STATUS_COLORS: Record<
  JobStatus,
  {
    hex: string;
    dotBg: string;
    badgeBg: string;
    badgeBorder: string;
    textColor: string;
    label: string;
  }
> = {
  HEALTHY: {
    hex: '#10B981',
    dotBg: 'bg-emerald-500',
    badgeBg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
    badgeBorder: 'border-emerald-200 dark:border-emerald-800',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    label: 'Healthy',
  },
  DEGRADED: {
    hex: '#F59E0B',
    dotBg: 'bg-amber-500',
    badgeBg: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
    badgeBorder: 'border-amber-200 dark:border-amber-800',
    textColor: 'text-amber-600 dark:text-amber-400',
    label: 'Degraded',
  },
  DOWN: {
    hex: '#EF4444',
    dotBg: 'bg-rose-500',
    badgeBg: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300',
    badgeBorder: 'border-rose-200 dark:border-rose-800',
    textColor: 'text-rose-600 dark:text-rose-400',
    label: 'Down',
  },
  PAUSED: {
    hex: '#6B7280',
    dotBg: 'bg-zinc-500',
    badgeBg: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
    badgeBorder: 'border-zinc-200 dark:border-zinc-700',
    textColor: 'text-zinc-500 dark:text-zinc-400',
    label: 'Paused',
  },
  PENDING: {
    hex: '#3B82F6',
    dotBg: 'bg-sky-500',
    badgeBg: 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300',
    badgeBorder: 'border-sky-200 dark:border-sky-800',
    textColor: 'text-sky-600 dark:text-sky-400',
    label: 'Pending',
  },
};

export const LOG_STATUS_COLORS: Record<
  LogStatus,
  {
    hex: string;
    dotBg: string;
    badgeBg: string;
    badgeBorder: string;
    textColor: string;
    label: string;
  }
> = {
  SUCCESS: {
    hex: '#10B981',
    dotBg: 'bg-emerald-500',
    badgeBg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
    badgeBorder: 'border-emerald-200 dark:border-emerald-800',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    label: 'Success',
  },
  RETRY: {
    hex: '#F59E0B',
    dotBg: 'bg-amber-500',
    badgeBg: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
    badgeBorder: 'border-amber-200 dark:border-amber-800',
    textColor: 'text-amber-600 dark:text-amber-400',
    label: 'Retry',
  },
  FAILED: {
    hex: '#EF4444',
    dotBg: 'bg-rose-500',
    badgeBg: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300',
    badgeBorder: 'border-rose-200 dark:border-rose-800',
    textColor: 'text-rose-600 dark:text-rose-400',
    label: 'Failed',
  },
};
