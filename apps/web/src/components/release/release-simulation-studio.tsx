'use client';

import React from 'react';
import { PreDeploymentDelta } from './release-types';
import { Zap, Layers, ArrowRight, ShieldCheck, Database, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReleaseSimulationStudioProps {
  deltas: PreDeploymentDelta[];
}

export function ReleaseSimulationStudio({ deltas }: ReleaseSimulationStudioProps) {
  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 font-sans shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-purple-400" />
          <h3 className="text-sm font-bold text-slate-100">
            Pre-Deployment Simulation Studio & Delta Comparisons
          </h3>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] bg-purple-500/10 text-purple-300 border border-purple-500/30">
          Monte Carlo Sim
        </span>
      </div>

      <div className="space-y-3 font-mono text-xs">
        {deltas.map((delta, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-sans">
            <div className="flex items-center justify-between font-mono border-b border-slate-900 pb-2">
              <span className="font-bold text-cyan-300 text-xs">{delta.category}</span>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase">
                {delta.impactLevel}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
                <span className="text-[10px] text-rose-400 font-bold uppercase block">Before State:</span>
                <p className="text-slate-300 text-[11px] leading-relaxed font-sans">{delta.beforeState}</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
                <span className="text-[10px] text-emerald-400 font-bold uppercase block">After State (Simulated):</span>
                <p className="text-slate-300 text-[11px] leading-relaxed font-sans">{delta.afterState}</p>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/90 text-slate-300 text-xs font-mono flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Risk Assessment: <strong className="text-slate-100">{delta.riskAssessment}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
