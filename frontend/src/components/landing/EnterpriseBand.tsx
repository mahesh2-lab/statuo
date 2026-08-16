import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Lock, Server, FileCheck } from 'lucide-react';
import { ScrollReveal } from './shared/ScrollReveal';
import { FlickeringGrid } from '../ui/flickering-grid';

const enterpriseItems = [
  {
    icon: Lock,
    title: 'Enterprise SAML / SSO',
    description: 'Seamless Okta, Azure AD, and Google Workspace identity mapping with custom SCIM provisioning.',
  },
  {
    icon: Server,
    title: 'Dedicated VPC Edge Probes',
    description: 'Deploy Statuo synthetic probe runners inside your own AWS VPC or on-premise private subnets.',
  },
  {
    icon: FileCheck,
    title: 'SOC2 Type II & SLA Guarantees',
    description: 'Enforce strict data residency, signed BAAs for healthcare compliance, and contractual uptime guarantees.',
  },
];

export function EnterpriseBand() {
  return (
    <section className="l-section border-b border-border/60 pb-16" id="enterprise">
      <div className="l-container">
        <ScrollReveal>
          <div className="border border-border bg-card p-8 sm:p-12 relative overflow-hidden">
            {/* Ambient telemetry line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-emerald-500 to-cyan-500 z-10" />

            {/* Flickering Grid Animated Background */}
            <FlickeringGrid
              className="absolute inset-0 z-0 [mask-image:radial-gradient(600px_circle_at_top_right,white,transparent)] opacity-40 pointer-events-none"
              squareSize={4}
              gridGap={6}
              color="rgb(0, 232, 135)"
              maxOpacity={0.4}
              flickerChance={0.2}
            />

            <div className="max-w-3xl mb-8">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-muted border border-border text-[10px] font-mono uppercase text-muted-foreground mb-3">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                <span>ENTERPRISE GRADE INFRASTRUCTURE</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground uppercase tracking-tight font-sans">
                Dedicated Power for Mission-Critical Fleets
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2 font-sans leading-relaxed">
                For organizations managing thousands of microservices, multi-cloud architectures, and strict regulatory compliance requirements.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 pt-6 border-t border-border/60">
              {enterpriseItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="space-y-2">
                    <div className="w-8 h-8 flex items-center justify-center bg-muted border border-border">
                      <Icon className="w-4 h-4 text-foreground" />
                    </div>
                    <h3 className="font-bold text-xs text-foreground uppercase font-sans tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed font-sans">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-3 flex-wrap pt-6 mt-2 border-t border-border/60">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-semibold text-xs uppercase font-mono tracking-wider hover:opacity-90 transition-all shadow-xs"
              >
                <span>Talk with Solutions Engineering</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/docs"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-muted text-foreground border border-border text-xs font-mono hover:bg-muted/80 transition-colors"
              >
                <span>Review Security Whitepaper</span>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
