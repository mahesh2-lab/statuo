import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Pause, RefreshCw, Edit2, Trash2, ChevronRight } from 'lucide-react';
import type { Job, TestExecutionResult } from '../types/pulse';
import { StatusBadge } from './StatusBadge';
import { MethodBadge } from './MethodBadge';
import { formatLatency, formatRelativeTime, formatStatusCode } from '../lib/formatters';
import { pulseApi } from '../api/client';
import { useToast } from '../context/useToast';
import { Button } from './ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';

interface JobRowProps {
  job: Job;
  onEdit: (job: Job) => void;
  onDelete: (job: Job) => void;
  onRefresh?: () => void;
}

export const JobRow: React.FC<JobRowProps> = ({ job, onEdit, onDelete, onRefresh }) => {
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
    <tr
      onClick={() => navigate(`/jobs/${job.id}`)}
      className="group border-b border-white/10 hover:bg-white/[0.04] transition-colors duration-150 cursor-pointer text-xs"
    >
      {/* Status */}
      <td className="py-3.5 pl-4 pr-3 whitespace-nowrap">
        <StatusBadge status={job.status} size="sm" pulse={job.isActive} />
      </td>

      {/* Name & URL */}
      <td className="py-3.5 px-3 max-w-[240px]">
        <div className="font-medium text-white truncate group-hover:text-zinc-100 font-sans">
          {job.name}
        </div>
        <div className="text-[11px] text-zinc-400 font-mono truncate flex items-center gap-1 mt-0.5">
          <span className="truncate">{job.url}</span>
        </div>
      </td>

      {/* Method */}
      <td className="py-3.5 px-3 whitespace-nowrap">
        <MethodBadge method={job.method} />
      </td>

      {/* Latency & Status Code */}
      <td className="py-3.5 px-3 whitespace-nowrap">
        <div className="font-mono text-xs font-semibold text-zinc-200">
          {formatLatency(job.lastResponseTimeMs ?? job.lastResponseTime)}
        </div>
        <div className="text-[11px] text-zinc-400 font-mono">
          Code: {formatStatusCode(job.lastStatusCode)}
        </div>
      </td>

      {/* Interval & Last Run */}
      <td className="py-3.5 px-3 whitespace-nowrap">
        <div className="text-xs text-zinc-300">
          {formatRelativeTime(job.lastRunAt)}
        </div>
        <div className="text-[11px] text-zinc-400 font-mono">Every {job.interval}s</div>
      </td>

      {/* Actions */}
      <td className="py-3.5 pl-3 pr-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-end gap-0.5">
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
                <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin text-white' : ''}`} />
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
                className={`transition-colors duration-150 ${
                  job.isActive
                    ? 'text-zinc-400 hover:text-white'
                    : 'text-emerald-400 hover:bg-emerald-500/20'
                }`}
                aria-label={job.isActive ? 'Pause Check' : 'Resume Check'}
              >
                {job.isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent className="text-[10px] font-mono rounded-none">
              {job.isActive ? 'Pause Check' : 'Resume Check'}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => onEdit(job)}
                className="text-zinc-400 hover:text-white"
                aria-label="Edit Job"
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
                aria-label="Delete Job"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="text-[10px] font-mono rounded-none">Delete Job</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => navigate(`/jobs/${job.id}`)}
                className="text-zinc-400 hover:text-white"
                aria-label="View Details"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="text-[10px] font-mono rounded-none">View Details</TooltipContent>
          </Tooltip>
        </div>
      </td>
    </tr>
  );
};
