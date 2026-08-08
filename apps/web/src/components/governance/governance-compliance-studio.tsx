'use client';

import React, { useState } from 'react';
import {
  FileText,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Search,
  Filter,
  Layers,
  Activity,
  Clock,
  Send,
  Bot,
  User,
  GitBranch,
  Play,
  Download,
  Plus,
  HelpCircle,
  XCircle,
  Network,
  Check,
  X,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CommandPaletteModal } from '@/components/ui/command-palette-modal';
import { ContextualGraphDrawer } from '@/components/knowledge-graph/contextual-graph-drawer';
import { UniversalEntityDetailHeader } from '@/components/ui/universal-entity-detail-header';

type GovTab =
  | 'posture'
  | 'catalog'
  | 'violations'
  | 'gaps'
  | 'exceptions'
  | 'preview'
  | 'remediation'
  | 'audit-mode'
  | 'ai-advisor'
  | 'audit-log';

interface GovAiMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  citations?: { policy: string; evidence: string }[];
}

export function GovernanceComplianceStudio() {
  const [activeTab, setActiveTab] = useState<GovTab>('posture');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isGraphDrawerOpen, setIsGraphDrawerOpen] = useState(false);

  // Tab 5 Exception Request Modal state
  const [showExceptionModal, setShowExceptionModal] = useState(false);
  const [exceptionReason, setExceptionReason] = useState('');

  // Tab 9 AI Governance Advisor state
  const [aiMessages, setAiMessages] = useState<GovAiMessage[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: "Welcome to your Governance & Compliance Intelligence Studio. I monitor 18 policy categories across your software organization backed by real CodeAtlas evidence. Ask me any policy or compliance query!",
      citations: [
        { policy: 'pol-arch-1', evidence: 'analytics_pipeline.go:L112' },
        { policy: 'pol-sec-1', evidence: 'user-profile-repo package.json:L42' },
      ],
    },
  ]);
  const [aiInput, setAiInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);

  const tabs = [
    { id: 'posture', label: 'Governance Posture', icon: Activity },
    { id: 'catalog', label: 'Control Library & Policies', icon: FileText },
    { id: 'violations', label: 'Policy Violations', icon: AlertTriangle },
    { id: 'gaps', label: 'Evidence Gaps', icon: HelpCircle },
    { id: 'exceptions', label: 'Exceptions Lifecycle', icon: Clock },
    { id: 'preview', label: 'Policy Change Preview', icon: Layers },
    { id: 'remediation', label: 'Safe Remediation', icon: ShieldCheck },
    { id: 'audit-mode', label: 'Audit Timeline Export', icon: Download },
    { id: 'ai-advisor', label: 'AI Governance Advisor', icon: Sparkles },
    { id: 'audit-log', label: 'Immutable Audit Log', icon: CheckCircle2 },
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
      if (qLower.includes('violation') || qLower.includes('non-compliant')) {
        reply = "Active non-compliant violation detected: **Direct SQL read replica connection bypass** in `analytics_pipeline.go:L112`. This violates the **Strict Service API Ingress Boundary Policy (pol-arch-1)**. Recommending migration to Analytics GraphQL API ingress.";
        cites = [{ policy: 'pol-arch-1', evidence: 'analytics_pipeline.go:L112' }];
      } else if (qLower.includes('audit') || qLower.includes('evidence')) {
        reply = "All 3 active governance policies possess verifiable technical evidence (GORM connection strings, package.json lockfiles, CODEOWNERS files). Audit timeline export is ready for SOC2/ISO27001 compliance verification.";
        cites = [{ policy: 'pol-sec-1', evidence: 'package.json:L42' }];
      } else if (qLower.includes('expir') || qLower.includes('exception')) {
        reply = "1 policy exception is expiring in 7 days: **legacy-ledger-repo** exception for Zero Known Critical CVE Policy. Required action: Review C++ wrapper test suite and merge lockfile patch.";
        cites = [{ policy: 'pol-sec-1', evidence: 'legacy-ledger-repo exception exc-1' }];
      } else {
        reply = `AI Governance Advisor analyzed prompt: "${q}". Governance engine monitors 18 policy categories across 42 systems and 2450 repositories.`;
        cites = [{ policy: 'pol-arch-1', evidence: 'architecture_model.json' }];
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
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>ENGINEERING GOVERNANCE & COMPLIANCE INTELLIGENCE</span>
          </div>
          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
            18 Policy Categories • Evidence-Driven
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-cyan-500/40"
          >
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            <span>Cmd+K Governance Triggers</span>
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

      {/* Sub-Tabs */}
      <div className="h-11 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl px-4 flex items-center gap-1 shrink-0 font-mono text-xs z-10 overflow-x-auto scrollbar-none">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as GovTab)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all font-bold shrink-0 ${
                isActive
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 overflow-hidden relative">
        {/* TAB 1: POSTURE OVERVIEW */}
        {activeTab === 'posture' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-sans">
            <UniversalEntityDetailHeader
              entityName="Strict Service API Ingress Boundary Policy"
              entityType="POLICY"
              owner="Principal Enterprise Architect"
              riskLevel="HIGH"
              healthScore={92.4}
              status="ACTIVE"
              onOpenGraphDrawer={() => setIsGraphDrawerOpen(true)}
            />
            <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 space-y-2 font-mono">
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">Governance Posture Overview</span>
              <h2 className="text-base font-black text-white leading-snug">
                Engineering Governance State: HEALTHY (92.4/100). 18 Policy categories evaluated against real CodeAtlas evidence.
              </h2>
            </div>

            <div className="grid grid-cols-4 gap-4 font-mono text-xs">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Active Policies</span>
                <span className="text-2xl font-black text-white">3 Policies</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Controls Evaluated</span>
                <span className="text-2xl font-black text-cyan-400">16 Controls</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Active Violations</span>
                <span className="text-2xl font-black text-rose-400">2 Violations</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Expiring Exceptions</span>
                <span className="text-2xl font-black text-amber-400">1 Exception (7 days)</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CATALOG */}
        {activeTab === 'catalog' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <span>CONTROL LIBRARY & POLICY CATALOG</span>
              </h2>
            </div>

            <div className="space-y-3">
              {[
                { name: 'Strict Service API Ingress Boundary Policy', category: 'ARCHITECTURE_GOVERNANCE', severity: 'HIGH', status: 'ACTIVE' },
                { name: 'Zero Known Critical CVE Dependency Policy', category: 'SECURITY_GOVERNANCE', severity: 'CRITICAL', status: 'ACTIVE' },
                { name: 'Responsible AI Model Ingestion Standard', category: 'AI_GOVERNANCE', severity: 'HIGH', status: 'ACTIVE' },
              ].map((p) => (
                <div key={p.name} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white text-sm block">{p.name}</span>
                    <span className="text-[10px] text-slate-400 font-sans block">Category: {p.category}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-[10px]">
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: VIOLATIONS */}
        {activeTab === 'violations' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80 flex items-center justify-between">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                <span>POLICY VIOLATIONS & EVIDENCE CITATIONS</span>
              </h2>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">Direct DB Replica Connection Bypass</span>
                  <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold text-[10px]">
                    HIGH SEVERITY
                  </span>
                </div>
                <span className="text-[10px] text-cyan-300 block">Evidence Citation: analytics_pipeline.go:L112</span>
                <p className="text-xs font-sans text-slate-300">Analytics Reporting Pipeline bypasses GraphQL API Gateway by opening direct GORM connection to Payment primary Postgres replica.</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: GAPS */}
        {activeTab === 'gaps' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-400" />
                <span>EVIDENCE GAP EXPLORER</span>
              </h2>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="font-bold text-white text-sm block">Missing Repository Ownership Metadata</span>
              <span className="text-slate-400 text-xs font-sans block">Repository: legacy-reconciliation-worker • No CODEOWNERS file present</span>
            </div>
          </div>
        )}

        {/* TAB 5: EXCEPTIONS */}
        {activeTab === 'exceptions' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80 flex items-center justify-between">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" />
                <span>EXCEPTIONS LIFECYCLE & EXPIRATION RADAR</span>
              </h2>
              <Button size="sm" onClick={() => setShowExceptionModal(true)} className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold">
                <Plus className="w-4 h-4 mr-1" /> Request Exception
              </Button>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">Exception: Zero Known Critical CVE Policy</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold">
                  EXPIRING IN 7 DAYS
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block font-sans">Scope: legacy-ledger-repo • Approver: Enterprise CTO</span>
            </div>
          </div>
        )}

        {/* TAB 6: PREVIEW */}
        {activeTab === 'preview' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                <span>POLICY CHANGE IMPACT PREVIEW</span>
              </h2>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="text-sm font-bold text-white">Previewing Rule: Require TLS 1.3 encryption on internal gRPC</span>
              <span className="text-xs text-slate-300 font-sans block">3 Microservices affected • Estimated remediation effort: 1 Week</span>
            </div>
          </div>
        )}

        {/* TAB 7: REMEDIATION */}
        {activeTab === 'remediation' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>SAFE REMEDIATION & RE-VALIDATION</span>
              </h2>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="text-sm font-bold text-white">Proposed Fix: GraphQL Ingress Migration</span>
              <p className="text-xs text-slate-300 font-sans">Extract GraphQL schema endpoint and re-evaluate policy pol-arch-1 upon CI merge.</p>
            </div>
          </div>
        )}

        {/* TAB 8: AUDIT MODE */}
        {activeTab === 'audit-mode' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80 flex items-center justify-between">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <Download className="w-5 h-5 text-emerald-400" />
                <span>AUDITOR EVIDENCE TIMELINE EXPORT</span>
              </h2>
              <Button size="sm" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold">
                Export Audit Bundle (.zip)
              </Button>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="font-bold text-white">Control Evaluation: ctrl-arch-01 (Non-Compliant)</span>
                <span className="text-[10px] text-slate-500 block">Evaluated At: 2026-08-08T04:30:00Z • Evidence: analytics_pipeline.go:L112</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: AI ADVISOR */}
        {activeTab === 'ai-advisor' && (
          <div className="w-full h-full p-6 flex flex-col font-mono text-xs overflow-hidden">
            <div className="pb-3 border-b border-slate-800/80 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <h2 className="text-base font-black text-white">AI GOVERNANCE ADVISOR</h2>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-[10px]">
                Evidence-Backed Citations
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 py-4 scrollbar-none">
              {aiMessages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-3 p-4 rounded-2xl border ${
                    m.sender === 'ai'
                      ? 'bg-slate-900/80 border-slate-800 text-slate-200'
                      : 'bg-emerald-500/10 border-emerald-500/30 text-white ml-12'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                    m.sender === 'ai' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-400'
                  }`}>
                    {m.sender === 'ai' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>
                  <div className="space-y-2 flex-1">
                    <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                    {m.citations && (
                      <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-800/80 text-[10px]">
                        <span className="text-slate-500 font-bold">Citations:</span>
                        {m.citations.map((c, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-emerald-300 font-bold">
                            {c.policy} ({c.evidence})
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isAiThinking && (
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-emerald-400 flex items-center gap-2">
                  <Bot className="w-4 h-4 animate-spin" />
                  <span>AI Governance Advisor evaluating 18 policy categories...</span>
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
                  placeholder="Ask AI Governance Advisor (e.g. 'Which policies are being violated?', 'Show me evidence for SOC2')..."
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500/40"
                />
                <Button type="submit" disabled={!aiInput || isAiThinking} className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold">
                  <Send className="w-4 h-4 mr-1" /> Ask AI
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 10: AUDIT LOG */}
        {activeTab === 'audit-log' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>IMMUTABLE GOVERNANCE AUDIT LOG</span>
              </h2>
            </div>

            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 font-mono text-xs flex items-center justify-between">
                <span className="text-slate-300">2026-08-08T04:30:00Z • CONTROL_EVALUATION • ctrl-arch-01 (NON_COMPLIANT)</span>
                <span className="text-emerald-400 font-bold">VERIFIED</span>
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
        entityName="Strict Service API Ingress Boundary Policy"
        entityType="POLICY"
      />
    </div>
  );
}
