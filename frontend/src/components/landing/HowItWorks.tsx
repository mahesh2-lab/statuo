import { Terminal, Network, ShieldCheck, Zap } from 'lucide-react';
import { SectionHeader } from './shared/SectionHeader';
import { ScrollReveal } from './shared/ScrollReveal';

const steps = [
  {
    step: '01',
    title: 'Define Probe Spec',
    description: 'Configure endpoint URLs, expected HTTP headers, JSON body assertions, and probe frequency via GUI, CLI, or Terraform.',
    icon: Terminal,
  },
  {
    step: '02',
    title: 'Distribute Across Edge',
    description: 'Statuo broadcasts synthetic jobs to 24 edge nodes across AWS, GCP, and Cloudflare points of presence.',
    icon: Network,
  },
  {
    step: '03',
    title: 'Multi-Node Consensus',
    description: 'If a node detects a failure, secondary verification nodes confirm the anomaly before raising a false positive.',
    icon: ShieldCheck,
  },
  {
    step: '04',
    title: 'Instant Dispatch & Triage',
    description: 'Trigger PagerDuty, Slack, Webhooks, and pass execution logs to connected MCP agents for auto-remediation.',
    icon: Zap,
  },
];

export function HowItWorks() {
  return (
    <section className="l-section border-b border-border/60 pb-16" id="how-it-works">
      <div className="l-container">
        <ScrollReveal>
          <SectionHeader
            tag="PIPELINE EXECUTION MODEL"
            title={
              <>
                From Definition to <span className="text-primary font-mono">Consensus Triage</span>
              </>
            }
            subtitle="How Statuo guarantees zero false-positive alerts while providing sub-second anomaly detection."
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <ScrollReveal key={s.step} delay={i * 0.08}>
                <div className="l-card p-5 h-full flex flex-col justify-between border border-border bg-card/60">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-xl font-bold text-primary">{s.step}</span>
                      <div className="w-8 h-8 flex items-center justify-center bg-muted border border-border">
                        <Icon className="w-4 h-4 text-foreground" />
                      </div>
                    </div>

                    <h3 className="font-bold text-sm text-foreground uppercase tracking-tight mb-2 font-sans">
                      {s.title}
                    </h3>

                    <p className="text-xs text-muted-foreground leading-relaxed font-sans">
                      {s.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-3 border-t border-border/40 text-[10px] font-mono text-muted-foreground flex items-center justify-between">
                    <span>STAGE {s.step}</span>
                    <span className="text-emerald-500">OPTIMAL</span>
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
