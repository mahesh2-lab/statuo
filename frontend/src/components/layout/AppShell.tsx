import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './TopBar';
import { JobFormModal } from '../JobFormModal';
import { useCreateJob } from '../../hooks/useJobs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Search, LayoutDashboard, Activity, BarChart3, ListOrdered, Settings } from 'lucide-react';

export const AppShell: React.FC = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      return (
        localStorage.getItem('statuo_sidebar_collapsed') === 'true' ||
        localStorage.getItem('pulse_sidebar_collapsed') === 'true'
      );
    } catch {
      return false;
    }
  });
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isNewJobOpen, setIsNewJobOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [commandSearch, setCommandSearch] = useState('');

  const { mutateAsync: createJob, isPending: isCreatingJob } = useCreateJob();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('statuo_sidebar_collapsed', String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const commandItems = [
    { label: 'Go to Dashboard', icon: LayoutDashboard, action: () => navigate('/') },
    { label: 'Go to Monitors & Jobs', icon: Activity, action: () => navigate('/jobs') },
    { label: 'Create New Health Monitor', icon: Activity, action: () => setIsNewJobOpen(true) },
    { label: 'Go to Analytics & Uptime', icon: BarChart3, action: () => navigate('/analytics') },
    { label: 'Go to Audit Events', icon: ListOrdered, action: () => navigate('/events') },
    { label: 'Go to Incident Logs', icon: ListOrdered, action: () => navigate('/logs') },
    { label: 'Go to Settings', icon: Settings, action: () => navigate('/settings') },
  ];

  const filteredCommands = commandItems.filter((item) =>
    item.label.toLowerCase().includes(commandSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen flex bg-background text-foreground font-sans">
      {/* Persistent Left Sidebar */}
      <Sidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Content Column */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-200 ${
          isCollapsed ? 'lg:pl-16' : 'lg:pl-60'
        }`}
      >
        {/* Sticky Topbar */}
        <Topbar
          onOpenMobile={() => setIsMobileOpen(true)}
          onOpenNewJob={() => setIsNewJobOpen(true)}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 w-full max-w-[1760px] mx-auto p-4 sm:p-6 lg:p-8">
          <Outlet context={{ onOpenNewJob: () => setIsNewJobOpen(true) }} />
        </main>
      </div>

      {/* Global New Job Modal */}
      <JobFormModal
        isOpen={isNewJobOpen}
        onClose={() => setIsNewJobOpen(false)}
        onSubmit={async (payload) => {
          await createJob(payload);
        }}
        isLoading={isCreatingJob}
      />

      {/* Quick Command Dialog (⌘K) */}
      <Dialog open={isCommandOpen} onOpenChange={setIsCommandOpen}>
        <DialogContent className="rounded-none border-border bg-card p-0 max-w-lg shadow-2xl overflow-hidden">
          <DialogHeader className="sr-only">
            <DialogTitle>Quick Command Menu</DialogTitle>
          </DialogHeader>
          <div className="flex items-center gap-2 px-3 border-b border-border bg-muted/20">
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            <Input
              value={commandSearch}
              onChange={(e) => setCommandSearch(e.target.value)}
              placeholder="Type a command or jump to page..."
              className="border-none shadow-none focus-visible:ring-0 text-xs font-mono h-10 px-0 bg-transparent"
              autoFocus
            />
          </div>
          <div className="p-2 max-h-72 overflow-y-auto space-y-1 font-mono text-xs">
            {filteredCommands.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    item.action();
                    setIsCommandOpen(false);
                    setCommandSearch('');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-foreground hover:bg-accent hover:text-accent-foreground rounded-none transition-colors"
                >
                  <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            {filteredCommands.length === 0 && (
              <div className="p-4 text-center text-xs text-muted-foreground font-mono">
                No matching commands found.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
