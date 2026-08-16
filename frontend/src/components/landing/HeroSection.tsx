import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Activity, Globe2, ChevronRight } from 'lucide-react';
import { InteractiveGridPattern } from '../ui/interactive-grid-pattern';
import { BorderBeam } from '../ui/border-beam';

export function HeroSection() {
  const prefersReducedMotion = useReducedMotion();

  const probePoints = [
    { region: 'us-east-1', latency: '18ms', status: 'HEALTHY', color: '#00E887' },
    { region: 'eu-west-1', latency: '34ms', status: 'HEALTHY', color: '#00E887' },
    { region: 'ap-south-1', latency: '52ms', status: 'HEALTHY', color: '#00E887' },
    { region: 'sa-east-1', latency: '89ms', status: 'HEALTHY', color: '#00E887' },
  ];

  const monitorRows = [
    { target: 'https://api.statuo.dev/v1/health', type: 'HTTPS REST', code: '200 OK', latency: '24ms', uptime: '100%', status: 'HEALTHY' },
    { target: 'wss://stream.statuo.dev/telemetry', type: 'WEBSOCKET', code: '101 ACK', latency: '12ms', uptime: '99.99%', status: 'HEALTHY' },
    { target: 'grpc://auth.internal.statuo.io:443', type: 'gRPC TLS', code: '0 OK', latency: '8ms', uptime: '100%', status: 'HEALTHY' },
    { target: 'https://checkout.statuo.dev/api/charge', type: 'HTTPS SYNTH', code: '201 CREATED', latency: '142ms', uptime: '99.95%', status: 'HEALTHY' },
  ];

  return (
    <section className="relative pt-32 pb-16 overflow-hidden border-b border-border/60">
      {/* Interactive Background Grid */}
      <InteractiveGridPattern
        className="mask-[radial-gradient(900px_circle_at_center,white,transparent)] opacity-60 pointer-events-auto"
        width={40}
        height={40}
        squares={[48, 28]}
        squaresClassName="stroke-border/40 hover:fill-primary/20 transition-all duration-100"
      />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="l-container relative z-10 text-center px-4">
        {/* Release / Architecture Badge */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-muted/60 border border-border text-xs font-mono mb-6 select-none"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-foreground font-semibold">STATUO TELEMETRY V2.4</span>
          <span className="text-muted-foreground">//</span>
          <span className="text-primary font-medium">NATIVE MCP SERVER INCLUDED</span>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          className="l-heading text-4xl sm:text-5xl lg:text-6xl max-w-4xl mx-auto mb-6 tracking-tight"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          High-Velocity Observability &{' '}
          <span className="text-primary font-mono tracking-tight">Synthetic Telemetry</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="l-subhead max-w-2xl mx-auto mb-8 text-sm sm:text-base text-muted-foreground leading-relaxed"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          Continuous sub-second endpoint probing, multi-region edge assertions, automated incident triage, and native MCP protocol integration for autonomous coding agents.
        </motion.p>

        {/* Action CTAs */}
        <motion.div
          className="flex items-center justify-center gap-3 flex-wrap mb-4"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-semibold text-xs uppercase tracking-wider font-mono hover:opacity-90 transition-all shadow-sm"
          >
            <span>Deploy Fleet Monitor</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-card border border-border text-foreground font-medium text-xs font-mono hover:bg-muted transition-colors"
          >
            <Activity className="w-3.5 h-3.5 text-emerald-500" />
            <span>Explore Live Dashboard</span>
          </Link>
        </motion.div>

        {/* Monospace Quick-start banner */}
        <motion.div
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-black/40 border border-border text-[11px] font-mono text-muted-foreground mb-12 select-all"
          initial={prefersReducedMotion ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <span className="text-primary">$</span>
          <span className="text-foreground">npx statuo@latest probe --all</span>
          <span className="text-muted-foreground/60">|</span>
          <span className="text-emerald-400">✓ 24/24 pass in 42ms</span>
        </motion.div>

        {/* Telemetry Dashboard Mockup / Interactive Frame */}
        <motion.div
          className="relative max-w-5xl mx-auto border border-border bg-card shadow-2xl overflow-hidden text-left font-mono text-xs"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <BorderBeam size={25} duration={8} colorFrom="#00E887" colorTo="#38bdf8" borderWidth={1.5} />
          {/* Mock Window Topbar */}
          <div className="h-10 bg-muted/40 border-b border-border px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
              </div>
              <span className="text-[11px] text-muted-foreground hidden sm:inline">
                statuo-engine://fleet-prod-cluster-01.telemetry
              </span>
            </div>

            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1.5 text-emerald-500">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                PROBING ACTIVE
              </span>
              <span className="text-muted-foreground">INTERVAL: 1000ms</span>
            </div>
          </div>

          {/* Telemetry Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-border bg-background/50 divide-x divide-border">
            <div className="p-3">
              <div className="text-[10px] text-muted-foreground uppercase">Fleet Availability</div>
              <div className="text-base font-bold text-emerald-500 flex items-center gap-1">
                99.998% <span className="text-[10px] text-muted-foreground font-normal">(30d)</span>
              </div>
            </div>
            <div className="p-3">
              <div className="text-[10px] text-muted-foreground uppercase">Mean Edge Latency</div>
              <div className="text-base font-bold text-foreground">
                21.4 ms <span className="text-[10px] text-emerald-400 font-normal">↓ 2.1ms</span>
              </div>
            </div>
            <div className="p-3">
              <div className="text-[10px] text-muted-foreground uppercase">Active Probes</div>
              <div className="text-base font-bold text-foreground">
                128 / 128 <span className="text-[10px] text-emerald-400 font-normal">100% OK</span>
              </div>
            </div>
            <div className="p-3">
              <div className="text-[10px] text-muted-foreground uppercase">Incident MTTR</div>
              <div className="text-base font-bold text-foreground">
                1.4 min <span className="text-[10px] text-muted-foreground font-normal">auto-triage</span>
              </div>
            </div>
          </div>

          {/* Live Probes Table */}
          <div className="divide-y divide-border bg-card">
            <div className="hidden sm:grid grid-cols-12 px-4 py-2 text-[10px] text-muted-foreground font-mono uppercase bg-muted/20">
              <div className="col-span-5">TARGET ENDPOINT</div>
              <div className="col-span-2">PROTOCOL</div>
              <div className="col-span-2">STATUS</div>
              <div className="col-span-2">LATENCY</div>
              <div className="col-span-1 text-right">UPTIME</div>
            </div>

            {monitorRows.map((row, i) => (
              <div
                key={i}
                className="grid grid-cols-1 sm:grid-cols-12 px-4 py-2.5 items-center gap-2 sm:gap-0 hover:bg-muted/30 transition-colors"
              >
                <div className="col-span-5 flex items-center gap-2 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="font-mono text-foreground truncate">{row.target}</span>
                </div>
                <div className="col-span-2 text-muted-foreground text-[11px]">
                  <span className="px-1.5 py-0.5 bg-muted border border-border">{row.type}</span>
                </div>
                <div className="col-span-2">
                  <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-bold">
                    {row.code}
                  </span>
                </div>
                <div className="col-span-2 text-foreground text-[11px] font-mono">{row.latency}</div>
                <div className="col-span-1 text-right font-bold text-emerald-500 text-[11px]">{row.uptime}</div>
              </div>
            ))}
          </div>

          {/* Bottom Live Edge Strip */}
          <div className="p-3 bg-muted/20 border-t border-border flex flex-wrap items-center justify-between gap-3 text-[11px]">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Globe2 className="w-3.5 h-3.5 text-primary" />
              <span>Multi-Region Edge Nodes:</span>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {probePoints.map((pt) => (
                <div key={pt.region} className="flex items-center gap-1.5 bg-background px-2 py-0.5 border border-border">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-muted-foreground">{pt.region}:</span>
                  <span className="font-bold text-foreground">{pt.latency}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
