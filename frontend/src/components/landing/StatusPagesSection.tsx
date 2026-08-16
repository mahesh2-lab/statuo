import { SectionHeader } from './shared/SectionHeader';
import { ScrollReveal } from './shared/ScrollReveal';

const statusPageTypes = [
  {
    title: 'Public Status Hub',
    tag: 'CUSTOM DOMAIN & SSL',
    description: 'Host on status.yourdomain.com with automated SSL certificates, custom stylesheets, and branded uptime badges.',
    uptime: '99.99%',
    services: [
      { name: 'Core API Gateway', status: 'OPERATIONAL', latency: '19ms', color: '#00E887' },
      { name: 'Global CDN Cache', status: 'OPERATIONAL', latency: '4ms', color: '#00E887' },
      { name: 'Billing & Invoicing', status: 'OPERATIONAL', latency: '48ms', color: '#00E887' },
    ],
  },
  {
    title: 'Internal Team Telemetry',
    tag: 'RBAC & SSO PROTECTED',
    description: 'Private dashboard for DevOps and security teams with raw payload inspection, pod memory telemetry, and latency heatmaps.',
    uptime: '99.98%',
    services: [
      { name: 'Postgres Cluster 01', status: 'OPERATIONAL', latency: '2ms', color: '#00E887' },
      { name: 'Redis Cache Mesh', status: 'DEGRADED', latency: '320ms', color: '#f59e0b' },
      { name: 'Worker Queue Fleet', status: 'OPERATIONAL', latency: '14ms', color: '#00E887' },
    ],
  },
  {
    title: 'SLA Contract Compliance',
    tag: 'AUDIT VERIFIED',
    description: 'Export cryptographically verifiable 90-day SLA reports to satisfy enterprise procurement and compliance audits.',
    uptime: '100.0%',
    services: [
      { name: 'Enterprise SLA Tier', status: 'COMPLIANT', latency: '12ms', color: '#00E887' },
      { name: 'EU Data Residency', status: 'COMPLIANT', latency: '22ms', color: '#00E887' },
      { name: 'SOC2 Type II Controls', status: 'VERIFIED', latency: '0ms', color: '#00E887' },
    ],
  },
];

export function StatusPagesSection() {
  return (
    <section className="l-section border-b border-border/60 pb-16">
      <div className="l-container">
        <ScrollReveal>
          <SectionHeader
            tag="PUBLIC & PRIVATE STATUS HUBS"
            title={
              <>
                Build Trust With <span className="text-primary font-mono">Transparent Uptime</span>
              </>
            }
            subtitle="Keep customers and internal stakeholders informed with real-time status pages that update automatically when incidents trigger or resolve."
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
          {statusPageTypes.map((page, i) => (
            <ScrollReveal key={page.title} delay={i * 0.08}>
              <div className="l-card p-0 flex flex-col h-full overflow-hidden border border-border">
                {/* Mini Visualizer Header */}
                <div className="bg-black/90 p-4 border-b border-border text-white font-mono text-xs">
                  <div className="flex items-center justify-between mb-3 text-[11px]">
                    <span className="text-zinc-400 font-bold">{page.tag}</span>
                    <span className="text-emerald-400 font-bold">{page.uptime}</span>
                  </div>

                  <div className="space-y-1.5">
                    {page.services.map((svc) => (
                      <div
                        key={svc.name}
                        className="flex items-center justify-between p-1.5 bg-zinc-900/60 border border-zinc-800 text-[10px]"
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: svc.color }}
                          />
                          <span className="text-zinc-300 truncate">{svc.name}</span>
                        </div>
                        <span className="text-zinc-400 font-mono shrink-0">{svc.latency}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-foreground uppercase tracking-tight mb-2 font-sans">
                      {page.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed font-sans">
                      {page.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border/40 text-[11px] font-mono text-primary flex items-center gap-1">
                    <span>LIVE PREVIEW →</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
