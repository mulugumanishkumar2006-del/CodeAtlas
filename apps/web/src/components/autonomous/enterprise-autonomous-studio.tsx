'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Play,
  ArrowRight,
  Send,
  Bot,
  User,
  Search,
  Filter,
  Layers,
  Sliders,
  Check,
  X,
  RotateCcw,
  Activity,
  FileCode,
  LineChart,
  Network,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CommandPaletteModal } from '@/components/ui/command-palette-modal';
import { ContextualGraphDrawer } from '@/components/knowledge-graph/contextual-graph-drawer';

type AutoTab =
  | 'control-center'
  | 'queue'
  | 'diff-preview'
  | 'approval-gateway'
  | 'timeline'
  | 'policy-config'
  | 'campaigns'
  | 'validation'
  | 'learning-loop'
  | 'ai-agent';

interface AutoAiMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  evidence?: string[];
}

export function EnterpriseAutonomousStudio() {
  const [activeTab, setActiveTab] = useState<AutoTab>('control-center');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isGraphDrawerOpen, setIsGraphDrawerOpen] = useState(false);

  // Tab 1 Level slider state
  const [autonomyLevel, setAutonomyLevel] = useState(4); // Default LEVEL 4: Human Approval

  // Tab 4 Approval Gateway state
  const [approvalDecision, setApprovalDecision] = useState<'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');

  // Tab 10 AI Agent state
  const [aiMessages, setAiMessages] = useState<AutoAiMessage[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: "Welcome to your Enterprise Autonomous Optimization Control Center! I move CodeAtlas beyond detection toward closed-loop investigation, simulation, change preparation, human authorization, validation, and learning loop. How can I assist your optimization strategy today?",
      evidence: ['opp-101', 'opp-102', 'learn-1'],
    },
  ]);
  const [aiInput, setAiInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);

  const tabs = [
    { id: 'control-center', label: 'Autonomous Control Center', icon: Zap },
    { id: 'queue', label: 'Opportunity Queue', icon: Sliders },
    { id: 'diff-preview', label: 'Visual Code Diff Preview', icon: FileCode },
    { id: 'approval-gateway', label: 'Human Approval Gateway', icon: Lock },
    { id: 'timeline', label: '15-Step Execution Timeline', icon: Activity },
    { id: 'policy-config', label: 'Autonomy Policy Config', icon: ShieldCheck },
    { id: 'campaigns', label: 'Optimization Campaigns', icon: Layers },
    { id: 'validation', label: 'Validation & Rollback', icon: CheckCircle2 },
    { id: 'learning-loop', label: 'Learning Loop & Value', icon: LineChart },
    { id: 'ai-agent', label: 'AI Autonomous Agent', icon: Sparkles },
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
      if (qLower.includes('optimize first') || qLower.includes('priority')) {
        reply = "Recommending **Immediate Optimization #1**: Upgrade `@acme/sec-vault` to v2.1.0 in `user-profile-repo` (100% vulnerability risk reduction, 1 hour CI effort, Level 4 Human Approval pending).";
      } else if (qLower.includes('autonomy level') || qLower.includes('control')) {
        reply = `Current Autonomy Level is set to **Level ${autonomyLevel} (LEVEL_${autonomyLevel}_HUMAN_APPROVAL)**. High-impact operations require explicit human approval; low-risk lockfile upgrades are eligible for controlled automation.`;
      } else if (qLower.includes('learn') || qLower.includes('accuracy')) {
        reply = "Recent optimization learning outcome: **Redis Session Cache Rollout** achieved 42% DB connection lock reduction (Predicted: 40%), resulting in **98.2% prediction accuracy**.";
      } else {
        reply = `AI Autonomous Agent analyzed prompt: "${q}". Context engine evaluated opportunity queue, simulation baselines, and safety boundaries.`;
      }

      setAiMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, sender: 'ai', text: reply, evidence: ['opp-101', 'opp-102'] },
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
            <Zap className="w-4 h-4 text-amber-400" />
            <span>ENTERPRISE AUTONOMOUS OPTIMIZATION CONTROL CENTER</span>
          </div>
          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
            LEVEL {autonomyLevel} • HUMAN APPROVAL BOUNDARY ACTIVE
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-cyan-500/40"
          >
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            <span>Cmd+K Optimization Triggers</span>
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
              onClick={() => setActiveTab(t.id as AutoTab)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all font-bold shrink-0 ${
                isActive
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-lg shadow-amber-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Studio Body */}
      <div className="flex-1 overflow-hidden relative">
        {/* TAB 1: CONTROL CENTER */}
        {activeTab === 'control-center' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Configurable Autonomy Level Setting</span>
                <span className="text-xs font-bold text-white">ACTIVE: LEVEL {autonomyLevel} (HUMAN APPROVAL REQUIRED)</span>
              </div>
              <input
                type="range"
                min="0"
                max="6"
                value={autonomyLevel}
                onChange={(e) => setAutonomyLevel(parseInt(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                <span>L0: Observe</span>
                <span>L1: Recommend</span>
                <span>L2: Simulate</span>
                <span>L3: Prepare</span>
                <span className="text-amber-400">L4: Approval</span>
                <span>L5: Controlled</span>
                <span>L6: Continuous</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase block">Active Opportunities</span>
                <span className="text-2xl font-black text-white">4 Items</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[10px] text-amber-400 uppercase block font-bold">Pending Approvals</span>
                <span className="text-2xl font-black text-amber-400">1 Item</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[10px] text-emerald-400 uppercase block font-bold">Prediction Accuracy</span>
                <span className="text-2xl font-black text-emerald-400">98.2%</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: OPPORTUNITY QUEUE */}
        {activeTab === 'queue' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <Sliders className="w-5 h-5 text-amber-400" />
                <span>PRIORITIZED OPTIMIZATION OPPORTUNITY QUEUE</span>
              </h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  id: 'opp-101',
                  title: 'Upgrade @acme/sec-vault Shared RSA Package to v2.1.0',
                  category: 'SECURITY',
                  entity: 'user-profile-repo',
                  benefit: '100% vulnerability risk reduction across 4 microservices',
                  priority: 'HIGH_PRIORITY',
                  status: 'PENDING_APPROVAL',
                },
                {
                  id: 'opp-102',
                  title: 'Decouple Analytics DB Read Replica Connection',
                  category: 'ARCHITECTURE',
                  entity: 'payment-processing-core',
                  benefit: 'Reduces coupling score from 0.88 to 0.42 via GraphQL Ingress',
                  priority: 'HIGH_PRIORITY',
                  status: 'IN_PREPARATION',
                },
              ].map((o) => (
                <div key={o.id} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">{o.title}</span>
                    <span className="px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold text-[10px]">
                      {o.status}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 block font-sans">Entity: {o.entity} • Benefit: {o.benefit}</span>
                  <div className="flex items-center gap-2 pt-2">
                    <Button onClick={() => setActiveTab('diff-preview')} size="sm" className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold h-7 text-[11px]">
                      Preview Code Diff
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: VISUAL CODE DIFF */}
        {activeTab === 'diff-preview' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <FileCode className="w-5 h-5 text-amber-400" />
                <span>VISUAL CODE DIFF & ARTIFACT PREVIEWER</span>
              </h2>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 font-mono">
              <span className="text-xs font-bold text-white block">File: user-profile-repo/package.json</span>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-1">
                <div className="text-slate-500">--- a/package.json</div>
                <div className="text-slate-500">+++ b/package.json</div>
                <div className="text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">-    "@acme/sec-vault": "1.2.0"</div>
                <div className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">+    "@acme/sec-vault": "2.1.0"</div>
              </div>
              <p className="text-xs font-sans text-slate-300">Generated PR Title: fix(security): upgrade @acme/sec-vault to 2.1.0 to remediate CVE-2026-4491</p>
            </div>
          </div>
        )}

        {/* TAB 4: HUMAN APPROVAL GATEWAY */}
        {activeTab === 'approval-gateway' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80 flex items-center justify-between">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <Lock className="w-5 h-5 text-amber-400" />
                <span>HUMAN APPROVAL GATEWAY</span>
              </h2>
              <span className="text-[10px] px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                Level 4 Required
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">Lockfile Patch #402 Authorization</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold">
                  {approvalDecision}
                </span>
              </div>
              <p className="text-xs font-sans text-slate-300">Approve automated pull request generation and execution of vitest integration validation suite.</p>

              {approvalDecision === 'PENDING' && (
                <div className="flex items-center gap-2 pt-2">
                  <Button onClick={() => setApprovalDecision('APPROVED')} className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold">
                    <Check className="w-4 h-4 mr-1" /> Approve Execution
                  </Button>
                  <Button onClick={() => setApprovalDecision('REJECTED')} variant="outline" className="bg-slate-950 border-slate-800 text-slate-400 hover:text-white">
                    <X className="w-4 h-4 mr-1" /> Reject Request
                  </Button>
                </div>
              )}
              {approvalDecision === 'APPROVED' && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-sans text-xs">
                  ✓ Execution Authorized by CTO. Workflow pipeline step 7 (VALIDATE) in progress...
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: TIMELINE */}
        {activeTab === 'timeline' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-400" />
                <span>15-STEP EXECUTION LIFECYCLE TIMELINE</span>
              </h2>
            </div>

            <div className="space-y-2">
              {[
                { step: 1, stage: 'DETECT', status: 'COMPLETED' },
                { step: 2, stage: 'INVESTIGATE', status: 'COMPLETED' },
                { step: 3, stage: 'PREDICT', status: 'COMPLETED' },
                { step: 4, stage: 'SIMULATE', status: 'COMPLETED' },
                { step: 5, stage: 'RECOMMEND', status: 'COMPLETED' },
                { step: 6, stage: 'HUMAN_APPROVAL', status: 'IN_PROGRESS' },
              ].map((s) => (
                <div key={s.step} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between font-mono text-xs">
                  <span className="text-white font-bold">Step {s.step}: {s.stage}</span>
                  <span className={`text-[10px] font-bold ${s.status === 'COMPLETED' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: POLICY CONFIG */}
        {activeTab === 'policy-config' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <span>SAFE AUTONOMY POLICY CONFIGURATOR</span>
              </h2>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="text-sm font-bold text-white block">Predefined Low-Risk Autonomy Thresholds</span>
              <p className="text-xs text-slate-300 font-sans">Low-risk lockfile upgrades & documentation refreshes are authorized for Level 5 Controlled Autonomy.</p>
            </div>
          </div>
        )}

        {/* TAB 7: CAMPAIGNS */}
        {activeTab === 'campaigns' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-400" />
                <span>AUTONOMOUS OPTIMIZATION CAMPAIGNS</span>
              </h2>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="text-sm font-bold text-white block">Campaign: Shared Cryptography Modernization</span>
              <p className="text-xs font-sans text-slate-300">Progress: 3 of 4 microservices upgraded to @acme/sec-vault@2.1.0.</p>
            </div>
          </div>
        )}

        {/* TAB 8: VALIDATION */}
        {activeTab === 'validation' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>VALIDATION & ROLLBACK INSPECTOR</span>
              </h2>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 font-mono">
              <span className="text-sm font-bold text-white block">Validation Suite: npx vitest run tests/auth.spec.ts</span>
              <span className="text-emerald-400 font-bold text-xs block">✓ 42 / 42 Tests Passed (Sub-10ms JWT signing verified)</span>
            </div>
          </div>
        )}

        {/* TAB 9: LEARNING LOOP */}
        {activeTab === 'learning-loop' && (
          <div className="w-full h-full p-6 overflow-y-auto space-y-6 scrollbar-none font-mono text-xs">
            <div className="pb-3 border-b border-slate-800/80">
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <LineChart className="w-5 h-5 text-amber-400" />
                <span>POST-CHANGE LEARNING & VALUE TRACKER</span>
              </h2>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 font-mono">
              <span className="text-sm font-bold text-white block">Learning Outcome: Redis Session Cache Rollout</span>
              <div className="text-xs text-slate-300 font-sans">
                <div>• Predicted Impact: 40% DB lock reduction</div>
                <div>• Actual Impact: 42% DB lock reduction</div>
                <div className="text-emerald-400 font-bold font-mono pt-1">• Prediction Accuracy: 98.2%</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 10: AI AGENT */}
        {activeTab === 'ai-agent' && (
          <div className="w-full h-full p-6 flex flex-col font-mono text-xs overflow-hidden">
            <div className="pb-3 border-b border-slate-800/80 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h2 className="text-base font-black text-white">AI AUTONOMOUS OPTIMIZATION AGENT</h2>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold text-[10px]">
                Closed-Loop Intelligence
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 py-4 scrollbar-none">
              {aiMessages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-3 p-4 rounded-2xl border ${
                    m.sender === 'ai'
                      ? 'bg-slate-900/80 border-slate-800 text-slate-200'
                      : 'bg-amber-500/10 border-amber-500/30 text-white ml-12'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                    m.sender === 'ai' ? 'bg-amber-500/20 text-amber-400' : 'bg-indigo-500/20 text-indigo-400'
                  }`}>
                    {m.sender === 'ai' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>
                  <div className="space-y-2 flex-1">
                    <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                  </div>
                </div>
              ))}
              {isAiThinking && (
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-amber-400 flex items-center gap-2">
                  <Bot className="w-4 h-4 animate-spin" />
                  <span>AI Agent traversing optimization pipeline...</span>
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
                  placeholder="Ask AI Autonomous Agent (e.g. 'What should we optimize first?', 'What is our prediction accuracy?')..."
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500/40"
                />
                <Button type="submit" disabled={!aiInput || isAiThinking} className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold">
                  <Send className="w-4 h-4 mr-1" /> Ask AI Agent
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
