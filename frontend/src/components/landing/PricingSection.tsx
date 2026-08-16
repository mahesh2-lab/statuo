import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import { SectionHeader } from './shared/SectionHeader';
import { ScrollReveal } from './shared/ScrollReveal';
import { BorderBeam } from '../ui/border-beam';
import { useSession } from '../../hooks/useAuth';

const plans = [
  {
    name: 'Developer Free',
    tag: 'SIDE PROJECTS',
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: 'Essential endpoint telemetry for personal microservices & OSS.',
    features: [
      '10 Active Endpoints',
      '60s Probe Frequency',
      '3 Multi-Region Edge Nodes',
      '7-Day Telemetry Logs',
      'Slack & Email Alerts',
      'Community Support',
    ],
    cta: 'Start Free',
    featured: false,
  },
  {
    name: 'Pro Fleet',
    tag: 'SCALING APPS',
    monthlyPrice: 24,
    yearlyPrice: 19,
    description: 'Sub-second probing & synthetic assertions for growing SaaS teams.',
    features: [
      '50 Active Endpoints',
      '10s Probe Frequency',
      '12 Global Edge Nodes',
      '30-Day Telemetry Logs',
      'Native MCP Server Protocol',
      'Webhook Payload HMAC Signatures',
      'Custom Status Page Domain',
    ],
    cta: 'Launch Pro',
    featured: false,
  },
  {
    name: 'Team Cluster',
    tag: 'PRODUCTION SYSTEMS',
    monthlyPrice: 59,
    yearlyPrice: 48,
    description: 'Full multi-region consensus, gRPC streaming, and on-call escalation.',
    features: [
      '200 Active Endpoints',
      '1s Sub-Second Probing',
      'All 24 Global Edge Nodes',
      '90-Day Telemetry Logs',
      'Multi-User RBAC & Audit Trails',
      'Automated Incident Escalation Matrix',
      'Private Team Status Hubs',
      'Priority SLA Support',
    ],
    cta: 'Deploy Team Fleet',
    featured: true,
    badge: 'MOST DEPLOYED',
  },
  {
    name: 'Enterprise Core',
    tag: 'MISSION CRITICAL',
    monthlyPrice: -1,
    yearlyPrice: -1,
    description: 'Dedicated edge probing nodes, custom SLA agreements, and SAML/SSO.',
    features: [
      'Unlimited Endpoints',
      'Custom Edge Probe Locations',
      '1-Year Telemetry Retention',
      'SAML 2.0 / Okta / Azure SSO',
      'Dedicated Slack / Teams Bridge',
      'SOC2 Type II Audit Reports',
      'Custom Legal & Master Services Agreement',
    ],
    cta: 'Contact Architecture Team',
    featured: false,
  },
];

export function PricingSection() {
  const [isYearly, setIsYearly] = useState(true);
  const { data: sessionData } = useSession();
  const isAuthenticated = Boolean(sessionData && ((sessionData as any).user || (sessionData as any).id));

  return (
    <section className="l-section border-b border-border/60 pb-16" id="pricing">
      <div className="l-container">
        <ScrollReveal>
          <SectionHeader
            tag="TRANSPARENT TIER PRICING"
            title={
              <>
                Predictable Pricing for <span className="text-primary font-mono">Any Scale</span>
              </>
            }
            subtitle="Transparent tiers with zero artificial bandwidth penalties. Scale probes effortlessly as your traffic multiplies."
          />
        </ScrollReveal>

        {/* Billing toggle */}
        <ScrollReveal>
          <div className="flex items-center justify-center gap-3 mt-8 mb-12">
            <span className={`text-xs font-mono ${!isYearly ? 'text-foreground font-bold' : 'text-muted-foreground'}`}>
              MONTHLY
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="relative w-12 h-6 bg-muted border border-border cursor-pointer transition-colors p-0.5"
              aria-label="Toggle annual billing"
            >
              <div
                className={`w-4 h-4 bg-primary transition-all ${
                  isYearly ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-xs font-mono ${isYearly ? 'text-foreground font-bold' : 'text-muted-foreground'}`}>
              ANNUAL
            </span>
            <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-mono font-bold">
              SAVE 20%
            </span>
          </div>
        </ScrollReveal>

        {/* Pricing cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan, i) => {
            const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
            const isFeatured = plan.featured;

            return (
              <ScrollReveal key={plan.name} delay={i * 0.06}>
                <div
                  className={`l-card p-6 h-full flex flex-col justify-between relative border ${
                    isFeatured
                      ? 'border-primary bg-card/90 shadow-lg overflow-hidden'
                      : 'border-border bg-card'
                  }`}
                >
                  {isFeatured && (
                    <>
                      <BorderBeam size={20} duration={6} colorFrom="#00E887" colorTo="#38bdf8" borderWidth={1.5} />
                      <div className="absolute top-1 right-0 mr-1 px-2 py-0.5 bg-primary text-primary-foreground text-[10px] font-mono font-bold uppercase tracking-wider z-10">
                        {plan.badge}
                      </div>
                    </>
                  )}

                  <div>
                    <div className="text-[10px] font-mono text-muted-foreground uppercase mb-1">
                      {plan.tag}
                    </div>
                    <h3 className="text-base font-bold text-foreground font-sans uppercase mb-3">
                      {plan.name}
                    </h3>

                    <div className="mb-4">
                      {price >= 0 ? (
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-bold font-mono text-foreground">${price}</span>
                          <span className="text-xs text-muted-foreground font-mono">/month</span>
                        </div>
                      ) : (
                        <div className="text-2xl font-bold font-mono text-foreground">Custom</div>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed font-sans mb-6">
                      {plan.description}
                    </p>

                    <div className="space-y-2 pt-4 border-t border-border/60 mb-6">
                      {plan.features.map((f) => (
                        <div key={f} className="flex items-center gap-2 text-xs font-mono text-foreground/90">
                          <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span className="text-[11px]">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link
                    to={isAuthenticated ? '/dashboard' : '/signup'}
                    className={`w-full py-2.5 px-4 text-xs font-mono font-bold uppercase text-center flex items-center justify-center gap-1.5 transition-all ${
                      isFeatured
                        ? 'bg-primary text-primary-foreground hover:opacity-90'
                        : 'bg-muted hover:bg-muted/80 text-foreground border border-border'
                    }`}
                  >
                    <span>{isAuthenticated ? 'Open Dashboard' : plan.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
