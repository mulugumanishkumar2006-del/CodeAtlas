'use client';

import React from 'react';
import { EnterpriseScenarioItem } from './esl-types';
import { Layers, Activity, ShieldCheck, DollarSign, Sparkles, CheckCircle2, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EslCommandCenterProps {
  scenarios: EnterpriseScenarioItem[];
  selectedScenarioId: string;
  onSelectScenario: (scenario: EnterpriseScenarioItem) => void;
}

export function EslCommandCenter({ scenarios, selectedScenarioId, onSelectScenario }: EslCommandCenterProps) {
  const activeScenario = scenarios.find((s) => s.id === selectedScenarioId) || scenarios[0];

  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 font-sans shadow-xl">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3 font-mono">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          <h2 className="text-sm font-bold text-slate-100">
            Enterprise Scenario Laboratory & Decision Intelligence Scorecard
          </h2>
        </div>

        <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono">
          AI Decision Engine Active
        </span>
      </div>

      {/* Primary Scorecard Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Architecture Health:</span>
          <span className="text-sm font-black text-emerald-400">94.0%</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Business ROI:</span>
          <span className="text-sm font-black text-cyan-300">4.8x ROI</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Team Velocity:</span>
          <span className="text-sm font-black text-purple-300">+35% Speedup</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">AI Confidence:</span>
          <span className="text-sm font-black text-emerald-400">98.4%</span>
        </div>
      </div>

      {/* Scenario List */}
      <div className="space-y-3 font-mono text-xs">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          Select Engineering Strategy Scenario:
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {scenarios.map((scen) => (
            <div
              key={scen.id}
              onClick={() => onSelectScenario(scen)}
              className={cn(
                'p-4 rounded-xl border transition-all cursor-pointer space-y-2',
                selectedScenarioId === scen.id
                  ? 'bg-slate-950 border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              )}
            >
              <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                <span className="font-bold text-xs text-slate-100">{scen.name}</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-500/10 text-purple-300 uppercase">
                  {scen.category}
                </span>
              </div>

              <p className="text-[11px] text-slate-400 font-sans leading-snug">{scen.description}</p>

              <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
                <span>P95 Latency: <strong className="text-cyan-300">{scen.p95LatencyMs} ms</strong></span>
                <span>ROI: <strong className="text-emerald-400">{scen.roiMultiplier}x</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
