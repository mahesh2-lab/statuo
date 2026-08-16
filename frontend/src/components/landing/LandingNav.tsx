import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Moon, Sun, Laptop, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../../context/useTheme';
import { useSession } from '../../hooks/useAuth';

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { data: sessionData } = useSession();
  const isAuthenticated = Boolean(sessionData && ((sessionData as any).user || (sessionData as any).id));

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    if (theme === 'dark') setTheme('light');
    else if (theme === 'light') setTheme('system');
    else setTheme('dark');
  };

  const getThemeIcon = () => {
    if (theme === 'system') return <Laptop className="w-3.5 h-3.5" />;
    return resolvedTheme === 'dark' ? (
      <Moon className="w-3.5 h-3.5 text-blue-400" />
    ) : (
      <Sun className="w-3.5 h-3.5 text-amber-500" />
    );
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-xs'
          : 'bg-background/80 backdrop-blur-xs border-b border-border/40'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-4 shrink-0">
          <Link to="/" className="flex items-center gap-2.5 no-underline select-none">
            <div className="flex h-7 w-7 items-center justify-center bg-primary rounded-none shadow-xs">
              <img src="/logo.svg" alt="Statuo" className="h-4 w-4 object-contain" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-foreground uppercase font-sans">
                Statuo
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 bg-muted text-muted-foreground border border-border">
                v2.4
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Navigation Links */}
        <div className="hidden md:flex items-center gap-1 text-xs font-sans font-medium text-muted-foreground">
          <a
            href="#features"
            className="px-3 py-1.5 hover:text-foreground hover:bg-muted/60 transition-colors whitespace-nowrap"
          >
            Telemetry
          </a>
          <a
            href="#integrations"
            className="px-3 py-1.5 hover:text-foreground hover:bg-muted/60 transition-colors whitespace-nowrap"
          >
            Integrations
          </a>
          <a
            href="#ai-client"
            className="px-3 py-1.5 hover:text-foreground hover:bg-muted/60 transition-colors whitespace-nowrap"
          >
            MCP Server
          </a>
          <a
            href="#pricing"
            className="px-3 py-1.5 hover:text-foreground hover:bg-muted/60 transition-colors whitespace-nowrap"
          >
            Pricing
          </a>
          <Link
            to="/docs"
            className="px-3 py-1.5 hover:text-foreground hover:bg-muted/60 transition-colors whitespace-nowrap"
          >
            Docs
          </Link>
        </div>

        {/* Right: Search, Theme, Sign In, CTA */}
        <div className="flex items-center gap-2.5 shrink-0">
          

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="h-8 w-8 flex items-center justify-center border border-border text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer shrink-0"
            title={`Theme: ${theme}`}
            aria-label="Toggle theme"
          >
            {getThemeIcon()}
          </button>

          {!isAuthenticated && (
            <>
              <div className="h-4 w-px bg-border hidden sm:block shrink-0" />
              {/* Sign In */}
              <Link
                to="/login"
                className="hidden sm:inline-flex items-center px-2.5 py-1.5 text-xs font-sans font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
              >
                Sign In
              </Link>
            </>
          )}

          {/* Primary CTA */}
          <Link
            to={isAuthenticated ? '/dashboard' : '/signup'}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-xs whitespace-nowrap shrink-0"
          >
            <span>{isAuthenticated ? 'Dashboard' : 'Launch Free'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden h-8 w-8 flex items-center justify-center border border-border text-foreground hover:bg-muted shrink-0"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
            className="md:hidden border-b border-border bg-background px-4 py-4 space-y-3 font-sans text-xs"
          >
            <div className="flex flex-col space-y-1">
              <a
                href="#features"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 text-foreground hover:bg-muted font-medium"
              >
                Telemetry & Probes
              </a>
              <a
                href="#integrations"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 text-foreground hover:bg-muted font-medium"
              >
                Integrations
              </a>
              <a
                href="#ai-client"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 text-foreground hover:bg-muted font-medium"
              >
                MCP Server Protocol
              </a>
              <a
                href="#pricing"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 text-foreground hover:bg-muted font-medium"
              >
                Pricing
              </a>
              <Link
                to="/docs"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 text-foreground hover:bg-muted font-medium"
              >
                Documentation
              </Link>
            </div>
            <div className="pt-3 border-t border-border flex items-center justify-between">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-1.5 text-xs bg-primary text-primary-foreground font-semibold"
                  >
                    Launch Free →
                  </Link>
                </>
              ) : (
                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center px-4 py-2 text-xs bg-primary text-primary-foreground font-semibold"
                >
                  Go to Dashboard →
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
