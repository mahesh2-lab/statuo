import { Link } from 'react-router-dom';
import { ArrowRight, Activity, ArrowUpRight } from 'lucide-react';
import { ScrollReveal } from './shared/ScrollReveal';
import { InteractiveGridPattern } from '../ui/interactive-grid-pattern';

import { useSession } from '../../hooks/useAuth';

export function FinalCTA() {
  const { data: sessionData } = useSession();
  const isAuthenticated = Boolean(sessionData && ((sessionData as any).user || (sessionData as any).id));

  return (
    <section className="l-section border-b border-border/60 pb-16">
      <div className="l-container max-w-4xl">
        <ScrollReveal>
          <div className="border border-border bg-card p-8 sm:p-12 text-center relative overflow-hidden">
            {/* Background interactive grid */}
            <InteractiveGridPattern
              className="[mask-image:radial-gradient(450px_circle_at_center,white,transparent)] opacity-50 pointer-events-auto"
              width={36}
              height={36}
              squares={[36, 16]}
              squaresClassName="stroke-border/40 hover:fill-primary/20 transition-all duration-100"
            />

            <div className="relative z-10 max-w-2xl mx-auto">
              <div className="w-10 h-10 bg-primary mx-auto mb-4 flex items-center justify-center">
                <Activity className="w-5 h-5 text-primary-foreground" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-foreground uppercase tracking-tight font-sans mb-3">
                Deploy Synthetic Telemetry in Under 60 Seconds
              </h2>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-sans mb-6">
                Start with 10 free endpoints. No credit card required. Connect your first REST or WebSocket probe instantly.
              </p>

              {/* Terminal Snippet */}
              <div className="p-2.5 bg-black/80 border border-border text-left font-mono text-xs text-zinc-300 max-w-md mx-auto mb-6 flex items-center justify-between">
                <span className="truncate">
                  <span className="text-primary font-bold mr-1">$</span>
                  <span>npx statuo@latest init</span>
                </span>
                <span className="text-[10px] text-emerald-400 shrink-0 font-bold">READY</span>
              </div>

              <div className="flex items-center justify-center gap-3 flex-wrap">
                <Link
                  to={isAuthenticated ? '/dashboard' : '/signup'}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground font-bold text-xs uppercase font-mono tracking-wider hover:opacity-90 transition-all shadow-sm"
                >
                  <span>{isAuthenticated ? 'Open Dashboard' : 'Launch Free Console'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/docs"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-muted text-foreground border border-border text-xs font-mono hover:bg-muted/80 transition-colors"
                >
                  <span>Explore Documentation</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
