'use client';

import React, { useState } from 'react';
import {
  Network,
  Search,
  Filter,
  Layers,
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CommandPaletteModal } from '@/components/ui/command-palette-modal';

type GraphTab =
  | 'explorer'
  | 'pathfinder'
  | 'impact'
  | 'heatmaps'
  | 'timemachine'
  | 'cycles'
  | 'gaps'
  | 'ai';

interface GraphAiMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  nodes?: string[];
}

export function OrgKnowledgeGraphStudio() {
  const [activeTab, setActiveTab] = useState<GraphTab>('explorer');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Path Finder state
  const [pathSource, setPathSource] = useState('Checkout App');
  const [pathTarget, setPathTarget] = useState('executeIdempotentCharge()');

  // AI Assistant state
  const [aiMessages, setAiMessages] = useState<GraphAiMessage[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: "Hello! I am your Organization Knowledge Graph AI Assistant. I observe graph relationships across 36 node types (Organization, Workspace, Team, Repos, Services, APIs, DBs, Security findings, Incidents, ADRs). Ask me any architectural path or dependency query!",
      nodes: ['Checkout App', 'PaymentProcessingEngine', 'AuthGatewayService'],
    },
  ]);
  const [aiInput, setAiInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);

  const tabs = [
    { id: 'explorer', label: 'Focus Explorer', icon: Network },
    { id: 'pathfinder', label: 'Path Finder', icon: Layers },
    { id: 'impact', label: 'Impact Graph', icon: Zap },
    { id: 'heatmaps', label: 'Graph Heatmaps', icon: Flame },
    { id: 'timemachine', label: 'Time Machine & Diff', icon: Clock },
    { id: 'cycles', label: 'Cycles & Hidden Deps', icon: RefreshCw },
    { id: 'gaps', label: 'Knowledge Quality & Gaps', icon: ShieldAlert },
    { id: 'ai', label: 'AI Graph Assistant', icon: Sparkles },
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
      if (qLower.includes('checkout') || qLower.includes('depend')) {
        reply = "The **Checkout App** depends on **PaymentProcessingEngine** via HTTP API (`POST /api/v1/payments/charge`). Payment processing in turn depends on **AuthGatewayService** for token validation and **Core Postgres Cluster** for transaction ledger writes.";
      } else if (qLower.includes('central') || qLower.includes('important')) {
        reply = "The most central entities in your graph are **AuthGatewayService** (11 consumers), **Core Postgres Cluster** (6 DB connections), and **@acme/sec-vault** (shared security package across 4 repos).";
      } else if (qLower.includes('cycle') || qLower.includes('circular')) {
        reply = "A circular dependency cycle was detected: `PaymentProcessingEngine → BillingInvoiceEngine → LedgerService → PaymentProcessingEngine`. Recommending decoupling via Kafka event streaming.";
      } else {
        reply = `Organization Knowledge Graph analyzed prompt: "${q}". Connected graph indexes 36 node types and 38 relationship types across 8 repositories and 12 microservices.`;
      }

      setAiMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, sender: 'ai', text: reply, nodes: ['Checkout App', 'PaymentProcessingEngine', 'AuthGatewayService'] },
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
            <Network className="w-4 h-4 text-cyan-400" />
            <span>ORGANIZATION KNOWLEDGE GRAPH ENGINE</span>
          </div>
          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
            36 Node Types • 38 Relationship Types
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-cyan-500/40"
          >
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            <span>Cmd+K Graph Triggers</span>
          </button>
          <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Real-time AST Graph Ingestion
          </span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="h-11 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl px-4 flex items-center gap-1 shrink-0 font-mono text-xs z-10 overflow-x-auto scrollbar-none">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as GraphTab)}
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

      {/* Studio Workspace Body */}
      <div className="flex-1 overflow-hidden relative">
        {/* TAB 1: FOCUS EXPLORER */}
        {activeTab === 'explorer' && (
          <div className="w-full h-full flex flex-col bg-slate-950 font-mono text-xs">
            <div className="p-4 border-b border-slate-800/80 flex items-center justify-between shrink-0">
              <span className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Network className="w-4 h-4 text-cyan-400" />
                <span>Interactive Contextual Focus Explorer</span>
              </span>
              <span className="text-[10px] text-slate-400">Progressive Expansion • Evidence-Backed Edges</span>
            </div>

            <div className="flex-1 relative bg-slate-900/40 border border-slate-800 rounded-2xl m-4 flex items-center justify-center p-8">
              <div className="text-center space-y-3">
                <Network className="w-12 h-12 text-cyan-400 mx-auto animate-pulse" />
                <p className="text-white font-bold">Focus Mode Explorer Active</p>
                <p className="text-slate-400 font-sans text-xs max-w-md mx-auto">
                  Click any entity in CodeAtlas (Repo, Service, File, Security Finding, Team) to load its immediate graph neighborhood with 1-click hop expansion.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PATH FINDER */}
        {activeTab === 'pathfinder' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80 flex items-center justify-between">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                <span>NATURAL LANGUAGE MULTI-HOP PATH FINDER</span>
              </h2>
              <span className="text-[10px] px-2.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
                Shortest Path Engine
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400">Source Entity</label>
                  <input
                    type="text"
                    value={pathSource}
                    onChange={(e) => setPathSource(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">Target Entity</label>
                  <input
                    type="text"
                    value={pathTarget}
                    onChange={(e) => setPathTarget(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              {/* Traversal Chain Display */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-300 block">Shortest Relationship Chain (6 Hops):</span>
                {[
                  { step: '1', entity: pathSource, type: 'APPLICATION', edge: 'USES' },
                  { step: '2', entity: 'CheckoutService', type: 'SERVICE', edge: 'CALLS' },
                  { step: '3', entity: 'POST /api/v1/payments/charge', type: 'API', edge: 'EXPOSES' },
                  { step: '4', entity: 'PaymentProcessingEngine', type: 'SERVICE', edge: 'LOCATED_IN' },
                  { step: '5', entity: 'payment-processing-core', type: 'REPOSITORY', edge: 'CONTAINS' },
                  { step: '6', entity: pathTarget, type: 'FUNCTION', edge: 'TARGET' },
                ].map((p, i) => (
                  <div key={p.step} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-[10px]">
                        #{p.step}
                      </span>
                      <span className="font-bold text-white">{p.entity}</span>
                    </div>
                    <span className="text-[10px] text-cyan-400 font-bold">{p.type} • Edge: {p.edge}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: IMPACT GRAPH */}
        {activeTab === 'impact' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80 flex items-center justify-between">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <Zap className="w-5 h-5 text-cyan-400" />
                <span>GRAPH IMPACT & BLAST RADIUS ENGINE</span>
              </h2>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                <span className="text-[10px] text-rose-300 uppercase block font-bold">Directly Affected</span>
                <span className="text-2xl font-black text-rose-400">2 Microservices</span>
              </div>
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <span className="text-[10px] text-amber-300 uppercase block font-bold">Indirectly Affected</span>
                <span className="text-2xl font-black text-amber-400">2 Downstream Services</span>
              </div>
              <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
                <span className="text-[10px] text-cyan-300 uppercase block font-bold">Confidence Score</span>
                <span className="text-2xl font-black text-cyan-400">96.4%</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: HEATMAP OVERLAYS */}
        {activeTab === 'heatmaps' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-400" />
                <span>GRAPH MULTI-DIMENSIONAL HEATMAP OVERLAYS</span>
              </h2>
            </div>

            <div className="space-y-3">
              {[
                { entity: 'payment-processing-core', type: 'REPOSITORY', risk: 'HIGH (0.88)', reason: 'High dependency centrality & active CVE vulnerability edge' },
                { entity: 'AuthGatewayService', type: 'SERVICE', risk: 'HIGH (0.96 Centrality)', reason: 'OAuth bearer token validation for 11 connected microservices' },
                { entity: 'Core Postgres Cluster', type: 'DATABASE', risk: 'CRITICAL (0.92 Centrality)', reason: 'Primary transactional ledger reads and writes' },
              ].map((h) => (
                <div key={h.entity} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white text-sm block">{h.entity}</span>
                    <span className="text-slate-400 text-xs font-sans block">{h.reason}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold">
                    {h.risk}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: TIME MACHINE & DIFF */}
        {activeTab === 'timemachine' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyan-400" />
                <span>TIME-AWARE KNOWLEDGE GRAPH & DIFF COMPARISON</span>
              </h2>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-white uppercase block">Graph State Diff (2026-01-01 vs CURRENT)</span>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400">
                + Added Node: Redis Session Cluster (CACHE)
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-rose-400">
                - Removed Node: LegacyMemcachedStore (CACHE)
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: CYCLES & HIDDEN DEPS */}
        {activeTab === 'cycles' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-cyan-400" />
                <span>CIRCULAR DEPENDENCY & HIDDEN DEPENDENCY RADAR</span>
              </h2>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-rose-400 uppercase block">Detected Circular Dependency Cycle</span>
              <span className="font-bold text-white block">PaymentProcessingEngine → BillingInvoiceEngine → LedgerService → PaymentProcessingEngine</span>
              <p className="text-slate-400 font-sans text-xs">Potential deadlock risk during concurrent transaction rollbacks.</p>
            </div>
          </div>
        )}

        {/* TAB 7: GAPS & QUALITY */}
        {activeTab === 'gaps' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <span>GRAPH QUALITY METRICS & KNOWLEDGE GAPS</span>
              </h2>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Coverage Score</span>
                <span className="text-2xl font-black text-emerald-400">96.2%</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Relationship Confidence</span>
                <span className="text-2xl font-black text-cyan-400">94.8%</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Stale Edges</span>
                <span className="text-2xl font-black text-amber-400">2 Edges</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Unresolved Entities</span>
                <span className="text-2xl font-black text-rose-400">1 Entity</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: AI GRAPH ASSISTANT */}
        {activeTab === 'ai' && (
          <div className="w-full h-full p-6 flex flex-col font-mono text-xs overflow-hidden">
            <div className="pb-3 border-b border-slate-800/80 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h2 className="text-base font-black text-white">AI GRAPH INTELLIGENCE ENGINE</h2>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold text-[10px]">
                36 Node Types Grounded
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
                    {m.nodes && (
                      <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-slate-800/80 text-[10px]">
                        <span className="text-slate-500">Grounded Nodes:</span>
                        {m.nodes.map((n) => (
                          <span key={n} className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-cyan-300 font-bold">
                            {n}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isAiThinking && (
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-cyan-400 flex items-center gap-2">
                  <Bot className="w-4 h-4 animate-spin" />
                  <span>Graph Engine traversing relationships...</span>
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
                  placeholder="Ask AI graph questions (e.g. 'How does checkout depend on payments?')..."
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
      </div>

      {/* Universal Command Palette Modal */}
      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </div>
  );
}
