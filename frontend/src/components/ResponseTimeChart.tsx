import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import type { JobLog, LogStatus } from '../types/pulse';
import { LOG_STATUS_COLORS } from '../lib/constants';

interface ResponseTimeChartProps {
  logs: JobLog[];
  height?: number;
}

const CustomChartTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const statusConfig = LOG_STATUS_COLORS[data.status as LogStatus] || LOG_STATUS_COLORS.SUCCESS;

    return (
      <div className="p-3 bg-[#09090b] border border-white/15 rounded-none shadow-xl text-xs font-sans space-y-1 z-50">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-1.5">
          <span className="text-zinc-400 font-mono text-[11px]">{new Date(data.rawTime).toLocaleString()}</span>
          <span
            className={`px-1.5 py-0.5 rounded-none text-[10px] font-semibold uppercase font-mono ${statusConfig.badgeBg} ${statusConfig.badgeBorder} border`}
          >
            {data.status}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4 pt-1">
          <span className="text-zinc-400">Latency:</span>
          <span className="font-mono font-bold text-white">
            {data.responseTime} ms
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-zinc-400">HTTP Status:</span>
          <span className="font-mono text-zinc-300">
            {data.statusCode || 'N/A'}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-zinc-400">Attempt:</span>
          <span className="font-mono text-zinc-300">#{data.attempt}</span>
        </div>
        {data.errorMessage && (
          <div className="pt-1 text-rose-400 max-w-[220px] break-words font-mono text-[11px]">
            Error: {data.errorMessage}
          </div>
        )}
      </div>
    );
  }
  return null;
};

const renderCustomDot = (props: any) => {
  const { cx, cy, payload } = props;
  if (cx === undefined || cy === undefined) return null;

  let dotColor = '#10B981'; // Green for SUCCESS
  if (payload.status === 'RETRY') dotColor = '#F59E0B'; // Amber
  if (payload.status === 'FAILED') dotColor = '#EF4444'; // Rose

  return (
    <rect
      key={`dot-${payload.id || props.index}`}
      x={cx - 3}
      y={cy - 3}
      width={6}
      height={6}
      fill={dotColor}
      stroke="#000000"
      strokeWidth={1}
    />
  );
};

export const ResponseTimeChart: React.FC<ResponseTimeChartProps> = ({ logs, height = 280 }) => {
  // Sort logs chronologically (oldest to newest)
  const chartData = [...logs]
    .sort((a, b) => new Date(a.executedAt).getTime() - new Date(b.executedAt).getTime())
    .map((log) => {
      const date = new Date(log.executedAt);
      const timeStr = date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      return {
        id: log.id,
        rawTime: log.executedAt,
        time: timeStr,
        responseTime: log.responseTimeMs ?? log.responseTime ?? 0,
        status: log.status,
        statusCode: log.statusCode,
        attempt: log.attempt,
        errorMessage: log.errorMessage,
      };
    });

  if (chartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[260px] border border-dashed border-white/10 rounded-none text-zinc-400 text-xs">
        <span>No execution history available yet</span>
        <span className="text-[11px] mt-1 text-zinc-400">Run a test check or wait for the scheduler.</span>
      </div>
    );
  }

  // Calculate average response time
  const validTimes = chartData.filter((d) => d.responseTime > 0).map((d) => d.responseTime);
  const avgTime =
    validTimes.length > 0
      ? Math.round(validTimes.reduce((acc, curr) => acc + curr, 0) / validTimes.length)
      : 0;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3 text-xs">
        <div className="flex items-center gap-4 text-zinc-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-none bg-emerald-500 inline-block" />
            <span>Success</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-none bg-amber-500 inline-block" />
            <span>Retry</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-none bg-rose-500 inline-block" />
            <span>Failed</span>
          </div>
        </div>
        <div className="font-mono text-zinc-400">
          Average Latency: <strong className="text-white">{avgTime} ms</strong>
        </div>
      </div>

      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255, 255, 255, 0.08)"
              vertical={false}
            />
            <XAxis
              dataKey="time"
              stroke="#71717a"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
            />
            <YAxis
              stroke="#71717a"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}ms`}
            />
            <Tooltip content={<CustomChartTooltip />} />
            <Line
              type="monotone"
              dataKey="responseTime"
              stroke="#ffffff"
              strokeWidth={1.5}
              dot={renderCustomDot}
              activeDot={{ r: 4, stroke: '#ffffff', strokeWidth: 2, fill: '#000000' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
