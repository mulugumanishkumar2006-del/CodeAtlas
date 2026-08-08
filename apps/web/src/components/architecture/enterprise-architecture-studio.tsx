'use client';

import React, { useState } from 'react';
import {
  Layers,
  Network,
  Zap,
  ShieldAlert,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Send,
  Bot,
  User,
  GitBranch,
  Server,
  Database,
  Flame,
  LineChart,
  HardDrive,
  Info,
  Maximize2,
  Bookmark,
  Share2,
  RefreshCw,
  Search,
  Filter,
  Play,
  FileText,
  Sliders,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CommandPaletteModal } from '@/components/ui/command-palette-modal';
import { ContextualGraphDrawer } from '@/components/knowledge-graph/contextual-graph-drawer';

type ArchTab =
  | 'living-map'
  | 'drift'
  | 'coupling'
  | 'spof'
  | 'data-flows'
  | 'scorecard'
  | 'timemachine'
  | 'simulator'
  | 'ai-architect'
  | 'governance';

interface ArchAiMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  evidenceNodes?: string[];
}

export function EnterpriseArchitectureStudio() {
  const [activeTab, setActiveTab] = useState<ArchTab>('living-map');
  const [disclosureLevel, setDisclosureLevel] = useState<number>(4); // Level 4: Services by default
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isGraphDrawerOpen, setIsGraphDrawerOpen] = useState(false);

  // Tab 8 Simulator state
  const [simScenario, setSimScenario] = useState('DECOUPLE_ANALYTICS_DB');
  const [simTarget, setSimTarget] = useState('PaymentProcessingEngine');
  const [simRun, setSimRun] = useState(false);

  // Tab 9 AI Architect Assistant state
  const [aiMessages, setAiMessages] = useState<ArchAiMessage[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: "Hello! I am your Enterprise AI Architect. I continuously observe living architecture topology across 7 progressive detail levels (Org → Systems → Apps → Services → Repos → Modules → Code). Ask me any architectural query!",
      evidenceNodes: ['PaymentProcessingEngine', 'Analytics DB Replica', 'Core Postgres Cluster'],
    },
  ]);
  const [aiInput, setAiInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);

  const tabs = [
    { id: 'living-map', label: 'Living Architecture Map', icon: Layers },
    { id: 'drift', label: 'Drift & Violations', icon: ShieldAlert },
    { id: 'coupling', label: 'Coupling & Hotspots', icon: Flame },
    { id: 'spof', label: 'SPOF & Bottlenecks', icon: AlertTriangle },
    { id: 'data-flows', label: 'Data Flow Tracing', icon: GitBranch },
    { id: 'scorecard', label: 'Architecture Scorecard', icon: CheckCircle2 },
    { id: 'timemachine', label: 'Time Machine & Diff', icon: Clock },
    { id: 'simulator', label: 'Refactoring Simulator', icon: Zap },
    { id: 'ai-architect', label: 'AI Architect Assistant', icon: Sparkles },
    { id: 'governance', label: 'Governance & Rules', icon: FileText },
  ];

  const handleAiSend = (textQuery?: string) => {
    const q = textQuery || aiInput;
    if (!q) return;

    setAiMessages((prev) => [...prev, { id: `u-${Date.now()}`, sender: 'user', text: q }]);
    setAiInput('');
    setIsAiThinking(true);

    setTimeout(() => {
      let reply = '';
      const qLower = q.toLowerCase();
      if (qLower.includes('drift') || qLower.includes('violation')) {
        reply = "Architecture drift detected: **Analytics Pipeline** directly queries the **Payment primary Postgres replica** (`analytics_pipeline.go:L112`), bypassing the Analytics GraphQL API Gateway. Recommending query migration.";
      } else if (qLower.includes('spof') || qLower.includes('bottleneck')) {
        reply = "Primary Single Point of Failure (SPOF): **Core Postgres Cluster** handles all financial transaction ledger writes across 6 services. Recommending multi-region read replicas with a pgBouncer connection proxy.";
      } else if (qLower.includes('coupling') || qLower.includes('refactor')) {
        reply = "Highest architectural coupling occurs between **PaymentProcessingEngine** and **BillingInvoiceEngine**. A 3-service cycle loop was detected (`Payment → Billing → Ledger → Payment`). Recommending decoupling via Kafka event streaming.";
      } else {
        reply = `AI Architect analyzed prompt: "${q}". Architecture topology evaluates 7 disclosure levels spanning 42 nodes and 88 relationship edges across 4 domains.`;
      }

      setAiMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, sender: 'ai', text: reply, evidenceNodes: ['PaymentProcessingEngine', 'Analytics DB Replica', 'Core Postgres Cluster'] },
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
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>ENTERPRISE ARCHITECTURE INTELLIGENCE ENGINE</span>
          </div>
          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
            7 Disclosure Levels • Score: 92.4/100
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Progressive Disclosure Slider */}
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1 text-slate-400">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>Level {disclosureLevel}:</span>
            <span className="font-bold text-white">
              {['Org', 'Systems', 'Apps', 'Services', 'Repos', 'Modules', 'Code'][disclosureLevel - 1]}
            </span>
            <input
              type="range"
              min="1"
              max="7"
              value={disclosureLevel}
              onChange={(e) => setDisclosureLevel(parseInt(e.target.value))}
              className="w-20 accent-cyan-400 cursor-pointer"
            />
          </div>

          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-cyan-500/40"
          >
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            <span>Cmd+K Arch Triggers</span>
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
              onClick={() => setActiveTab(t.id as ArchTab)}
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
        {/* TAB 1: LIVING MAP */}
        {activeTab === 'living-map' && (
          <div className="w-full h-full flex flex-col bg-slate-950 font-mono text-xs">
            <div className="p-4 border-b border-slate-800/80 flex items-center justify-between shrink-0">
              <span className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Living Enterprise Architecture Map (Level {disclosureLevel})</span>
              </span>
              <span className="text-[10px] text-slate-400">Boundary Overlay Active • 4 Domains • 42 Nodes</span>
            </div>

            <div className="flex-1 relative bg-slate-900/40 border border-slate-800 rounded-2xl m-4 flex items-center justify-center p-8">
              <div className="text-center space-y-3">
                <Layers className="w-12 h-12 text-cyan-400 mx-auto animate-pulse" />
                <p className="text-white font-bold">Living Architecture Canvas Active (Level {disclosureLevel})</p>
                <p className="text-slate-400 font-sans text-xs max-w-md mx-auto">
                  Interactive multi-level topology visualization. Drag, zoom, or select components to inspect boundary compliance, data flows, and coupling metrics.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DRIFT & VIOLATIONS */}
        {activeTab === 'drift' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80 flex items-center justify-between">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <span>ARCHITECTURE DRIFT & BOUNDARY VIOLATIONS</span>
              </h2>
              <span className="text-[10px] px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                1 Active Violation
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">Direct DB Replica Connection Bypass</span>
                <span className="px-2.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold text-[10px]">
                  HIGH SEVERITY
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block">Expected Architecture</span>
                  <span className="text-slate-300">Analytics queries must route through GraphQL API Ingress</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block">Observed Architecture</span>
                  <span className="text-rose-400 font-bold">Direct GORM SQL connection string to Payment primary Postgres replica</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: COUPLING & HOTSPOTS */}
        {activeTab === 'coupling' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-400" />
                <span>ARCHITECTURE COUPLING & HOTSPOT EXPLORER</span>
              </h2>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="font-bold text-white text-sm">PaymentProcessingEngine</span>
              <span className="text-[10px] text-amber-400 block font-bold">Dependency Centrality: 0.94 • Shared DBs: 2 • Consumers: 8</span>
              <span className="text-xs text-slate-300 font-sans block">Cross-Team Coupling: Payments Core Team, Analytics Team, Billing Team, Mobile BFF Team.</span>
            </div>
          </div>
        )}

        {/* TAB 4: SPOF & BOTTLENECKS */}
        {activeTab === 'spof' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                <span>SINGLE POINT OF FAILURE (SPOF) & BOTTLENECK RADAR</span>
              </h2>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">Core Postgres Cluster</span>
                <span className="px-2.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold text-[10px]">
                  CRITICAL SPOF
                </span>
              </div>
              <p className="text-xs font-sans text-slate-300">All financial transactions & ledger writes pass through single primary DB node (6 consumer services).</p>
            </div>
          </div>
        )}

        {/* TAB 5: DATA FLOW TRACING */}
        {activeTab === 'data-flows' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-cyan-400" />
                <span>END-TO-END DATA FLOW TRACING</span>
              </h2>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-white uppercase block">Checkout Charge Transaction Data Flow</span>
              <div className="flex items-center gap-2 overflow-x-auto py-2">
                {[
                  'Checkout Web App',
                  'POST /api/v1/payments/charge',
                  'PaymentProcessingEngine',
                  'payment.created Topic',
                  'BillingInvoiceEngine',
                  'Core Postgres Ledger DB',
                ].map((step, idx) => (
                  <React.Fragment key={step}>
                    {idx > 0 && <ArrowRight className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                    <span className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-bold shrink-0">
                      {step}
                    </span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: SCORECARD */}
        {activeTab === 'scorecard' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80 flex items-center justify-between">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>10-DIMENSIONAL ARCHITECTURE SCORECARD</span>
              </h2>
              <span className="text-xl font-black text-emerald-400">92.4 / 100</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { name: 'Coupling', score: 86.0, status: 'MODERATE' },
                { name: 'Cohesion', score: 94.0, status: 'OPTIMAL' },
                { name: 'Boundaries', score: 88.5, status: 'GOOD' },
                { name: 'Drift', score: 91.0, status: 'GOOD' },
                { name: 'Complexity', score: 93.0, status: 'OPTIMAL' },
                { name: 'Dependencies', score: 89.0, status: 'GOOD' },
                { name: 'Resilience', score: 95.0, status: 'OPTIMAL' },
                { name: 'Ownership', score: 96.0, status: 'OPTIMAL' },
                { name: 'Documentation', score: 94.0, status: 'OPTIMAL' },
                { name: 'Change Risk', score: 98.0, status: 'OPTIMAL' },
              ].map((sc) => (
                <div key={sc.name} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">{sc.name}</span>
                  <span className="text-lg font-black text-white block">{sc.score}</span>
                  <span className="text-[9px] text-cyan-400 font-bold block">{sc.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: TIME MACHINE & DIFF */}
        {activeTab === 'timemachine' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyan-400" />
                <span>TIME MACHINE & ARCHITECTURE DIFF</span>
              </h2>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-white uppercase block">Architecture Diff (2026-01-01 vs CURRENT)</span>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400">
                + Added Service: Redis Session Cluster (Dedicated gRPC cache layer)
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-rose-400">
                - Deprecated: Monolithic Postgres session lock table
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: REFACTORING SIMULATOR */}
        {activeTab === 'simulator' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <Zap className="w-5 h-5 text-cyan-400" />
                <span>REFACTORING & FAILURE IMPACT SIMULATOR</span>
              </h2>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <select value={simScenario} onChange={(e) => setSimScenario(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white">
                  <option value="DECOUPLE_ANALYTICS_DB">Extract Analytics GraphQL Service</option>
                  <option value="FAIL_PAYMENT_CORE">Simulate PaymentProcessingEngine Failure</option>
                </select>
                <Button onClick={() => setSimRun(true)} className="bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold">
                  <Play className="w-4 h-4 mr-2" /> Run Architecture Simulation
                </Button>
              </div>

              {simRun && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 space-y-1 animate-in fade-in">
                  <span className="font-bold block">Simulation Results</span>
                  <p className="font-sans text-xs text-slate-200">
                    Extracting Analytics GraphQL Service reduces dependency coupling from 0.88 to 0.42 and protects payment ledger database locks.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 9: AI ARCHITECT */}
        {activeTab === 'ai-architect' && (
          <div className="w-full h-full p-6 flex flex-col font-mono text-xs overflow-hidden">
            <div className="pb-3 border-b border-slate-800/80 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h2 className="text-base font-black text-white">AI ARCHITECT ASSISTANT</h2>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold text-[10px]">
                Grounded Knowledge Graph Context
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
                  </div>
                </div>
              ))}
              {isAiThinking && (
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-cyan-400 flex items-center gap-2">
                  <Bot className="w-4 h-4 animate-spin" />
                  <span>AI Architect reasoning over architecture topology...</span>
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
                  placeholder="Ask AI Architect (e.g. 'Explain this architecture', 'Where is architecture drifting?')..."
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500/40"
                />
                <Button type="submit" disabled={!aiInput || isAiThinking} className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold">
                  <Send className="w-4 h-4 mr-1" /> Ask AI
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 10: GOVERNANCE */}
        {activeTab === 'governance' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <span>ARCHITECTURE GOVERNANCE & RECOMMENDATIONS</span>
              </h2>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="font-bold text-white text-sm block">Recommendation: Create GraphQL Ingress for Analytics Queries</span>
              <p className="text-xs text-slate-300 font-sans">Eliminates direct database coupling and protects payment primary Postgres locks.</p>
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
        entityName="PaymentProcessingEngine"
        entityType="SERVICE"
      />
    </div>
  );
}
