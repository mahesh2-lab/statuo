import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SectionHeader } from './shared/SectionHeader';
import { ScrollReveal } from './shared/ScrollReveal';


const faqs = [
  {
    question: 'How does Statuo prevent false positive incident alerts?',
    answer: 'Statuo uses a multi-node edge consensus algorithm. When a primary probe detects a non-2xx response or timeout, secondary nodes in adjacent global regions immediately execute parallel verification checks. An incident alert is only dispatched once consensus is confirmed.',
  },
  {
    question: 'How does the Model Context Protocol (MCP) server work with Cursor and Claude?',
    answer: 'Statuo exposes a standard MCP server (`npx @statuo/mcp-server`) that speaks stdio / SSE. Coding assistants can securely execute tools to pull telemetry metrics, diagnose endpoint response times, read live logs, and simulate traffic spikes during local development.',
  },
  {
    question: 'Can I monitor internal microservices behind a corporate firewall / VPC?',
    answer: 'Yes. In addition to our 24 public global edge probing regions, you can deploy lightweight Statuo agent containers inside your private AWS VPC, GCP project, Kubernetes cluster, or on-premise datacenter.',
  },
  {
    question: 'What protocols and synthetic assertion types are supported out of the box?',
    answer: 'We support HTTP/1.1, HTTP/2, HTTP/3, WebSocket (WSS), gRPC TLS, TCP/UDP sockets, DNS resolution (A, AAAA, CNAME, TXT), SSL/TLS certificate chains, and ICMP Ping.',
  },
  {
    question: 'How does team billing and endpoint seat scaling work?',
    answer: 'All plans include unlimited team member invitations. Pricing scales solely by the number of active monitored targets and probe frequency. Upgrades and downgrades are prorated instantly without interruption.',
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="l-section border-b border-border/60 pb-16">
      <div className="l-container max-w-3xl">
        <ScrollReveal>
          <SectionHeader
            tag="KNOWLEDGE BASE & FAQ"
            title={
              <>
                Technical <span className="text-primary font-mono">Answers</span>
              </>
            }
            subtitle="Common questions regarding architecture, edge nodes, security protocols, and autonomous AI integrations."
          />
        </ScrollReveal>

        <div className="mt-10 space-y-2">
          {faqs.map((faq, i) => (
            <ScrollReveal key={i} delay={i * 0.04}>
              <div className="border border-border bg-card/60">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left font-sans text-xs sm:text-sm font-bold text-foreground cursor-pointer hover:bg-muted/30 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="font-mono text-primary font-bold text-xs">0{i + 1}</span>
                    <span>{faq.question}</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground transition-transform duration-200 shrink-0 ${
                      openIndex === i ? 'rotate-180 text-foreground' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 pt-0 text-xs text-muted-foreground leading-relaxed font-sans border-t border-border/40">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
