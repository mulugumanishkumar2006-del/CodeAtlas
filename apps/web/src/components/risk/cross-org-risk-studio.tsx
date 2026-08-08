'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  Zap,
  Sparkles,
  FlaskConical,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Send,
  Bot,
  User,
  GitBranch,
  Layers,
  Search,
  Filter,
  Play,
  FileText,
  ShieldCheck,
  Activity,
  Flame,
  Clock,
  Check,
  RefreshCcw,
  XCircle,
  HelpCircle,
  Network,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CommandPaletteModal } from '@/components/ui/command-palette-modal';
import { ContextualGraphDrawer } from '@/components/knowledge-graph/contextual-graph-drawer';
import { UniversalEntityDetailHeader } from '@/components/ui/universal-entity-detail-header';

type RiskTab =
  | 'radar'
  | 'propagation'
  | 'blast-radius'
  | 'concentration'
  | 'stories'
  | 'compound'
  | 'simulator'
  | 'remediation'
  | 'ai-analyst'
  | 'governance';

interface RiskAiMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  evidenceLinks?: string[];
}

export function CrossOrgRiskStudio() {
  const [activeTab, setActiveTab] = useState<RiskTab>('radar');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isGraphDrawerOpen, setIsGraphDrawerOpen] = useState(false);

  // Tab 7 Simulator state
  const [simScenario, setSimScenario] = useState('UPGRADE_SEC_VAULT');
  const [simRun, setSimRun] = useState(false);

  // Tab 10 Governance state
  const [riskStatus, setRiskStatus] = useState('UNDER_INVESTIGATION');

  // Tab 9 AI Risk Analyst state
  const [aiMessages, setAiMessages] = useState<RiskAiMessage[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: "Welcome to your Cross-Organization Risk Intelligence Radar. I analyze risk propagation, blast radius, compound correlations, and safe autonomous remediations across your entire software ecosystem. Ask me any risk query!",
      evidenceLinks: ['@acme/sec-vault@1.2.0', 'PaymentProcessingEngine', 'auth-gateway-service'],
    },
  ]);
  const [aiInput, setAiInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);

  const tabs = [
    { id: 'radar', label: 'Org Risk Radar', icon: ShieldAlert },
    { id: 'propagation', label: 'Propagation Paths', icon: GitBranch },
    { id: 'blast-radius', label: 'Blast Radius', icon: Zap },
    { id: 'concentration', label: 'Risk Concentration', icon: Flame },
    { id: 'stories', label: 'Risk Stories', icon: FileText },
    { id: 'compound', label: 'Compound Risks', icon: Layers },
    { id: 'simulator', label: 'Risk Simulator', icon: FlaskConical },
    { id: 'remediation', label: 'Safe Remediation', icon: ShieldCheck },
    { id: 'ai-analyst', label: 'AI Risk Analyst', icon: Sparkles },
    { id: 'governance', label: 'Governance Trail', icon: Activity },
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
      if (qLower.includes('blast radius') || qLower.includes('propagation')) {
        reply = "The risk with the largest potential blast radius is **CVE-2026-4491 in @acme/sec-vault**. It propagates through **auth-gateway-service** to 4 downstream microservices (**AuthGatewayService**, **PaymentProcessingEngine**, **BillingInvoiceEngine**, **MobileBackendBFF**) affecting 2 engineering teams.";
      } else if (qLower.includes('concentrat') || qLower.includes('converge')) {
        reply = "Risk concentration is highest on **PaymentProcessingEngine**, where 4 independent risks converge: Security (SecVault CVE), Architecture (Direct DB Bypass), Performance (Postgres Lock Contention), and Tech Debt (Legacy Reconciliation Cron).";
      } else if (qLower.includes('fix first') || qLower.includes('priority')) {
        reply = "Recommending **Immediate Attention** on merging Dependabot lockfile PR #402 for @acme/sec-vault@2.1.0 (100% risk reduction with 1 hour CI effort), followed by decoupling Analytics DB read queries via GraphQL API ingress.";
      } else {
        reply = `AI Risk Analyst analyzed prompt: "${q}". Evaluated 17 risk categories across 20 entity layers connected to the Organization Knowledge Graph.`;
      }

      setAiMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, sender: 'ai', text: reply, evidenceLinks: ['@acme/sec-vault@1.2.0', 'PaymentProcessingEngine', 'auth-gateway-service'] },
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
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>CROSS-ORGANIZATION RISK INTELLIGENCE RADAR</span>
          </div>
          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold">
            17 Risk Categories • Graph-Powered
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-cyan-500/40"
          >
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            <span>Cmd+K Risk Triggers</span>
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
              onClick={() => setActiveTab(t.id as RiskTab)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all font-bold shrink-0 ${
                isActive
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-lg shadow-rose-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-rose-400' : 'text-slate-500'}`} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Studio Body */}
      <div className="flex-1 overflow-hidden relative">
        {/* TAB 1: RADAR & REGISTER */}
        {activeTab === 'radar' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <UniversalEntityDetailHeader
              entityName="CVE-2026-4491 in @acme/sec-vault Shared RSA Package"
              entityType="RISK"
              owner="Platform Security Core Team"
              riskLevel="CRITICAL"
              healthScore={78.5}
              status="ACTIVE_INVESTIGATION"
              onOpenGraphDrawer={() => setIsGraphDrawerOpen(true)}
            />
            <div className="pb-3 border-b border-slate-800/80 flex items-center justify-between">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-400" />
                <span>UNIFIED CROSS-ORGANIZATION RISK REGISTER</span>
              </h2>
              <span className="text-[10px] px-2.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold">
                2 Critical Active Risks
              </span>
            </div>

            <div className="space-y-4">
              {[
                {
                  id: 'risk-cross-1',
                  title: 'CVE-2026-4491 in @acme/sec-vault Shared RSA Package',
                  category: 'SECURITY_RISK',
                  priority: 'IMMEDIATE_ATTENTION',
                  exposure: '4 Microservices & 3 Gateways',
                  evidence: 'package.json lockfile audit in auth-gateway-service',
                  affected: ['AuthGatewayService', 'PaymentProcessingEngine', 'BillingInvoiceEngine'],
                  action: 'Execute automated lockfile upgrade PR to @acme/sec-vault@2.1.0',
                },
                {
                  id: 'risk-cross-2',
                  title: 'Direct Database Replica Access bypassing Analytics GraphQL Ingress',
                  category: 'ARCHITECTURE_RISK',
                  priority: 'HIGH_PRIORITY',
                  exposure: 'Payment Ledger Postgres Primary Database',
                  evidence: 'analytics_pipeline.go:L112 connection string',
                  affected: ['PaymentProcessingEngine', 'AnalyticsReportingEngine'],
                  action: 'Decouple query through Analytics GraphQL API Ingress',
                },
              ].map((r) => (
                <div key={r.id} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">{r.title}</span>
                    <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold text-[10px]">
                      {r.priority}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 block font-sans">Exposure: {r.exposure}</span>
                  <span className="text-[10px] text-slate-500 block">Evidence: {r.evidence}</span>
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 font-sans text-xs flex items-center justify-between">
                    <span>💡 <b>Action:</b> {r.action}</span>
                    <Button
                      size="sm"
                      onClick={() => setIsGraphDrawerOpen(true)}
                      className="bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold font-mono text-[11px] h-7"
                    >
                      Inspect Risk Graph
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: PROPAGATION PATHS */}
        {activeTab === 'propagation' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-rose-400" />
                <span>RISK PROPAGATION PATH ANALYZER</span>
              </h2>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-white uppercase block">Propagation Path: @acme/sec-vault@1.2.0</span>
              <div className="flex items-center gap-2 overflow-x-auto py-2">
                {[
                  '@acme/sec-vault (LIBRARY)',
                  'auth-gateway-service (REPO)',
                  'AuthGatewayService (SERVICE)',
                  'POST /api/v1/auth/token (API)',
                  'Global Checkout Platform (APP)',
                  'Payments Core Team (TEAM)',
                ].map((step, idx) => (
                  <React.Fragment key={step}>
                    {idx > 0 && <ArrowRight className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
                    <span className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-bold shrink-0">
                      {step}
                    </span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: BLAST RADIUS */}
        {activeTab === 'blast-radius' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <Zap className="w-5 h-5 text-rose-400" />
                <span>RISK BLAST RADIUS CALCULATOR</span>
              </h2>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                <span className="text-[10px] text-rose-300 uppercase block font-bold">Direct Impact</span>
                <span className="text-xl font-black text-rose-400">2 Microservices</span>
              </div>
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <span className="text-[10px] text-amber-300 uppercase block font-bold">Indirect Impact</span>
                <span className="text-xl font-black text-amber-400">2 Downstream Services</span>
              </div>
              <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
                <span className="text-[10px] text-cyan-300 uppercase block font-bold">Affected Teams</span>
                <span className="text-xl font-black text-cyan-400">2 Engineering Teams</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: RISK CONCENTRATION */}
        {activeTab === 'concentration' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <Flame className="w-5 h-5 text-rose-400" />
                <span>CONVERGENT RISK CONCENTRATION MATRIX</span>
              </h2>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">PaymentProcessingEngine</span>
                <span className="px-2.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold text-[10px]">
                  SCORE: 8.9/10 (4 CONVERGENT RISKS)
                </span>
              </div>
              <ul className="list-disc list-inside text-xs font-sans text-slate-300 space-y-1">
                <li>Security: CVE-2026-4491 Shared RSA Package vulnerability</li>
                <li>Architecture: Direct SQL read replica bypass coupling</li>
                <li>Performance: GORM db.AutoMigrate() lock contention</li>
                <li>Tech Debt: Legacy reconciliation cron job complexity</li>
              </ul>
            </div>
          </div>
        )}

        {/* TAB 5: STORIES */}
        {activeTab === 'stories' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <FileText className="w-5 h-5 text-rose-400" />
                <span>EXECUTIVE RISK NARRATIVES & STORIES</span>
              </h2>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="text-sm font-bold text-white">Security Vulnerability Risk Narrative</span>
              <p className="text-xs font-sans text-slate-300 leading-relaxed">
                An outdated shared dependency (@acme/sec-vault@1.2.0) creates potential security exposure across 3 core repositories and 4 microservices. Merging automated lockfile PR #402 eliminates vulnerability.
              </p>
            </div>
          </div>
        )}

        {/* TAB 6: COMPOUND RISKS */}
        {activeTab === 'compound' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <Layers className="w-5 h-5 text-rose-400" />
                <span>COMPOUND RISK CORRELATION DETECTOR</span>
              </h2>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="font-bold text-white text-sm">Elevated Change Risk in Payment Ingress Path</span>
              <div className="text-xs font-sans text-slate-300 space-y-1">
                <div>• Tight Architectural Coupling (Score: 0.88)</div>
                <div>• High Commit Change Frequency (14 commits/week)</div>
                <div>• Low Integration Test Coverage (38% unit test coverage)</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: SIMULATOR */}
        {activeTab === 'simulator' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-rose-400" />
                <span>RISK SCENARIO SIMULATOR</span>
              </h2>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <select value={simScenario} onChange={(e) => setSimScenario(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white">
                  <option value="UPGRADE_SEC_VAULT">What if we upgrade @acme/sec-vault to v2.1.0?</option>
                  <option value="DO_NOTHING">What if we delay remediation for 60 days?</option>
                </select>
                <Button onClick={() => setSimRun(true)} className="bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-400 hover:to-indigo-500 text-white font-bold">
                  <Play className="w-4 h-4 mr-2" /> Simulate Risk Reduction
                </Button>
              </div>

              {simRun && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 space-y-1 animate-in fade-in">
                  <span className="font-bold block">Simulation Outcome</span>
                  <p className="font-sans text-xs text-slate-200">
                    Upgrading lockfile reduces risk exposure from 4 microservices down to 0 microservices with 100% risk reduction confidence.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 8: SAFE REMEDIATION */}
        {activeTab === 'remediation' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>SAFE AUTONOMOUS REMEDIATION PLANNER</span>
              </h2>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="text-sm font-bold text-white">Proposed Automated Lockfile Patch #402</span>
              <p className="text-xs font-sans text-slate-300">Upgrade @acme/sec-vault package to v2.1.0 in user-profile-repo with automated vitest verification.</p>
              <Button className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold mt-2">
                Approve & Execute Remediation
              </Button>
            </div>
          </div>
        )}

        {/* TAB 9: AI RISK ANALYST */}
        {activeTab === 'ai-analyst' && (
          <div className="w-full h-full p-6 flex flex-col font-mono text-xs overflow-hidden">
            <div className="pb-3 border-b border-slate-800/80 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-rose-400" />
                <h2 className="text-base font-black text-white">AI RISK ANALYST ASSISTANT</h2>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold text-[10px]">
                Grounded Knowledge Graph Evidence
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 py-4 scrollbar-none">
              {aiMessages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-3 p-4 rounded-2xl border ${
                    m.sender === 'ai'
                      ? 'bg-slate-900/80 border-slate-800 text-slate-200'
                      : 'bg-rose-500/10 border-rose-500/30 text-white ml-12'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                    m.sender === 'ai' ? 'bg-rose-500/20 text-rose-400' : 'bg-indigo-500/20 text-indigo-400'
                  }`}>
                    {m.sender === 'ai' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>
                  <div className="space-y-2 flex-1">
                    <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                  </div>
                </div>
              ))}
              {isAiThinking && (
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-rose-400 flex items-center gap-2">
                  <Bot className="w-4 h-4 animate-spin" />
                  <span>AI Risk Analyst traversing propagation paths...</span>
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
                  placeholder="Ask AI Risk Analyst (e.g. 'What is our biggest risk?', 'Which risks affect multiple teams?')..."
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500/40"
                />
                <Button type="submit" disabled={!aiInput || isAiThinking} className="bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold">
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
                <Activity className="w-5 h-5 text-rose-400" />
                <span>RISK GOVERNANCE & AUDIT TRAIL</span>
              </h2>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <span className="text-sm font-bold text-white block">Governance State Management</span>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Current Status:</span>
                <select value={riskStatus} onChange={(e) => setRiskStatus(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white">
                  <option value="UNDER_INVESTIGATION">UNDER_INVESTIGATION</option>
                  <option value="ACCEPTED">ACCEPTED</option>
                  <option value="DEFERRED">DEFERRED</option>
                  <option value="RESOLVED">RESOLVED</option>
                </select>
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
        entityName="@acme/sec-vault@1.2.0"
        entityType="SECURITY_FINDING"
      />
    </div>
  );
}
