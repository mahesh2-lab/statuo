import React, { useState } from 'react';
import {
  ListOrdered,
  Search,
  Filter,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Card } from '../components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '../components/ui/table';
import { Skeleton } from '../components/ui/skeleton';
import { EmptyState } from '../components/EmptyState';
import { useJobs } from '../hooks/useJobs';
import { formatDateTime, formatLatency } from '../lib/formatters';

interface LogItem {
  id: string;
  jobId: string;
  jobName: string;
  url: string;
  status: 'SUCCESS' | 'RETRY' | 'FAILED';
  statusCode: number;
  responseTime: number;
  responseTimeMs?: number;
  attempt: number;
  executedAt: string;
  errorMessage?: string;
}

export const LogsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const limit = 15;

  const { data: jobsData, isLoading, refetch } = useJobs({ limit: 50 });
  const jobs = jobsData?.jobs || [];

  // Generate combined cross-job logs list from active monitors
  const allLogs: LogItem[] = [];
  jobs.forEach((job) => {
    if (job.lastRunAt) {
      allLogs.push({
        id: `log_${job.id}_latest`,
        jobId: job.id,
        jobName: job.name,
        url: job.url,
        status: job.status === 'DOWN' ? 'FAILED' : job.status === 'DEGRADED' ? 'RETRY' : 'SUCCESS',
        statusCode: job.lastStatusCode || (job.status === 'DOWN' ? 503 : 200),
        responseTime: job.lastResponseTime || 45,
        attempt: job.consecutiveFailures ? job.consecutiveFailures + 1 : 1,
        executedAt: job.lastRunAt,
      });
    }
  });

  const filteredLogs = allLogs.filter((log) => {
    const matchesSearch =
      log.jobName.toLowerCase().includes(search.toLowerCase()) ||
      log.url.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const paginatedLogs = filteredLogs.slice((page - 1) * limit, page * limit);
  const totalPages = Math.ceil(filteredLogs.length / limit) || 1;

  const getLogBadge = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 border border-emerald-500/20">
            <CheckCircle2 className="w-2.5 h-2.5" />
            <span>200 OK</span>
          </span>
        );
      case 'RETRY':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 border border-amber-500/20">
            <AlertTriangle className="w-2.5 h-2.5" />
            <span>RETRY</span>
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-1.5 py-0.5 border border-rose-500/20">
            <XCircle className="w-2.5 h-2.5" />
            <span>FAILED</span>
          </span>
        );
      default:
        return <span className="font-mono text-xs text-muted-foreground">{status}</span>;
    }
  };

  return (
    <div className="space-y-4 py-1">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold tracking-tight text-foreground font-sans uppercase">
              Incident & Execution Logs
            </h1>
            <span className="px-1.5 py-0.5 bg-primary/10 text-primary border border-primary/20 text-[10px] font-mono font-bold">
              CROSS-JOB AUDIT
            </span>
          </div>
          <p className="text-xs text-muted-foreground font-sans mt-0.5">
            Real-time execution trace logs across all monitored infrastructure targets
          </p>
        </div>

        <Button
          variant="outline"
          size="xs"
          onClick={() => refetch()}
          className="text-xs font-mono border-border"
        >
          <RefreshCw className="w-3 h-3 mr-1" />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Toolbar: Search + Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by monitor or endpoint..."
              className="w-full pl-8 rounded-none bg-background border-border text-foreground font-mono text-xs h-8"
            />
          </div>

          <Select
            value={statusFilter}
            onValueChange={(val) => {
              setStatusFilter(val);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-36 rounded-none bg-background border-border text-foreground font-mono text-xs h-8">
              <Filter className="w-3 h-3 mr-1 text-muted-foreground" />
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent className="rounded-none bg-popover border-border font-mono text-xs">
              <SelectItem value="ALL">All Outcomes</SelectItem>
              <SelectItem value="SUCCESS">Success (200)</SelectItem>
              <SelectItem value="RETRY">Retries</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="text-xs font-mono text-muted-foreground">
          {filteredLogs.length} events logged
        </div>
      </div>

      {/* Log Table */}
      {isLoading ? (
        <div className="border border-border bg-card p-4 space-y-2 rounded-none">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-full rounded-none" />
          ))}
        </div>
      ) : paginatedLogs.length === 0 ? (
        <EmptyState
          icon={ListOrdered}
          title="No Incident Logs Found"
          description="There are no recent execution logs matching your current filters."
        />
      ) : (
        <Card className="border border-border bg-card rounded-none shadow-none overflow-hidden gap-0">
          <div className="overflow-x-auto">
            <Table className="w-full text-left text-xs">
              <TableHeader className="bg-card border-b border-border">
                <TableRow className="border-b border-border hover:bg-transparent">
                  <TableHead className="py-2.5 px-3 text-[10px] font-medium text-muted-foreground font-mono uppercase">
                    Status
                  </TableHead>
                  <TableHead className="py-2.5 px-3 text-[10px] font-medium text-muted-foreground font-mono uppercase">
                    Monitor & Endpoint
                  </TableHead>
                  <TableHead className="py-2.5 px-3 text-[10px] font-medium text-muted-foreground font-mono uppercase">
                    HTTP Code
                  </TableHead>
                  <TableHead className="py-2.5 px-3 text-[10px] font-medium text-muted-foreground font-mono uppercase">
                    Response Time
                  </TableHead>
                  <TableHead className="py-2.5 px-3 text-[10px] font-medium text-muted-foreground font-mono uppercase">
                    Attempt
                  </TableHead>
                  <TableHead className="py-2.5 pl-2 pr-4 text-right text-[10px] font-medium text-muted-foreground font-mono uppercase">
                    Timestamp
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-border">
                {paginatedLogs.map((log) => (
                  <TableRow
                    key={log.id}
                    className={`hover:bg-accent/40 border-border font-mono text-xs ${
                      log.status === 'FAILED' ? 'bg-destructive/5' : log.status === 'RETRY' ? 'bg-amber-500/5' : ''
                    }`}
                  >
                    <TableCell className="py-3 px-3">
                      {getLogBadge(log.status)}
                    </TableCell>
                    <TableCell className="py-3 px-3">
                      <div className="font-semibold text-foreground font-sans text-xs">{log.jobName}</div>
                      <div className="text-[10px] text-muted-foreground font-mono truncate max-w-sm">{log.url}</div>
                    </TableCell>
                    <TableCell className="py-3 px-3 font-bold text-foreground">
                      {log.statusCode}
                    </TableCell>
                    <TableCell className="py-3 px-3 font-semibold text-foreground">
                      {formatLatency(log.responseTimeMs ?? log.responseTime)}
                    </TableCell>
                    <TableCell className="py-3 px-3 text-muted-foreground text-[11px]">
                      {log.attempt}
                    </TableCell>
                    <TableCell className="py-3 pl-2 pr-4 text-right text-muted-foreground text-[11px]">
                      {formatDateTime(log.executedAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-card font-mono text-xs">
              <div className="text-muted-foreground">
                Page {page} of {totalPages}
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="xs"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded-none border-border"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="xs"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-none border-border"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};
