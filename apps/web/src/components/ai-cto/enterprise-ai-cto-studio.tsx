'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  User,
  Send,
  Building2,
  FileText,
  Clock,
  Layers,
  FlaskConical,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sliders,
  Search,
  Lock,
  Check,
  X,
  HelpCircle,
  Network,
  ShieldCheck,
  LineChart,
  GitBranch,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CommandPaletteModal } from '@/components/ui/command-palette-modal';
import { ContextualGraphDrawer } from '@/components/knowledge-graph/contextual-graph-drawer';

type CtoTab =
  | 'command-center'
  | 'query'
  | 'briefings'
  | 'options'
  | 'decisions'
  | 'what-if'
  | 'reviews'
  | 'priorities'
  | 'authorization'
  | 'recommendations';

interface CtoAiMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  citations?: { entity: string; type: string; file: string; line: number }[];
}

export function EnterpriseAiCtoStudio() {
  const [activeTab, setActiveTab] = useState<CtoTab>('command-center');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isGraphDrawerOpen, setIsGraphDrawerOpen] = useState(false);

  // Tab 4 Option Comparison state
  const [selectedTopic, setSelectedTopic] = useState('DECOUPLE_ANALYTICS_DB');

  // Tab 9 Action Approval state
  const [actionStatus, setActionStatus] = useState<'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');

  // Tab 2 Query state
  const [aiMessages, setAiMessages] = useState<CtoAiMessage[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: "Hello! I am your Enterprise AI CTO Advisor. I reason across your entire software ecosystem (Repos, Architecture, Dependencies, DBs, Security, Performance, Tech Debt, Predictions, Simulations). Ask me any engineering query with grounded evidence!",
      citations: [
        { entity: 'payment-processing-core', type: 'REPOSITORY', file: 'analytics_pipeline.go', line: 112 },
        { entity: '@acme/sec-vault@1.2.0', type: 'LIBRARY', file: 'package.json', line: 42 },
      ],
    },
  ]);
  const [aiInput, setAiInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);

  const tabs = [
    { id: 'command-center', label: 'AI CTO Command Center', icon: Building2 },
    { id: 'query', label: 'Grounded Query & Evidence', icon: Sparkles },
    { id: 'briefings', label: 'Engineering Briefings', icon: FileText },
    { id: 'options', label: 'Option Comparison Matrix', icon: Layers },
    { id: 'decisions', label: 'Decision Briefs', icon: FileText },
    { id: 'what-if', label: 'What-If Reasoning', icon: FlaskConical },
    { id: 'reviews', label: 'Review Intelligence', icon: CheckCircle2 },
    { id: 'priorities', label: 'Work Prioritization', icon: Sliders },
    { id: 'authorization', label: 'Human Approval Boundary', icon: Lock },
    { id: 'recommendations', label: 'Outcome Lifecycle', icon: LineChart },
  ];

  const handleAiSend = (textQuery?: string) => {
    const q = textQuery || aiInput;
    if (!q) return;

    setAiMessages((prev) => [...prev, { id: `u-${Date.now()}`, sender: 'user', text: q }]);
    setAiInput('');
    setIsAiThinking(true);

    setTimeout(() => {
      let reply = '';
      let cites = [];
      const qLower = q.toLowerCase();
      if (qLower.includes('worry') || qLower.includes('risk')) {
        reply = "**Observed**: Analytics pipeline connects directly to Payment primary Postgres replica (`analytics_pipeline.go:L112`), creating tight coupling.\n\n**Predicted**: Schema migrations on payment ledger tables will break reporting dashboards.\n\n**Simulated**: Migrating queries to Analytics GraphQL ingress reduces coupling score from 0.88 to 0.42.";
        cites = [
          { entity: 'payment-processing-core', type: 'REPOSITORY', file: 'analytics_pipeline.go', line: 112 },
          { entity: '@acme/sec-vault@1.2.0', type: 'LIBRARY', file: 'package.json', line: 42 },
        ];
      } else if (qLower.includes('change') || qLower.includes('happen')) {
        reply = "**Observed**: Sub-10ms payment ingress response time achieved following idempotency refactoring.\n\n**Observed**: Auth session lock contention dropped by 42% after deploying Redis 7 session cluster.";
        cites = [
          { entity: 'PaymentProcessingEngine', type: 'SERVICE', file: 'idempotency_connector.go', line: 58 },
        ];
      } else {
        reply = `AI CTO analyzed prompt: "${q}". Context engine queried Knowledge Graph, Enterprise Architecture, Risk Intelligence, and Simulation Studio.`;
        cites = [
          { entity: 'Payments Platform System', type: 'SYSTEM', file: 'architecture_model.json', line: 1 },
        ];
      }

      setAiMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, sender: 'ai', text: reply, citations: cites },
      ]);
      setIsAiThinking(false);
    }, 400);
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 font-sans overflow-hidden relative">
      {/* Top Banner Header */}
      <div className="h-12 border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-xl px-4 flex items-center justify-between shrink-0 font-mono text-xs z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-bold text-white">
            <Building2 className="w-4 h-4 text-cyan-400" />
            <span>ENTERPRISE AI CTO ADVISOR COMMAND CENTER</span>
          </div>
          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
            Evidence-Driven • Zero Hallucination
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-cyan-500/40"
          >
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            <span>Cmd+K CTO Triggers</span>
          </button>
          <Button
            size="sm"
            onClick={() => setIsGraphDrawerOpen(true)}
            className="bg-cyan-500/10 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 font-mono text-xs h-7"
          >
            <Network className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
            Graph Context
          </Button>
        </div>
      </div>

      {/* Decision Sub-Tabs */}
      <div className="h-11 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl px-4 flex items-center gap-1 shrink-0 font-mono text-xs z-10 overflow-x-auto scrollbar-none">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as CtoTab)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all font-bold shrink-0 ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Studio Body */}
      <div className="flex-1 overflow-hidden relative">
        {/* TAB 1: COMMAND CENTER */}
        {activeTab === 'command-center' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-sans">
            {/* Immediate Contextual Intelligence Header */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 space-y-2 font-mono">
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">AI CTO Contextual Briefing</span>
              <h2 className="text-base font-black text-white leading-snug">
                3 important engineering signals changed since yesterday. Organization health is 90.8/100 across 9 evaluated dimensions.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-cyan-400 uppercase block">What Should I Know?</span>
                <ul className="list-disc list-inside text-xs font-sans text-slate-300 space-y-1">
                  <li>Payment Core latency improved by 18% (sub-10ms) following idempotency refactoring.</li>
                  <li>Redis Session Cache deployed to production; DB lock contention dropped by 42%.</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-amber-400 uppercase block">What To Worry About?</span>
                <ul className="list-disc list-inside text-xs font-sans text-slate-300 space-y-1">
                  <li>Analytics Pipeline directly queries Payment primary Postgres replica.</li>
                  <li>Knowledge concentration risk in StripeIdempotencyConnector (single maintainer).</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: QUERY & EVIDENCE */}
        {activeTab === 'query' && (
          <div className="w-full h-full p-6 flex flex-col font-mono text-xs overflow-hidden">
            <div className="pb-3 border-b border-slate-800/80 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h2 className="text-base font-black text-white">GROUNDED ENGINEERING QUERY & CITATION PANEL</h2>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold text-[10px]">
                Evidence-First • Observed vs Predicted
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 py-4 scrollbar-none">
              {aiMessages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-3 p-4 rounded-2xl border ${
                    m.sender === 'ai'
                      ? 'bg-slate-900/80 border-slate-800 text-slate-200'
                      : 'bg-cyan-500/10 border-cyan-500/30 text-white ml-12'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                    m.sender === 'ai' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-indigo-500/20 text-indigo-400'
                  }`}>
                    {m.sender === 'ai' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>
                  <div className="space-y-2 flex-1">
                    <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                    {m.citations && (
                      <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-800/80 text-[10px]">
                        <span className="text-slate-500 font-bold">Citation Panel:</span>
                        {m.citations.map((c, idx) => (
                          <button
                            key={idx}
                            onClick={() => setIsGraphDrawerOpen(true)}
                            className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-cyan-300 hover:border-cyan-500/40 font-bold flex items-center gap-1"
                          >
                            <span>{c.file}:{c.line}</span>
                            <span className="text-slate-500">({c.entity})</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isAiThinking && (
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-cyan-400 flex items-center gap-2">
                  <Bot className="w-4 h-4 animate-spin" />
                  <span>AI CTO gathering evidence across 20 entity layers...</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800/80 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAiSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Ask AI CTO (e.g. 'What should I worry about?', 'What happens if we split payments?')..."
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500/40"
                />
                <Button type="submit" disabled={!aiInput || isAiThinking} className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold">
                  <Send className="w-4 h-4 mr-1" /> Ask AI CTO
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 3: BRIEFINGS */}
        {activeTab === 'briefings' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <span>EXECUTIVE ENGINEERING BRIEFINGS</span>
              </h2>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="text-sm font-bold text-white">Daily Engineering Intelligence Brief</span>
              <p className="text-xs font-sans text-slate-300">3 important engineering signals changed since yesterday. Auth session DB lock contention dropped by 42% following Redis session cache deployment.</p>
            </div>
          </div>
        )}

        {/* TAB 4: OPTIONS MATRIX */}
        {activeTab === 'options' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                <span>ENGINEERING OPTION COMPARISON MATRIX</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <span className="font-bold text-white">Option A: GraphQL Ingress</span>
                <span className="text-[10px] text-emerald-400 block font-bold">RECOMMENDED</span>
                <p className="text-xs font-sans text-slate-300">Extract dedicated GraphQL schema for analytics reporting (2 weeks effort, Low risk).</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <span className="font-bold text-white">Option B: Kafka Event Stream</span>
                <span className="text-[10px] text-cyan-400 block font-bold">FEASIBLE</span>
                <p className="text-xs font-sans text-slate-300">Stream payment.created events to Kafka topic (3 weeks effort, Medium risk).</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <span className="font-bold text-white">Option C: Do Nothing</span>
                <span className="text-[10px] text-rose-400 block font-bold">HIGH RISK</span>
                <p className="text-xs font-sans text-slate-300">Keep current GORM SQL direct DB connection string (0 weeks effort, Critical risk).</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: DECISION BRIEFS */}
        {activeTab === 'decisions' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <span>STRUCTURED ENGINEERING DECISION BRIEFS</span>
              </h2>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="text-sm font-bold text-white">Decision Brief: Decouple Analytics DB Replica</span>
              <p className="text-xs font-sans text-slate-300 leading-relaxed">
                Analytics pipeline queries bypass API gateway boundary via direct GORM SQL connection string. Recommendation: Option A (GraphQL API Ingress). Validation Plan: Run integration tests & verify sub-10ms response latency.
              </p>
            </div>
          </div>
        )}

        {/* TAB 6: WHAT-IF REASONING */}
        {activeTab === 'what-if' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-cyan-400" />
                <span>WHAT-IF REASONING & SIMULATION STUDIO</span>
              </h2>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-white uppercase block">Simulate Dependency Removal: @acme/sec-vault@1.2.0</span>
              <p className="text-xs font-sans text-slate-300">Simulation engine evaluates zero breaking API changes across 42 unit tests with 100% vulnerability risk reduction.</p>
            </div>
          </div>
        )}

        {/* TAB 7: REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>ARCHITECTURE & CODE REVIEW INTELLIGENCE</span>
              </h2>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="font-bold text-white text-sm block">PR #402 Lockfile Upgrade Analysis</span>
              <p className="text-xs text-slate-300 font-sans">Zero architecture breaking changes; resolves CVE-2026-4491 security vulnerability.</p>
            </div>
          </div>
        )}

        {/* TAB 8: PRIORITIES */}
        {activeTab === 'priorities' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <Sliders className="w-5 h-5 text-cyan-400" />
                <span>ENGINEERING WORK PRIORITIZATION ENGINE</span>
              </h2>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="font-bold text-white text-sm block">High Priority #1: Merge Dependabot lockfile PR #402</span>
              <span className="text-emerald-400 text-xs font-bold block">100% vulnerability risk reduction • 1 Hour CI Effort</span>
            </div>
          </div>
        )}

        {/* TAB 9: AUTHORIZATION */}
        {activeTab === 'authorization' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80 flex items-center justify-between">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <Lock className="w-5 h-5 text-amber-400" />
                <span>HUMAN AUTHORIZATION & ACTION BOUNDARY</span>
              </h2>
              <span className="text-[10px] px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                1 Pending Approval
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">Action Proposal: Execute Lockfile Patch PR #402</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold">
                  {actionStatus}
                </span>
              </div>
              <p className="text-xs font-sans text-slate-300">Proposed change: Upgrade @acme/sec-vault to 2.1.0 in user-profile-repo with automated vitest verification.</p>

              {actionStatus === 'PENDING' && (
                <div className="flex items-center gap-2 pt-2">
                  <Button onClick={() => setActionStatus('APPROVED')} className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold">
                    <Check className="w-4 h-4 mr-1" /> Approve Action
                  </Button>
                  <Button onClick={() => setActionStatus('REJECTED')} variant="outline" className="bg-slate-950 border-slate-800 text-slate-400 hover:text-white">
                    <X className="w-4 h-4 mr-1" /> Reject Action
                  </Button>
                </div>
              )}
              {actionStatus === 'APPROVED' && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-sans text-xs">
                  ✓ Action Approved by CTO. Executing automated CI workflow...
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 10: RECOMMENDATIONS */}
        {activeTab === 'recommendations' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <LineChart className="w-5 h-5 text-cyan-400" />
                <span>RECOMMENDATION LIFECYCLE & OUTCOME TRACKER</span>
              </h2>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="font-bold text-white text-sm block">Redis Session Cache Migration</span>
              <span className="text-emerald-400 font-bold text-xs block">Status: VALIDATED OUTCOME (+42% Postgres lock reduction)</span>
            </div>
          </div>
        )}
      </div>

      {/* Universal Command Palette Modal */}
      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />

      {/* Universal Contextual Graph Drawer */}
      <ContextualGraphDrawer
        isOpen={isGraphDrawerOpen}
        onClose={() => setIsGraphDrawerOpen(false)}
        entityName="Payments Platform System"
        entityType="SYSTEM"
      />
    </div>
  );
}
