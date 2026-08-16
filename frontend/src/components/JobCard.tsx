import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Pause, RefreshCw, Edit2, Trash2 } from 'lucide-react';
import type { Job, TestExecutionResult } from '../types/pulse';
import { StatusBadge } from './StatusBadge';
import { MethodBadge } from './MethodBadge';
import { formatLatency, formatRelativeTime, formatStatusCode } from '../lib/formatters';
import { pulseApi } from '../api/client';
import { useToast } from '../context/useToast';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';

interface JobCardProps {
  job: Job;
  onEdit: (job: Job) => void;
  onDelete: (job: Job) => void;
  onRefresh?: () => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onEdit, onDelete, onRefresh }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isTesting, setIsTesting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const handleTriggerTest = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsTesting(true);
    try {
      const result: TestExecutionResult = await pulseApi.triggerTest(job.id);
      if (result.ok) {
        toast.success(
          `Status: ${result.statusCode || 200} (${result.responseTimeMs ? Math.round(result.responseTimeMs) : 0}ms)`,
          `Ping Succeeded: ${job.name}`
        );
      } else {
        toast.error(
          result.errorMessage || `Returned status ${result.statusCode || 'failed'}`,
          `Ping Failed: ${job.name}`
        );
      }
      if (onRefresh) onRefresh();
    } catch (err: any) {
      toast.error(err.message || 'Failed to trigger test ping');
    } finally {
      setIsTesting(false);
    }
  };

  const handleToggleActive = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsToggling(true);
    try {
      await pulseApi.toggleJobStatus(job.id, !job.isActive);
      toast.info(
        job.isActive ? `Paused monitoring for ${job.name}` : `Resumed monitoring for ${job.name}`
      );
      if (onRefresh) onRefresh();
    } catch (err: any) {
      toast.error(err.message || 'Failed to toggle job status');
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <Card
      onClick={() => navigate(`/jobs/${job.id}`)}
      className="p-4 rounded-none border border-white/10 bg-[#09090b] hover:border-white/20 transition-all duration-150 cursor-pointer flex flex-col justify-between gap-3 shadow-none"
    >
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <MethodBadge method={job.method} />
            <StatusBadge status={job.status} size="sm" pulse={job.isActive} />
          </div>
          <span className="text-[11px] text-zinc-400 font-mono">
            {formatRelativeTime(job.lastRunAt)}
          </span>
        </div>

        <div className="mt-2.5">
          <h4 className="font-semibold text-sm text-white truncate font-sans">
            {job.name}
          </h4>
          <p className="text-xs text-zinc-400 font-mono truncate mt-0.5">{job.url}</p>
        </div>

        {job.description && (
          <p className="mt-2 text-xs text-zinc-400 line-clamp-2 font-sans">
            {job.description}
          </p>
        )}
      </div>

      <div className="pt-3 border-t border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs">
          <div>
            <span className="text-zinc-400">Latency: </span>
            <span className="font-mono font-semibold text-zinc-200">
              {formatLatency(job.lastResponseTimeMs ?? job.lastResponseTime)}
            </span>
          </div>
          <div>
            <span className="text-zinc-400">Code: </span>
            <span className="font-mono text-zinc-300">
              {formatStatusCode(job.lastStatusCode)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-xs"
                disabled={isTesting}
                onClick={handleTriggerTest}
                className="text-zinc-400 hover:text-white"
                aria-label="Test Now"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="text-[10px] font-mono rounded-none">Test Ping</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-xs"
                disabled={isToggling}
                onClick={handleToggleActive}
                className="text-zinc-400 hover:text-white"
                aria-label={job.isActive ? 'Pause' : 'Resume'}
              >
                {job.isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent className="text-[10px] font-mono rounded-none">
              {job.isActive ? 'Pause Job' : 'Resume Job'}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => onEdit(job)}
                className="text-zinc-400 hover:text-white"
                aria-label="Edit"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="text-[10px] font-mono rounded-none">Edit Job</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => onDelete(job)}
                className="text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10"
                aria-label="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="text-[10px] font-mono rounded-none">Delete Job</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </Card>
  );
};
