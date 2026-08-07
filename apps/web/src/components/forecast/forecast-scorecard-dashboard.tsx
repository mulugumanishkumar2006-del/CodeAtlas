'use client';

import React from 'react';
import { ForecastScorecard } from './forecast-types';
import { Sparkles, TrendingUp, ShieldCheck, Zap, Layers, Clock, Activity, DollarSign, Rocket, LineChart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ForecastScorecardDashboardProps {
  scorecard: ForecastScorecard;
}

export function ForecastScorecardDashboard({ scorecard }: ForecastScorecardDashboardProps) {
  const metrics = [
    { label: 'Engineering Health Forecast', value: `${scorecard.engineeringHealthScore}%`, icon: Activity, color: 'text-emerald-400', border: 'border-emerald-500/30', sub: 'Projected 94% (Improving)' },
    { label: 'Architecture Stability', value: `${scorecard.architectureStabilityScore}%`, icon: Layers, color: 'text-purple-400', border: 'border-purple-500/30', sub: '0 Bypasses (Clean Hexagonal)' },
    { label: 'Tech Debt Forecast', value: `+${scorecard.techDebtAccumulationHours}h`, icon: Clock, color: 'text-indigo-400', border: 'border-indigo-500/30', sub: '-18h Refactored in PR #482' },
    { label: 'Repo Growth Forecast', value: `+${(scorecard.repositoryGrowthLoc / 1000).toFixed(1)}k LOC`, icon: LineChart, color: 'text-cyan-400', border: 'border-cyan-500/30', sub: '6 Microservices Projected' },
    { label: 'Security Risk Forecast', value: `${scorecard.securityRiskCount} CVEs`, icon: ShieldCheck, color: 'text-emerald-400', border: 'border-emerald-500/30', sub: 'PyYAML patch required (14d)' },
    { label: 'Performance P95 Trend', value: `${scorecard.performanceP95Ms} ms`, icon: Zap, color: 'text-cyan-400', border: 'border-cyan-500/30', sub: '-92% Latency Drop' },
    { label: 'Deployment Success', value: `${scorecard.deploymentSuccessPct}%`, icon: Rocket, color: 'text-emerald-400', border: 'border-emerald-500/30', sub: 'LOW Deployment Risk' },
    { label: 'Developer Productivity', value: `+${scorecard.developerProductivityGainPct}%`, icon: Sparkles, color: 'text-amber-400', border: 'border-amber-500/30', sub: 'AI Refactoring Active' },
    { label: 'Maintenance Cost', value: `$${(scorecard.maintenanceCostMonthlyUsd / 1000).toFixed(1)}k / mo`, icon: DollarSign, color: 'text-rose-400', border: 'border-rose-500/30', sub: 'EKS + Provisioned RDS' },
    { label: 'Complexity Score', value: `${scorecard.repositoryComplexityScore}`, icon: TrendingUp, color: 'text-purple-400', border: 'border-purple-500/30', sub: 'Cyclomatic Score Optimal' },
  ];

  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 font-sans select-none shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <h2 className="text-sm font-bold text-slate-100">
            10-Dimension AI Predictive Engineering Scorecard
          </h2>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
          Continuous AI Forecasting
        </span>
      </div>

      {/* 10 Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div
              key={idx}
              className={cn(
                'p-3.5 rounded-xl bg-slate-950/80 border transition-all space-y-1.5 hover:border-cyan-500/40',
                m.border
              )}
            >
              <div className="flex items-center justify-between text-xs text-slate-400">
                <Icon className={cn('w-4 h-4', m.color)} />
                <span className="font-extrabold text-slate-100 text-sm">{m.value}</span>
              </div>
              <span className="text-[10px] font-bold text-slate-300 block truncate leading-tight">{m.label}</span>
              <span className="text-[9px] text-slate-500 block truncate font-sans">{m.sub}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
