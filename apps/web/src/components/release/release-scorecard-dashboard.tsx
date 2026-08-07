'use client';

import React from 'react';
import { ReleaseScorecard } from './release-types';
import { Rocket, ShieldCheck, Zap, Layers, Clock, CheckCircle2, Sparkles, RefreshCw, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReleaseScorecardDashboardProps {
  scorecard: ReleaseScorecard;
  onOpenAdvisor: () => void;
}

export function ReleaseScorecardDashboard({
  scorecard,
  onOpenAdvisor,
}: ReleaseScorecardDashboardProps) {
  const scoreMetrics = [
    { label: 'Architecture Health', value: `${scorecard.architectureHealthPct}%`, icon: Layers, color: 'text-purple-400', border: 'border-purple-500/30' },
    { label: 'Security Readiness', value: `${scorecard.securityReadinessPct}%`, icon: ShieldCheck, color: 'text-emerald-400', border: 'border-emerald-500/30' },
    { label: 'Performance P95', value: `${scorecard.performancePredictionMs} ms`, icon: Zap, color: 'text-cyan-400', border: 'border-cyan-500/30' },
    { label: 'Tech Debt Impact', value: `${scorecard.techDebtDeltaHours} h`, icon: Clock, color: 'text-indigo-400', border: 'border-indigo-500/30' },
    { label: 'Rollback Confidence', value: `${scorecard.rollbackConfidencePct}%`, icon: RefreshCw, color: 'text-amber-400', border: 'border-amber-500/30' },
    { label: 'Overall AI Confidence', value: `${scorecard.overallAiConfidencePct}%`, icon: Sparkles, color: 'text-rose-400', border: 'border-rose-500/30' },
  ];

  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 font-sans select-none shadow-xl">
      {/* Top Header & Readiness Circle */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-600 p-0.5 shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex flex-col items-center justify-center font-mono">
              <span className="text-xl font-black text-white leading-none">{scorecard.readinessScore}</span>
              <span className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">/ 100</span>
            </div>
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              AI Release Readiness Scorecard
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                RECOMMENDED DEPLOY
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Multi-subsystem pre-deployment evaluation across architecture, security, performance, and rollback risks.
            </p>
          </div>
        </div>

        {/* Deployment Risk & AI Advisor Launcher */}
        <div className="flex items-center gap-3 font-mono">
          <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30 flex items-center gap-2">
            <Rocket className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="text-[9px] text-slate-400 uppercase font-bold block">Deployment Risk</span>
              <span className="text-xs font-black text-emerald-400">{scorecard.deploymentRisk} RISK</span>
            </div>
          </div>

          <button
            onClick={onOpenAdvisor}
            className="px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-cyan-950/50 flex items-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4 text-cyan-300" />
            <span>Ask AI Deployment Advisor</span>
          </button>
        </div>
      </div>

      {/* Grid of 6 Scorecard Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono">
        {scoreMetrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div
              key={idx}
              className={cn(
                'p-3 rounded-xl bg-slate-950/80 border transition-colors flex flex-col justify-between space-y-2',
                m.border
              )}
            >
              <div className="flex items-center justify-between text-xs text-slate-400">
                <Icon className={cn('w-4 h-4', m.color)} />
                <span className="font-bold text-slate-200">{m.value}</span>
              </div>
              <span className="text-[10px] font-bold text-slate-300 block truncate">{m.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
