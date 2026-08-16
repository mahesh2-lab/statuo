import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Plus,
  Search,
  RefreshCw,
  MoreHorizontal,
  Play,
  Pause,
  Trash2,
  Edit2,
  ExternalLink,
  Filter,
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
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '../components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { Skeleton } from '../components/ui/skeleton';
import { JobStatusBadge } from '../components/JobStatusBadge';
import { MethodBadge } from '../components/MethodBadge';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { JobFormModal } from '../components/JobFormModal';
import {
  useJobs,
  useCreateJob,
  useUpdateJob,
  useDeleteJob,
  useToggleJob,
  useTriggerTest,
} from '../hooks/useJobs';
import { formatInterval, formatLatency, formatRelativeTime } from '../lib/formatters';
import type { Job, JobStatus } from '../types/pulse';

export const JobsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('search') || '';
  const statusFilter = searchParams.get('status') || 'ALL';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = 10;
  const offset = (page - 1) * limit;

  // Local state for modals
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [deletingJobId, setDeletingJobId] = useState<string | null>(null);

  // Queries and Mutations
  const { data, isLoading, isError, refetch } = useJobs({
    search: search || undefined,
    status: statusFilter !== 'ALL' ? (statusFilter as JobStatus) : undefined,
    limit,
    offset,
  });

  const { mutateAsync: createJob, isPending: isCreating } = useCreateJob();
  const { mutateAsync: updateJob, isPending: isUpdating } = useUpdateJob();
  const { mutateAsync: deleteJob, isPending: isDeleting } = useDeleteJob();
  const { mutate: toggleJob } = useToggleJob();
  const { mutate: triggerTest, isPending: isTesting } = useTriggerTest();

  const jobs = data?.jobs || [];
  const pagination = data?.pagination || { total: 0, limit: 10, offset: 0 };
  const totalPages = Math.ceil(pagination.total / limit) || 1;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (val) next.set('search', val);
      else next.delete('search');
      next.set('page', '1');
      return next;
    });
  };

  const handleStatusChange = (val: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (val && val !== 'ALL') next.set('status', val);
      else next.delete('status');
      next.set('page', '1');
      return next;
    });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('page', String(newPage));
      return next;
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deletingJobId) return;
    await deleteJob(deletingJobId);
    setDeletingJobId(null);
  };

  return (
    <div className="space-y-4 py-1">
      {/* Header & New Monitor CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
        <div>
          <h1 className="text-base font-bold tracking-tight text-foreground font-sans uppercase">
            Monitors & Jobs
          </h1>
          <p className="text-xs text-muted-foreground font-sans mt-0.5">
            Configure automated ping runners, SLA thresholds, and status alerts
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="xs"
            onClick={() => refetch()}
            className="text-xs font-mono border-border"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            <span>Refresh</span>
          </Button>

          <Button
            variant="default"
            size="xs"
            onClick={() => setIsNewModalOpen(true)}
            className="text-xs font-semibold h-7 px-3"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            <span>New Monitor</span>
          </Button>
        </div>
      </div>

      {/* Toolbar: Search + Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2 flex-1 max-w-lg">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-muted-foreground" />
            <Input
              value={search}
              onChange={handleSearchChange}
              placeholder="Search monitors by name or URL..."
              className="w-full pl-8 rounded-none bg-background border-border text-foreground font-mono text-xs h-8"
            />
          </div>

          <Select value={statusFilter} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-36 rounded-none bg-background border-border text-foreground font-mono text-xs h-8">
              <Filter className="w-3 h-3 mr-1 text-muted-foreground" />
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent className="rounded-none bg-popover border-border font-mono text-xs">
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="HEALTHY">Healthy</SelectItem>
              <SelectItem value="DEGRADED">Degraded</SelectItem>
              <SelectItem value="DOWN">Down</SelectItem>
              <SelectItem value="PAUSED">Paused</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="text-xs font-mono text-muted-foreground text-right">
          {pagination.total} monitors configured
        </div>
      </div>

      {/* Data Table / Loading / Empty / Error States */}
      {isLoading ? (
        <div className="border border-border bg-card p-4 space-y-3 rounded-none">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-none" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState
          title="Could not load monitors"
          message="Failed to fetch job list. Check if backend service is available."
          onRetry={() => refetch()}
        />
      ) : jobs.length === 0 ? (
        <EmptyState
          title="No Monitors Found"
          description={
            search || statusFilter !== 'ALL'
              ? 'No monitors matched your current search filters. Try adjusting your query.'
              : 'You have not created any health check monitors yet. Configure an endpoint to start ping tracking.'
          }
          actionLabel="Create First Monitor"
          actionIcon={Plus}
          onAction={() => setIsNewModalOpen(true)}
        />
      ) : (
        <div className="border border-border bg-card overflow-hidden rounded-none shadow-none">
          <div className="overflow-x-auto">
            <Table className="w-full text-left text-xs">
              <TableHeader className="bg-card border-b border-border">
                <TableRow className="border-b border-border hover:bg-transparent">
                  <TableHead className="py-2.5 px-3 text-[10px] font-medium text-muted-foreground font-mono uppercase">
                    Service Name & URL
                  </TableHead>
                  <TableHead className="py-2.5 px-3 text-[10px] font-medium text-muted-foreground font-mono uppercase">
                    Method
                  </TableHead>
                  <TableHead className="py-2.5 px-3 text-[10px] font-medium text-muted-foreground font-mono uppercase">
                    Status
                  </TableHead>
                  <TableHead className="py-2.5 px-3 text-[10px] font-medium text-muted-foreground font-mono uppercase">
                    Interval
                  </TableHead>
                  <TableHead className="py-2.5 px-3 text-[10px] font-medium text-muted-foreground font-mono uppercase">
                    Latency
                  </TableHead>
                  <TableHead className="py-2.5 px-3 text-[10px] font-medium text-muted-foreground font-mono uppercase">
                    Last Checked
                  </TableHead>
                  <TableHead className="py-2.5 pl-2 pr-4 text-right text-[10px] font-medium text-muted-foreground font-mono uppercase">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-border">
                {jobs.map((job) => (
                  <TableRow
                    key={job.id}
                    onClick={() => navigate(`/jobs/${job.id}`)}
                    className="hover:bg-accent/40 border-border transition-colors cursor-pointer"
                  >
                    <TableCell className="py-3 px-3">
                      <div className="font-semibold text-foreground text-xs font-sans truncate">{job.name}</div>
                      <div className="text-[10px] text-muted-foreground font-mono truncate">{job.url}</div>
                    </TableCell>
                    <TableCell className="py-3 px-3">
                      <MethodBadge method={job.method} />
                    </TableCell>
                    <TableCell className="py-3 px-3">
                      <JobStatusBadge status={job.status} pulse={job.isActive} />
                    </TableCell>
                    <TableCell className="py-3 px-3 font-mono text-xs text-muted-foreground">
                      {formatInterval(job.interval)}
                    </TableCell>
                    <TableCell className="py-3 px-3 font-mono text-xs font-semibold text-foreground">
                      {formatLatency(job.lastResponseTimeMs ?? job.lastResponseTime)}
                    </TableCell>
                    <TableCell className="py-3 px-3 font-mono text-[10px] text-muted-foreground">
                      {formatRelativeTime(job.lastRunAt)}
                    </TableCell>
                    <TableCell className="py-3 pl-2 pr-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          title="Trigger Test Ping"
                          disabled={isTesting}
                          onClick={() => triggerTest(job.id)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon-xs"
                          title={job.isActive ? 'Pause Monitor' : 'Resume Monitor'}
                          onClick={() => toggleJob({ id: job.id, isActive: !job.isActive })}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          {job.isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-500" />}
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <MoreHorizontal className="w-3.5 h-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44 rounded-none border-border bg-popover text-popover-foreground p-1 font-mono text-xs">
                            <DropdownMenuItem
                              onClick={() => navigate(`/jobs/${job.id}`)}
                              className="px-2 py-1.5 cursor-pointer rounded-none"
                            >
                              <ExternalLink className="w-3.5 h-3.5 mr-2" />
                              <span>View Telemetry</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setEditingJob(job)}
                              className="px-2 py-1.5 cursor-pointer rounded-none"
                            >
                              <Edit2 className="w-3.5 h-3.5 mr-2" />
                              <span>Edit Config</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-border my-1" />
                            <DropdownMenuItem
                              onClick={() => setDeletingJobId(job.id)}
                              className="px-2 py-1.5 cursor-pointer rounded-none text-destructive hover:bg-destructive/10 focus:text-destructive"
                            >
                              <Trash2 className="w-3.5 h-3.5 mr-2" />
                              <span>Delete Monitor</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-card text-xs font-mono">
              <div className="text-muted-foreground">
                Showing {offset + 1} - {Math.min(offset + limit, pagination.total)} of {pagination.total}
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="xs"
                  disabled={page <= 1}
                  onClick={() => handlePageChange(page - 1)}
                  className="rounded-none border-border"
                >
                  Previous
                </Button>
                <span className="px-2 text-foreground font-bold">
                  {page} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="xs"
                  disabled={page >= totalPages}
                  onClick={() => handlePageChange(page + 1)}
                  className="rounded-none border-border"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create Modal */}
      <JobFormModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSubmit={async (payload) => {
          await createJob(payload);
        }}
        isLoading={isCreating}
      />

      {/* Edit Modal */}
      <JobFormModal
        isOpen={Boolean(editingJob)}
        job={editingJob}
        onClose={() => setEditingJob(null)}
        onSubmit={async (payload) => {
          if (editingJob) {
            await updateJob({ id: editingJob.id, payload });
          }
        }}
        isLoading={isUpdating}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingJobId)}
        title="Delete Monitor"
        description="Are you sure you want to delete this health check monitor? All past execution logs and latency SLAs will be permanently deleted."
        confirmLabel="Delete Monitor"
        isDestructive
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeletingJobId(null)}
      />
    </div>
  );
};
