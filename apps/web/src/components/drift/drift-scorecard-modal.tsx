'use client';

import React from 'react';
import {
  Sparkles,
  Flame,
  AlertTriangle,
  CheckCircle2,
  Focus,
  X,
  TrendingDown,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  MOCK_SCORECARD_METRICS,
  MOCK_DRIFT_RECOMMENDATIONS
} from './drift-mock-data';

interface DriftScorecardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFocusNode: (nodeId: string) => void;
}

export function DriftScorecardModal({
  isOpen,
  onClose,
  onFocusNode,
}: DriftScorecardModalProps) {
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
                <h2 className="text-xl font-black text-white tracking-tight">AI Architecture Scorecard & Refactoring Plan</h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold">
                  DRIFT SCORE: 78/100
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Continuous evaluation of architecture stability, coupling, maintainability, and domain isolation.
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

        {/* Scorecard Metrics Grid */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 scrollbar-none font-mono">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {MOCK_SCORECARD_METRICS.map((metric) => (
              <div key={metric.dimension} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-400">{metric.dimension}</span>
                  <span className="text-sm font-black text-white">{metric.currentScore}%</span>
                </div>
                <p className="text-[11px] text-slate-300 font-sans leading-relaxed">{metric.analysis}</p>
              </div>
            ))}
          </div>

          {/* Recommendations List */}
          <div className="pt-4 border-t border-slate-800/80 space-y-3 font-sans">
            <h3 className="text-sm font-black text-white uppercase tracking-wider font-mono">
              Prioritized Architecture Refactoring Actions
            </h3>
            {MOCK_DRIFT_RECOMMENDATIONS.map((rec) => (
              <div key={rec.id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-mono font-bold">
                    {rec.priority}
                  </span>
                  <Button
                    onClick={() => {
                      if (rec.affectedNodes.length > 0) onFocusNode(rec.affectedNodes[0]);
                      onClose();
                    }}
                    className="bg-cyan-500/15 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-500/40 font-bold text-xs gap-1.5 h-7 rounded-xl"
                  >
                    <Focus className="w-3.5 h-3.5" /> Highlight Graph
                  </Button>
                </div>
                <h4 className="text-xs font-bold text-white">{rec.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{rec.suggestedAction}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
