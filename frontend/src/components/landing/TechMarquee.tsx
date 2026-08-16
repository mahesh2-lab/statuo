import { Marquee } from '../ui/marquee';
import { Activity, Shield, Cpu, Database, Server, Cloud, Terminal, Globe2 } from 'lucide-react';

const targets = [
  { name: 'FastAPI Microservice', status: '200 OK', latency: '14ms', region: 'us-east-1', icon: Terminal, color: '#00E887' },
  { name: 'Next.js 15 Edge SSR', status: '200 OK', latency: '8ms', region: 'iad-edge', icon: Globe2, color: '#38bdf8' },
  { name: 'PostgreSQL 16 Primary', status: 'HEALTHY', latency: '2ms', region: 'us-east-1a', icon: Database, color: '#00E887' },
  { name: 'Redis Cache Mesh', status: 'PONG', latency: '1ms', region: 'us-east-1b', icon: Server, color: '#00E887' },
  { name: 'Cloudflare Workers API', status: '101 ACK', latency: '4ms', region: 'global-anycast', icon: Cloud, color: '#f59e0b' },
  { name: 'Auth0 / Better Auth', status: 'VALID', latency: '22ms', region: 'us-west-2', icon: Shield, color: '#00E887' },
  { name: 'Stripe Webhook Gateway', status: '200 OK', latency: '48ms', region: 'us-east-1', icon: Activity, color: '#00E887' },
  { name: 'Kubernetes Ingress Controller', status: 'ONLINE', latency: '6ms', region: 'eu-central-1', icon: Cpu, color: '#a78bfa' },
];

export function TechMarquee() {
  return (
    <div className="border-b border-border/60 bg-muted/20 py-4 font-mono text-xs overflow-hidden">
      <div className="l-container mb-2 text-[10px] text-muted-foreground uppercase flex items-center justify-between px-4">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>SYNTHETIC PROBE TELEMETRY STREAM</span>
        </span>
        <span className="hidden sm:inline">24 REGIONS POLLING CONTINUOUSLY</span>
      </div>

      <Marquee pauseOnHover className="[--duration:25s] py-1">
        {targets.map((tgt) => {
          const Icon = tgt.icon;
          return (
            <div
              key={tgt.name}
              className="flex items-center gap-2.5 px-3 py-1.5 bg-card border border-border text-foreground hover:border-foreground/30 transition-colors shrink-0"
            >
              <Icon className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="font-bold text-[11px]">{tgt.name}</span>
              <span
                className="px-1 py-0.2 text-[9px] font-bold border"
                style={{
                  color: tgt.color,
                  backgroundColor: `${tgt.color}15`,
                  borderColor: `${tgt.color}30`,
                }}
              >
                {tgt.status}
              </span>
              <span className="text-muted-foreground text-[10px]">{tgt.latency}</span>
              <span className="text-[9px] text-muted-foreground/60 border-l border-border pl-1.5">
                {tgt.region}
              </span>
            </div>
          );
        })}
      </Marquee>
    </div>
  );
}
