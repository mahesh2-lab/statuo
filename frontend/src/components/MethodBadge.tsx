import React from 'react';
import type { HttpMethod } from '../types/pulse';
import { Badge } from './ui/badge';
import { cn } from '../lib/utils';

interface MethodBadgeProps {
  method?: HttpMethod | string;
  className?: string;
}

export const MethodBadge: React.FC<MethodBadgeProps> = ({ method = 'GET', className = '' }) => {
  const m = method.toUpperCase();

  return (
    <Badge
      variant="secondary"
      className={cn('font-mono font-semibold text-[10px] px-2 py-0.5 tracking-wider', className)}
    >
      {m}
    </Badge>
  );
};
