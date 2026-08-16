import React from 'react';
import { Skeleton } from './ui/skeleton';

export { Skeleton };

export const CardSkeleton: React.FC = () => {
  return (
    <div className="p-4 bg-[#09090b] border border-white/10 rounded-none space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-20 rounded-none" />
        <Skeleton className="h-5 w-5 rounded-none" />
      </div>
      <Skeleton className="h-7 w-16 rounded-none" />
      <Skeleton className="h-3 w-28 rounded-none" />
    </div>
  );
};

export const TableRowSkeleton: React.FC<{ columns?: number }> = ({ columns = 6 }) => {
  return (
    <tr className="border-b border-white/10">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="p-3.5">
          <Skeleton className="h-3 w-full max-w-[120px] rounded-none" />
        </td>
      ))}
    </tr>
  );
};
