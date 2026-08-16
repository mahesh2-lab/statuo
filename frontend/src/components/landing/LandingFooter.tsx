import { Link } from 'react-router-dom';

const footerSections = [
  {
    title: 'TELEMETRY ENGINE',
    links: [
      { label: 'Synthetic Probes', href: '#features' },
      { label: 'Multi-Region Edge', href: '#features' },
      { label: 'MCP Server Protocol', href: '#ai-client' },
      { label: 'Status Pages', href: '#features' },
      { label: 'Pricing Matrix', href: '#pricing' },
    ],
  },
  {
    title: 'PROBE BLUEPRINTS',
    links: [
      { label: 'REST & GraphQL', href: '#features' },
      { label: 'WebSocket Stream', href: '#features' },
      { label: 'SSL Expiry Alerting', href: '#features' },
      { label: 'gRPC TLS Assertion', href: '#features' },
      { label: 'DNS & ICMP Ping', href: '#features' },
    ],
  },
  {
    title: 'DEVELOPER & DOCS',
    links: [
      { label: 'Documentation', href: '/docs' },
      { label: 'API Reference', href: '/docs' },
      { label: 'CLI Tooling (npm)', href: '/docs' },
      { label: 'Webhook Signatures', href: '/docs' },
      { label: 'System Incidents', href: '/logs' },
    ],
  },
  {
    title: 'LEGAL & SECURITY',
    links: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Security Whitepaper', href: '#' },
      { label: 'SOC2 Compliance', href: '#' },
      { label: 'DPA & GDPR', href: '#' },
    ],
  },
];

export function LandingFooter() {
  return (
    <footer className="bg-background text-foreground font-mono text-xs border-t border-border pt-12 pb-8">
      <div className="l-container px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 no-underline">
              <div className="flex h-8 w-8 items-center justify-center bg-primary rounded-none">
                <img src="/logo.svg" alt="Statuo Logo" className="h-5 w-5 object-contain" />
              </div>
              <span className="font-bold text-sm tracking-tight text-foreground uppercase font-sans">
                STATUO ENTERPRISE
              </span>
            </Link>

            <p className="text-xs text-muted-foreground leading-relaxed font-sans max-w-sm">
              High-availability synthetic telemetry, sub-second multi-region endpoint probing, and native Model Context Protocol (MCP) server integration.
            </p>

            <div className="flex items-center gap-2 text-[11px] text-muted-foreground pt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>SYSTEM STATUS: 100% OPERATIONAL</span>
            </div>
          </div>

          {/* Nav Columns */}
          {footerSections.map((sec) => (
            <div key={sec.title} className="space-y-3">
              <div className="text-[11px] font-bold text-foreground font-mono tracking-wider">
                {sec.title}
              </div>
              <ul className="space-y-2 list-none p-0 m-0">
                {sec.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors no-underline block"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-muted-foreground">
          <div>
            © {new Date().getFullYear()} Statuo Telemetry Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="hover:text-foreground">
              Console
            </Link>
            <Link to="/docs" className="hover:text-foreground">
              Docs
            </Link>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-foreground">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
