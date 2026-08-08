'use client';

import React, { useState } from 'react';
import {
  FlaskConical,
  Zap,
  Sparkles,
  Search,
  Filter,
  Layers,
  GitBranch,
  Play,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Bot,
  User,
  Send,
  Plus,
  CheckCircle2,
  Lock,
  GitPullRequest,
  Check,
  X,
  Network,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CommandPaletteModal } from '@/components/ui/command-palette-modal';
import { ContextualGraphDrawer } from '@/components/knowledge-graph/contextual-graph-drawer';
import { UniversalEntityDetailHeader } from '@/components/ui/universal-entity-detail-header';

type SimTab =
  | 'scenarios'
  | 'builder'
  | 'graph-diff'
  | 'blast-radius'
  | 'comparison'
  | 'branching'
  | 'outage'
  | 'migration'
  | 'ai-assistant'
  | 'approval';

interface SimAiMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  evidence?: string[];
}

export function EnterpriseSimulationStudio() {
  const [activeTab, setActiveTab] = useState<SimTab>('scenarios');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isGraphDrawerOpen, setIsGraphDrawerOpen] = useState(false);

  // Tab 2 Builder state
  const [opType, setOpType] = useState('UPGRADE');
  const [targetEntity, setTargetEntity] = useState('@acme/sec-vault@1.2.0');
  const [isSimRunning, setIsSimRunning] = useState(false);
  const [simOutcome, setSimOutcome] = useState(false);

  // Tab 10 Approval state
  const [approvalStatus, setApprovalStatus] = useState<'DRAFT' | 'APPROVED'>('DRAFT');

  // Tab 9 AI Assistant state
  const [aiMessages, setAiMessages] = useState<SimAiMessage[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: "Welcome to Enterprise Simulation Studio! I safely calculate 'What happens if we change this?' across 14 simulation scopes (Architecture, Dependencies, APIs, DBs, Failures, Risk) without modifying production. Ask me any simulation query!",
      evidence: ['scen-101', 'scen-102'],
    },
  ]);
  const [aiInput, setAiInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);

  const tabs = [
    { id: 'scenarios', label: 'Scenario Workspace', icon: FlaskConical },
    { id: 'builder', label: 'Scenario Builder', icon: Plus },
    { id: 'graph-diff', label: 'Graph Diff Visualizer', icon: GitBranch },
    { id: 'blast-radius', label: 'Blast Radius & Path', icon: Zap },
    { id: 'comparison', label: 'Scenario Comparison', icon: Layers },
    { id: 'branching', label: 'Branching & Versions', icon: Network },
    { id: 'outage', label: 'Failure Simulator', icon: AlertTriangle },
    { id: 'migration', label: 'Safe Migration Planner', icon: ShieldCheck },
    { id: 'ai-assistant', label: 'AI Simulation Assistant', icon: Sparkles },
    { id: 'approval', label: 'Execution Boundary', icon: Lock },
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
      if (qLower.includes('what happens') || qLower.includes('blast radius')) {
        reply = "Simulating **@acme/sec-vault upgrade to v2.1.0**: Reduces vulnerability risk across 4 microservices (**AuthGatewayService**, **PaymentProcessingEngine**, **BillingInvoiceEngine**, **MobileBackendBFF**) with **100% risk reduction** confidence.";
      } else if (qLower.includes('split') || qLower.includes('architect')) {
        reply = "Simulating **Analytics GraphQL Ingress extraction**: Decouples direct SQL read replica bypass from `analytics_pipeline.go:L112`, dropping coupling score from **0.88 down to 0.42**.";
      } else if (qLower.includes('fail') || qLower.includes('outage')) {
        reply = "Simulating **Postgres Primary Ledger Outage**: Direct blast radius affects PaymentProcessingEngine and BillingInvoiceEngine. Downstream fallback queue buffers transactions for up to 30 minutes.";
      } else {
        reply = `AI Simulation Assistant analyzed prompt: "${q}". Simulation engine executed graph traversal across Knowledge Graph baseline.`;
      }

      setAiMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, sender: 'ai', text: reply, evidence: ['scen-101', 'scen-102'] },
      ]);
      setIsAiThinking(false);
    }, 400);
  };

  const runBuilderSim = () => {
    setIsSimRunning(true);
    setTimeout(() => {
      setIsSimRunning(false);
      setSimOutcome(true);
    }, 500);
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 font-sans overflow-hidden relative">
      {/* Top Banner Header */}
      <div className="h-12 border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-xl px-4 flex items-center justify-between shrink-0 font-mono text-xs z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-bold text-white">
            <FlaskConical className="w-4 h-4 text-indigo-400" />
            <span>ENTERPRISE SIMULATION STUDIO</span>
          </div>
          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold">
            14 Scopes • Isolated Production-Safe Baseline
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-cyan-500/40"
          >
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            <span>Cmd+K Simulation Triggers</span>
          </button>
          <Button
            size="sm"
            onClick={() => setIsGraphDrawerOpen(true)}
            className="bg-cyan-500/10 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 font-mono text-xs h-7"
          >
            <Network className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
            Graph Baseline
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
              onClick={() => setActiveTab(t.id as SimTab)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all font-bold shrink-0 ${
                isActive
                  ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shadow-lg shadow-indigo-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Studio Body */}
      <div className="flex-1 overflow-hidden relative">
        {/* TAB 1: WORKSPACE */}
        {activeTab === 'scenarios' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <UniversalEntityDetailHeader
              entityName="Upgrade @acme/sec-vault Dependency to v2.1.0"
              entityType="SCENARIO"
              owner="Platform Engineering Team"
              riskLevel="LOW"
              healthScore={95.0}
              status="COMPLETED"
              onOpenGraphDrawer={() => setIsGraphDrawerOpen(true)}
            />
            <div className="pb-3 border-b border-slate-800/80 flex items-center justify-between">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-indigo-400" />
                <span>HYPOTHETICAL SCENARIO WORKSPACE</span>
              </h2>
              <Button size="sm" onClick={() => setActiveTab('builder')} className="bg-indigo-500 hover:bg-indigo-400 text-white font-bold">
                <Plus className="w-4 h-4 mr-1" /> New Scenario
              </Button>
            </div>

            <div className="space-y-4">
              {[
                {
                  id: 'scen-101',
                  name: 'Upgrade @acme/sec-vault Dependency to v2.1.0',
                  scope: 'DEPENDENCY_UPGRADE',
                  operation: 'UPGRADE',
                  status: 'COMPLETED',
                  risk_reduction: '100%',
                  impact: '4 Microservices & 2 Teams',
                },
                {
                  id: 'scen-102',
                  name: 'Extract Analytics GraphQL Ingress Boundary',
                  scope: 'ARCHITECTURE',
                  operation: 'SPLIT',
                  status: 'COMPLETED',
                  risk_reduction: '52%',
                  impact: '2 Services (Decouples Postgres Replica)',
                },
              ].map((s) => (
                <div key={s.id} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">{s.name}</span>
                    <span className="px-2.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold text-[10px]">
                      {s.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-400 font-sans">
                    <div>Operation: <b>{s.operation}</b> ({s.scope})</div>
                    <div>Impact: <b>{s.impact}</b></div>
                    <div>Risk Reduction: <b className="text-emerald-400">{s.risk_reduction}</b></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: BUILDER */}
        {activeTab === 'builder' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-400" />
                <span>INTERACTIVE SCENARIO BUILDER</span>
              </h2>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 block mb-1">Operation Type</label>
                  <select value={opType} onChange={(e) => setOpType(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white">
                    <option value="UPGRADE">UPGRADE (Dependency / API)</option>
                    <option value="REMOVE">REMOVE (Service / Library)</option>
                    <option value="SPLIT">SPLIT (Architecture Boundary)</option>
                    <option value="MERGE">MERGE (Services / DBs)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Target Entity</label>
                  <input
                    type="text"
                    value={targetEntity}
                    onChange={(e) => setTargetEntity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <Button onClick={runBuilderSim} disabled={isSimRunning} className="bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-bold">
                <Play className="w-4 h-4 mr-2" /> {isSimRunning ? 'Calculating Impact...' : 'Run Simulation'}
              </Button>

              {simOutcome && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 space-y-1 animate-in fade-in">
                  <span className="font-bold block">Simulation Execution Result</span>
                  <p className="font-sans text-xs text-slate-200">
                    Calculated impact for {opType} on {targetEntity}: 4 Microservices affected, 100% vulnerability risk reduction, 0 breaking API changes.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: GRAPH DIFF */}
        {activeTab === 'graph-diff' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-indigo-400" />
                <span>GRAPH DIFF VISUALIZER (BEFORE VS AFTER)</span>
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-2">
                <span className="text-rose-400 font-bold uppercase text-[10px] block">Nodes / Edges Removed</span>
                <div className="text-xs text-slate-200">- @acme/sec-vault@1.2.0 (LIBRARY)</div>
                <div className="text-xs text-slate-200">- auth-gateway-service → @acme/sec-vault@1.2.0</div>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                <span className="text-emerald-400 font-bold uppercase text-[10px] block">Nodes / Edges Added</span>
                <div className="text-xs text-slate-200">+ @acme/sec-vault@2.1.0 (LIBRARY)</div>
                <div className="text-xs text-slate-200">+ auth-gateway-service → @acme/sec-vault@2.1.0</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: BLAST RADIUS */}
        {activeTab === 'blast-radius' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <Zap className="w-5 h-5 text-indigo-400" />
                <span>BLAST RADIUS & STEP-BY-STEP PROPAGATION PATH</span>
              </h2>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto py-2">
              {[
                '@acme/sec-vault@1.2.0 (LIBRARY)',
                'auth-gateway-service (REPO)',
                'AuthGatewayService (SERVICE)',
                'Global Checkout Platform (APP)',
                'Payments Core Team (TEAM)',
              ].map((step, idx) => (
                <React.Fragment key={step}>
                  {idx > 0 && <ArrowRight className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                  <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-bold shrink-0">
                    {step}
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: COMPARISON */}
        {activeTab === 'comparison' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-400" />
                <span>SIDE-BY-SIDE SCENARIO COMPARISON MATRIX</span>
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <span className="font-bold text-white">Scenario A: Upgrade @acme/sec-vault to v2.1.0</span>
                <p className="text-xs text-slate-300 font-sans">1 Hour CI Effort • Low Risk • 100% Risk Reduction</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <span className="font-bold text-white">Scenario B: Replace with Auth0 Integration</span>
                <p className="text-xs text-slate-300 font-sans">3 Weeks Effort • Medium Risk • Requires Auth Migration</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: BRANCHING */}
        {activeTab === 'branching' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <Network className="w-5 h-5 text-indigo-400" />
                <span>SCENARIO BRANCHING TREE</span>
              </h2>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="font-bold text-white">Main Scenario: Upgrade Lockfile #402</span>
              <div className="pl-4 border-l border-indigo-500/40 text-xs text-slate-300">
                └─ Branch A-1: Deploy via Staging Blue/Green Canary
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: OUTAGE */}
        {activeTab === 'outage' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                <span>FAILURE & OUTAGE SIMULATOR</span>
              </h2>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="text-sm font-bold text-white">Simulating Postgres Primary Ledger Outage</span>
              <p className="text-xs text-slate-300 font-sans">Direct blast radius affects PaymentProcessingEngine. Fallback Kafka queue buffers transactions up to 30 minutes.</p>
            </div>
          </div>
        )}

        {/* TAB 8: MIGRATION */}
        {activeTab === 'migration' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>DEPENDENCY-AWARE SAFE MIGRATION PLANNER</span>
              </h2>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="text-sm font-bold text-white block">Suggested Migration Sequence</span>
              <ol className="list-decimal list-inside text-xs font-sans text-slate-300 space-y-1">
                <li>Update lockfile in auth-gateway-service</li>
                <li>Run automated vitest integration test suite</li>
                <li>Deploy AuthGatewayService to Staging environment</li>
                <li>Promote to Production after zero regression check</li>
              </ol>
            </div>
          </div>
        )}

        {/* TAB 9: AI ASSISTANT */}
        {activeTab === 'ai-assistant' && (
          <div className="w-full h-full p-6 flex flex-col font-mono text-xs overflow-hidden">
            <div className="pb-3 border-b border-slate-800/80 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <h2 className="text-base font-black text-white">AI SIMULATION ASSISTANT</h2>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold text-[10px]">
                Grounded Knowledge Graph Baseline
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 py-4 scrollbar-none">
              {aiMessages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-3 p-4 rounded-2xl border ${
                    m.sender === 'ai'
                      ? 'bg-slate-900/80 border-slate-800 text-slate-200'
                      : 'bg-indigo-500/10 border-indigo-500/30 text-white ml-12'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                    m.sender === 'ai' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-cyan-500/20 text-cyan-400'
                  }`}>
                    {m.sender === 'ai' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>
                  <div className="space-y-2 flex-1">
                    <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                  </div>
                </div>
              ))}
              {isAiThinking && (
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-indigo-400 flex items-center gap-2">
                  <Bot className="w-4 h-4 animate-spin" />
                  <span>AI Assistant traversing simulation baseline...</span>
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
                  placeholder="Ask AI Simulation Assistant (e.g. 'What happens if we split payments?', 'Which scenario has less risk?')..."
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500/40"
                />
                <Button type="submit" disabled={!aiInput || isAiThinking} className="bg-indigo-500 hover:bg-indigo-400 text-white font-bold">
                  <Send className="w-4 h-4 mr-1" /> Ask AI
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 10: APPROVAL */}
        {activeTab === 'approval' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80 flex items-center justify-between">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <Lock className="w-5 h-5 text-amber-400" />
                <span>EXECUTION APPROVAL BOUNDARY</span>
              </h2>
              <span className="text-[10px] px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                Simulation Isolated
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">Approve Scenario for Implementation</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold">
                  {approvalStatus}
                </span>
              </div>
              <p className="text-xs font-sans text-slate-300">Transition hypothetical scenario to authorized execution workflow.</p>

              {approvalStatus === 'DRAFT' && (
                <Button onClick={() => setApprovalStatus('APPROVED')} className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold mt-2">
                  <Check className="w-4 h-4 mr-1" /> Approve for Implementation
                </Button>
              )}
              {approvalStatus === 'APPROVED' && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-sans text-xs">
                  ✓ Scenario Approved for Implementation. Moving to authorized execution workflow...
                </div>
              )}
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
        entityName="@acme/sec-vault@1.2.0"
        entityType="LIBRARY"
      />
    </div>
  );
}
