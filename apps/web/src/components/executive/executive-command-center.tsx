'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  Activity,
  Zap,
  Sparkles,
  FlaskConical,
  Clock,
  CheckCircle2,
  TrendingUp,
  LineChart,
  Flame,
  ArrowRight,
  Send,
  Bot,
  User,
  GitBranch,
  Server,
  Layers,
  Search,
  Command,
  FileText,
  ChevronRight,
  ShieldCheck,
  Cpu,
  Info,
  Lock,
  Building2,
  Network,
  HelpCircle,
  Play,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CommandPaletteModal } from '@/components/ui/command-palette-modal';
import { ContextualGraphDrawer } from '@/components/knowledge-graph/contextual-graph-drawer';

type ExecutiveTab =
  | 'home'
  | 'risks'
  | 'investments'
  | 'changes'
  | 'predictive'
  | 'what-if'
  | 'ai-briefing'
  | 'portfolio'
  | 'alerts'
  | 'timeline';

interface ExecutiveAiMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  evidenceLink?: string;
}

export function ExecutiveCommandCenter() {
  const [activeTab, setActiveTab] = useState<ExecutiveTab>('home');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isGraphDrawerOpen, setIsGraphDrawerOpen] = useState(false);
  const [selectedRiskId, setSelectedRiskId] = useState<string | null>(null);

  // Tab 6 What-If Simulator state
  const [simScenario, setSimScenario] = useState('DECOUPLE_ANALYTICS_DB');
  const [simTarget, setSimTarget] = useState('payment-processing-core');
  const [simRun, setSimRun] = useState(false);

  // Tab 7 AI Briefing state
  const [aiMessages, setAiMessages] = useState<ExecutiveAiMessage[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: "Welcome to your Executive Engineering Intelligence Briefing. I transform system intelligence into decision-ready insights for technical leadership. Ask me anything about engineering health, risks, investments, or architecture!",
      evidenceLink: "/enterprise",
    },
  ]);
  const [aiInput, setAiInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);

  const tabs = [
    { id: 'home', label: 'Executive Home', icon: Building2 },
    { id: 'risks', label: 'Risk Register & Stories', icon: ShieldAlert },
    { id: 'investments', label: 'Investment Outcomes', icon: LineChart },
    { id: 'changes', label: 'Change Detection', icon: GitBranch },
    { id: 'predictive', label: 'Predictive Horizons', icon: TrendingUp },
    { id: 'what-if', label: 'What-If Simulator', icon: FlaskConical },
    { id: 'ai-briefing', label: 'AI CTO Briefing', icon: Sparkles },
    { id: 'portfolio', label: 'System Portfolio', icon: Layers },
    { id: 'alerts', label: 'Alert Digest', icon: Activity },
    { id: 'timeline', label: 'Executive Timeline', icon: Clock },
  ];

  const handleAiSend = (queryText?: string) => {
    const q = queryText || aiInput;
    if (!q) return;

    setAiMessages((prev) => [...prev, { id: `u-${Date.now()}`, sender: 'user', text: q }]);
    setAiInput('');
    setIsAiThinking(true);

    setTimeout(() => {
      let reply = '';
      const qLower = q.toLowerCase();
      if (qLower.includes('worry') || qLower.includes('risk')) {
        reply = "Your top executive risk is **tight database coupling** between Payment Processing Core and the Analytics DB replica. Schema migrations on payment ledger tables risk breaking analytics dashboards. Additionally, an outdated `@acme/sec-vault` package requires final PR approval in `user-profile-repo`.";
      } else if (qLower.includes('change') || qLower.includes('improve')) {
        reply = "Over the last 30 days, your engineering health improved by **+1.4% to 90.8/100**. Key positive outcomes include a **42% reduction in Postgres lock contention** after migrating auth sessions to Redis, and an **18% API latency reduction** in Payment Core.";
      } else if (qLower.includes('investment') || qLower.includes('result')) {
        reply = "Engineering investments are producing strong results: **75% of active initiatives** have achieved verified outcome improvements. Refactoring idempotency keys in Payment Core achieved a sub-10ms response time and zero duplicate charge incidents.";
      } else {
        reply = `Executive AI Briefing analyzed prompt: "${q}". Organization health is 90.8/100 across 9 evaluated dimensions with 4 active engineering initiatives.`;
      }

      setAiMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, sender: 'ai', text: reply, evidenceLink: "/enterprise" },
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
            <span>EXECUTIVE ENGINEERING COMMAND CENTER</span>
          </div>
          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
            Org Health: 90.8/100 (Grade A-)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-cyan-500/40"
          >
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            <span>Cmd+K Decision Triggers</span>
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
              onClick={() => setActiveTab(t.id as ExecutiveTab)}
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

      {/* Main Decision Workspace Body */}
      <div className="flex-1 overflow-hidden relative">
        {/* TAB 1: EXECUTIVE HOME */}
        {activeTab === 'home' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-sans">
            {/* Executive Summary Headline */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 space-y-2 font-mono">
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">Executive Summary</span>
              <h2 className="text-base font-black text-white leading-snug">
                Engineering organization health is strong (90.8/100). Technical debt in core payment pipelines decreased by 14% following refactoring sprint.
              </h2>
              <span className="text-xs text-slate-400 block font-sans">
                75% of active engineering initiatives are producing verified outcome improvements.
              </span>
            </div>

            {/* 9-Dimensional Health Radar */}
            <div>
              <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>9 Evaluated Engineering Dimensions</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2 font-mono text-xs">
                {[
                  { name: 'Architecture', score: 94.0, trend: '+2.1%', color: 'text-cyan-400' },
                  { name: 'Security', score: 88.5, trend: '-0.4%', color: 'text-amber-400' },
                  { name: 'Performance', score: 93.5, trend: '+1.2%', color: 'text-sky-400' },
                  { name: 'Reliability', score: 95.0, trend: '0.0%', color: 'text-emerald-400' },
                  { name: 'Tech Debt', score: 84.0, trend: '+3.4%', color: 'text-indigo-400' },
                  { name: 'Code Quality', score: 91.8, trend: '+1.0%', color: 'text-teal-400' },
                  { name: 'Flow', score: 92.0, trend: '+1.8%', color: 'text-emerald-400' },
                  { name: 'Dependency', score: 86.0, trend: '-1.1%', color: 'text-amber-400' },
                  { name: 'Operations', score: 92.5, trend: '+0.5%', color: 'text-cyan-400' },
                ].map((d) => (
                  <div key={d.name} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                    <span className="text-[9px] text-slate-400 uppercase font-bold truncate block">{d.name}</span>
                    <span className={`text-lg font-black block ${d.color}`}>{d.score}</span>
                    <span className="text-[9px] text-emerald-400 font-bold block">{d.trend}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Executive Signals */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300">Architecture Coupling Risk Increasing</span>
                  <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-bold">
                    HIGH IMPACT
                  </span>
                </div>
                <p className="text-xs font-sans text-slate-300">Direct DB replica access bypasses Analytics GraphQL API abstraction layer.</p>
                <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs font-sans">
                  💡 <b>Recommended Attention:</b> Approve refactoring ticket to migrate queries to GraphQL ingress.
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-300">Security Exposure Decreasing</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                    HIGH CONFIDENCE
                  </span>
                </div>
                <p className="text-xs font-sans text-slate-300">Upgraded @acme/sec-vault package to v2.1.0, resolving CVE-2026-4491.</p>
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 text-xs font-sans">
                  ✓ <b>Status:</b> Zero action required. Automated CI verification complete.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: INTELLIGENT RISK REGISTER & STORIES */}
        {activeTab === 'risks' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80 flex items-center justify-between">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <span>EXECUTIVE RISK REGISTER & RISK STORIES</span>
              </h2>
              <span className="text-[10px] px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                Traceable to Source Code
              </span>
            </div>

            <div className="space-y-4">
              {[
                {
                  id: 'risk-exec-1',
                  title: 'Outdated Shared RSA SecVault Library across 4 Repositories',
                  category: 'SECURITY_DEPENDENCY',
                  severity: 'HIGH',
                  impact: 'JWT verification potential vulnerability (CVE-2026-4491)',
                  story: "Outdated @acme/sec-vault package v1.2.0 in lockfiles exposes JWT verification. Upgrading to v2.1.0 in final repo removes vulnerability.",
                  affected: ['auth-gateway-service', 'payment-processing-core', 'billing-invoice-engine'],
                  action: 'Execute automated lockfile upgrade PR to @acme/sec-vault@2.1.0',
                },
                {
                  id: 'risk-exec-2',
                  title: 'Tight Architectural Coupling: Payment Engine -> Analytics DB',
                  category: 'ARCHITECTURE_COUPLING',
                  severity: 'MEDIUM',
                  impact: 'Schema migrations on payment tables break analytics without CI warning.',
                  story: "Analytics team added direct SQL read replicas to payment primary Postgres cluster to avoid GraphQL latency.",
                  affected: ['payment-processing-core', 'analytics-db-repo'],
                  action: 'Decouple query through Analytics GraphQL Ingress',
                },
              ].map((r) => (
                <div key={r.id} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">{r.title}</span>
                    <span className="px-2.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold text-[10px]">
                      {r.severity} SEVERITY
                    </span>
                  </div>

                  <p className="text-xs font-sans text-slate-300 leading-relaxed">
                    <strong>Risk Story:</strong> {r.story}
                  </p>

                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <span>Affected Systems:</span>
                    {r.affected.map((sys) => (
                      <span key={sys} className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-cyan-300">
                        {sys}
                      </span>
                    ))}
                  </div>

                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 font-sans text-xs flex items-center justify-between">
                    <span>💡 <b>Intervention:</b> {r.action}</span>
                    <Button
                      size="sm"
                      onClick={() => setIsGraphDrawerOpen(true)}
                      className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-[11px] h-7"
                    >
                      Trace Technical Source
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: INVESTMENT OUTCOMES */}
        {activeTab === 'investments' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <LineChart className="w-5 h-5 text-cyan-400" />
                <span>ENGINEERING INVESTMENT OUTCOME TRACKER</span>
              </h2>
            </div>

            <div className="space-y-3">
              {[
                {
                  initiative: 'Payment Core Idempotency Refactoring',
                  category: 'REFACTORING_DEBT',
                  expected: 'Zero duplicate charge incidents & 15% latency reduction',
                  actual: 'Achieved +18% latency reduction (sub-10ms) & zero duplicate charges',
                  status: 'VERIFIED OUTCOME',
                },
                {
                  initiative: 'Redis Session Cluster Migration',
                  category: 'ARCHITECTURE_MODERNIZATION',
                  expected: 'Decouple auth session locks from monolithic Postgres',
                  actual: 'Successfully decoupled; DB lock contention dropped by 42%',
                  status: 'VERIFIED OUTCOME',
                },
              ].map((inv) => (
                <div key={inv.initiative} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">{inv.initiative}</span>
                    <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-[10px]">
                      {inv.status}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 block">Category: {inv.category}</span>
                  <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-500 uppercase block">Expected Outcome</span>
                      <span className="text-slate-300">{inv.expected}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-500 uppercase block">Actual Outcome</span>
                      <span className="text-emerald-400 font-bold">{inv.actual}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: CHANGE DETECTION */}
        {activeTab === 'changes' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-cyan-400" />
                <span>EXECUTIVE CHANGE DETECTION & BEFORE/AFTER SHIFTS</span>
              </h2>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-white uppercase block">Major Architecture Shift: Auth Session Decoupling</span>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block">Before Shift</span>
                  <span className="text-slate-300">Auth sessions locked Postgres monolithic DB tables.</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block">After Shift</span>
                  <span className="text-emerald-400 font-bold">Sessions cached in dedicated Redis 7 cluster.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: PREDICTIVE HORIZONS */}
        {activeTab === 'predictive' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                <span>PREDICTIVE EXECUTIVE RISK HORIZONS (30-90 DAYS)</span>
              </h2>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="font-bold text-white text-sm">Projected Technical Debt Growth in Legacy Ledger Repo</span>
                <span className="text-[10px] text-amber-400 block font-bold">Time Horizon: 60 Days • Confidence: HIGH</span>
                <p className="text-xs font-sans text-slate-300">If unmitigated, legacy reconciliation batch latency will exceed 30s SLO threshold.</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: WHAT-IF SIMULATOR */}
        {activeTab === 'what-if' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-cyan-400" />
                <span>EXECUTIVE WHAT-IF SCENARIO SIMULATOR</span>
              </h2>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <span className="text-xs font-bold text-white uppercase block">Select Leadership Scenario</span>
              <div className="grid grid-cols-2 gap-3">
                <select value={simScenario} onChange={(e) => setSimScenario(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white">
                  <option value="DECOUPLE_ANALYTICS_DB">What if we decouple Analytics DB read replica?</option>
                  <option value="DO_NOTHING">What if we do nothing for 90 days?</option>
                </select>
                <Button onClick={() => setSimRun(true)} className="bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold">
                  <Play className="w-4 h-4 mr-2" /> Simulate Scenario Outcome
                </Button>
              </div>

              {simRun && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 space-y-1 animate-in fade-in">
                  <span className="font-bold block">Simulated Outcome Prediction</span>
                  <p className="font-sans text-xs text-slate-200">
                    Decoupling Analytics DB via GraphQL API eliminates database lock contention and increases architecture health score from 94.0 to 98.0 with zero risk of breaking financial reporting dashboards during DB schema migrations.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 7: AI CTO BRIEFING */}
        {activeTab === 'ai-briefing' && (
          <div className="w-full h-full p-6 flex flex-col font-mono text-xs overflow-hidden">
            <div className="pb-3 border-b border-slate-800/80 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h2 className="text-base font-black text-white">AI CTO DECISION BRIEFING</h2>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold text-[10px]">
                Executive Decision Assistant
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
                  <span>AI CTO retrieving graph evidence...</span>
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
                  placeholder="Ask AI CTO (e.g. 'What should I worry about?', 'Are engineering investments working?')..."
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

        {/* TAB 8: SYSTEM PORTFOLIO */}
        {activeTab === 'portfolio' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                <span>SYSTEM & SERVICE PORTFOLIO MATRIX</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: 'Payments Platform System', health: 91.5, risk: 'MEDIUM', criticality: 'CRITICAL', owner: 'Payments Core Team' },
                { name: 'Security & Identity Platform', health: 94.0, risk: 'LOW', criticality: 'CRITICAL', owner: 'Platform Security Team' },
                { name: 'Billing Subscription Engine', health: 88.0, risk: 'HIGH', criticality: 'HIGH', owner: 'Billing Subscriptions Team' },
              ].map((p) => (
                <div key={p.name} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{p.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      {p.criticality}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 block">Owner: {p.owner}</span>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                    <span className="text-emerald-400 font-bold">{p.health}/100 Health</span>
                    <span className="text-amber-400 font-bold">Risk: {p.risk}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 9: ALERTS DIGEST */}
        {activeTab === 'alerts' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-400" />
                <span>PRIORITIZED EXECUTIVE ALERTS DIGEST</span>
              </h2>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white text-sm block">Architecture Coupling Risk Detected in Payments / Analytics Boundary</span>
                  <span className="text-slate-400 text-xs font-sans block">Today • High Urgency • Immediate Leadership Attention</span>
                </div>
                <Button size="sm" onClick={() => setActiveTab('what-if')} className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold">
                  Simulate Refactoring
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 10: EXECUTIVE TIMELINE */}
        {activeTab === 'timeline' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyan-400" />
                <span>ORGANIZATION-LEVEL ENGINEERING TIMELINE</span>
              </h2>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Sub-10ms Payment Ingress Latency Benchmark Achieved</span>
                  <span className="text-[10px] text-slate-500">August 2026</span>
                </div>
                <p className="text-xs font-sans text-slate-300">18% performance improvement following idempotency refactoring in Payment Processing Core.</p>
              </div>
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
        entityName="payment-processing-core"
        entityType="REPOSITORY"
      />
    </div>
  );
}
