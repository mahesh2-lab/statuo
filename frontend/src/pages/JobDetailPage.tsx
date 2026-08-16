import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  RefreshCw,
  Play,
  Pause,
  Edit2,
  Trash2,
  ExternalLink,
  Shield,
  Clock,
  Activity,
  Layers,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '../components/ui/table';
import { JobStatusBadge } from '../components/JobStatusBadge';
import { MethodBadge } from '../components/MethodBadge';
import { ErrorState } from '../components/ErrorState';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { JobFormModal } from '../components/JobFormModal';
import {
  useJobDetail,
  useUpdateJob,
  useDeleteJob,
  useToggleJob,
  useTriggerTest,
} from '../hooks/useJobs';
import { useJobLogs } from '../hooks/useJobLogs';
import type { JobLog } from '../types/pulse';
import {
  formatInterval,
  formatLatency,
  formatDateTime,
} from '../lib/formatters';

export const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [logsPage, setLogsPage] = useState(1);
  const logsLimit = 10;
  const logsOffset = (logsPage - 1) * logsLimit;

  const { data: jobDetail, isLoading: isLoadingJob, isError: isJobError, refetch: refetchJob } = useJobDetail(id || '');
  const { data: logsData, refetch: refetchLogs } = useJobLogs(id || '', {
    limit: logsLimit,
    offset: logsOffset,
  });

  const { mutateAsync: updateJob, isPending: isUpdating } = useUpdateJob();
  const { mutateAsync: deleteJob, isPending: isDeleting } = useDeleteJob();
  const { mutate: toggleJob } = useToggleJob();
  const { mutate: triggerTest, isPending: isTesting } = useTriggerTest();

  if (isLoadingJob) {
    return (
      <div className="space-y-4 py-1">
        <Skeleton className="h-8 w-40 rounded-none" />
        <Skeleton className="h-28 w-full rounded-none" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-none" />
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-none" />
      </div>
    );
  }

  if (isJobError || !jobDetail?.job) {
    return (
      <ErrorState
        title="Monitor Not Found"
        message="The requested monitoring job could not be retrieved or has been deleted."
        onRetry={() => refetchJob()}
      />
    );
  }

  const job = jobDetail.job;
  const logs = logsData?.logs || jobDetail.recentLogs || [];
  const pagination = logsData?.pagination || { total: logs.length, limit: logsLimit, offset: logsOffset };
  const totalLogPages = Math.ceil(pagination.total / logsLimit) || 1;

  // Chart data from logs
  const chartData = logs
    .slice()
    .reverse()
    .map((log: JobLog) => ({
      time: new Date(log.executedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      responseTime: log.responseTimeMs ?? log.responseTime ?? 0,
      status: log.status,
    }));

  const handleDeleteConfirm = async () => {
    if (!job.id) return;
    await deleteJob(job.id);
    navigate('/jobs');
  };

  const getLogStatusBadge = (status: string) => {
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
            <span>RETRYING</span>
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
        return <span className="text-muted-foreground font-mono text-[10px]">{status}</span>;
    }
  };

  return (
    <div className="space-y-4 py-1">
      {/* Back Button & Breadcrumbs */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="xs"
          onClick={() => navigate('/jobs')}
          className="text-xs font-mono text-muted-foreground hover:text-foreground p-0 h-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          <span>Back to Monitors</span>
        </Button>
      </div>

      {/* Main Header Card */}
      <Card className="bg-card border-border p-5 rounded-none shadow-none gap-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-lg font-bold text-foreground font-sans tracking-tight">
                {job.name}
              </h1>
              <JobStatusBadge status={job.status} size="md" pulse={job.isActive} />
              <MethodBadge method={job.method} />
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mt-1.5">
              <span className="text-foreground">{job.url}</span>
              <a
                href={job.url}
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                title="Open in new tab"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {job.description && (
              <p className="text-xs text-muted-foreground font-sans mt-2">
                {job.description}
              </p>
            )}
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="default"
              size="sm"
              disabled={isTesting}
              onClick={() => triggerTest(job.id)}
              className="text-xs font-semibold h-8 px-3"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isTesting ? 'animate-spin' : ''}`} />
              <span>Run Test Now</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleJob({ id: job.id, isActive: !job.isActive })}
              className="text-xs font-mono border-border h-8"
            >
              {job.isActive ? (
                <>
                  <Pause className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />
                  <span>Resume</span>
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditModalOpen(true)}
              className="text-xs font-mono border-border h-8"
            >
              <Edit2 className="w-3.5 h-3.5 mr-1.5" />
              <span>Edit</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteConfirmOpen(true)}
              className="text-xs font-mono border-border text-destructive hover:bg-destructive/10 h-8"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              <span>Delete</span>
            </Button>
          </div>
        </div>

        {/* 4 Metric Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 mt-4 border-t border-border font-mono text-xs">
          <div className="p-3 bg-muted/20 border border-border">
            <div className="text-[10px] text-muted-foreground uppercase flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              <span>Interval</span>
            </div>
            <div className="text-sm font-bold text-foreground mt-1">
              {formatInterval(job.interval)}
            </div>
          </div>

          <div className="p-3 bg-muted/20 border border-border">
            <div className="text-[10px] text-muted-foreground uppercase flex items-center gap-1.5">
              <Activity className="w-3 h-3" />
              <span>Last Latency</span>
            </div>
            <div className="text-sm font-bold text-foreground mt-1">
              {formatLatency(job.lastResponseTimeMs ?? job.lastResponseTime)}
            </div>
          </div>

          <div className="p-3 bg-muted/20 border border-border">
            <div className="text-[10px] text-muted-foreground uppercase flex items-center gap-1.5">
              <Shield className="w-3 h-3" />
              <span>Retry Policy</span>
            </div>
            <div className="text-sm font-bold text-foreground mt-1">
              {job.retryCount}x ({job.retryInterval}s delay)
            </div>
          </div>

          <div className="p-3 bg-muted/20 border border-border">
            <div className="text-[10px] text-muted-foreground uppercase flex items-center gap-1.5">
              <Layers className="w-3 h-3" />
              <span>Auth Token</span>
            </div>
            <div className="text-sm font-bold text-foreground mt-1">
              {job.token ? '••••••••' : 'None'}
            </div>
          </div>
        </div>
      </Card>

      {/* Latency History Chart */}
      <Card className="bg-card border-border p-4 rounded-none shadow-none gap-0">
        <div className="flex items-center justify-between border-b border-border pb-3 mb-3">
          <div>
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider font-sans">
              Response Time Latency History
            </h3>
            <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
              Round-trip ping time (ms) recorded across recent executions
            </p>
          </div>
        </div>

        <div className="h-56 w-full pt-2">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="time"
                  stroke="var(--muted-foreground)"
                  fontSize={10}
                  tickLine={false}
                  axisLine={{ stroke: 'var(--border)' }}
                  fontFamily="monospace"
                />
                <YAxis
                  stroke="var(--muted-foreground)"
                  fontSize={10}
                  tickLine={false}
                  axisLine={{ stroke: 'var(--border)' }}
                  fontFamily="monospace"
                  unit="ms"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--popover)',
                    borderColor: 'var(--border)',
                    borderRadius: 0,
                    fontFamily: 'monospace',
                    fontSize: '11px',
                  }}
                  formatter={(value: any) => [`${value}ms`, 'Response Time']}
                />
                <Line
                  type="monotone"
                  dataKey="responseTime"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  dot={{ r: 3, fill: 'var(--primary)', stroke: 'var(--card)' }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-muted-foreground font-mono">
              No ping executions recorded yet. Click "Run Test Now" above.
            </div>
          )}
        </div>
      </Card>

      {/* Execution Logs Table */}
      <Card className="bg-card border-border p-4 rounded-none shadow-none gap-0">
        <div className="flex items-center justify-between border-b border-border pb-3 mb-3">
          <div>
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider font-sans">
              Recent Execution Logs ({pagination.total})
            </h3>
            <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
              Historical HTTP status codes, latency times, and error payloads
            </p>
          </div>

          <Button
            variant="outline"
            size="xs"
            onClick={() => refetchLogs()}
            className="text-xs font-mono border-border"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            <span>Refresh Logs</span>
          </Button>
        </div>

        {logs.length > 0 ? (
          <div className="overflow-x-auto">
            <Table className="w-full text-left text-xs">
              <TableHeader className="bg-card border-b border-border">
                <TableRow className="border-b border-border hover:bg-transparent">
                  <TableHead className="py-2.5 px-3 text-[10px] font-medium text-muted-foreground font-mono uppercase">
                    Status
                  </TableHead>
                  <TableHead className="py-2.5 px-3 text-[10px] font-medium text-muted-foreground font-mono uppercase">
                    HTTP Code
                  </TableHead>
                  <TableHead className="py-2.5 px-3 text-[10px] font-medium text-muted-foreground font-mono uppercase">
                    Latency
                  </TableHead>
                  <TableHead className="py-2.5 px-3 text-[10px] font-medium text-muted-foreground font-mono uppercase">
                    Attempt
                  </TableHead>
                  <TableHead className="py-2.5 pl-2 pr-4 text-right text-[10px] font-medium text-muted-foreground font-mono uppercase">
                    Executed At
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-border">
                {logs.map((log: JobLog) => (
                  <TableRow key={log.id} className="hover:bg-accent/40 border-border font-mono text-xs">
                    <TableCell className="py-2.5 px-3">
                      {getLogStatusBadge(log.status)}
                    </TableCell>
                    <TableCell className="py-2.5 px-3 font-bold text-foreground">
                      {log.statusCode || '-'}
                    </TableCell>
                    <TableCell className="py-2.5 px-3 text-foreground font-semibold">
                      {formatLatency(log.responseTimeMs ?? log.responseTime)}
                    </TableCell>
                    <TableCell className="py-2.5 px-3 text-muted-foreground text-[11px]">
                      {log.attempt}
                    </TableCell>
                    <TableCell className="py-2.5 pl-2 pr-4 text-right text-muted-foreground text-[11px]">
                      {formatDateTime(log.executedAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination Controls */}
            {totalLogPages > 1 && (
              <div className="flex items-center justify-between pt-3 border-t border-border font-mono text-xs mt-3">
                <div className="text-muted-foreground">
                  Page {logsPage} of {totalLogPages}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="xs"
                    disabled={logsPage <= 1}
                    onClick={() => setLogsPage((p) => Math.max(1, p - 1))}
                    className="rounded-none border-border"
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="xs"
                    disabled={logsPage >= totalLogPages}
                    onClick={() => setLogsPage((p) => p + 1)}
                    className="rounded-none border-border"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-muted-foreground font-mono">
            No execution logs recorded yet.
          </div>
        )}
      </Card>

      {/* Edit Modal */}
      <JobFormModal
        isOpen={isEditModalOpen}
        job={job}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={async (payload) => {
          await updateJob({ id: job.id, payload });
          setIsEditModalOpen(false);
          refetchJob();
        }}
        isLoading={isUpdating}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        title="Delete Monitor"
        description={`Are you sure you want to delete "${job.name}"? This action cannot be undone.`}
        confirmLabel="Delete Monitor"
        isDestructive
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setIsDeleteConfirmOpen(false)}
      />
    </div>
  );
};
