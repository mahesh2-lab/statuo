import React from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import {
  LayoutDashboard,
  Activity,
  BarChart3,
  ListOrdered,
  Settings,
  ChevronLeft,
  ChevronRight,
  Radio,
  BookOpen,
} from "lucide-react"
import { Button } from "../ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"

interface SidebarProps {
  isCollapsed: boolean
  onToggleCollapse: () => void
  isMobileOpen: boolean
  onCloseMobile: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}) => {
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = [
    { label: "Dashboard", to: "/", icon: LayoutDashboard },
    { label: "Monitors & Jobs", to: "/jobs", icon: Activity },
    { label: "Analytics", to: "/analytics", icon: BarChart3 },
    { label: "Audit Events", to: "/events", icon: Radio },
    { label: "Incident Logs", to: "/logs", icon: ListOrdered },
    { label: "Settings", to: "/settings", icon: Settings },
  ]

  const isItemActive = (path: string) => {
    if (path === "/" || path === "/dashboard") {
      return location.pathname === "/" || location.pathname === "/dashboard"
    }
    return location.pathname.startsWith(path)
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-200 ${
          isCollapsed ? "w-16" : "w-60"
        } ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Brand Header */}
        <div
          className={`flex h-14 items-center border-b border-sidebar-border ${isCollapsed ? "justify-center px-0" : "justify-between px-4"}`}
        >
          <div
            onClick={() => {
              navigate("/")
              onCloseMobile()
            }}
            className="flex cursor-pointer items-center gap-2.5 overflow-hidden select-none"
            title="Statuo Dashboard"
          >
            <div className="flex h-8 w-9 rounded-lg shrink-0 items-center justify-center bg-primary">
              <img src="/logo.svg" alt="Statuo Logo" className="h-5 w-5 object-contain" />
            </div>
            {!isCollapsed && (
              <div className="flex min-w-0 items-center gap-1.5">
                <span className="font-sans text-xl font-bold tracking-wider text-foreground ">
                  Statuo
                </span>
                <span className="border border-border bg-muted px-1.5 py-0.5 font-mono text-[9px] font-bold text-foreground">
                  PRO
                </span>
              </div>
            )}
          </div>

          {/* Desktop Collapse Button */}
          {!isCollapsed && (
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={onToggleCollapse}
              className="hidden h-7 w-7 rounded-none text-foreground hover:bg-muted lg:flex"
              title="Collapse sidebar"
            >
              <ChevronLeft className="h-4 w-4 text-foreground" />
            </Button>
          )}
        </div>

        {/* Navigation Items */}
        {isCollapsed ? (
          <nav className="flex flex-1 flex-col items-center gap-2.5 overflow-y-auto p-3">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isItemActive(item.to)
              return (
                <Tooltip key={item.to} delayDuration={50}>
                  <TooltipTrigger asChild>
                    <Link
                      to={item.to}
                      onClick={onCloseMobile}
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-none transition-all ${
                        active
                          ? "bg-primary font-bold text-white shadow-xs"
                          : "text-foreground hover:bg-muted/80"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 shrink-0 ${active ? "text-white" : "text-foreground"}`}
                      />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    sideOffset={12}
                    className="z-50 rounded-none px-2.5 py-1 font-mono text-xs"
                  >
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </nav>
        ) : (
          <nav className="flex-1 space-y-1 overflow-y-auto p-3">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isItemActive(item.to)
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={onCloseMobile}
                  className={`flex items-center gap-3 rounded-none px-3 py-2 font-sans text-xs transition-colors ${
                    active
                      ? "bg-primary font-semibold text-white shadow-xs"
                      : "font-medium text-foreground hover:bg-muted/80"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 shrink-0 ${active ? "text-white" : "text-foreground"}`}
                  />
                  <span className="truncate">{item.label}</span>
                </Link>
              )
            })}
          </nav>
        )}

        {/* Mini Sidebar Footer */}
        {isCollapsed ? (
          <div className="flex flex-col items-center gap-2 border-t border-sidebar-border p-2">
            <Tooltip delayDuration={50}>
              <TooltipTrigger asChild>
                <div className="flex h-8 w-8 items-center justify-center cursor-default">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={12} className="font-mono text-xs">
                Scheduler Active (15s cycle)
              </TooltipContent>
            </Tooltip>

            <Tooltip delayDuration={50}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={onToggleCollapse}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-none text-foreground hover:bg-muted"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={12} className="font-mono text-xs">
                Expand sidebar
              </TooltipContent>
            </Tooltip>
          </div>
        ) : (
          <div className="border-t border-sidebar-border p-3 space-y-2.5">
            {/* Live Status Card */}
            <div className="border border-sidebar-border bg-muted/40 p-2.5 font-mono text-[11px] text-foreground">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="font-semibold">Scheduler</span>
                </div>
                <span className="px-1.5 py-0.2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                  LIVE
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between text-[10px] text-muted-foreground">
                <span>15s polling cycle</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">99.98%</span>
              </div>
            </div>

            {/* Mini Footer Utility Links & Version */}
            <div className="flex items-center justify-between px-0.5 text-[10px] font-mono text-muted-foreground">
              <div className="flex items-center gap-2">
                <Link
                  to="/docs"
                  onClick={onCloseMobile}
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  <BookOpen className="h-3 w-3" />
                  <span>Docs</span>
                </Link>
                <span>•</span>
                <Link
                  to="/settings"
                  onClick={onCloseMobile}
                  className="hover:text-foreground transition-colors"
                >
                  API
                </Link>
              </div>
              <span className="font-mono text-[9px] text-muted-foreground/70">v1.2.0</span>
            </div>
          </div>
        )}
      </aside>
    </>
  )
}
