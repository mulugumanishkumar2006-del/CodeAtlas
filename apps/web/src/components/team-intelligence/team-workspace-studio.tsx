'use client';

import React, { useState } from 'react';
import {
  Users,
  Activity,
  Network,
  ShieldCheck,
  Zap,
  Sparkles,
  FlaskConical,
  Clock,
  BookOpen,
  Layers,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Send,
  Bot,
  User,
  GitBranch,
  Server,
  Lock,
  Flame,
  LineChart,
  ShieldAlert,
  Play,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TeamContextHeader } from './team-context-header';
import { CommandPaletteModal } from '@/components/ui/command-palette-modal';

type TeamTab =
  | 'overview'
  | 'graph'
  | 'ownership'
  | 'knowledge'
  | 'dependencies'
  | 'bottlenecks'
  | 'architecture'
  | 'ai-advisor'
  | 'simulation'
  | 'transfer';

interface TeamAiMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  evidence?: string[];
}

export function TeamWorkspaceStudio() {
  const [activeTab, setActiveTab] = useState<TeamTab>('overview');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Tab 8 AI Advisor state
  const [aiMessages, setAiMessages] = useState<TeamAiMessage[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: "Hello! I am your Team Engineering AI Advisor. I observe system-level collaboration flows, review dependencies, knowledge concentration risks, and ownership boundaries across your teams. Ask me anything!",
      evidence: ['StripeIdempotencyConnector', 'AuthGatewayService', 'BillingInvoiceEngine'],
    },
  ]);
  const [aiInput, setAiInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Tab 9 Simulation state
  const [simScenario, setSimScenario] = useState('SPLIT_SHARED_SERVICE');
  const [simTarget, setSimTarget] = useState('AuthGatewayService');
  const [simHasRun, setSimHasRun] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Team Health Radar', icon: Activity },
    { id: 'graph', label: 'Collaboration Graph', icon: Network },
    { id: 'ownership', label: 'Ownership Matrix', icon: ShieldCheck },
    { id: 'knowledge', label: 'Knowledge Concentration', icon: Zap },
    { id: 'dependencies', label: 'Cross-Team Deps', icon: Layers },
    { id: 'bottlenecks', label: 'Review & Bottlenecks', icon: Clock },
    { id: 'architecture', label: 'Architecture Overlay', icon: GitBranch },
    { id: 'ai-advisor', label: 'Team AI Advisor', icon: Sparkles },
    { id: 'simulation', label: 'Simulation Studio', icon: FlaskConical },
    { id: 'transfer', label: 'Knowledge Transfer', icon: BookOpen },
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
      if (qLower.includes('friction') || qLower.includes('review')) {
        reply = "Collaboration friction is concentrated around **cross-team gRPC contract changes** between Payments Core and Billing Subscriptions. PRs modifying Protobuf schemas take an average of 26 hours for dual approval, compared to 4 hours for internal PRs.";
      } else if (qLower.includes('knowledge') || qLower.includes('bus factor')) {
        reply = "Knowledge concentration risk detected in the **StripeIdempotencyConnector** component. Documentation coverage is at 45%. We recommend authoring a technical runbook and scheduling pair-review walkthroughs.";
      } else if (qLower.includes('unclear') || qLower.includes('ownership')) {
        reply = "Unclear ownership was identified in the **DailyReconciliationCron** component in `legacy-ledger-repo`. It has not received active commits in 18 months and lacks an assigned team maintainer.";
      } else {
        reply = `Team AI Advisor analyzed graph relationships for prompt: "${q}". The Payments Platform Team maintains a 91.5/100 overall engineering health score with clear primary ownership over 3 core microservices.`;
      }

      setAiMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, sender: 'ai', text: reply, evidence: ['StripeIdempotencyConnector', 'PaymentProcessingEngine'] },
      ]);
      setIsAiThinking(false);
    }, 400);
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 font-sans overflow-hidden relative">
      {/* Context Navigation Bar */}
      <TeamContextHeader
        organizationName="Acme Enterprise"
        teamName="Payments Platform Team"
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      {/* Navigation Sub-Header Tabs */}
      <div className="h-11 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl px-4 flex items-center justify-between shrink-0 font-mono text-xs z-10 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as TeamTab)}
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
      </div>

      {/* Main Content Workspace Body */}
      <div className="flex-1 overflow-hidden relative">
        {/* TAB 1: OVERVIEW & 10-DIMENSIONAL HEALTH RADAR */}
        {activeTab === 'overview' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 font-mono text-xs">
              <div>
                <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  <span>PAYMENTS PLATFORM TEAM • ENGINEERING HEALTH RADAR</span>
                </h2>
                <p className="text-slate-400 font-sans text-xs">
                  Systemic, multi-dimensional team workflow analysis. Zero individual developer rankings.
                </p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-[10px]">
                Overall Health: 91.5/100
              </span>
            </div>

            {/* 10 Health Dimensions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 font-mono text-xs">
              {[
                { name: 'Delivery Flow', score: 92.0, desc: 'Consistent PR merge cadence with minimal stale branches.' },
                { name: 'Review Flow', score: 88.5, desc: 'High review participation; minor cross-team gRPC PR latency.' },
                { name: 'Architecture Health', score: 94.0, desc: 'Clean service boundaries; minor DB coupling on Analytics.' },
                { name: 'Security Score', score: 91.0, desc: 'Zero open critical vulnerabilities; 1 shared package update pending.' },
                { name: 'Performance Score', score: 93.5, desc: 'Sub-12ms API latency across payment ingress routes.' },
                { name: 'Technical Debt', score: 84.0, desc: 'Legacy reconciliation cron script requires refactoring.' },
                { name: 'Reliability Score', score: 95.0, desc: '99.99% uptime SLO compliance over last 90 days.' },
                { name: 'Documentation', score: 82.0, desc: 'StripeIdempotencyConnector runbook update required.' },
                { name: 'Ownership Clarity', score: 90.0, desc: 'Core services clearly mapped; 1 legacy cron script unowned.' },
                { name: 'Knowledge Distribution', score: 86.5, desc: 'Good team cross-training; 1 component has concentration risk.' },
              ].map((d) => (
                <div key={d.name} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-bold uppercase truncate">{d.name}</span>
                    <span className={`text-base font-black ${d.score >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {d.score}
                    </span>
                  </div>
                  <p className="text-[11px] font-sans text-slate-400 leading-snug">{d.desc}</p>
                </div>
              ))}
            </div>

            {/* Critical Risks Summary */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 font-mono text-xs">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Systemic Team Risks Requiring Attention</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-xs font-bold text-amber-300">Knowledge Concentration Risk in StripeIdempotencyConnector</span>
                  <p className="text-[11px] font-sans text-slate-400">Documentation coverage is 45%. Edge-case payment lock logic requires a technical runbook.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-xs font-bold text-cyan-300">Cross-Team Review Dependency Bottleneck</span>
                  <p className="text-[11px] font-sans text-slate-400">Dual approval requirement on gRPC contracts adds 22h turnaround delay.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COLLABORATION GRAPH */}
        {activeTab === 'graph' && (
          <div className="w-full h-full p-6 flex flex-col bg-slate-950 font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80 flex items-center justify-between shrink-0">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Network className="w-4 h-4 text-cyan-400" />
                <span>Cross-Team Ecosystem Collaboration Graph</span>
              </h2>
              <span className="text-[10px] text-slate-400">Showing Teams, Repositories, Services & Review Flows</span>
            </div>
            <div className="flex-1 relative bg-slate-900/40 border border-slate-800 rounded-2xl mt-4 flex items-center justify-center p-6">
              <div className="text-center space-y-3">
                <Network className="w-12 h-12 text-cyan-400 mx-auto animate-pulse" />
                <p className="text-slate-300 font-bold">Interactive Collaboration Graph Canvas Active</p>
                <p className="text-slate-500 font-sans text-xs max-w-md mx-auto">
                  Visualizes inter-team repository ownership, cross-team API calls, and code review approval flows between Payments Platform, Platform Security, and Billing Subscriptions teams.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: OWNERSHIP INTELLIGENCE */}
        {activeTab === 'ownership' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80 flex items-center justify-between">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <span>OWNERSHIP INTELLIGENCE MATRIX</span>
              </h2>
              <span className="text-[10px] px-2.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
                Confidence-Scored Mapping
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-emerald-400 uppercase block">Primary Owned Services (3)</span>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="font-bold text-white">PaymentProcessingEngine</span>
                  <span className="text-[10px] text-cyan-400 block">repo: payment-processing-core</span>
                  <span className="text-[10px] text-slate-500 block">Confidence: 98% (Metadata & Active PR approvals)</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-amber-400 uppercase block">Shared Ownership (1)</span>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="font-bold text-white">TaxInvoicePdfGenerator</span>
                  <span className="text-[10px] text-amber-400 block">Shared with Billing Subscriptions Team</span>
                  <span className="text-[10px] text-slate-500 block">Confidence: 85% (Joint review history)</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-rose-400 uppercase block">Unclear / Missing Ownership (2)</span>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="font-bold text-rose-300">DailyReconciliationCron</span>
                  <span className="text-[10px] text-slate-400 block">repo: legacy-ledger-repo</span>
                  <span className="text-[10px] text-rose-400 block">No commits in 18 months • Unassigned</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: KNOWLEDGE CONCENTRATION & BUS FACTOR */}
        {activeTab === 'knowledge' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80 flex items-center justify-between">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                <span>KNOWLEDGE CONCENTRATION & CONTINUITY ANALYSIS</span>
              </h2>
              <span className="text-[10px] px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                Knowledge Continuity: 86.5%
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                <span className="text-xs font-bold text-amber-300">StripeIdempotencyConnector Component</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  HIGH KNOWLEDGE CONCENTRATION RISK
                </span>
              </div>
              <p className="text-xs font-sans text-slate-300">
                Knowledge concentration risk detected around Stripe transaction lock state machine. Documentation coverage is 45% with limited review distribution across the team.
              </p>
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs font-sans">
                💡 <b>Recommended Action:</b> Author technical runbook for lock state machine and schedule architectural pair-walkthrough with Platform Security team.
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: CROSS-TEAM DEPENDENCIES */}
        {activeTab === 'dependencies' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                <span>CROSS-TEAM SERVICE & REVIEW DEPENDENCIES</span>
              </h2>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white text-sm">PaymentProcessingEngine (gRPC API)</span>
                  <span className="text-slate-400 text-xs block">Consumed by: Billing Subscriptions Team</span>
                </div>
                <span className="px-2.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold">
                  CRITICAL DEPENDENCY
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white text-sm">AuthGatewayService (OAuth Bearer API)</span>
                  <span className="text-slate-400 text-xs block">Provided by: Platform Security Team</span>
                </div>
                <span className="px-2.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
                  HIGH DEPENDENCY
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: BOTTLENECKS & REVIEW FLOW */}
        {activeTab === 'bottlenecks' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyan-400" />
                <span>COLLABORATION BOTTLENECK & REVIEW FLOW ANALYSIS</span>
              </h2>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-amber-300 block">Observed Pattern: Cross-Team Review Cycle Delay</span>
              <p className="text-xs font-sans text-slate-300">
                Protobuf gRPC API contract changes require dual approvals from Payments Core and Billing Subscriptions, extending average review turnaround time from 4h to 26h.
              </p>
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-200 font-sans text-xs">
                💡 <b>System Recommendation:</b> Adopt Protobuf schema contract registry with automated CI backward-compatibility checks.
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: ARCHITECTURE OVERLAY */}
        {activeTab === 'architecture' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-cyan-400" />
                <span>ARCHITECTURE MAP WITH TEAM OWNERSHIP OVERLAY</span>
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <span className="font-bold text-white">Payment Ingress Gateway</span>
                <span className="text-[10px] text-emerald-400 block font-bold">Clear Primary Ownership: Payments Core</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <span className="font-bold text-white">Ledger Transaction Storage</span>
                <span className="text-[10px] text-rose-400 block font-bold">Shared Database Coupling Risk</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: TEAM AI ADVISOR */}
        {activeTab === 'ai-advisor' && (
          <div className="w-full h-full p-6 flex flex-col font-mono text-xs overflow-hidden">
            <div className="pb-3 border-b border-slate-800/80 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h2 className="text-base font-black text-white">TEAM AI ENGINEERING ADVISOR</h2>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold text-[10px]">
                Grounded System Intelligence
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
                    {m.evidence && (
                      <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-slate-800/80 text-[10px]">
                        <span className="text-slate-500">Evidence Components:</span>
                        {m.evidence.map((ev) => (
                          <span key={ev} className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-cyan-300 font-bold">
                            {ev}
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
                  <span>AI Advisor analyzing collaboration graph...</span>
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
                  placeholder="Ask AI about collaboration friction, knowledge concentration, or ownership boundaries..."
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

        {/* TAB 9: TEAM SIMULATION STUDIO */}
        {activeTab === 'simulation' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-cyan-400" />
                <span>TEAM SCENARIO SIMULATION STUDIO</span>
              </h2>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <span className="text-xs font-bold text-white uppercase block">Simulate Organizational / Architecture Changes</span>
              <div className="grid grid-cols-2 gap-3">
                <select value={simScenario} onChange={(e) => setSimScenario(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white">
                  <option value="SPLIT_SHARED_SERVICE">What if we split shared TaxInvoice service?</option>
                  <option value="HANDOFF_OWNERSHIP">What if we hand off LegacyLedgerCron ownership?</option>
                </select>
                <Button
                  onClick={() => setSimHasRun(true)}
                  className="bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold"
                >
                  <Play className="w-4 h-4 mr-2" /> Execute Simulation
                </Button>
              </div>

              {simHasRun && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 space-y-1 animate-in fade-in">
                  <span className="font-bold block">Simulation Prediction Result</span>
                  <p className="font-sans text-xs text-slate-200">
                    Splitting TaxInvoicePdfGenerator into a dedicated microservice reduces cross-team review friction by 35% and increases review flow health from 88.5 to 94.0.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 10: KNOWLEDGE TRANSFER HUB */}
        {activeTab === 'transfer' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80 flex items-center justify-between">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-cyan-400" />
                <span>KNOWLEDGE TRANSFER & RUNBOOK OPPORTUNITIES</span>
              </h2>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white text-sm block">Create Technical Runbook for Stripe Idempotency State Machine</span>
                  <span className="text-slate-400 text-xs block">Target: StripeIdempotencyConnector • Impact: HIGH • Effort: LOW (2h)</span>
                </div>
                <Button size="sm" className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold">
                  Generate Runbook Draft
                </Button>
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
    </div>
  );
}
