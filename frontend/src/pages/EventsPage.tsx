import React, { useState } from 'react';
import {
  ListOrdered,
  Search,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  Shield,
  Radio,
  Download,
  Activity,
  Sliders,
  Flame,
} from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Skeleton } from '../components/ui/skeleton';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../components/ui/dialog';
import { EmptyState } from '../components/EmptyState';
import { useEvents } from '../hooks/useEvents';
import { formatDateTime } from '../lib/formatters';
import type { EventCategory, SystemEvent } from '../types/pulse';
import { toast } from 'sonner';

export const EventsPage: React.FC = () => {
  const [categoryFilter, setCategoryFilter] = useState<EventCategory>('ALL');
  const [search, setSearch] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<SystemEvent | null>(null);
  const [isStreaming, setIsStreaming] = useState(true);

  const { data, isLoading, refetch } = useEvents({
    category: categoryFilter,
    search: search || undefined,
    limit: 50,
  });

  const events = data?.events || [];

  const totalIncidents = events.filter((e) => e.category === 'INCIDENT').length;
  const totalHealth = events.filter((e) => e.category === 'HEALTH').length;
  const totalMonitor = events.filter((e) => e.category === 'MONITOR').length;
  const totalAuth = events.filter((e) => e.category === 'AUTH').length;

  const getSeverityBadge = (severity: SystemEvent['severity']) => {
    switch (severity) {
      case 'ERROR':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-1.5 py-0.5 border border-rose-500/20">
            <XCircle className="w-3 h-3" />
            <span>CRITICAL</span>
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 border border-amber-500/20">
            <AlertTriangle className="w-3 h-3" />
            <span>WARNING</span>
          </span>
        );
      case 'SUCCESS':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            <span>SUCCESS</span>
          </span>
        );
      case 'INFO':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-1.5 py-0.5 border border-blue-500/20">
            <Info className="w-3 h-3" />
            <span>INFO</span>
          </span>
        );
    }
  };

  const getCategoryIcon = (category: SystemEvent['category']) => {
    switch (category) {
      case 'INCIDENT':
        return <Flame className="w-3.5 h-3.5 text-rose-500" />;
      case 'HEALTH':
        return <Activity className="w-3.5 h-3.5 text-emerald-500" />;
      case 'MONITOR':
        return <Sliders className="w-3.5 h-3.5 text-primary" />;
      case 'AUTH':
        return <Shield className="w-3.5 h-3.5 text-amber-500" />;
      default:
        return <Radio className="w-3.5 h-3.5 text-muted-foreground" />;
    }
  };

  const handleExportEvents = () => {
    const blob = new Blob([JSON.stringify(events, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `statuo-audit-events-${Date.now()}.json`;
    a.click();
    toast.success('Audit events exported successfully (JSON)');
  };

  return (
    <div className="space-y-4 py-1">
      {/* Header & Streaming Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-border pb-3">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-base font-bold tracking-tight text-foreground font-sans uppercase">
              System Audit & Security Events
            </h1>
            <span className="px-1.5 py-0.5 bg-primary/10 text-primary border border-primary/20 text-[10px] font-mono font-bold">
              LIVE EVENT STREAM
            </span>
            {isStreaming && (
              <span className="flex items-center gap-1 px-1.5 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>STREAMING</span>
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground font-sans mt-0.5">
            Immutable audit log capturing health runner incidents, configuration updates, and session logins
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant={isStreaming ? 'default' : 'outline'}
            size="xs"
            onClick={() => setIsStreaming(!isStreaming)}
            className="text-xs font-mono h-7"
          >
            <Radio className="w-3 h-3 mr-1" />
            <span>{isStreaming ? 'Streaming: ON' : 'Paused'}</span>
          </Button>

          <Button
            variant="outline"
            size="xs"
            onClick={handleExportEvents}
            className="text-xs font-mono border-border h-7"
          >
            <Download className="w-3 h-3 mr-1" />
            <span>Export Log</span>
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

      {/* Category Stats Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card
          onClick={() => setCategoryFilter('INCIDENT')}
          className={`bg-card border p-3 rounded-none shadow-none cursor-pointer transition-colors ${
            categoryFilter === 'INCIDENT' ? 'border-destructive bg-destructive/5' : 'border-border hover:bg-accent/30'
          }`}
        >
          <div className="flex items-center justify-between text-[10px] font-mono uppercase text-muted-foreground">
            <span>Incidents & SLA</span>
            <Flame className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <div className="text-xl font-bold text-foreground font-mono mt-1.5">{totalIncidents}</div>
        </Card>

        <Card
          onClick={() => setCategoryFilter('HEALTH')}
          className={`bg-card border p-3 rounded-none shadow-none cursor-pointer transition-colors ${
            categoryFilter === 'HEALTH' ? 'border-primary bg-primary/5' : 'border-border hover:bg-accent/30'
          }`}
        >
          <div className="flex items-center justify-between text-[10px] font-mono uppercase text-muted-foreground">
            <span>Health Probes</span>
            <Activity className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-xl font-bold text-foreground font-mono mt-1.5">{totalHealth}</div>
        </Card>

        <Card
          onClick={() => setCategoryFilter('MONITOR')}
          className={`bg-card border p-3 rounded-none shadow-none cursor-pointer transition-colors ${
            categoryFilter === 'MONITOR' ? 'border-primary bg-primary/5' : 'border-border hover:bg-accent/30'
          }`}
        >
          <div className="flex items-center justify-between text-[10px] font-mono uppercase text-muted-foreground">
            <span>Monitor Config</span>
            <Sliders className="w-3.5 h-3.5 text-primary" />
          </div>
          <div className="text-xl font-bold text-foreground font-mono mt-1.5">{totalMonitor}</div>
        </Card>

        <Card
          onClick={() => setCategoryFilter('AUTH')}
          className={`bg-card border p-3 rounded-none shadow-none cursor-pointer transition-colors ${
            categoryFilter === 'AUTH' ? 'border-primary bg-primary/5' : 'border-border hover:bg-accent/30'
          }`}
        >
          <div className="flex items-center justify-between text-[10px] font-mono uppercase text-muted-foreground">
            <span>Auth & Security</span>
            <Shield className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-xl font-bold text-foreground font-mono mt-1.5">{totalAuth}</div>
        </Card>
      </div>

      {/* Toolbar: Category Tabs + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        {/* Category Tabs */}
        <div className="inline-flex border border-border bg-card p-0.5">
          {(['ALL', 'INCIDENT', 'HEALTH', 'MONITOR', 'AUTH'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 text-xs font-mono font-bold transition-colors ${
                categoryFilter === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events, targets, actors..."
            className="w-full pl-8 rounded-none bg-background border-border text-foreground font-mono text-xs h-8"
          />
        </div>
      </div>

      {/* Events Table / Feed */}
      {isLoading ? (
        <div className="border border-border bg-card p-4 space-y-2.5 rounded-none">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-none" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <EmptyState
          icon={ListOrdered}
          title="No Audit Events Found"
          description="There are no system events matching your current category filter or search query."
        />
      ) : (
        <Card className="border border-border bg-card rounded-none shadow-none overflow-hidden gap-0">
          <div className="overflow-x-auto">
            <Table className="w-full text-left font-mono text-xs">
              <TableHeader className="bg-card border-b border-border">
                <TableRow className="border-b border-border hover:bg-transparent">
                  <TableHead className="py-2.5 px-3 text-[10px] text-muted-foreground uppercase">Severity</TableHead>
                  <TableHead className="py-2.5 px-3 text-[10px] text-muted-foreground uppercase">Event & Description</TableHead>
                  <TableHead className="py-2.5 px-3 text-[10px] text-muted-foreground uppercase">Category</TableHead>
                  <TableHead className="py-2.5 px-3 text-[10px] text-muted-foreground uppercase">Actor</TableHead>
                  <TableHead className="py-2.5 pl-2 pr-4 text-right text-[10px] text-muted-foreground uppercase">Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-border">
                {events.map((ev) => (
                  <TableRow
                    key={ev.id}
                    onClick={() => setSelectedEvent(ev)}
                    className="hover:bg-accent/40 border-border cursor-pointer transition-colors"
                  >
                    <TableCell className="py-3 px-3">
                      {getSeverityBadge(ev.severity)}
                    </TableCell>
                    <TableCell className="py-3 px-3">
                      <div className="font-semibold text-foreground font-sans text-xs flex items-center gap-1.5">
                        <span>{ev.title}</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground font-mono mt-0.5 truncate max-w-lg">
                        {ev.description}
                      </div>
                      {ev.target && (
                        <div className="text-[10px] text-primary/80 font-mono mt-0.5 truncate max-w-sm">
                          target: {ev.target}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="py-3 px-3">
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-foreground">
                        {getCategoryIcon(ev.category)}
                        <span>{ev.category}</span>
                      </span>
                    </TableCell>
                    <TableCell className="py-3 px-3 text-muted-foreground text-[11px]">
                      {ev.actor || 'System'}
                    </TableCell>
                    <TableCell className="py-3 pl-2 pr-4 text-right text-muted-foreground text-[11px] whitespace-nowrap">
                      {formatDateTime(ev.timestamp)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {/* Raw Event Detail Dialog */}
      {selectedEvent && (
        <Dialog open={Boolean(selectedEvent)} onOpenChange={() => setSelectedEvent(null)}>
          <DialogContent className="rounded-none border-border bg-card p-6 max-w-xl font-mono text-xs text-foreground">
            <DialogHeader className="border-b border-border pb-3">
              <div className="flex items-center gap-2">
                {getSeverityBadge(selectedEvent.severity)}
                <DialogTitle className="text-sm font-bold text-foreground font-sans">
                  {selectedEvent.title}
                </DialogTitle>
              </div>
              <DialogDescription className="text-xs text-muted-foreground font-sans mt-1">
                {selectedEvent.description}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 pt-3">
              <div className="grid grid-cols-2 gap-3 text-xs bg-muted/20 p-3 border border-border">
                <div>
                  <span className="text-muted-foreground uppercase text-[10px] block">Event ID</span>
                  <span className="font-bold text-foreground">{selectedEvent.id}</span>
                </div>
                <div>
                  <span className="text-muted-foreground uppercase text-[10px] block">Category</span>
                  <span className="font-bold text-foreground">{selectedEvent.category}</span>
                </div>
                <div>
                  <span className="text-muted-foreground uppercase text-[10px] block">Actor</span>
                  <span className="font-bold text-foreground">{selectedEvent.actor || 'System Daemon'}</span>
                </div>
                <div>
                  <span className="text-muted-foreground uppercase text-[10px] block">Timestamp</span>
                  <span className="font-bold text-foreground">{formatDateTime(selectedEvent.timestamp)}</span>
                </div>
              </div>

              {selectedEvent.target && (
                <div className="p-2.5 bg-muted/20 border border-border text-xs">
                  <span className="text-muted-foreground uppercase text-[10px] block mb-0.5">Target Endpoint</span>
                  <span className="font-bold text-primary break-all">{selectedEvent.target}</span>
                </div>
              )}

              {selectedEvent.metadata && (
                <div className="space-y-1">
                  <span className="text-muted-foreground uppercase text-[10px] block">Raw JSON Payload</span>
                  <pre className="p-3 bg-muted/40 border border-border text-[11px] overflow-x-auto text-foreground">
                    {JSON.stringify(selectedEvent.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
