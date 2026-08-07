'use client';

import React, { useState } from 'react';
import { FinOpsCommandCenter } from './finops-command-center';
import { FinOpsTrafficSimulator } from './finops-traffic-simulator';
import { FinOpsAiOptimizations } from './finops-ai-optimizations';
import { FinOpsWhatIfScenarios } from './finops-what-if-scenarios';
import {
  MOCK_COMMAND_METRICS,
  MOCK_WORKLOAD_SIMULATIONS,
  MOCK_COST_BREAKDOWNS,
  MOCK_FINOPS_RECOMMENDATIONS,
  MOCK_WHAT_IF_FINOPS,
} from './finops-mock-data';
import { DollarSign, Activity, Sparkles, PieChart } from 'lucide-react';
import { cn } from '@/lib/utils';

export function FinOpsWorkspaceContainer() {
  const [activeTab, setActiveTab] = useState<'center' | 'workload' | 'optimizations' | 'whatif'>('center');

  return (
    <div className="flex flex-col h-screen w-full bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Top Header */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 shrink-0 font-mono">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-emerald-400" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-black text-slate-100 tracking-tight leading-none">
                AI Performance & Infrastructure Cost Simulator
              </h1>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Cloud FinOps & Performance Command Center
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-sans mt-0.5">
              Predict engineering performance, cloud resource utilization, scalability limits, and operational cost deltas before production deployment.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          {[
            { id: 'center', label: 'Command Center & Cost Breakdown', icon: DollarSign },
            { id: 'workload', label: 'Workload Scaling Simulator', icon: Activity },
            { id: 'optimizations', label: 'AI FinOps Optimizations', icon: Sparkles },
            { id: 'whatif', label: 'What-If FinOps Assistant', icon: PieChart },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  'px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5',
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-200 border-emerald-500/30 font-bold shadow-md'
                    : 'bg-transparent text-slate-400 border-transparent hover:text-slate-200'
                )}
              >
                <Icon className="w-3.5 h-3.5 text-emerald-400" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Workspace */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
        {activeTab === 'center' && (
          <FinOpsCommandCenter metrics={MOCK_COMMAND_METRICS} costBreakdowns={MOCK_COST_BREAKDOWNS} />
        )}

        {activeTab === 'workload' && <FinOpsTrafficSimulator simulations={MOCK_WORKLOAD_SIMULATIONS} />}

        {activeTab === 'optimizations' && (
          <FinOpsAiOptimizations recommendations={MOCK_FINOPS_RECOMMENDATIONS} />
        )}

        {activeTab === 'whatif' && <FinOpsWhatIfScenarios qaEntries={MOCK_WHAT_IF_FINOPS} />}
      </div>
    </div>
  );
}
