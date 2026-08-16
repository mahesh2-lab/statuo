import { Lock, Cpu, Sparkles, Terminal } from 'lucide-react';
import { SectionHeader } from './shared/SectionHeader';
import { ScrollReveal } from './shared/ScrollReveal';
import { BorderBeam } from '../ui/border-beam';

const subFeatures = [
  {
    icon: Cpu,
    title: 'Model Context Protocol (MCP) Server',
    description: 'Connect Cursor, Claude Code, Windsurf, or custom LLM agents directly to Statuo via standard stdio / SSE transports.',
  },
  {
    icon: Terminal,
    title: 'Autonomous Incident Diagnostics',
    description: 'AI agents can query endpoint health, read raw HTTP response headers, trace SSL chains, and identify failing microservices.',
  },
  {
    icon: Lock,
    title: 'Scoped Read/Write Token Granularity',
    description: 'Issue sandboxed API keys with exact probe execution rights. Revoke LLM agent permissions in real-time from the dashboard.',
  },
];

export function AIClientSection() {
  return (
    <section className="l-section border-b border-border/60 pb-16" id="ai-client">
      <div className="l-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: AI MCP Terminal Simulator */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <ScrollReveal direction="left">
              <div className="relative border border-border bg-black text-white font-mono text-xs shadow-xl overflow-hidden">
                <BorderBeam size={20} duration={6} colorFrom="#38bdf8" colorTo="#a78bfa" borderWidth={1.5} />
                {/* Terminal Header */}
                <div className="h-9 bg-zinc-900/90 border-b border-zinc-800 px-4 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-zinc-200 font-bold">CURSOR / CLAUDE MCP AGENT SESSION</span>
                  </div>
                  <span className="text-emerald-400 font-bold">● MCP CONNECTED</span>
                </div>

                {/* Terminal Body */}
                <div className="p-4 space-y-3 text-[11px] leading-relaxed">
                  <div className="text-zinc-500">
                    // Claude Agent calling MCP Tool: statuo_get_incident_trace
                  </div>

                  <div className="p-2.5 bg-zinc-900/60 border border-zinc-800 text-zinc-300">
                    <div className="text-cyan-400 font-bold">▶ Tool Execution: statuo.diagnoseEndpoint()</div>
                    <div className="text-zinc-400 mt-1">
                      Target: <span className="text-emerald-400">https://api.statuo.dev/v1/auth/session</span>
                    </div>
                    <div className="text-zinc-400">
                      Result: <span className="text-red-400">502 Bad Gateway</span> (upstream proxy timed out at 5000ms)
                    </div>
                  </div>

                  <div className="text-zinc-200">
                    <span className="text-cyan-400 font-bold">Agent Recommendation:</span> Redis session cluster in <span className="text-yellow-400">us-east-1</span> is exceeding connection limits. Auto-scaling replica group via AWS CLI.
                  </div>

                  <div className="pt-2 border-t border-zinc-800 text-zinc-400 flex items-center justify-between text-[10px]">
                    <span>MCP PROTOCOL: v1.0.0</span>
                    <span className="text-emerald-400 font-mono">LATENCY: 14ms</span>
                  </div>
                </div>

                {/* Quick command bar */}
                <div className="p-2.5 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between text-[11px]">
                  <span className="text-zinc-400">$ statuo mcp --serve</span>
                  <span className="text-xs text-primary font-bold">LISTEN 0.0.0.0:8080</span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Copy */}
          <div className="lg:col-span-6 order-1 lg:order-2">
            <ScrollReveal direction="right">
              <SectionHeader
                centered={false}
                tag="AGENTIC CODING & AUTOMATION"
                title={
                  <>
                    Observability for <span className="text-primary font-mono">AI-First Engineering</span>
                  </>
                }
                subtitle="Don't just alert human engineers. Allow autonomous agents in Cursor and Claude to pull real-time telemetry, reproduce production bugs locally, and auto-patch regressions."
              />

              <div className="mt-8 space-y-4">
                {subFeatures.map((sf) => {
                  const Icon = sf.icon;
                  return (
                    <div key={sf.title} className="p-4 bg-card border border-border flex items-start gap-3.5 hover:border-foreground/30 transition-colors">
                      <div className="w-8 h-8 rounded-none bg-muted flex items-center justify-center shrink-0 border border-border">
                        <Icon className="w-4 h-4 text-cyan-500" />
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
        </div>
      </div>
    </section>
  );
}
