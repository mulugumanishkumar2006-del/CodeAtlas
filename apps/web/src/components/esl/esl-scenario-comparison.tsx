'use client';

import React from 'react';
import { EnterpriseScenarioItem } from './esl-types';
import { Layers, CheckCircle2, Sparkles, Activity } from 'lucide-react';

interface EslScenarioComparisonProps {
  scenarios: EnterpriseScenarioItem[];
}

export function EslScenarioComparison({ scenarios }: EslScenarioComparisonProps) {
  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 font-sans shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-slate-100">
            Side-by-Side Multi-Scenario Architecture Matrix
          </h3>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono">
          Decision Matrix
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        {scenarios.map((scen) => (
          <div key={scen.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-900 pb-2">
              <span className="font-bold text-slate-100 text-xs">{scen.name}</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-bold">
                ROI: {scen.roiMultiplier}x
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
              <div>Tech Score: <strong className="text-emerald-400">{scen.technicalScore}/100</strong></div>
              <div>Business Score: <strong className="text-cyan-300">{scen.businessScore}/100</strong></div>
              <div>Monthly Cost: <strong className="text-slate-200">${scen.monthlyCostUsd.toLocaleString()}/mo</strong></div>
              <div>P95 Latency: <strong className="text-purple-300">{scen.p95LatencyMs} ms</strong></div>
            </div>

            <p className="text-slate-300 font-sans text-xs pt-1 border-t border-slate-900 leading-relaxed">
              {scen.aiRecommendationNote}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
