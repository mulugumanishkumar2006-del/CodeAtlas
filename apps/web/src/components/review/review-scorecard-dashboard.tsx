'use client';

import React from 'react';
import { ReviewScorecard } from './review-types';
import { ShieldCheck, Zap, Layers, CheckCircle2, AlertTriangle, FileCode2, Sparkles, TrendingUp, Clock, Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReviewScorecardDashboardProps {
  scorecard: ReviewScorecard;
}

export function ReviewScorecardDashboard({ scorecard }: ReviewScorecardDashboardProps) {
  const dimensions = [
    { label: 'Architecture Score', score: scorecard.architectureScore, icon: Layers, color: 'text-purple-400', border: 'border-purple-500/30' },
    { label: 'Security Score', score: scorecard.securityScore, icon: ShieldCheck, color: 'text-emerald-400', border: 'border-emerald-500/30' },
    { label: 'Performance Score', score: scorecard.performanceScore, icon: Zap, color: 'text-cyan-400', border: 'border-cyan-500/30' },
    { label: 'Maintainability Score', score: scorecard.maintainabilityScore, icon: CheckCircle2, color: 'text-indigo-400', border: 'border-indigo-500/30' },
    { label: 'Documentation Score', score: scorecard.documentationScore, icon: FileCode2, color: 'text-amber-400', border: 'border-amber-500/30' },
    { label: 'Test Quality Score', score: scorecard.testQualityScore, icon: Sparkles, color: 'text-rose-400', border: 'border-rose-500/30' },
  ];

  return (
    <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5 font-sans select-none shadow-xl">
      {/* Top Header & Readiness Gauge */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-4">
          {/* Main Overall Rating Circle */}
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex flex-col items-center justify-center font-mono">
              <span className="text-xl font-black text-white leading-none">{scorecard.overallScore}</span>
              <span className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">/ 100</span>
            </div>
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              Staff AI Code Review Scorecard
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                Live Audit
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Automated repository-aware review evaluating intent, architecture, security, and performance.
            </p>
          </div>
        </div>

        {/* Deployment Readiness & Tech Debt Badge */}
        <div className="flex items-center gap-3 font-mono">
          <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30 flex items-center gap-2">
            <Rocket className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="text-[9px] text-slate-400 uppercase font-bold block">Deployment Readiness</span>
              <span className="text-xs font-black text-emerald-400">{scorecard.deploymentReadiness}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-cyan-500/30 flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <div>
              <span className="text-[9px] text-slate-400 uppercase font-bold block">Tech Debt Impact</span>
              <span className="text-xs font-black text-cyan-300">{scorecard.techDebtImpactHours}h Refactored</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of 6 Dimension Scores */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono">
        {dimensions.map((dim, idx) => {
          const Icon = dim.icon;
          return (
            <div
              key={idx}
              className={cn(
                'p-3 rounded-xl bg-slate-950/80 border transition-colors flex flex-col justify-between space-y-2',
                dim.border
              )}
            >
              <div className="flex items-center justify-between text-xs text-slate-400">
                <Icon className={cn('w-4 h-4', dim.color)} />
                <span className="font-bold text-slate-200">{dim.score}%</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-300 block truncate">{dim.label}</span>
                <div className="w-full h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
                  <div
                    className={cn('h-full rounded-full transition-all duration-500', dim.color.replace('text-', 'bg-'))}
                    style={{ width: `${dim.score}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
