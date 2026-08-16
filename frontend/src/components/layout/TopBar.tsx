import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Sun,
  Moon,
  Laptop,
  Bell,
  Search,
  LogOut,
  Settings,
  Activity,
  Plus,
  Check,
} from 'lucide-react';
import { Button } from '../ui/button';
import { useTheme } from '../../context/useTheme';
import { useSession, useSignOut } from '../../hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

interface TopbarProps {
  onOpenMobile: () => void;
  onOpenNewJob?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenMobile, onOpenNewJob }) => {
  const navigate = useNavigate();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { data: sessionData } = useSession();
  const { mutate: signOut, isPending: isSigningOut } = useSignOut();

  const user = (sessionData as any)?.user || (sessionData as any) || { name: 'Admin User', email: 'admin@statuo.dev' };
  const userInitials = user.name
    ? user.name
        .split(' ')
        .map((w: string) => w[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'AD';

  const handleSignOut = () => {
    signOut(undefined, {
      onSuccess: () => {
        navigate('/login');
      },
    });
  };

  const getThemeIcon = () => {
    if (theme === 'system') return <Laptop className="w-3.5 h-3.5" />;
    return resolvedTheme === 'dark' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />;
  };

  return (
    <header className="h-14 border-b border-border bg-card text-card-foreground px-4 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Mobile Menu & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={onOpenMobile}
          className="lg:hidden text-foreground"
        >
          <Menu className="w-4 h-4" />
        </Button>

        {/* Global Search Bar */}
        <div
          onClick={() => {
            const evt = new KeyboardEvent('keydown', { key: 'k', metaKey: true });
            window.dispatchEvent(evt);
          }}
          className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-background border border-border text-muted-foreground text-xs font-mono w-64 hover:border-foreground/40 transition-colors cursor-pointer select-none h-8"
        >
          <Search className="w-3.5 h-3.5 shrink-0" />
          <span className="flex-1 truncate">Search monitors & logs...</span>
          <kbd className="px-1.5 py-0.5 bg-muted border border-border text-[9px] text-muted-foreground font-sans">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Quick Action, Incidents, Theme Switcher, User Profile */}
      <div className="flex items-center gap-2">
        {onOpenNewJob && (
          <Button
            variant="default"
            size="xs"
            onClick={onOpenNewJob}
            className="text-xs font-semibold h-8 px-3"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            <span className="hidden sm:inline">New Monitor</span>
          </Button>
        )}

        {/* Incident Notification Indicator */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => navigate('/logs')}
              className="text-muted-foreground hover:text-foreground relative h-8 w-8"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-none" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" sideOffset={6} className="rounded-none font-mono text-xs">
            System Incident Alerts
          </TooltipContent>
        </Tooltip>

        {/* Professional Theme Switcher Dropdown */}
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="text-muted-foreground hover:text-foreground h-8 w-8"
                  aria-label="Select theme"
                >
                  {getThemeIcon()}
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={6} className="rounded-none font-mono text-xs">
              Theme: {theme.toUpperCase()}
            </TooltipContent>
          </Tooltip>

          <DropdownMenuContent align="end" className="w-36 rounded-none bg-popover border-border font-mono text-xs shadow-md">
            <DropdownMenuLabel className="text-[10px] text-muted-foreground uppercase font-mono px-2 py-1">
              Interface Theme
            </DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => setTheme('light')}
              className="flex items-center justify-between cursor-pointer py-1.5 px-2 hover:bg-muted"
            >
              <div className="flex items-center gap-2">
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>Light</span>
              </div>
              {theme === 'light' && <Check className="w-3.5 h-3.5 text-primary" />}
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => setTheme('dark')}
              className="flex items-center justify-between cursor-pointer py-1.5 px-2 hover:bg-muted"
            >
              <div className="flex items-center gap-2">
                <Moon className="w-3.5 h-3.5 text-blue-400" />
                <span>Dark</span>
              </div>
              {theme === 'dark' && <Check className="w-3.5 h-3.5 text-primary" />}
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => setTheme('system')}
              className="flex items-center justify-between cursor-pointer py-1.5 px-2 hover:bg-muted"
            >
              <div className="flex items-center gap-2">
                <Laptop className="w-3.5 h-3.5 text-foreground" />
                <span>System</span>
              </div>
              {theme === 'system' && <Check className="w-3.5 h-3.5 text-primary" />}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="h-4 w-px bg-border mx-1" />

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 px-1.5 py-1 h-8 rounded-none hover:bg-muted"
            >
              <Avatar className="w-6 h-6 rounded-none border border-border text-[10px] font-mono font-bold bg-primary text-primary-foreground">
                <AvatarFallback className="rounded-none bg-primary text-primary-foreground">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:inline-block text-xs font-mono font-medium text-foreground max-w-[100px] truncate">
                {user.name || user.email}
              </span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56 rounded-none bg-popover border-border font-sans shadow-md">
            <DropdownMenuLabel className="font-normal p-3 bg-muted/30 border-b border-border">
              <div className="flex flex-col space-y-1">
                <p className="text-xs font-bold text-foreground font-sans leading-none">{user.name}</p>
                <p className="text-[11px] font-mono text-muted-foreground leading-none">{user.email}</p>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuItem
              onClick={() => navigate('/settings')}
              className="cursor-pointer text-xs font-sans py-2 px-3 hover:bg-muted flex items-center gap-2"
            >
              <Settings className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Workspace Settings</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => navigate('/jobs')}
              className="cursor-pointer text-xs font-sans py-2 px-3 hover:bg-muted flex items-center gap-2"
            >
              <Activity className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Fleet Monitors</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-border my-1" />

            <DropdownMenuItem
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="cursor-pointer text-xs font-sans text-destructive focus:text-destructive focus:bg-destructive/10 py-2 px-3 flex items-center gap-2"
            >
              <LogOut className="w-3.5 h-3.5 text-destructive" />
              <span>{isSigningOut ? 'Signing Out...' : 'Sign Out'}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
