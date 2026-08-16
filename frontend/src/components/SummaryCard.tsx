import React from 'react';
import type { JobStatus } from '../types/pulse';
import { STATUS_COLORS } from '../lib/constants';
import { Card } from './ui/card';
import { cn } from '../lib/utils';

interface SummaryCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  status?: JobStatus;
  icon?: React.ReactNode;
  trend?: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  subtitle,
  status,
  icon,
}) => {
  const statusConfig = status ? STATUS_COLORS[status] : null;

  return (
    <Card
      size="sm"
      className={cn(
        'relative overflow-hidden p-4 rounded-none border bg-[#09090b] shadow-none gap-0',
        statusConfig ? `${statusConfig.badgeBorder} border-l-2` : 'border-white/10'
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-zinc-400 font-mono uppercase tracking-wider">
          {title}
        </span>
        {icon && (
          <div
            className={cn(
              'p-1.5 rounded-none',
              statusConfig ? statusConfig.badgeBg : 'bg-white/[0.05] text-zinc-400'
            )}
          >
            {icon}
          </div>
        )}
      </div>

      <div className="mt-2.5 flex items-baseline gap-2">
        <span
          className={cn(
            'text-2xl font-bold tracking-tight',
            statusConfig ? statusConfig.textColor : 'text-white'
          )}
        >
          {value}
        </span>
      </div>

      {subtitle && <p className="mt-1 text-xs text-zinc-400 font-sans">{subtitle}</p>}
    </Card>
  );
};
