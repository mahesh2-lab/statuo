import { Activity, ShieldAlert, Cpu, BellRing, Network, Zap } from 'lucide-react';
import { SectionHeader } from './shared/SectionHeader';
import { ScrollReveal } from './shared/ScrollReveal';

const features = [
  {
    code: '01',
    title: 'Sub-Second Probing',
    tag: 'HIGH-FREQUENCY',
    description: 'Execute synthetic HTTP, WebSocket, gRPC, and DNS tests at 1s intervals with payload verification.',
    icon: Activity,
    color: '#00E887',
  },
  {
    code: '02',
    title: 'Native MCP Protocol',
    tag: 'AI / AGENTS',
    description: 'Give Cursor, Claude, and autonomous coding agents direct real-time read/write access to your monitoring fleet.',
    icon: Cpu,
    color: '#38bdf8',
  },
  {
    code: '03',
    title: 'Distributed Edge Probes',
    tag: 'MULTI-REGION',
    description: 'Simultaneous assertions across 24 global edge points. Eliminate false alarms via multi-node consensus.',
    icon: Network,
    color: '#a78bfa',
  },
  {
    code: '04',
    title: 'Incident Telemetry & Traces',
    tag: 'ROOT-CAUSE',
    description: 'Full request/response capture with SSL handshake profiling, DNS resolution timing, and error body snapshots.',
    icon: ShieldAlert,
    color: '#f59e0b',
  },
  {
    code: '05',
    title: 'Smart Routing & Escalation',
    tag: 'DISPATCH',
    description: 'Instant notification webhooks for Slack, Discord, Teams, and PagerDuty with on-call retry escalation policies.',
    icon: BellRing,
    color: '#f43f5e',
  },
  {
    code: '06',
    title: 'Public & Private Status Pages',
    tag: 'SLA BRANDING',
    description: 'Custom domain status hubs with subscriber email/SMS updates, incident timelines, and verified SLA reporting.',
    icon: Zap,
    color: '#00E887',
  },
];

export function FeatureStrip() {
  return (
    <section className="l-section border-b border-border/60 pb-16" id="features">
      <div className="l-container">
        <ScrollReveal>
          <SectionHeader
            tag="ARCHITECTURE & CORE CAPABILITIES"
            title={
              <>
                Engineered for <span className="text-primary font-mono">Zero-Tolerance</span> Reliability
              </>
            }
            subtitle="Everything required to monitor, diagnose, and auto-remediate mission-critical distributed services."
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <ScrollReveal key={feature.code} delay={i * 0.06}>
                <div className="l-card p-6 h-full flex flex-col justify-between hover:border-primary/50 group transition-all">
                  <div>
                    {/* Top Row: Code and Tag */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-primary">{feature.code}</span>
                        <span className="text-muted-foreground/40 font-mono">//</span>
                        <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 bg-muted border border-border text-muted-foreground">
                          {feature.tag}
                        </span>
                      </div>
                      <div className="w-8 h-8 flex items-center justify-center bg-muted/40 border border-border group-hover:border-primary/40 transition-colors">
                        <Icon className="w-4 h-4 text-foreground" />
                      </div>
                    </div>

                    {/* Feature Title */}
                    <h3 className="font-sans font-bold text-base text-foreground mb-2 tracking-tight">
                      {feature.title}
                    </h3>

                    {/* Feature Description */}
                    <p className="text-xs text-muted-foreground leading-relaxed font-sans">
                      {feature.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-3 border-t border-border/40 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                    <span>STATUS: ACTIVE</span>
                    <span className="text-emerald-500 font-bold">READY</span>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
