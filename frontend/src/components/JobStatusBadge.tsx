import React from 'react';
import { Check, AlertTriangle, XCircle, Pause, Clock } from 'lucide-react';
import type { JobStatus } from '../types/pulse';

interface JobStatusBadgeProps {
  status: JobStatus | string;
  size?: 'sm' | 'md';
  pulse?: boolean;
  className?: string;
}

export const JobStatusBadge: React.FC<JobStatusBadgeProps> = ({
  status,
  size = 'sm',
  pulse = false,
  className = '',
}) => {
  const normalizedStatus = (status || 'PENDING').toUpperCase() as JobStatus;

  const config: Record<
    JobStatus,
    { label: string; icon: React.ComponentType<{ className?: string }>; bg: string; text: string; border: string; dot: string }
  > = {
    HEALTHY: {
      label: 'HEALTHY',
      icon: Check,
      bg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
      text: 'text-emerald-700 dark:text-emerald-400',
      border: 'border-emerald-500/25',
      dot: 'bg-emerald-500',
    },
    DEGRADED: {
      label: 'DEGRADED',
      icon: AlertTriangle,
      bg: 'bg-amber-500/10 dark:bg-amber-500/15',
      text: 'text-amber-700 dark:text-amber-400',
      border: 'border-amber-500/25',
      dot: 'bg-amber-500',
    },
    DOWN: {
      label: 'DOWN',
      icon: XCircle,
      bg: 'bg-rose-500/10 dark:bg-rose-500/15',
      text: 'text-rose-700 dark:text-rose-400',
      border: 'border-rose-500/25',
      dot: 'bg-rose-500',
    },
    PAUSED: {
      label: 'PAUSED',
      icon: Pause,
      bg: 'bg-zinc-500/10 dark:bg-zinc-500/15',
      text: 'text-zinc-600 dark:text-zinc-400',
      border: 'border-zinc-500/25',
      dot: 'bg-zinc-500',
    },
    PENDING: {
      label: 'PENDING',
      icon: Clock,
      bg: 'bg-blue-500/10 dark:bg-blue-500/15',
      text: 'text-blue-700 dark:text-blue-400',
      border: 'border-blue-500/25',
      dot: 'bg-blue-500',
    },
  };

  const item = config[normalizedStatus] || config.PENDING;
  const Icon = item.icon;

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px] gap-1' : 'px-2.5 py-1 text-xs gap-1.5';
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5';

  return (
    <span
      className={`inline-flex items-center font-mono font-bold tracking-wider uppercase border rounded-none transition-colors select-none ${item.bg} ${item.text} ${item.border} ${sizeClasses} ${className}`}
    >
      {pulse ? (
        <span className="relative flex h-1.5 w-1.5 mr-0.5">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-none opacity-75 ${item.dot}`} />
          <span className={`relative inline-flex rounded-none h-1.5 w-1.5 ${item.dot}`} />
        </span>
      ) : (
        <Icon className={iconSize} />
      )}
      <span>{item.label}</span>
    </span>
  );
};

export const StatusBadge = JobStatusBadge;
