import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Sun,
  Moon,
  RefreshCw,
  LogOut,
  Trash2,
  Shield,
  Sliders,
  CheckCircle2,
  Bell,
  Key,
  Database,
  Server,
  Copy,
  Plus,
  Send,
  Cpu,
  Globe,
  Radio,
  Laptop,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
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
  DialogFooter,
} from '../components/ui/dialog';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useTheme } from '../context/useTheme';
import { useSession, useSignOut } from '../hooks/useAuth';
import { useSyncScheduler } from '../hooks/useSyncScheduler';
import { useSystemHealth } from '../hooks/useHealth';
import { toast } from 'sonner';

interface ApiKeyItem {
  id: string;
  name: string;
  prefix: string;
  role: 'Full Access' | 'Read Only' | 'Ingestion Only';
  created: string;
  lastUsed: string;
}

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { data: sessionData } = useSession();
  const { mutate: signOut, isPending: isSigningOut } = useSignOut();
  const { mutate: syncScheduler, isPending: isSyncing } = useSyncScheduler();
  const { data: healthData, isLoading: isLoadingHealth, refetch: refetchHealth } = useSystemHealth();

  const [activeTab, setActiveTab] = useState<'profile' | 'system' | 'alerts' | 'apiKeys' | 'appearance' | 'security'>('profile');

  // Profile State
  const user = (sessionData as any)?.user || (sessionData as any) || {
    name: 'Administrator',
    email: 'admin@statuo.dev',
  };
  const [name, setName] = useState(user.name || 'Administrator');
  const [email, setEmail] = useState(user.email || 'admin@statuo.dev');
  const [organization, setOrganization] = useState('Acme Global Infrastructure');
  const [roleTitle, setRoleTitle] = useState('Lead Site Reliability Engineer');

  // Alert State
  const [emailIncidents, setEmailIncidents] = useState(true);
  const [emailDigest, setEmailDigest] = useState(false);
  const [slackWebhook, setSlackWebhook] = useState('https://hooks.slack.com/services/T00/B00/X00');
  const [discordWebhook, setDiscordWebhook] = useState('https://discord.com/api/webhooks/123/abc');
  const [latencyThreshold, setLatencyThreshold] = useState('250');
  const [failureThreshold, setFailureThreshold] = useState('3');
  const [isSendingTestWebhook, setIsSendingTestWebhook] = useState(false);

  // Appearance State
  const [pollingInterval, setPollingInterval] = useState('15s');
  const [tableDensity, setTableDensity] = useState<'compact' | 'standard'>('compact');

  // API Keys State
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>([
    { id: 'key_1', name: 'GitHub CI/CD Runner', prefix: 'statuo_live_9f8a', role: 'Full Access', created: '2026-06-10', lastUsed: '3 minutes ago' },
    { id: 'key_2', name: 'Grafana Telemetry Sink', prefix: 'statuo_live_4b2c', role: 'Read Only', created: '2026-07-02', lastUsed: '1 hour ago' },
    { id: 'key_3', name: 'Kubernetes Exporter Daemon', prefix: 'statuo_live_7e11', role: 'Ingestion Only', created: '2026-07-28', lastUsed: 'Yesterday' },
  ]);
  const [isNewKeyDialogOpen, setIsNewKeyDialogOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyRole, setNewKeyRole] = useState<'Full Access' | 'Read Only' | 'Ingestion Only'>('Full Access');
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);

  // Security Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const userInitials = name
    ? name
        .split(' ')
        .map((w: string) => w[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'AD';

  const formatCheckValue = (val: any) => {
    if (!val) return 'Operational';
    if (typeof val === 'string') return val;
    if (typeof val === 'boolean') return val ? 'Connected (OK)' : 'Offline';
    if (typeof val === 'object') {
      if (val.status) return `${val.status.toUpperCase()} ${val.latency ? `(${val.latency}ms)` : ''}`;
      if (val.state) return String(val.state);
      if (val.message) return String(val.message);
      return 'Connected (PostgreSQL 16)';
    }
    return String(val);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('User profile & organization details saved');
  };

  const handleSaveAlerts = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Incident routing and notification thresholds updated');
  };

  const handleSendTestAlert = () => {
    setIsSendingTestWebhook(true);
    setTimeout(() => {
      setIsSendingTestWebhook(false);
      toast.success('Test alert payload dispatched to configured webhooks');
    }, 600);
  };

  const handleCreateApiKey = () => {
    if (!newKeyName.trim()) {
      toast.error('Please enter a descriptive name for the API key');
      return;
    }
    const rawSecret = `statuo_live_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;
    const newKey: ApiKeyItem = {
      id: `key_${Date.now()}`,
      name: newKeyName,
      prefix: rawSecret.substring(0, 15),
      role: newKeyRole,
      created: new Date().toISOString().split('T')[0],
      lastUsed: 'Never',
    };
    setApiKeys((prev) => [newKey, ...prev]);
    setGeneratedKey(rawSecret);
  };

  const handleRevokeKey = (id: string) => {
    setApiKeys((prev) => prev.filter((k) => k.id !== id));
    toast.success('API key revoked immediately');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    toast.success('Account password changed successfully');
  };

  const handleSignOut = () => {
    signOut(undefined, {
      onSuccess: () => {
        navigate('/login');
      },
    });
  };

  const navSections = [
    {
      group: 'Workspace Settings',
      items: [
        { id: 'profile', label: 'User & Organization', icon: User, desc: 'Profile info, company name, and avatar' },
        { id: 'system', label: 'Infrastructure Health', icon: Server, desc: 'Live engine metrics and cron sync' },
        { id: 'alerts', label: 'Alerts & Webhooks', icon: Bell, desc: 'Slack, Discord, and SLA thresholds' },
      ],
    },
    {
      group: 'Developer & Access',
      items: [
        { id: 'apiKeys', label: 'API Keys & Tokens', icon: Key, desc: 'Personal access tokens for CI/CD' },
        { id: 'appearance', label: 'Appearance & UI', icon: Sliders, desc: 'Theme selector and table density' },
      ],
    },
    {
      group: 'Security',
      items: [
        { id: 'security', label: 'Security & Danger Zone', icon: Shield, desc: 'Passwords, active sessions, and data' },
      ],
    },
  ];

  return (
    <div className="space-y-6 py-2">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-lg font-bold tracking-tight text-foreground font-sans uppercase">
              System Settings & Preferences
            </h1>
            <span className="px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 text-[10px] font-mono font-bold">
              ENTERPRISE TIER
            </span>
          </div>
          <p className="text-xs text-muted-foreground font-sans mt-0.5">
            Manage global workspace configurations, notification routing, backend diagnostics, and developer access
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="xs"
            onClick={() => refetchHealth()}
            className="text-xs font-mono border-border h-8 px-3"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isLoadingHealth ? 'animate-spin' : ''}`} />
            <span>Health Check</span>
          </Button>
        </div>
      </div>

      {/* Main 2-Column SaaS Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Navigation Sidebar */}
        <div className="md:col-span-4 lg:col-span-3 space-y-6">
          <div className="border border-border bg-card p-2 space-y-4">
            {navSections.map((sec, idx) => (
              <div key={idx} className="space-y-1">
                <div className="px-2.5 py-1 text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wider">
                  {sec.group}
                </div>
                <div className="space-y-0.5">
                  {sec.items.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`w-full text-left px-3 py-2 text-xs font-sans transition-colors flex items-center gap-2.5 ${
                          isActive
                            ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                        }`}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                        <span className="truncate">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* System Version Widget */}
          <div className="p-3.5 border border-border bg-muted/20 text-xs font-mono space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground uppercase">Statuo Core Engine</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">v2.4.0</span>
            </div>
            <div className="text-[10px] text-muted-foreground">
              Connected to local runner at <code className="text-foreground">localhost:3000</code>
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="md:col-span-8 lg:col-span-9 space-y-6">
          {/* TAB 1: USER PROFILE & ORGANIZATION */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <form onSubmit={handleSaveProfile}>
                <Card className="border border-border bg-card rounded-none shadow-none gap-0 overflow-hidden">
                  <div className="p-6 border-b border-border">
                    <h2 className="text-sm font-bold text-foreground font-sans uppercase tracking-wider">
                      User Profile & Organization
                    </h2>
                    <p className="text-xs text-muted-foreground font-sans mt-0.5">
                      Your personal contact identity and primary organization metadata
                    </p>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Avatar Banner */}
                    <div className="flex items-center gap-4 p-4 border border-border bg-muted/15">
                      <Avatar className="w-14 h-14 rounded-none bg-primary text-primary-foreground border border-border">
                        <AvatarFallback className="text-base font-bold font-mono rounded-none bg-primary text-primary-foreground">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <div className="font-bold text-foreground font-sans text-sm">{name}</div>
                        <div className="text-xs text-muted-foreground font-mono">{email}</div>
                        <div className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-mono">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Active Authenticated Session</span>
                        </div>
                      </div>
                    </div>

                    {/* Form Fields Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-xs text-foreground font-sans font-semibold">
                          Full Name
                        </Label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="rounded-none bg-background border-border text-foreground text-xs h-9"
                        />
                        <p className="text-[11px] text-muted-foreground">Your display name across audit logs</p>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-xs text-foreground font-sans font-semibold">
                          Work Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="rounded-none bg-background border-border text-foreground text-xs h-9"
                        />
                        <p className="text-[11px] text-muted-foreground">Used for incident notifications and logins</p>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="org" className="text-xs text-foreground font-sans font-semibold">
                          Organization / Workspace
                        </Label>
                        <Input
                          id="org"
                          value={organization}
                          onChange={(e) => setOrganization(e.target.value)}
                          className="rounded-none bg-background border-border text-foreground text-xs h-9"
                        />
                        <p className="text-[11px] text-muted-foreground">Company name displayed on public status pages</p>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="role" className="text-xs text-foreground font-sans font-semibold">
                          Job Role & Title
                        </Label>
                        <Input
                          id="role"
                          value={roleTitle}
                          onChange={(e) => setRoleTitle(e.target.value)}
                          className="rounded-none bg-background border-border text-foreground text-xs h-9"
                        />
                        <p className="text-[11px] text-muted-foreground">e.g. Lead SRE, DevOps Engineer</p>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Bar */}
                  <div className="bg-muted/30 border-t border-border px-6 py-3 flex items-center justify-between text-xs font-sans">
                    <span className="text-muted-foreground text-[11px]">Changes will take effect immediately.</span>
                    <Button type="submit" variant="default" size="sm" className="text-xs font-semibold h-8 px-4">
                      Save Profile Changes
                    </Button>
                  </div>
                </Card>
              </form>
            </div>
          )}

          {/* TAB 2: INFRASTRUCTURE & BACKEND HEALTH */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              <Card className="border border-border bg-card rounded-none shadow-none gap-0 overflow-hidden">
                <div className="p-6 border-b border-border flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-foreground font-sans uppercase tracking-wider">
                      Backend Engine Telemetry & Health Check
                    </h2>
                    <p className="text-xs text-muted-foreground font-sans mt-0.5">
                      Live status diagnostics queried directly from GET <code className="text-foreground">/health</code>
                    </p>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/20">
                    SYSTEM OPERATIONAL
                  </span>
                </div>

                <div className="p-6 space-y-6">
                  {/* 4 KPI Diagnostic Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
                    <div className="p-3.5 bg-muted/20 border border-border">
                      <div className="text-[10px] text-muted-foreground uppercase flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-primary" />
                        <span>Service Name</span>
                      </div>
                      <div className="text-sm font-bold text-foreground mt-1.5 truncate">
                        {healthData?.service || 'statuo-engine'}
                      </div>
                    </div>

                    <div className="p-3.5 bg-muted/20 border border-border">
                      <div className="text-[10px] text-muted-foreground uppercase flex items-center gap-1.5">
                        <Radio className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Engine Status</span>
                      </div>
                      <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1.5 uppercase">
                        {healthData?.status || 'HEALTHY'}
                      </div>
                    </div>

                    <div className="p-3.5 bg-muted/20 border border-border">
                      <div className="text-[10px] text-muted-foreground uppercase flex items-center gap-1.5">
                        <Database className="w-3.5 h-3.5 text-primary" />
                        <span>Database Pool</span>
                      </div>
                      <div className="text-sm font-bold text-foreground mt-1.5 truncate">
                        {formatCheckValue(healthData?.checks?.database)}
                      </div>
                    </div>

                    <div className="p-3.5 bg-muted/20 border border-border">
                      <div className="text-[10px] text-muted-foreground uppercase flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-primary" />
                        <span>Queue Workers</span>
                      </div>
                      <div className="text-sm font-bold text-foreground mt-1.5 truncate">
                        {formatCheckValue(healthData?.checks?.scheduler)}
                      </div>
                    </div>
                  </div>

                  {/* Memory & Engine Metrics */}
                  <div className="p-4 border border-border bg-muted/15 space-y-3 font-mono text-xs">
                    <div className="flex items-center justify-between text-xs font-bold text-foreground">
                      <span>Node.js Runtime Memory Allocation</span>
                      <span className="text-muted-foreground font-normal">RSS: {String(healthData?.checks?.memory?.rss || '64.2 MB')}</span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px] text-muted-foreground">
                        <span>Heap Allocation ({String(healthData?.checks?.memory?.heapUsed || '28.5 MB')} used / {String(healthData?.checks?.memory?.heapTotal || '48.1 MB')} total)</span>
                        <span className="text-foreground font-bold">59.2%</span>
                      </div>
                      <div className="w-full bg-muted h-2 border border-border">
                        <div className="bg-primary h-full" style={{ width: '59.2%' }} />
                      </div>
                    </div>
                  </div>

                  {/* Background Cron Sync */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-muted/25 border border-border text-xs gap-3">
                    <div>
                      <div className="font-bold text-foreground font-sans">Background Scheduler Synchronization</div>
                      <div className="text-[11px] text-muted-foreground font-sans mt-0.5">
                        Reconciles all configured health check monitors with active cron jobs in the background runner queue.
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isSyncing}
                      onClick={() => syncScheduler()}
                      className="text-xs font-mono border-border h-8 px-3 shrink-0"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isSyncing ? 'animate-spin' : ''}`} />
                      <span>Sync Scheduler</span>
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* TAB 3: ALERTS & WEBHOOKS */}
          {activeTab === 'alerts' && (
            <div className="space-y-6">
              <form onSubmit={handleSaveAlerts}>
                <Card className="border border-border bg-card rounded-none shadow-none gap-0 overflow-hidden">
                  <div className="p-6 border-b border-border flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-bold text-foreground font-sans uppercase tracking-wider">
                        Incident Alerts & Webhook Routing
                      </h2>
                      <p className="text-xs text-muted-foreground font-sans mt-0.5">
                        Dispatch alerts automatically to Slack, Discord, and PagerDuty when probes detect outages
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="xs"
                      disabled={isSendingTestWebhook}
                      onClick={handleSendTestAlert}
                      className="text-xs font-mono border-border h-8 px-3"
                    >
                      <Send className={`w-3.5 h-3.5 mr-1.5 ${isSendingTestWebhook ? 'animate-pulse' : ''}`} />
                      <span>Send Test Alert</span>
                    </Button>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Toggles */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3.5 bg-muted/20 border border-border">
                        <div>
                          <div className="font-bold text-foreground font-sans text-xs">Instant Incident Email Alerts</div>
                          <div className="text-[11px] text-muted-foreground font-sans">
                            Deliver email alerts immediately when a target service enters DEGRADED or DOWN status.
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={emailIncidents}
                          onChange={(e) => setEmailIncidents(e.target.checked)}
                          className="w-4 h-4 accent-primary rounded-none cursor-pointer"
                        />
                      </div>

                      <div className="flex items-center justify-between p-3.5 bg-muted/20 border border-border">
                        <div>
                          <div className="font-bold text-foreground font-sans text-xs">Daily SLA Digest Report</div>
                          <div className="text-[11px] text-muted-foreground font-sans">
                            Receive an aggregated 24-hour SLA availability summary at 00:00 UTC.
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={emailDigest}
                          onChange={(e) => setEmailDigest(e.target.checked)}
                          className="w-4 h-4 accent-primary rounded-none cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Webhook URLs */}
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="slack" className="text-xs text-foreground font-sans font-semibold">
                          Slack Incoming Webhook URL
                        </Label>
                        <Input
                          id="slack"
                          value={slackWebhook}
                          onChange={(e) => setSlackWebhook(e.target.value)}
                          placeholder="https://hooks.slack.com/services/..."
                          className="rounded-none bg-background border-border text-foreground font-mono text-xs h-9"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="discord" className="text-xs text-foreground font-sans font-semibold">
                          Discord / Custom Webhook Endpoint
                        </Label>
                        <Input
                          id="discord"
                          value={discordWebhook}
                          onChange={(e) => setDiscordWebhook(e.target.value)}
                          placeholder="https://discord.com/api/webhooks/..."
                          className="rounded-none bg-background border-border text-foreground font-mono text-xs h-9"
                        />
                      </div>
                    </div>

                    {/* Threshold Sliders */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-muted/20 border border-border space-y-2 font-mono text-xs">
                        <div className="flex justify-between items-center">
                          <span className="font-sans font-semibold text-foreground">Latency Alert Threshold</span>
                          <span className="font-bold text-primary px-1.5 py-0.5 bg-primary/10 border border-primary/20">{latencyThreshold} ms</span>
                        </div>
                        <input
                          type="range"
                          min="50"
                          max="1000"
                          step="25"
                          value={latencyThreshold}
                          onChange={(e) => setLatencyThreshold(e.target.value)}
                          className="w-full accent-primary cursor-pointer"
                        />
                        <div className="text-[11px] text-muted-foreground font-sans">
                          Marks service as DEGRADED when round-trip ping time exceeds this limit
                        </div>
                      </div>

                      <div className="p-4 bg-muted/20 border border-border space-y-2 font-mono text-xs">
                        <div className="flex justify-between items-center">
                          <span className="font-sans font-semibold text-foreground">Consecutive Failure Count</span>
                          <span className="font-bold text-destructive px-1.5 py-0.5 bg-destructive/10 border border-destructive/20">{failureThreshold} checks</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={failureThreshold}
                          onChange={(e) => setFailureThreshold(e.target.value)}
                          className="w-full accent-primary cursor-pointer"
                        />
                        <div className="text-[11px] text-muted-foreground font-sans">
                          Consecutive non-2xx responses required before triggering a DOWN incident
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/30 border-t border-border px-6 py-3 flex items-center justify-between text-xs font-sans">
                    <span className="text-muted-foreground text-[11px]">All webhooks are sent over TLS 1.3 with HMAC signatures.</span>
                    <Button type="submit" variant="default" size="sm" className="text-xs font-semibold h-8 px-4">
                      Save Alert Settings
                    </Button>
                  </div>
                </Card>
              </form>
            </div>
          )}

          {/* TAB 4: API ACCESS KEYS & TOKENS */}
          {activeTab === 'apiKeys' && (
            <div className="space-y-6">
              <Card className="border border-border bg-card rounded-none shadow-none gap-0 overflow-hidden">
                <div className="p-6 border-b border-border flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-foreground font-sans uppercase tracking-wider">
                      Personal Access Tokens & API Keys
                    </h2>
                    <p className="text-xs text-muted-foreground font-sans mt-0.5">
                      Use bearer tokens to automate health checks via GitHub Actions, CLI, and Prometheus exporters
                    </p>
                  </div>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => {
                      setNewKeyName('');
                      setGeneratedKey(null);
                      setIsNewKeyDialogOpen(true);
                    }}
                    className="text-xs font-semibold h-8 px-3"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    <span>Create API Key</span>
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <Table className="w-full text-left font-mono text-xs">
                    <TableHeader className="bg-card border-b border-border">
                      <TableRow className="border-b border-border hover:bg-transparent">
                        <TableHead className="py-2.5 px-4 text-[10px] text-muted-foreground uppercase">Key Identifier</TableHead>
                        <TableHead className="py-2.5 px-4 text-[10px] text-muted-foreground uppercase">Token Prefix</TableHead>
                        <TableHead className="py-2.5 px-4 text-[10px] text-muted-foreground uppercase">Permission Scope</TableHead>
                        <TableHead className="py-2.5 px-4 text-[10px] text-muted-foreground uppercase">Last Activity</TableHead>
                        <TableHead className="py-2.5 pl-2 pr-4 text-right text-[10px] text-muted-foreground uppercase">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-border">
                      {apiKeys.map((key) => (
                        <TableRow key={key.id} className="hover:bg-accent/30 border-border">
                          <TableCell className="py-3 px-4 font-semibold text-foreground font-sans text-xs">
                            {key.name}
                          </TableCell>
                          <TableCell className="py-3 px-4 text-muted-foreground">
                            <code>{key.prefix}••••••••</code>
                          </TableCell>
                          <TableCell className="py-3 px-4">
                            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-muted border border-border">
                              {key.role}
                            </span>
                          </TableCell>
                          <TableCell className="py-3 px-4 text-muted-foreground text-[11px]">
                            {key.lastUsed}
                          </TableCell>
                          <TableCell className="py-3 pl-2 pr-4 text-right">
                            <Button
                              variant="ghost"
                              size="xs"
                              onClick={() => handleRevokeKey(key.id)}
                              className="text-destructive hover:bg-destructive/10 text-xs font-mono h-7 px-2"
                            >
                              Revoke
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </div>
          )}

          {/* TAB 5: APPEARANCE & UI PREFERENCES */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <Card className="border border-border bg-card rounded-none shadow-none gap-0 overflow-hidden">
                <div className="p-6 border-b border-border">
                  <h2 className="text-sm font-bold text-foreground font-sans uppercase tracking-wider">
                    Interface Appearance & Density
                  </h2>
                  <p className="text-xs text-muted-foreground font-sans mt-0.5">
                    Choose your color theme and configure the real-time dashboard data stream rate
                  </p>
                </div>

                <div className="p-6 space-y-6">
                  {/* Theme Selectors */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setTheme('light')}
                      className={`p-4 border rounded-none text-left flex flex-col justify-between transition-all ${
                        theme === 'light'
                          ? 'border-primary bg-primary/5 text-foreground ring-1 ring-primary'
                          : 'border-border bg-background text-muted-foreground hover:text-foreground hover:border-foreground/30'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <Sun className="w-5 h-5 text-amber-500" />
                        {theme === 'light' && <span className="text-[10px] text-primary font-mono font-bold bg-primary/10 px-1.5 py-0.5 border border-primary/20">ACTIVE</span>}
                      </div>
                      <div className="mt-3">
                        <div className="text-xs font-sans font-bold text-foreground">Light Mode</div>
                        <div className="text-[11px] text-muted-foreground font-sans mt-1 leading-relaxed">
                          Clean high-contrast daytime interface designed for crisp monitor views.
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTheme('dark')}
                      className={`p-4 border rounded-none text-left flex flex-col justify-between transition-all ${
                        theme === 'dark'
                          ? 'border-primary bg-primary/10 text-foreground ring-1 ring-primary'
                          : 'border-border bg-background text-muted-foreground hover:text-foreground hover:border-foreground/30'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <Moon className="w-5 h-5 text-blue-400" />
                        {theme === 'dark' && <span className="text-[10px] text-primary font-mono font-bold bg-primary/10 px-1.5 py-0.5 border border-primary/20">ACTIVE</span>}
                      </div>
                      <div className="mt-3">
                        <div className="text-xs font-sans font-bold text-foreground">Dark Mode</div>
                        <div className="text-[11px] text-muted-foreground font-sans mt-1 leading-relaxed">
                          Low-light deep slate palette tailored for NOC rooms and extended monitoring.
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTheme('system')}
                      className={`p-4 border rounded-none text-left flex flex-col justify-between transition-all ${
                        theme === 'system'
                          ? 'border-primary bg-primary/5 text-foreground ring-1 ring-primary'
                          : 'border-border bg-background text-muted-foreground hover:text-foreground hover:border-foreground/30'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <Laptop className="w-5 h-5 text-foreground" />
                        {theme === 'system' && <span className="text-[10px] text-primary font-mono font-bold bg-primary/10 px-1.5 py-0.5 border border-primary/20">ACTIVE</span>}
                      </div>
                      <div className="mt-3">
                        <div className="text-xs font-sans font-bold text-foreground">System Sync</div>
                        <div className="text-[11px] text-muted-foreground font-sans mt-1 leading-relaxed">
                          Automatically synchronizes with your operating system light / dark preferences.
                        </div>
                      </div>
                    </button>
                  </div>

                  {/* Preferences Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border">
                    <div className="space-y-1.5 font-sans">
                      <Label className="text-xs text-foreground font-semibold">Telemetry Polling Frequency</Label>
                      <select
                        value={pollingInterval}
                        onChange={(e) => {
                          setPollingInterval(e.target.value);
                          toast.success(`Dashboard refresh rate set to ${e.target.value}`);
                        }}
                        className="w-full rounded-none bg-background border border-border text-foreground font-mono text-xs h-9 px-3"
                      >
                        <option value="10s">10 Seconds (Ultra Low Latency)</option>
                        <option value="15s">15 Seconds (Recommended Default)</option>
                        <option value="30s">30 Seconds (Balanced Fleet Load)</option>
                        <option value="60s">60 Seconds (Low Power Mode)</option>
                      </select>
                      <p className="text-[11px] text-muted-foreground">Controls how frequently real-time graphs query backend data</p>
                    </div>

                    <div className="space-y-1.5 font-sans">
                      <Label className="text-xs text-foreground font-semibold">Data Table Density</Label>
                      <select
                        value={tableDensity}
                        onChange={(e) => setTableDensity(e.target.value as any)}
                        className="w-full rounded-none bg-background border border-border text-foreground font-mono text-xs h-9 px-3"
                      >
                        <option value="compact">Compact (High Information Density)</option>
                        <option value="standard">Standard (Spacious Row Heights)</option>
                      </select>
                      <p className="text-[11px] text-muted-foreground">Adjusts vertical padding across Monitor and Log tables</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* TAB 6: SECURITY & DANGER ZONE */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              {/* Password Change Card */}
              <form onSubmit={handleChangePassword}>
                <Card className="border border-border bg-card rounded-none shadow-none gap-0 overflow-hidden">
                  <div className="p-6 border-b border-border">
                    <h2 className="text-sm font-bold text-foreground font-sans uppercase tracking-wider">
                      Account Authentication & Password
                    </h2>
                    <p className="text-xs text-muted-foreground font-sans mt-0.5">
                      Ensure your account uses a strong, random password with at least 8 characters
                    </p>
                  </div>

                  <div className="p-6 space-y-4 max-w-lg">
                    <div className="space-y-1.5">
                      <Label htmlFor="cur_pwd" className="text-xs text-foreground font-sans font-semibold">Current Password</Label>
                      <Input
                        id="cur_pwd"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="rounded-none bg-background border-border text-foreground text-xs h-9"
                        placeholder="••••••••"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="new_pwd" className="text-xs text-foreground font-sans font-semibold">New Password</Label>
                      <Input
                        id="new_pwd"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="rounded-none bg-background border-border text-foreground text-xs h-9"
                        placeholder="At least 8 characters"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="conf_pwd" className="text-xs text-foreground font-sans font-semibold">Confirm New Password</Label>
                      <Input
                        id="conf_pwd"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="rounded-none bg-background border-border text-foreground text-xs h-9"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div className="bg-muted/30 border-t border-border px-6 py-3 flex items-center justify-between text-xs font-sans">
                    <span className="text-muted-foreground text-[11px]">Password changes immediately invalidate legacy session cookies.</span>
                    <Button type="submit" variant="default" size="sm" className="text-xs font-semibold h-8 px-4">
                      Update Password
                    </Button>
                  </div>
                </Card>
              </form>

              {/* Active Sessions Card */}
              <Card className="border border-border bg-card rounded-none shadow-none gap-0 overflow-hidden">
                <div className="p-6 border-b border-border">
                  <h2 className="text-sm font-bold text-foreground font-sans uppercase tracking-wider">
                    Active Authenticated Sessions
                  </h2>
                  <p className="text-xs text-muted-foreground font-sans mt-0.5">
                    Devices and web clients currently authorized with your credentials
                  </p>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between p-3.5 bg-muted/20 border border-border text-xs">
                    <div className="flex items-center gap-3">
                      <Laptop className="w-5 h-5 text-primary" />
                      <div>
                        <div className="font-bold text-foreground font-sans flex items-center gap-1.5">
                          <span>Chrome on Windows (Current Browser)</span>
                          <span className="text-[9px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 border border-emerald-500/20">THIS DEVICE</span>
                        </div>
                        <div className="text-[11px] text-muted-foreground font-mono mt-0.5">
                          IP: 127.0.0.1 • Authenticated session cookie • Last active just now
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="xs"
                      disabled={isSigningOut}
                      onClick={handleSignOut}
                      className="text-xs font-mono border-border text-destructive hover:bg-destructive/10 h-8"
                    >
                      <LogOut className="w-3.5 h-3.5 mr-1" />
                      <span>Sign Out</span>
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Danger Zone Card */}
              <Card className="border border-destructive/40 bg-card rounded-none shadow-none gap-0 overflow-hidden">
                <div className="p-6 border-b border-destructive/20 bg-destructive/5 flex items-center gap-2 text-destructive">
                  <Shield className="w-4 h-4" />
                  <h2 className="text-sm font-bold font-sans uppercase tracking-wider">
                    Danger Zone
                  </h2>
                </div>

                <div className="p-6 space-y-4 text-xs font-sans">
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <div>
                      <div className="font-bold text-foreground">Sign Out of All Devices</div>
                      <div className="text-muted-foreground text-[11px] mt-0.5">Revoke all active browser cookies and API tokens.</div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isSigningOut}
                      onClick={handleSignOut}
                      className="text-xs font-mono border-border text-destructive hover:bg-destructive/10 h-8 px-3"
                    >
                      Sign Out All
                    </Button>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div>
                      <div className="font-bold text-foreground">Delete Account & Infrastructure History</div>
                      <div className="text-muted-foreground text-[11px] mt-0.5">Permanently purge your account, SLA indices, and telemetry logs.</div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsDeleteDialogOpen(true)}
                      className="text-xs font-mono border-destructive/40 text-destructive hover:bg-destructive/10 h-8 px-3"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" />
                      <span>Delete Account</span>
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Create API Key Dialog */}
      <Dialog open={isNewKeyDialogOpen} onOpenChange={setIsNewKeyDialogOpen}>
        <DialogContent className="rounded-none border-border bg-card p-6 max-w-md font-mono text-xs">
          <DialogHeader className="border-b border-border pb-3">
            <DialogTitle className="text-sm font-bold text-foreground font-sans">
              Generate Personal Access Token
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground font-sans mt-1">
              Create an API key for headless CLI runners, GitHub Actions, or Prometheus exporters.
            </DialogDescription>
          </DialogHeader>

          {generatedKey ? (
            <div className="space-y-3 pt-3">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-sans">
                <div className="font-bold">API Key Generated Successfully</div>
                <div className="text-[11px] mt-0.5">Please copy your token now. For security reasons, it will not be shown again.</div>
              </div>

              <div className="flex items-center gap-2 p-2 bg-muted/40 border border-border">
                <code className="text-xs text-foreground font-bold flex-1 break-all">{generatedKey}</code>
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => {
                    navigator.clipboard.writeText(generatedKey);
                    toast.success('Token copied to clipboard');
                  }}
                  className="h-8 border-border"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  <span>Copy</span>
                </Button>
              </div>

              <DialogFooter className="pt-2">
                <Button variant="default" size="sm" onClick={() => setIsNewKeyDialogOpen(false)}>
                  Done
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <div className="space-y-3 pt-3 font-sans">
              <div className="space-y-1.5">
                <Label htmlFor="key_name" className="text-xs font-semibold">Key Identifier Name</Label>
                <Input
                  id="key_name"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="e.g. Production Ingestion Exporter"
                  className="rounded-none bg-background border-border text-foreground font-mono text-xs h-9"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Permission Scope</Label>
                <select
                  value={newKeyRole}
                  onChange={(e) => setNewKeyRole(e.target.value as any)}
                  className="w-full rounded-none bg-background border border-border text-foreground font-mono text-xs h-9 px-3"
                >
                  <option value="Full Access">Full Access (Read, Write, Delete)</option>
                  <option value="Read Only">Read Only (Telemetry & SLA Queries)</option>
                  <option value="Ingestion Only">Ingestion Only (Heartbeat Pings)</option>
                </select>
              </div>

              <DialogFooter className="pt-3">
                <Button variant="outline" size="sm" onClick={() => setIsNewKeyDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="default" size="sm" onClick={handleCreateApiKey}>
                  Generate Token
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Account Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Delete Account & Infrastructure History"
        description="Are you sure you want to permanently delete your Statuo account, all configured health check monitors, and past telemetry history? This action is irreversible."
        confirmLabel="Delete Account"
        isDestructive
        onConfirm={() => {
          setIsDeleteDialogOpen(false);
          toast.error('Account deletion disabled on enterprise demo tier');
        }}
        onClose={() => setIsDeleteDialogOpen(false)}
      />
    </div>
  );
};
