'use client';

import React, { useState } from 'react';
import { ArchitectureScenario } from './evo-types';
import { Layers, Sparkles, ShieldCheck, DollarSign, Clock, Zap, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EvoMultiScenarioMatrixProps {
  scenarios: ArchitectureScenario[];
}

export function EvoMultiScenarioMatrix({ scenarios }: EvoMultiScenarioMatrixProps) {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('scenario-c');

  const activeScenario = scenarios.find((s) => s.id === selectedScenarioId) || scenarios[2];

  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 font-sans shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3 font-mono">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          <h2 className="text-sm font-bold text-slate-100">
            Multi-Scenario Architectural Comparison Lab (Scenarios A - F)
          </h2>
        </div>

        <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono">
          Simultaneous 6-Scenario Prediction
        </span>
      </div>

      {/* 6 Scenario Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono">
        {scenarios.map((sc) => (
          <div
            key={sc.id}
            onClick={() => setSelectedScenarioId(sc.id)}
            className={cn(
              'p-4 rounded-xl border transition-all cursor-pointer space-y-2',
              selectedScenarioId === sc.id
                ? 'bg-slate-950 border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            )}
          >
            <div className="flex items-center justify-between border-b border-slate-900 pb-2">
              <span className="font-bold text-xs text-slate-100">{sc.name}</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-cyan-500/10 text-cyan-400 uppercase">
                {sc.badge}
              </span>
            </div>

            <p className="text-[11px] text-slate-400 font-sans leading-snug">{sc.description}</p>

            <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
              <div>
                <span className="text-slate-500 block">AI Score:</span>
                <strong className="text-cyan-300 font-bold">{sc.aiRecommendationScore}/100</strong>
              </div>
              <div>
                <span className="text-slate-500 block">P95 Latency:</span>
                <strong className="text-emerald-400 font-bold">{sc.p95LatencyMs} ms</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Infra Cost:</span>
                <strong className="text-slate-200 font-bold">${sc.monthlyCostUsd}/mo</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Tech Debt:</span>
                <strong className="text-amber-400 font-bold">{sc.techDebtHours} Hours</strong>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Scenario Inspector */}
      {activeScenario && (
        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-sans text-xs">
          <div className="flex items-center justify-between border-b border-slate-900 pb-2 font-mono">
            <span className="font-bold text-cyan-300 text-xs flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>{activeScenario.name} Inspector</span>
            </span>

            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
              Health: {activeScenario.healthScore}%
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800 font-mono text-xs space-y-1">
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
              AI Prediction Reasoning:
            </span>
            <p className="text-slate-200 text-xs font-sans leading-relaxed">{activeScenario.aiReasoning}</p>
          </div>
        </div>
      )}
    </div>
  );
}
