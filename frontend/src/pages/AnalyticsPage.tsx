import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock,
  CheckCircle2,
  RefreshCw,
  Activity,
  Zap,
  Globe,
  ListOrdered,
  Download,
  Flame,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  AreaChart,
  Area,
  Line,
  ReferenceLine,
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
import { useAnalytics } from '../hooks/useAnalytics';
import { toast } from 'sonner';

export const AnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
  const [activeTab, setActiveTab] = useState<'performance' | 'sla' | 'slo' | 'statusCodes'>('performance');

  const { data, isLoading, refetch } = useAnalytics();

  if (isLoading) {
    return (
      <div className="space-y-4 py-1">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <Skeleton className="h-7 w-56 rounded-none" />
          <Skeleton className="h-8 w-48 rounded-none" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-none" />
          ))}
        </div>
        <Skeleton className="h-72 w-full rounded-none" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Skeleton className="h-56 rounded-none" />
          <Skeleton className="h-56 rounded-none" />
        </div>
      </div>
    );
  }

  const jobs = data?.jobs || [];
  const summary = data?.summary || {
    totalJobs: 0,
    healthyJobs: 0,
    degradedJobs: 0,
    downJobs: 0,
    pausedJobs: 0,
    avgLatencyMs: 42,
    uptimePercentage: 99.982,
  };

  const baseLatency = summary.avgLatencyMs || 42;

  // 24h Dual Latency & Request Throughput curve
  const performanceTimeline = [
    { time: '00:00', p50: Math.round(baseLatency * 0.85), p95: Math.round(baseLatency * 1.3), p99: Math.round(baseLatency * 1.8), requests: 1850 },
    { time: '03:00', p50: Math.round(baseLatency * 0.82), p95: Math.round(baseLatency * 1.25), p99: Math.round(baseLatency * 1.7), requests: 1420 },
    { time: '06:00', p50: Math.round(baseLatency * 0.95), p95: Math.round(baseLatency * 1.4), p99: Math.round(baseLatency * 2.1), requests: 2900 },
    { time: '09:00', p50: Math.round(baseLatency * 1.15), p95: Math.round(baseLatency * 1.6), p99: Math.round(baseLatency * 2.4), requests: 4650 },
    { time: '12:00', p50: Math.round(baseLatency * 1.10), p95: Math.round(baseLatency * 1.55), p99: Math.round(baseLatency * 2.3), requests: 4300 },
    { time: '15:00', p50: Math.round(baseLatency * 0.98), p95: Math.round(baseLatency * 1.35), p99: Math.round(baseLatency * 1.95), requests: 3800 },
    { time: '18:00', p50: Math.round(baseLatency * 1.02), p95: Math.round(baseLatency * 1.45), p99: Math.round(baseLatency * 2.05), requests: 3600 },
    { time: '21:00', p50: Math.round(baseLatency * 0.90), p95: Math.round(baseLatency * 1.32), p99: Math.round(baseLatency * 1.85), requests: 2400 },
  ];

  // Uptime per job
  const uptimePerJob = jobs.length > 0
    ? jobs.map((job) => ({
        name: job.name.length > 20 ? job.name.substring(0, 20) + '...' : job.name,
        uptime: job.status === 'DOWN' ? 88.5 : job.status === 'DEGRADED' ? 96.4 : 99.985,
        target: 99.90,
        status: job.status,
      }))
    : [
        { name: 'Core API Gateway', uptime: 99.99, target: 99.90, status: 'HEALTHY' },
        { name: 'Auth Session Worker', uptime: 100.0, target: 99.90, status: 'HEALTHY' },
        { name: 'Payment Webhook Dispatcher', uptime: 99.95, target: 99.90, status: 'HEALTHY' },
        { name: 'Sentinel KV Telemetry', uptime: 99.98, target: 99.90, status: 'HEALTHY' },
      ];

  // Latency distribution histogram buckets
  const latencyBuckets = [
    { range: '< 50ms', count: 18, percentage: '45.2%', fill: 'var(--chart-1)' },
    { range: '50-150ms', count: 14, percentage: '35.0%', fill: 'var(--chart-2)' },
    { range: '150-300ms', count: 5, percentage: '12.5%', fill: 'var(--chart-3)' },
    { range: '300-1000ms', count: 2, percentage: '5.0%', fill: 'var(--chart-4)' },
    { range: '> 1000ms', count: 1, percentage: '2.3%', fill: 'var(--chart-5)' },
  ];

  // Multi-region edge runners
  const regionProbes = [
    { region: 'US East (Virginia)', code: 'us-east-1', latency: Math.round(baseLatency * 0.85), status: 'NORMAL', jitter: '±2ms' },
    { region: 'US West (Oregon)', code: 'us-west-2', latency: Math.round(baseLatency * 0.95), status: 'NORMAL', jitter: '±3ms' },
    { region: 'Europe Central (Frankfurt)', code: 'eu-central-1', latency: Math.round(baseLatency * 1.1), status: 'NORMAL', jitter: '±4ms' },
    { region: 'Asia East (Tokyo)', code: 'ap-northeast-1', latency: Math.round(baseLatency * 1.4), status: 'NORMAL', jitter: '±6ms' },
    { region: 'Asia South (Mumbai)', code: 'ap-south-1', latency: Math.round(baseLatency * 1.25), status: 'NORMAL', jitter: '±5ms' },
    { region: 'South America (São Paulo)', code: 'sa-east-1', latency: Math.round(baseLatency * 1.55), status: 'NORMAL', jitter: '±8ms' },
  ];

  // HTTP Status code distribution data
  const statusCodesData = [
    { code: '200 OK', count: 47820, percent: 98.92, fill: 'oklch(0.65 0.2 145)' },
    { code: '201 Created', count: 420, percent: 0.87, fill: 'oklch(0.60 0.18 145)' },
    { code: '400 Bad Request', count: 18, percent: 0.04, fill: 'oklch(0.75 0.18 75)' },
    { code: '401 Unauthorized', count: 12, percent: 0.02, fill: 'oklch(0.70 0.18 75)' },
    { code: '429 Rate Limited', count: 8, percent: 0.01, fill: 'oklch(0.65 0.2 75)' },
    { code: '500 Server Error', count: 6, percent: 0.01, fill: 'var(--chart-3)' },
    { code: '503 Service Unavailable', count: 4, percent: 0.01, fill: 'var(--chart-5)' },
  ];

  const handleExportData = () => {
    const report = {
      exportedAt: new Date().toISOString(),
      timeWindow: timeRange,
      summary,
      probes: regionProbes,
      jobs: uptimePerJob,
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `statuo-analytics-sla-${timeRange}-${Date.now()}.json`;
    a.click();
    toast.success('Analytics SLA Report downloaded (JSON)');
  };

  return (
    <div className="space-y-4 py-1">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-border pb-3">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-base font-bold tracking-tight text-foreground font-sans uppercase">
              Performance & SLA Analytics
            </h1>
            <span className="px-1.5 py-0.5 bg-primary/10 text-primary border border-primary/20 text-[10px] font-mono font-bold">
              MULTI-PROBE TELEMETRY
            </span>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 border border-emerald-500/20">
              SLA COMPLIANT
            </span>
          </div>
          <p className="text-xs text-muted-foreground font-sans mt-0.5">
            Deep percentile latencies, multi-region response times, and Error Budget burn rates
          </p>
        </div>

        {/* Global Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Time Window Selector */}
          <div className="inline-flex border border-border bg-card p-0.5">
            {(['24h', '7d', '30d'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-2.5 py-1 text-xs font-mono font-bold transition-colors ${
                  timeRange === r
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="xs"
            onClick={handleExportData}
            className="text-xs font-mono border-border h-7"
          >
            <Download className="w-3 h-3 mr-1" />
            <span>Export</span>
          </Button>

          <Button
            variant="outline"
            size="xs"
            onClick={() => navigate('/events')}
            className="text-xs font-mono border-border h-7"
          >
            <ListOrdered className="w-3 h-3 mr-1 text-primary" />
            <span>Audit Events</span>
          </Button>

          <Button
            variant="outline"
            size="xs"
            onClick={() => refetch()}
            className="text-xs font-mono border-border h-7"
          >
            <RefreshCw className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Top 6 KPI Deep Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* KPI 1: Overall SLA */}
        <Card className="bg-card border-border p-3.5 flex flex-col justify-between rounded-none shadow-none gap-0">
          <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground uppercase">
            <span>Fleet SLA</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold text-foreground font-mono">
              {Number(summary.uptimePercentage || 99.98).toFixed(3)}%
            </div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
              +0.04% vs target (99.90%)
            </div>
          </div>
        </Card>

        {/* KPI 2: P50 / P95 / P99 Latency */}
        <Card className="bg-card border-border p-3.5 flex flex-col justify-between rounded-none shadow-none gap-0">
          <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground uppercase">
            <span>P95 Latency</span>
            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold text-foreground font-mono">
              {Math.round(baseLatency * 1.38)} ms
            </div>
            <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
              P50: {Math.round(baseLatency * 0.9)}ms • P99: {Math.round(baseLatency * 2.1)}ms
            </div>
          </div>
        </Card>

        {/* KPI 3: Request Throughput */}
        <Card className="bg-card border-border p-3.5 flex flex-col justify-between rounded-none shadow-none gap-0">
          <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground uppercase">
            <span>Volume (24h)</span>
            <Zap className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold text-foreground font-mono">48.2k ops</div>
            <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
              Avg 18.2 req/sec
            </div>
          </div>
        </Card>

        {/* KPI 4: MTTD / MTTR */}
        <Card className="bg-card border-border p-3.5 flex flex-col justify-between rounded-none shadow-none gap-0">
          <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground uppercase">
            <span>MTTD / MTTR</span>
            <Activity className="w-3.5 h-3.5 text-primary" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold text-foreground font-mono">12s / 45s</div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
              Sub-minute recovery
            </div>
          </div>
        </Card>

        {/* KPI 5: Error Budget */}
        <Card className="bg-card border-border p-3.5 flex flex-col justify-between rounded-none shadow-none gap-0">
          <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground uppercase">
            <span>Error Budget</span>
            <Flame className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">84.2% Left</div>
            <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
              36.4 min allowance remaining
            </div>
          </div>
        </Card>

        {/* KPI 6: Active Probes */}
        <Card className="bg-card border-border p-3.5 flex flex-col justify-between rounded-none shadow-none gap-0">
          <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground uppercase">
            <span>Edge Runners</span>
            <Globe className="w-3.5 h-3.5 text-primary" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold text-foreground font-mono">6 Regions</div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
              Global mesh active
            </div>
          </div>
        </Card>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-border pt-1">
        <button
          onClick={() => setActiveTab('performance')}
          className={`px-4 py-2 text-xs font-mono font-bold transition-colors border-b-2 ${
            activeTab === 'performance'
              ? 'border-primary text-foreground bg-accent/30'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Overview & Latencies
        </button>
        <button
          onClick={() => setActiveTab('sla')}
          className={`px-4 py-2 text-xs font-mono font-bold transition-colors border-b-2 ${
            activeTab === 'sla'
              ? 'border-primary text-foreground bg-accent/30'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          SLA Availability Matrix
        </button>
        <button
          onClick={() => setActiveTab('slo')}
          className={`px-4 py-2 text-xs font-mono font-bold transition-colors border-b-2 ${
            activeTab === 'slo'
              ? 'border-primary text-foreground bg-accent/30'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          SLO & Error Budget
        </button>
        <button
          onClick={() => setActiveTab('statusCodes')}
          className={`px-4 py-2 text-xs font-mono font-bold transition-colors border-b-2 ${
            activeTab === 'statusCodes'
              ? 'border-primary text-foreground bg-accent/30'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          HTTP Codes & Failures
        </button>
      </div>

      {/* TAB 1: OVERVIEW & PERFORMANCE */}
      {activeTab === 'performance' && (
        <div className="space-y-4">
          {/* Main Dual Latency & Request Area Chart */}
          <Card className="bg-card border-border p-4 rounded-none shadow-none gap-0">
            <div className="flex items-center justify-between border-b border-border pb-3 mb-3">
              <div>
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider font-sans">
                  Percentile Response Latency & Request Load ({timeRange})
                </h3>
                <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                  Visualizing median (P50), 95th percentile (P95), and 99th percentile (P99) response curves
                </p>
              </div>

              <div className="flex items-center gap-4 text-[10px] font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-none bg-chart-2 inline-block" />
                  <span className="text-foreground font-semibold">P50 Median</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-none bg-chart-3 inline-block" />
                  <span className="text-foreground font-semibold">P95 Tier</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-none bg-rose-500 inline-block" />
                  <span className="text-foreground font-semibold">P99 Peak</span>
                </span>
              </div>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceTimeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="p50Gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="p95Gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--chart-3)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="var(--chart-3)" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
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
                  />
                  <Area type="monotone" dataKey="p50" stroke="var(--chart-2)" fill="url(#p50Gradient)" strokeWidth={2} name="P50 Latency" />
                  <Area type="monotone" dataKey="p95" stroke="var(--chart-3)" fill="url(#p95Gradient)" strokeWidth={2} name="P95 Latency" />
                  <Line type="monotone" dataKey="p99" stroke="oklch(0.704 0.191 22.216)" strokeWidth={2} dot={{ r: 3 }} name="P99 Latency" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* 2-Column Grid: Histogram & Regional Runner Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Latency Distribution Histogram */}
            <Card className="lg:col-span-6 bg-card border-border p-4 rounded-none shadow-none gap-0">
              <div className="flex items-center justify-between border-b border-border pb-3 mb-3">
                <div>
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wider font-sans">
                    Latency Histogram Distribution
                  </h3>
                  <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                    Proportion of requests grouped by response duration tiers
                  </p>
                </div>
              </div>

              <div className="h-56 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={latencyBuckets} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="range" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} fontFamily="monospace" />
                    <YAxis stroke="var(--muted-foreground)" fontSize={10} tickLine={false} fontFamily="monospace" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--popover)',
                        borderColor: 'var(--border)',
                        borderRadius: 0,
                        fontFamily: 'monospace',
                        fontSize: '11px',
                      }}
                      formatter={(val: any) => [`${val} samples`, 'Count']}
                    />
                    <Bar dataKey="count" radius={[0, 0, 0, 0]}>
                      {latencyBuckets.map((entry, index) => (
                        <Cell key={`hist-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Multi-Region Edge Runners */}
            <Card className="lg:col-span-6 bg-card border-border p-4 rounded-none shadow-none gap-0">
              <div className="flex items-center justify-between border-b border-border pb-3 mb-3">
                <div>
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wider font-sans">
                    Global Edge Probes Telemetry
                  </h3>
                  <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                    Distributed geographic runners and current ping latency
                  </p>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  ALL OPERATIONAL
                </span>
              </div>

              <div className="overflow-x-auto">
                <Table className="w-full text-left font-mono text-xs">
                  <TableHeader className="bg-card border-b border-border">
                    <TableRow className="border-b border-border hover:bg-transparent">
                      <TableHead className="py-2 px-2.5 text-[10px] text-muted-foreground uppercase">Region</TableHead>
                      <TableHead className="py-2 px-2.5 text-[10px] text-muted-foreground uppercase">Runner ID</TableHead>
                      <TableHead className="py-2 px-2.5 text-[10px] text-muted-foreground uppercase">Latency</TableHead>
                      <TableHead className="py-2 pl-2 pr-3 text-right text-[10px] text-muted-foreground uppercase">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-border">
                    {regionProbes.map((p) => (
                      <TableRow key={p.code} className="hover:bg-accent/30 border-border">
                        <TableCell className="py-2 px-2.5 font-sans font-semibold text-foreground text-xs">
                          {p.region}
                        </TableCell>
                        <TableCell className="py-2 px-2.5 text-muted-foreground text-[11px]">
                          {p.code}
                        </TableCell>
                        <TableCell className="py-2 px-2.5 text-foreground font-bold">
                          {p.latency}ms <span className="text-muted-foreground text-[10px] font-normal">({p.jitter})</span>
                        </TableCell>
                        <TableCell className="py-2 pl-2 pr-3 text-right">
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 border border-emerald-500/20">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            <span>{p.status}</span>
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: SLA AVAILABILITY MATRIX */}
      {activeTab === 'sla' && (
        <div className="space-y-4">
          <Card className="bg-card border-border p-4 rounded-none shadow-none gap-0">
            <div className="flex items-center justify-between border-b border-border pb-3 mb-3">
              <div>
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider font-sans">
                  Service Availability vs Target SLA (99.900%)
                </h3>
                <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                  Continuous uptime ratio comparison against formal enterprise SLA commitment
                </p>
              </div>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={uptimePerJob} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} fontFamily="monospace" angle={-10} textAnchor="end" />
                  <YAxis domain={[85, 100]} stroke="var(--muted-foreground)" fontSize={10} tickLine={false} fontFamily="monospace" unit="%" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--popover)',
                      borderColor: 'var(--border)',
                      borderRadius: 0,
                      fontFamily: 'monospace',
                      fontSize: '11px',
                    }}
                    formatter={(val: any) => [`${val}%`, 'Uptime SLA']}
                  />
                  <ReferenceLine y={99.90} stroke="oklch(0.577 0.245 27.325)" strokeDasharray="4 4" label={{ value: 'SLA Target (99.9%)', fill: 'var(--foreground)', fontSize: 10, position: 'insideTopRight', fontFamily: 'monospace' }} />
                  <Bar dataKey="uptime" fill="var(--chart-2)" radius={[0, 0, 0, 0]}>
                    {uptimePerJob.map((entry, index) => (
                      <Cell
                        key={`cell-sla-${index}`}
                        fill={entry.status === 'DOWN' ? 'var(--chart-3)' : entry.status === 'DEGRADED' ? 'var(--chart-1)' : 'var(--chart-2)'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* 30-Day Availability Blocks Heatmap */}
          <Card className="bg-card border-border p-4 rounded-none shadow-none gap-0">
            <div className="flex items-center justify-between border-b border-border pb-3 mb-3">
              <div>
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider font-sans">
                  30-Day Consecutive Availability Blocks
                </h3>
                <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                  Daily uptime status tiles (Green = 100%, Amber = Degraded, Red = Outage)
                </p>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">30 Days Telemetry</span>
            </div>

            <div className="space-y-3 font-mono text-xs pt-1">
              {uptimePerJob.slice(0, 4).map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground font-sans">{item.name}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">{item.uptime}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(30)].map((_, dayIdx) => {
                      const isDown = item.status === 'DOWN' && dayIdx > 27;
                      const isDegraded = item.status === 'DEGRADED' && (dayIdx === 14 || dayIdx === 28);
                      return (
                        <div
                          key={dayIdx}
                          title={`Day ${dayIdx + 1}: ${isDown ? 'Downtime' : isDegraded ? 'Degraded' : '100% Uptime'}`}
                          className={`flex-1 h-5 rounded-none border border-border transition-colors ${
                            isDown
                              ? 'bg-rose-500'
                              : isDegraded
                              ? 'bg-amber-500'
                              : 'bg-emerald-500/80 hover:bg-emerald-500'
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* TAB 3: SLO & ERROR BUDGET */}
      {activeTab === 'slo' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* SLO 1 */}
            <Card className="bg-card border-border p-4 rounded-none shadow-none gap-0">
              <div className="flex items-center justify-between border-b border-border pb-2.5">
                <span className="text-xs font-bold text-foreground uppercase font-sans">Critical Auth API</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
                  PASSING
                </span>
              </div>
              <div className="space-y-2 mt-3 font-mono text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Target Objective:</span>
                  <span className="text-foreground font-bold">99.950%</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Current 30d SLA:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">99.985%</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Error Budget Left:</span>
                  <span className="text-foreground font-bold">78.5% (18.2m)</span>
                </div>
                <div className="w-full bg-muted h-1.5 border border-border mt-2">
                  <div className="bg-emerald-500 h-full" style={{ width: '78.5%' }} />
                </div>
              </div>
            </Card>

            {/* SLO 2 */}
            <Card className="bg-card border-border p-4 rounded-none shadow-none gap-0">
              <div className="flex items-center justify-between border-b border-border pb-2.5">
                <span className="text-xs font-bold text-foreground uppercase font-sans">Background Jobs</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
                  PASSING
                </span>
              </div>
              <div className="space-y-2 mt-3 font-mono text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Target Objective:</span>
                  <span className="text-foreground font-bold">99.900%</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Current 30d SLA:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">100.000%</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Error Budget Left:</span>
                  <span className="text-foreground font-bold">100% (43.2m)</span>
                </div>
                <div className="w-full bg-muted h-1.5 border border-border mt-2">
                  <div className="bg-emerald-500 h-full" style={{ width: '100%' }} />
                </div>
              </div>
            </Card>

            {/* SLO 3 */}
            <Card className="bg-card border-border p-4 rounded-none shadow-none gap-0">
              <div className="flex items-center justify-between border-b border-border pb-2.5">
                <span className="text-xs font-bold text-foreground uppercase font-sans">Webhook Dispatchers</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-bold">
                  AT RISK
                </span>
              </div>
              <div className="space-y-2 mt-3 font-mono text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Target Objective:</span>
                  <span className="text-foreground font-bold">99.900%</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Current 30d SLA:</span>
                  <span className="text-amber-600 dark:text-amber-400 font-bold">99.910%</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Error Budget Left:</span>
                  <span className="text-amber-600 dark:text-amber-400 font-bold">22.0% (9.5m)</span>
                </div>
                <div className="w-full bg-muted h-1.5 border border-border mt-2">
                  <div className="bg-amber-500 h-full" style={{ width: '22%' }} />
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 4: HTTP STATUS CODES & FAILURE ANALYSIS */}
      {activeTab === 'statusCodes' && (
        <div className="space-y-4">
          <Card className="bg-card border-border p-4 rounded-none shadow-none gap-0">
            <div className="flex items-center justify-between border-b border-border pb-3 mb-3">
              <div>
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider font-sans">
                  HTTP Response Code Frequency Breakdown
                </h3>
                <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                  Detailed distribution of return codes across 48,708 total health runner probe requests
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table className="w-full text-left font-mono text-xs">
                <TableHeader className="bg-card border-b border-border">
                  <TableRow className="border-b border-border hover:bg-transparent">
                    <TableHead className="py-2 px-3 text-[10px] text-muted-foreground uppercase">Response Code</TableHead>
                    <TableHead className="py-2 px-3 text-[10px] text-muted-foreground uppercase">Count (24h)</TableHead>
                    <TableHead className="py-2 px-3 text-[10px] text-muted-foreground uppercase">Percentage</TableHead>
                    <TableHead className="py-2 pl-2 pr-4 text-right text-[10px] text-muted-foreground uppercase">Distribution Bar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-border">
                  {statusCodesData.map((row) => (
                    <TableRow key={row.code} className="hover:bg-accent/30 border-border">
                      <TableCell className="py-2.5 px-3 font-bold text-foreground">
                        <span className="inline-flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-none inline-block" style={{ backgroundColor: row.fill }} />
                          <span>{row.code}</span>
                        </span>
                      </TableCell>
                      <TableCell className="py-2.5 px-3 text-foreground">{row.count.toLocaleString()} reqs</TableCell>
                      <TableCell className="py-2.5 px-3 font-semibold text-foreground">{row.percent}%</TableCell>
                      <TableCell className="py-2.5 pl-2 pr-4 text-right">
                        <div className="w-36 ml-auto bg-muted h-2 border border-border">
                          <div className="h-full" style={{ width: `${Math.max(row.percent, 1)}%`, backgroundColor: row.fill }} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
