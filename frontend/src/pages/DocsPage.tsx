import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Copy,
  Check,
  ChevronDown,
  ArrowUpRight,
  Shield,
  Key,
  Layers,
} from 'lucide-react';
import {
  GoogleIcon,
  GitHubIcon,
  AppleIcon,
  DiscordIcon,
  VercelIcon,
  OpenAIIcon,
  DatabricksIcon,
  StrapiIcon,
  NextJsIcon,
  NuxtIcon,
  SvelteIcon,
  AstroIcon,
  HonoIcon,
} from '../components/icons/BrandIcons';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';

export const DocsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'cli' | 'prompt' | 'mcp' | 'skills'>('cli');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('npx auth init');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-zinc-800 selection:text-white">
      {/* Top Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 h-11 bg-black/90 backdrop-blur-md border-b border-[#1f1f23] px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-2.5 text-white cursor-pointer select-none"
          >
            <div className="flex h-6 w-7 rounded-md shrink-0 items-center justify-center bg-primary">
              <img src="/logo.svg" alt="Statuo Logo" className="h-4 w-4 object-contain" />
            </div>
            <span className="font-bold text-sm tracking-wider uppercase font-sans">
              STATUO
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-5 text-[11px] font-mono">
            <button className="text-white font-semibold border-b border-white pb-0.5">README</button>
            <button onClick={() => navigate('/docs')} className="text-zinc-400 hover:text-white transition-colors cursor-pointer">DOCS</button>
            <button className="text-zinc-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer">
              <span>PRODUCTS</span>
              <ChevronDown className="w-2.5 h-2.5 text-zinc-500" />
            </button>
            <button className="text-zinc-400 hover:text-white transition-colors cursor-pointer">ENTERPRISE</button>
            <button className="text-zinc-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer">
              <span>RESOURCES</span>
              <ChevronDown className="w-2.5 h-2.5 text-zinc-500" />
            </button>
          </nav>
        </div>

        {/* Top Right: Sign In / Dashboard */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="xs"
            onClick={() => navigate('/')}
            className="text-[11px] font-mono text-zinc-300 hover:text-white"
          >
            <span>DASHBOARD</span>
            <ArrowUpRight className="w-3 h-3 ml-1" />
          </Button>
          <Button
            variant="default"
            size="xs"
            onClick={() => navigate('/sign-in')}
            className="text-[11px] font-semibold tracking-tight"
          >
            <span>SIGN IN</span>
            <ArrowUpRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </header>

      {/* Hero & Content Split Layout */}
      <div className="pt-11 grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        {/* Left Hero Column */}
        <div className="lg:col-span-5 border-r border-[#1f1f23] p-8 lg:p-12 flex flex-col justify-between relative bg-black">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a10_1px,transparent_1px),linear-gradient(to_bottom,#27272a10_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

          {/* 3D Geometric Logo Centerpiece */}
          <div className="relative my-auto flex flex-col items-center justify-center py-12">
            <div className="w-32 h-32 border-2 border-white/20 relative flex items-center justify-center bg-black/60 shadow-[0_0_50px_rgba(255,255,255,0.05)]">
              <div className="w-16 h-16 border border-white/40 rotate-45 flex items-center justify-center">
                <span className="font-mono font-black text-2xl text-white -rotate-45">H</span>
              </div>
            </div>
            <div className="mt-8 text-center space-y-2">
              <h2 className="text-xl font-bold tracking-tight text-white font-sans">
                The Authentication Framework
              </h2>
              <p className="text-xs text-zinc-400 max-w-sm font-sans">
                Comprehensive authentication, session tokens, multi-tenancy, and Sentinel KV protection built for TypeScript.
              </p>
            </div>
          </div>
        </div>

        {/* Right Content Column */}
        <div className="lg:col-span-7 p-6 lg:p-10 space-y-8 bg-black">
          {/* Installation Terminal Box */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-white uppercase tracking-wider font-sans">
              Quick Installation
            </div>
            <Card className="rounded-none border-[#27272a] bg-[#09090b] shadow-none gap-0">
              <div className="flex items-center justify-between border-b border-[#27272a] px-3 py-2 bg-black/50">
                <Tabs
                  value={activeTab}
                  onValueChange={(val) => setActiveTab(val as any)}
                  className="w-auto"
                >
                  <TabsList className="bg-transparent p-0 h-auto gap-2">
                    <TabsTrigger
                      value="cli"
                      className="rounded-none text-[11px] font-mono p-1 h-auto text-zinc-400 data-[state=active]:text-white data-[state=active]:bg-transparent data-[state=active]:border-b data-[state=active]:border-white"
                    >
                      CLI
                    </TabsTrigger>
                    <TabsTrigger
                      value="prompt"
                      className="rounded-none text-[11px] font-mono p-1 h-auto text-zinc-400 data-[state=active]:text-white data-[state=active]:bg-transparent data-[state=active]:border-b data-[state=active]:border-white"
                    >
                      Prompt
                    </TabsTrigger>
                    <TabsTrigger
                      value="mcp"
                      className="rounded-none text-[11px] font-mono p-1 h-auto text-zinc-400 data-[state=active]:text-white data-[state=active]:bg-transparent data-[state=active]:border-b data-[state=active]:border-white"
                    >
                      MCP
                    </TabsTrigger>
                    <TabsTrigger
                      value="skills"
                      className="rounded-none text-[11px] font-mono p-1 h-auto text-zinc-400 data-[state=active]:text-white data-[state=active]:bg-transparent data-[state=active]:border-b data-[state=active]:border-white"
                    >
                      Skills
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={handleCopy}
                  className="text-zinc-500 hover:text-white"
                  title="Copy command"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </Button>
              </div>

              {/* Code Line */}
              <div className="p-4 font-mono text-xs flex items-center gap-2">
                <span className="text-[#38bdf8]">npx</span>
                <span className="text-white font-semibold">auth init</span>
              </div>
            </Card>
          </div>

          {/* Trusted By Bar with Exact SVGs */}
          <div className="space-y-3 pt-4 border-t border-[#1f1f23]">
            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider text-right">
              TRUSTED BY
            </div>
            <div className="flex flex-wrap items-center justify-between gap-6 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-200">
              <div className="flex items-center gap-1.5 font-bold font-sans text-xs">
                <OpenAIIcon size={16} />
                <span>OpenAI</span>
              </div>
              <div className="flex items-center gap-1.5 font-bold font-sans text-xs">
                <DatabricksIcon size={16} />
                <span>databricks</span>
              </div>
              <div className="flex items-center gap-1.5 font-bold font-sans text-xs">
                <VercelIcon size={14} />
                <span>Vercel</span>
              </div>
              <div className="flex items-center gap-1.5 font-bold font-sans text-xs">
                <StrapiIcon size={16} />
                <span>strapi</span>
              </div>
              <span className="font-semibold text-xs text-zinc-400 font-sans">beatbread</span>
              <span className="font-semibold text-xs text-zinc-400 font-sans">Artlist</span>
              <span className="font-semibold text-xs text-zinc-400 font-sans">sim</span>
              <span className="font-semibold text-xs text-zinc-400 font-sans">supermemory</span>
              <span className="font-bold text-xs text-zinc-300 uppercase tracking-widest font-mono">AXIOM</span>
            </div>
          </div>

          {/* Features 3x3 Grid */}
          <div className="space-y-4 pt-4 border-t border-[#1f1f23]">
            <h3 className="text-sm font-bold text-white tracking-tight font-sans">Features</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Feature 01 */}
              <Card className="p-3.5 bg-black border-[#1f1f23] space-y-2 rounded-none shadow-none gap-0">
                <div className="text-[10px] font-mono text-zinc-600">01</div>
                <div className="text-xs font-bold text-white font-sans">Works with your stack.</div>
                <div className="text-[10px] text-zinc-400 leading-relaxed font-sans">
                  Next.js, Nuxt, SvelteKit, Astro, Hono, and 20+ more.
                </div>
                <div className="flex items-center gap-2 pt-2 text-zinc-400">
                  <NextJsIcon size={14} />
                  <NuxtIcon size={14} />
                  <SvelteIcon size={14} />
                  <AstroIcon size={14} />
                  <HonoIcon size={14} />
                  <span className="text-[9px] font-mono text-zinc-500">+24</span>
                </div>
              </Card>

              {/* Feature 02 */}
              <Card className="p-3.5 bg-black border-[#1f1f23] space-y-2 rounded-none shadow-none gap-0">
                <div className="text-[10px] font-mono text-zinc-600">02</div>
                <div className="text-xs font-bold text-white font-sans">Built-in credential auth.</div>
                <div className="text-[10px] text-zinc-400 leading-relaxed font-sans">
                  Sessions, email verification, and password reset included.
                </div>
                <div className="p-1.5 bg-[#09090b] border border-[#27272a] text-[9px] font-mono text-zinc-500 flex items-center justify-between mt-2">
                  <span>user@email.com</span>
                  <span>••••••••</span>
                </div>
              </Card>

              {/* Feature 03 */}
              <Card className="p-3.5 bg-black border-[#1f1f23] space-y-2 rounded-none shadow-none gap-0">
                <div className="text-[10px] font-mono text-zinc-600">03</div>
                <div className="text-xs font-bold text-white font-sans">Social sign-on.</div>
                <div className="text-[10px] text-zinc-400 leading-relaxed font-sans">
                  Google, GitHub, Apple, Discord, and more.
                </div>
                <div className="flex items-center gap-2.5 pt-2 text-zinc-300">
                  <GoogleIcon size={14} />
                  <GitHubIcon size={14} />
                  <AppleIcon size={14} />
                  <DiscordIcon size={14} />
                  <span className="text-[9px] font-mono text-zinc-500">+34</span>
                </div>
              </Card>

              {/* Feature 04 */}
              <Card className="p-3.5 bg-black border-[#1f1f23] space-y-2 rounded-none shadow-none gap-0">
                <div className="text-[10px] font-mono text-zinc-600">04</div>
                <div className="text-xs font-bold text-white font-sans">Multi-tenancy built in.</div>
                <div className="text-[10px] text-zinc-400 leading-relaxed font-sans">
                  Teams, roles, invitations, and access control.
                </div>
                <div className="flex items-center gap-1.5 pt-2">
                  <span className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-700 text-[9px] font-mono text-zinc-300">owner</span>
                  <span className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-700 text-[9px] font-mono text-zinc-300">admin</span>
                  <span className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-700 text-[9px] font-mono text-zinc-300">member</span>
                </div>
              </Card>

              {/* Feature 05 */}
              <Card className="p-3.5 bg-black border-[#1f1f23] space-y-2 rounded-none shadow-none gap-0">
                <div className="text-[10px] font-mono text-zinc-600">05</div>
                <div className="text-xs font-bold text-white font-sans">Enterprise ready.</div>
                <div className="text-[10px] text-zinc-400 leading-relaxed font-sans">
                  SSO, SAML 2.0, SCIM, and directory sync.
                </div>
                <div className="flex items-center gap-2 pt-2 text-zinc-400">
                  <Shield size={14} />
                  <Key size={14} />
                  <Layers size={14} />
                </div>
              </Card>

              {/* Feature 06 */}
              <Card className="p-3.5 bg-black border-[#1f1f23] space-y-2 rounded-none shadow-none gap-0">
                <div className="text-[10px] font-mono text-zinc-600">06</div>
                <div className="text-xs font-bold text-white font-sans">50+ and growing.</div>
                <div className="text-[10px] text-zinc-400 leading-relaxed font-sans">
                  Passkeys, magic links, API keys, JWTs, and more.
                </div>
                <div className="flex items-center gap-1 pt-2 flex-wrap text-[8px] font-mono text-zinc-400">
                  <span className="bg-zinc-900 px-1 py-0.5 border border-zinc-800">passkeys</span>
                  <span className="bg-zinc-900 px-1 py-0.5 border border-zinc-800">2fa</span>
                  <span className="bg-zinc-900 px-1 py-0.5 border border-zinc-800">jwt</span>
                </div>
              </Card>

              {/* Feature 07 */}
              <Card className="p-3.5 bg-black border-[#1f1f23] space-y-2 rounded-none shadow-none gap-0">
                <div className="text-[10px] font-mono text-zinc-600">07</div>
                <div className="text-xs font-bold text-white font-sans">Auth for AI agents.</div>
                <div className="text-[10px] text-zinc-400 leading-relaxed font-sans">
                  MCP auth, token exchange, and agent delegation.
                </div>
                <div className="p-1 bg-[#09090b] border border-[#27272a] text-[9px] font-mono text-zinc-500 mt-2">
                  $ agent.auth({'{'} tk: ... {'}'}) &check;
                </div>
              </Card>

              {/* Feature 08 */}
              <Card className="p-3.5 bg-black border-[#1f1f23] space-y-2 rounded-none shadow-none gap-0">
                <div className="text-[10px] font-mono text-zinc-600">08</div>
                <div className="text-xs font-bold text-white font-sans">Security & observability.</div>
                <div className="text-[10px] text-zinc-400 leading-relaxed font-sans">
                  Bot detection, IP blocking, and email validation.
                </div>
                <div className="flex items-center gap-1.5 pt-2 text-[8px] font-mono">
                  <span className="text-rose-400">• blocked</span>
                  <span className="text-amber-400">• challenged</span>
                  <span className="text-emerald-400">• allowed</span>
                </div>
              </Card>

              {/* Feature 09 */}
              <Card className="p-3.5 bg-black border-[#1f1f23] space-y-2 rounded-none shadow-none gap-0">
                <div className="text-[10px] font-mono text-zinc-600">09</div>
                <div className="text-xs font-bold text-white font-sans">User management.</div>
                <div className="text-[10px] text-zinc-400 leading-relaxed font-sans">
                  Manage users, sessions, and organizations.
                </div>
                <div className="text-[9px] font-mono text-zinc-500 pt-2">
                  created a session • 10:48 AM
                </div>
              </Card>
            </div>
          </div>

          {/* Framework Section with Code Preview */}
          <div className="space-y-4 pt-4 border-t border-[#1f1f23]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white font-sans">Framework</h3>
                <p className="text-[11px] text-zinc-400 mt-0.5 font-sans">
                  The most comprehensive authentication framework for TypeScript.
                </p>
              </div>
              <Badge variant="secondary" className="font-mono text-[9px]">
                DECLARATIVE CONFIG
              </Badge>
            </div>

            <div className="border border-[#27272a] bg-[#09090b] p-4 font-mono text-xs text-zinc-300 space-y-1">
              <div className="text-zinc-500">// auth.ts</div>
              <div><span className="text-purple-400">import</span> {'{'} betterAuth {'}'} <span className="text-purple-400">from</span> <span className="text-emerald-300">"better-auth"</span>;</div>
              <div><span className="text-purple-400">import</span> {'{'} sentinelClient {'}'} <span className="text-purple-400">from</span> <span className="text-emerald-300">"@better-auth/infra"</span>;</div>
              <div className="pt-2"><span className="text-purple-400">export const</span> auth = <span className="text-blue-400">betterAuth</span>({'{'}</div>
              <div className="pl-4">database: <span className="text-blue-400">drizzleAdapter</span>(db),</div>
              <div className="pl-4">plugins: [</div>
              <div className="pl-8"><span className="text-blue-400">sentinelClient</span>({'{'}</div>
              <div className="pl-12">identifyUrl: <span className="text-emerald-300">"https://kv.better-auth.com/projects/..."</span></div>
              <div className="pl-8">{'}'})</div>
              <div className="pl-4">]</div>
              <div>{'}'});</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
