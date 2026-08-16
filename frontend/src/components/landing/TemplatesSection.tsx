import { CheckCircle2, ArrowRight } from 'lucide-react';
import { SectionHeader } from './shared/SectionHeader';
import { ScrollReveal } from './shared/ScrollReveal';

const templates = [
  {
    title: 'REST & GraphQL API Probe',
    tag: 'PAYLOAD & HEADERS',
    description: 'Assert JSON response structures, validate status codes, pass Bearer tokens, and benchmark p99 latency.',
    specs: ['Custom Auth Headers', 'JSON Path Regex Match', 'Status 200..299 Check'],
    method: 'POST /v1/query',
    badge: 'HTTP/2',
  },
  {
    title: 'WebSocket & Live Stream',
    tag: 'REAL-TIME PING/PONG',
    description: 'Maintain persistent socket connections, measure handshake delays, and send automated keep-alive heartbeats.',
    specs: ['WSS TLS Handshake', 'Heartbeat Frame Ping', 'Disconnect Alerting'],
    method: 'WSS /stream/live',
    badge: 'WEBSOCKET',
  },
  {
    title: 'SSL / TLS Certificate Suite',
    tag: 'ZERO-DOWNTIME EXPIRY',
    description: 'Track expiration dates across all domain SANs, detect revoked certificates, and verify cipher suites.',
    specs: ['30-day Expiry Alert', 'SAN Wildcard Tracking', 'TLS 1.3 Strict Check'],
    method: 'CERT CHECK *.statuo.dev',
    badge: 'TLS 1.3',
  },
];

export function TemplatesSection() {
  return (
    <section className="l-section border-b border-border/60 pb-16">
      <div className="l-container">
        <ScrollReveal>
          <SectionHeader
            tag="PRE-CONFIGURED PROBES"
            title={
              <>
                Deploy in Seconds with <span className="text-primary font-mono">Telemetry Blueprints</span>
              </>
            }
            subtitle="Choose from ready-to-use probe blueprints optimized for modern distributed architectures."
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
          {templates.map((tpl, i) => (
            <ScrollReveal key={tpl.title} delay={i * 0.08}>
              <div className="l-card p-5 h-full flex flex-col justify-between border border-border hover:border-primary/50 transition-colors">
                <div>
                  {/* Method badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2 py-0.5 bg-muted font-mono text-[10px] text-foreground border border-border font-bold">
                      {tpl.badge}
                    </span>
                    <span className="font-mono text-[10px] text-primary">{tpl.tag}</span>
                  </div>

                  <div className="p-2.5 bg-black/60 border border-border font-mono text-[11px] text-emerald-400 mb-4 truncate">
                    {tpl.method}
                  </div>

                  <h3 className="font-bold text-sm text-foreground uppercase tracking-tight mb-2 font-sans">
                    {tpl.title}
                  </h3>

                  <p className="text-xs text-muted-foreground leading-relaxed mb-4 font-sans">
                    {tpl.description}
                  </p>

                  <ul className="space-y-1.5 pt-3 border-t border-border/40 text-xs text-foreground/80 font-mono">
                    {tpl.specs.map((spec) => (
                      <li key={spec} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="text-[11px]">{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-3 border-t border-border/40 flex items-center justify-between text-xs font-mono text-primary">
                  <span>USE BLUEPRINT</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
