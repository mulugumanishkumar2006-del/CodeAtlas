'use client';

import React from 'react';
import { FinOpsCommandMetrics, CostCategoryBreakdown } from './finops-types';
import { DollarSign, Activity, Cpu, HardDrive, Zap, ShieldCheck, Sparkles, PieChart } from 'lucide-react';

interface FinOpsCommandCenterProps {
  metrics: FinOpsCommandMetrics;
  costBreakdowns: CostCategoryBreakdown[];
}

export function FinOpsCommandCenter({ metrics, costBreakdowns }: FinOpsCommandCenterProps) {
  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 font-sans shadow-xl">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3 font-mono">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-emerald-400" />
          <h2 className="text-sm font-bold text-slate-100">
            Performance Command Center & Cloud FinOps Cost Intelligence
          </h2>
        </div>

        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
          AWS + GCP + Azure FinOps Active
        </span>
      </div>

      {/* Primary Scorecards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Performance Score:</span>
          <span className="text-sm font-black text-cyan-300">{metrics.overallPerformanceScore}/100</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Monthly Cloud Cost:</span>
          <span className="text-sm font-black text-emerald-400">${(metrics.monthlyCostUsd / 1000).toFixed(1)}k / mo</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Estimated Annual:</span>
          <span className="text-sm font-black text-slate-100">${(metrics.annualCostUsd / 1000).toFixed(1)}k / yr</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Sustainability Index:</span>
          <span className="text-sm font-black text-purple-300">{metrics.sustainabilityScorePct}%</span>
        </div>
      </div>

      {/* Cost Category Breakdown List */}
      <div className="space-y-3 font-mono text-xs">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1.5">
          <PieChart className="w-3.5 h-3.5 text-emerald-400" />
          <span>Infrastructure Cost Breakdown per Category:</span>
        </span>

        <div className="space-y-2">
          {costBreakdowns.map((item, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-100">{item.category}</span>
                <span className="text-emerald-400 font-bold">${item.monthlyCostUsd}/mo ({item.percentageOfTotal}%)</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                <div className="h-full bg-emerald-400" style={{ width: `${item.percentageOfTotal}%` }} />
              </div>
              <p className="text-[10px] text-slate-400 font-sans pt-0.5">{item.recommendationNote}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
