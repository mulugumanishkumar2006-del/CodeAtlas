'use client';

import React from 'react';
import { PreApprovalSimulation } from './review-types';
import { Zap, ShieldCheck, Layers, Clock, Rocket, ArrowRight, CheckCircle2, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReviewSimulationPanelProps {
  simulation: PreApprovalSimulation;
}

export function ReviewSimulationPanel({ simulation }: ReviewSimulationPanelProps) {
  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-purple-500/30 space-y-5 font-sans shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-purple-400" />
          <div>
            <h3 className="text-sm font-bold text-slate-100 font-mono">
              Pre-Approval Simulation Studio
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">
              Predictive Monte Carlo impact simulation before merging pull request
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-extrabold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/40">
          Simulation Active
        </span>
      </div>

      {/* Simulated Key Scores */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        <div className="p-3.5 rounded-xl bg-slate-950 border border-purple-500/30 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Architecture Impact</span>
          <span className="text-lg font-black text-purple-300">{simulation.architectureImpactScore}/100</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Performance Impact</span>
          <span className="text-lg font-black text-cyan-300">{simulation.performanceImpactScore}/100</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Security Impact</span>
          <span className="text-lg font-black text-emerald-300">{simulation.securityImpactScore}/100</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Tech Debt Delta</span>
          <span className="text-lg font-black text-emerald-400">{simulation.techDebtDeltaHours} Hours</span>
        </div>
      </div>

      {/* Side-by-Side Comparison Table */}
      <div className="space-y-2">
        <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
          Side-by-Side System Impact Comparison
        </span>

        <div className="overflow-x-auto rounded-xl border border-slate-800 font-mono text-xs">
          <table className="w-full text-left bg-slate-950">
            <thead className="bg-slate-900 border-b border-slate-800 text-[10px] text-slate-400 uppercase">
              <tr>
                <th className="p-3">Impact Dimension</th>
                <th className="p-3">Current State (Main Branch)</th>
                <th className="p-3">Simulated State (Post-PR Merge)</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {simulation.sideBySideComparison.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-900/50">
                  <td className="p-3 font-bold text-purple-300">{row.dimension}</td>
                  <td className="p-3 text-rose-300 font-sans text-[11px]">{row.beforeState}</td>
                  <td className="p-3 text-emerald-300 font-sans text-[11px] font-bold">{row.afterState}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 w-max">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{row.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
