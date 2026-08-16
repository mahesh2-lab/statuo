import React from 'react';
import { ChevronLeft, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { JobLog, Pagination } from '../types/pulse';
import { StatusBadge } from './StatusBadge';
import { formatLatency, formatRelativeTime, formatStatusCode } from '../lib/formatters';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from './ui/table';
import { Button } from './ui/button';

interface LogsTableProps {
  logs: JobLog[];
  pagination?: Pagination;
  isLoading?: boolean;
  onPageChange?: (newOffset: number) => void;
}

export const LogsTable: React.FC<LogsTableProps> = ({
  logs,
  pagination,
  isLoading = false,
  onPageChange,
}) => {
  if (logs.length === 0 && !isLoading) {
    return (
      <div className="p-8 text-center border border-dashed border-white/10 rounded-none text-zinc-400 text-xs font-sans">
        No execution logs recorded yet.
      </div>
    );
  }

  const currentPage = pagination ? Math.floor(pagination.offset / pagination.limit) + 1 : 1;
  const totalPages = pagination ? Math.ceil(pagination.total / pagination.limit) : 1;

  return (
    <div className="rounded-none border border-white/10 bg-[#09090b] overflow-hidden">
      <div className="overflow-x-auto">
        <Table className="w-full text-left text-xs">
          <TableHeader className="bg-white/[0.03] border-b border-white/10">
            <TableRow className="border-b border-white/10 hover:bg-transparent">
              <TableHead className="py-3 pl-4 pr-3 text-[11px] font-medium text-zinc-400 font-mono uppercase tracking-wider">
                Status
              </TableHead>
              <TableHead className="py-3 px-3 text-[11px] font-medium text-zinc-400 font-mono uppercase tracking-wider">
                HTTP Code
              </TableHead>
              <TableHead className="py-3 px-3 text-[11px] font-medium text-zinc-400 font-mono uppercase tracking-wider">
                Latency
              </TableHead>
              <TableHead className="py-3 px-3 text-[11px] font-medium text-zinc-400 font-mono uppercase tracking-wider">
                Attempt
              </TableHead>
              <TableHead className="py-3 px-3 text-[11px] font-medium text-zinc-400 font-mono uppercase tracking-wider">
                Details / Error
              </TableHead>
              <TableHead className="py-3 pl-3 pr-4 text-right text-[11px] font-medium text-zinc-400 font-mono uppercase tracking-wider">
                Executed At
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-white/10">
            {logs.map((log) => (
              <TableRow key={log.id} className="hover:bg-white/[0.03] border-white/10 transition-colors duration-150">
                {/* Status Badge */}
                <TableCell className="py-3 pl-4 pr-3 whitespace-nowrap">
                  <StatusBadge status={log.status} size="sm" />
                </TableCell>

                {/* HTTP Status Code */}
                <TableCell className="py-3 px-3 whitespace-nowrap font-mono text-xs text-zinc-300">
                  {formatStatusCode(log.statusCode)}
                </TableCell>

                {/* Response Time */}
                <TableCell className="py-3 px-3 whitespace-nowrap font-mono text-xs font-semibold text-zinc-200">
                  {formatLatency(log.responseTimeMs ?? log.responseTime)}
                </TableCell>

                {/* Attempt Number */}
                <TableCell className="py-3 px-3 whitespace-nowrap text-xs text-zinc-400 font-mono">
                  #{log.attempt}
                </TableCell>

                {/* Details / Error message */}
                <TableCell className="py-3 px-3 text-xs max-w-[280px]">
                  {log.errorMessage ? (
                    <div className="flex items-start gap-1.5 text-rose-400 font-mono text-[11px] truncate">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span className="truncate">{log.errorMessage}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-[#34d399] text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>OK</span>
                    </div>
                  )}
                </TableCell>

                {/* Executed At */}
                <TableCell className="py-3 pl-3 pr-4 whitespace-nowrap text-right text-xs text-zinc-400">
                  <span className="font-sans">{new Date(log.executedAt).toLocaleString()}</span>
                  <div className="text-[10px] text-zinc-400 font-mono">({formatRelativeTime(log.executedAt)})</div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Bar */}
      {pagination && pagination.total > pagination.limit && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-white/10 bg-black/40 text-xs text-zinc-400 font-mono">
          <div>
            Showing <strong className="text-zinc-200">{pagination.offset + 1}</strong> to{' '}
            <strong className="text-zinc-200">
              {Math.min(pagination.offset + pagination.limit, pagination.total)}
            </strong>{' '}
            of <strong className="text-zinc-200">{pagination.total}</strong> logs
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon-xs"
              onClick={() => onPageChange && onPageChange(Math.max(0, pagination.offset - pagination.limit))}
              disabled={pagination.offset === 0}
              aria-label="Previous page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </Button>
            <span className="font-mono text-[11px]">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon-xs"
              onClick={() =>
                onPageChange && onPageChange(pagination.offset + pagination.limit)
              }
              disabled={pagination.offset + pagination.limit >= pagination.total}
              aria-label="Next page"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
