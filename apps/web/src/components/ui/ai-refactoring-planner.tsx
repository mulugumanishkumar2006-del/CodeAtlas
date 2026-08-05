'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Flame,
  Layers,
  Building2,
  Code2,
  Maximize2,
  Minimize2,
  Share2,
  CheckCircle2,
  Play,
  ShieldCheck,
  Zap,
  Filter,
  Wrench
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AiRefactoringRoadmap } from '@/components/ui/ai-refactoring-roadmap';
import { AiRefactoringTradeoffMatrix } from '@/components/ui/ai-refactoring-tradeoff-matrix';
import { AiRefactoringExecutionPlan } from '@/components/ui/ai-refactoring-execution-plan';
import { AiRefactoringAssistant } from '@/components/ui/ai-refactoring-assistant';

const REFACTORING_OPPORTUNITIES = [
  { id: 'opp-1', name: 'God Service (Payment processing router)', category: 'Architecture', debt: '$18.5k/yr', risk: 'HIGH' },
  { id: 'opp-2', name: 'Cyclic Dependency (Payment & Auth module)', category: 'Architecture', debt: '$12.0k/yr', risk: 'HIGH' },
  { id: 'opp-3', name: 'Database Bottleneck (Raw SQL handler locks)', category: 'Performance', debt: '$15.0k/yr', risk: 'CRITICAL' },
  { id: 'opp-4', name: 'Shotgun Surgery (Deprecated Pydantic v1 configs)', category: 'Hygiene', debt: '$4.5k/yr', risk: 'MEDIUM' },
  { id: 'opp-5', name: 'High Coupling (Stripe webhook ingestion)', category: 'Coupling', debt: '$6.2k/yr', risk: 'HIGH' },
  { id: 'opp-6', name: 'Unused / Dead Code (Legacy v1 REST endpoints)', category: 'Hygiene', debt: '$2.0k/yr', risk: 'LOW' },
  { id: 'opp-7', name: 'Improper Layering (Direct DB handles in router)', category: 'Architecture', debt: '$14.0k/yr', risk: 'HIGH' },
  { id: 'opp-8', name: 'Testing Gaps (Auth JWT validator tests)', category: 'Testing', debt: '$3.5k/yr', risk: 'MEDIUM' }
];

export function AIRefactoringPlanner() {
  const [selectedOppId, setSelectedOppId] = useState<string>('opp-1');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isApproved, setIsApproved] = useState<boolean>(false);

  const selectedOpp =
    REFACTORING_OPPORTUNITIES.find((o) => o.id === selectedOppId) || REFACTORING_OPPORTUNITIES[0];

  return (
    <div className={`space-y-8 max-w-7xl mx-auto pb-24 font-sans select-none ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-950 p-6 overflow-y-auto max-w-none' : ''}`}>
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-5 font-mono">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-500 p-0.5 shadow-lg shadow-cyan-950/60">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-white tracking-tight">AI Refactoring Planner</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> HUMAN-IN-THE-LOOP GOVERNANCE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Complete engineering execution plans: what to change, why to change, dependency order, trade-offs, and simulation verification.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={() => setIsFullscreen((p) => !p)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <Button
            onClick={() => setIsApproved(true)}
            disabled={isApproved}
            className={`h-9 px-4 text-xs font-bold font-mono rounded-xl gap-1.5 cursor-pointer shadow-lg ${
              isApproved
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white'
            }`}
          >
            {isApproved ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Sparkles className="w-4 h-4 text-cyan-200" />}
            {isApproved ? 'Refactoring Approved & Merged' : 'Approve Execution Plan'}
          </Button>
        </div>
      </div>

      {/* Automatically Detected Refactoring Opportunities Selector */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800/80 shadow-2xl space-y-4 font-mono">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-2">
            <Flame className="w-3.5 h-3.5 text-amber-400" /> Automatically Detected Refactoring Opportunities
          </span>
          <span className="text-[10px] text-cyan-400 font-bold">8 HIGH ROI TARGETS DETECTED</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
          {REFACTORING_OPPORTUNITIES.map((opp) => {
            const isActive = opp.id === selectedOppId;
            return (
              <button
                key={opp.id}
                onClick={() => setSelectedOppId(opp.id)}
                className={`p-3.5 rounded-2xl border transition-all duration-200 text-left space-y-1 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 border-cyan-500/50 text-white shadow-lg'
                    : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-amber-400 uppercase">{opp.category}</span>
                  <span className="text-emerald-400 font-bold">{opp.debt}</span>
                </div>
                <div className="font-bold text-xs leading-snug truncate">{opp.name}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. INTERACTIVE 6-STEP VISUAL REFACTORING ROADMAP */}
      <AiRefactoringRoadmap />

      {/* 2. AI TRADE-OFF ANALYSIS & DIGITAL TWIN SIMULATION COMPARISON */}
      <AiRefactoringTradeoffMatrix />

      {/* 3. DETAILED AI EXECUTION PLAN & CODE EVIDENCE */}
      <AiRefactoringExecutionPlan />

      {/* 4. LIVE EXECUTION PROGRESS & ADVISORY ASSISTANT */}
      <AiRefactoringAssistant />
    </div>
  );
}
