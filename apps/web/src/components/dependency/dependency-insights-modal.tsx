'use client';

import React from 'react';
import {
  Sparkles,
  Flame,
  AlertTriangle,
  CheckCircle2,
  Focus,
  X,
  ShieldAlert,
  Zap,
  Code2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DependencyAiInsight, MOCK_DEP_AI_INSIGHTS } from './dependency-mock-data';

interface DependencyInsightsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFocusNodes: (nodeIds: string[]) => void;
}

export function DependencyInsightsModal({
  isOpen,
  onClose,
  onFocusNodes,
}: DependencyInsightsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto font-sans">
      <div className="w-full max-w-4xl bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 animate-in zoom-in-95 duration-150 relative">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white tracking-tight">AI Dependency Refactoring & Insights</h2>
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-mono font-bold">
                  {MOCK_DEP_AI_INSIGHTS.length} ISSUES
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Proactive detection of high fan-out bottlenecks, circular loops, and outdated library dependencies.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Insights Grid */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 scrollbar-none font-mono">
          {MOCK_DEP_AI_INSIGHTS.map((insight) => (
            <div
              key={insight.id}
              className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold uppercase">
                    {insight.severity} SEVERITY
                  </span>
                  <span className="text-xs font-bold text-cyan-400">{insight.category}</span>
                </div>

                <Button
                  onClick={() => {
                    onFocusNodes(insight.affectedNodes);
                    onClose();
                  }}
                  className="bg-cyan-500/15 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-500/40 font-bold text-xs gap-1.5 h-7 rounded-xl"
                >
                  <Focus className="w-3.5 h-3.5" /> Focus Canvas
                </Button>
              </div>

              <h4 className="text-sm font-bold text-white font-sans">{insight.title}</h4>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">{insight.evidence}</p>

              <div className="flex items-start gap-2 text-xs font-sans text-emerald-300 bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-500/30">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold block">Refactoring Action Plan ({insight.estimatedEffortHours} hrs):</span>
                  <span>{insight.refactoringPlan}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
