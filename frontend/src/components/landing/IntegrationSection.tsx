import { MessageSquare, Webhook, BellRing } from 'lucide-react';
import { SectionHeader } from './shared/SectionHeader';
import { ScrollReveal } from './shared/ScrollReveal';

const subFeatures = [
  {
    icon: MessageSquare,
    title: 'Zero-Latency Channel Routing',
    description: 'Instant notification dispatch to Slack, Discord, Microsoft Teams, and OpsGenie with interactive resolve buttons.',
  },
  {
    icon: Webhook,
    title: 'HMAC Signed Webhooks',
    description: 'Cryptographically verify payloads with X-Statuo-Signature headers. Trigger serverless auto-remediation lambdas.',
  },
  {
    icon: BellRing,
    title: 'Multi-Tier Escalation Matrix',
    description: 'Define on-call shifts, escalation delays, and auto-repeat alerts until an engineer claims the incident.',
  },
];

export function IntegrationSection() {
  return (
    <section className="l-section border-b border-border/60 pb-16" id="integrations">
      <div className="l-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Copy */}
          <div className="lg:col-span-6">
            <ScrollReveal direction="left">
              <SectionHeader
                centered={false}
                tag="INTEGRATIONS & EVENT DISPATCH"
                title={
                  <>
                    Seamlessly Wired to <span className="text-primary font-mono">Your Stack</span>
                  </>
                }
                subtitle="Alerts arrive where your engineers already debug. Trigger automated CI/CD rollbacks, edge re-routing, or incident tickets without manual intervention."
              />

              <div className="mt-8 space-y-4">
                {subFeatures.map((sf) => {
                  const Icon = sf.icon;
                  return (
                    <div key={sf.title} className="p-4 bg-card border border-border flex items-start gap-3.5 hover:border-foreground/30 transition-colors">
                      <div className="w-8 h-8 rounded-none bg-muted flex items-center justify-center shrink-0 border border-border">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-foreground font-sans uppercase tracking-tight mb-1">
                          {sf.title}
                        </div>
                        <div className="text-xs text-muted-foreground leading-relaxed font-sans">
                          {sf.description}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Interactive Code & Alert Simulator */}
          <div className="lg:col-span-6">
            <ScrollReveal direction="right">
              <div className="border border-border bg-black text-white font-mono text-xs shadow-xl overflow-hidden">
                {/* Header */}
                <div className="h-9 bg-zinc-900/80 border-b border-zinc-800 px-4 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-zinc-300 font-semibold">WEBHOOK DISPATCH PAYLOAD</span>
                  </div>
                  <span className="text-zinc-500">EVENT_ID: evt_98xK19</span>
                </div>

                {/* Code Body */}
                <div className="p-4 space-y-2 text-[11px] leading-relaxed overflow-x-auto text-zinc-300">
                  <div>
                    <span className="text-zinc-500">// POST https://api.ops.company.internal/alerts</span>
                  </div>
                  <div>
                    <span className="text-blue-400">headers:</span> &#123;
                  </div>
                  <div className="pl-4 text-zinc-400">
                    <div>"content-type": <span className="text-emerald-400">"application/json"</span>,</div>
                    <div>"x-statuo-signature": <span className="text-emerald-400">"sha256=9f8e7d6c5b4a..."</span>,</div>
                    <div>"x-statuo-event": <span className="text-emerald-400">"incident.triggered"</span></div>
                  </div>
                  <div>&#125;,</div>
                  <div>
                    <span className="text-blue-400">payload:</span> &#123;
                  </div>
                  <div className="pl-4 text-zinc-400">
                    <div>"job_id": <span className="text-emerald-400">"job_api_gateway_prod"</span>,</div>
                    <div>"target": <span className="text-emerald-400">"https://api.statuo.dev/v1/health"</span>,</div>
                    <div>"status": <span className="text-red-400">"DOWN"</span>,</div>
                    <div>"latency_ms": <span className="text-amber-400">5400</span>,</div>
                    <div>"error_code": <span className="text-red-400">"HTTP_504_GATEWAY_TIMEOUT"</span>,</div>
                    <div>"failed_regions": [<span className="text-emerald-400">"us-east-1"</span>, <span className="text-emerald-400">"eu-west-1"</span>],</div>
                    <div>"escalation_tier": <span className="text-blue-400">1</span></div>
                  </div>
                  <div>&#125;</div>
                </div>

                {/* Simulated Slack / Teams Alert Bar */}
                <div className="p-3 bg-zinc-950 border-t border-zinc-800 text-[11px]">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 bg-red-500/20 text-red-400 font-bold border border-red-500/30">
                        P1 CRITICAL
                      </span>
                      <span className="text-zinc-200">#ops-oncall (Slack Dispatched)</span>
                    </div>
                    <span className="text-zinc-500">2ms ago</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
