'use client';

import React from 'react';
import {
  Award,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ShieldCheck,
  Zap,
  Activity
} from 'lucide-react';
import { ScorecardDimension } from './review-mock-data';

interface ReviewScorecardProps {
  dimensions: ScorecardDimension[];
  overallGrade: string;
  overallScorePct: number;
}

export function ReviewScorecard({
  dimensions,
  overallGrade,
  overallScorePct,
}: ReviewScorecardProps) {
  return (
    <div className="w-full bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-2xl space-y-6 font-sans select-none">
      {/* Scorecard Hero Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-1 shadow-xl shadow-cyan-500/30">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center font-mono font-black text-2xl text-cyan-300">
              {overallGrade}
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white tracking-tight">AI Architecture Quality Scorecard</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-bold text-xs">
                {overallScorePct}% OVERALL GRADE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Evaluated against AWS Well-Architected, Google SRE, Clean Architecture, and SOLID principles.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-slate-500 text-[10px] uppercase font-bold block">DIMENSIONS</span>
            <span className="text-sm font-black text-cyan-300">{dimensions.length} Evaluated</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-slate-500 text-[10px] uppercase font-bold block">PASSED PILLARS</span>
            <span className="text-sm font-black text-emerald-400">12 / 13</span>
          </div>
        </div>
      </div>

      {/* 13 Dimensions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
        {dimensions.map((dim) => {
          const isImproved = dim.scorePct >= dim.previousScorePct;

          return (
            <div
              key={dim.name}
              className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-cyan-500/40 transition-all space-y-2.5 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs truncate" title={dim.name}>
                  {dim.name}
                </span>
                <span className="text-sm font-black text-cyan-300">{dim.scorePct}%</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800/80">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    dim.scorePct >= 90
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                      : dim.scorePct >= 80
                      ? 'bg-gradient-to-r from-cyan-500 to-indigo-400'
                      : 'bg-gradient-to-r from-amber-500 to-rose-400'
                  }`}
                  style={{ width: `${dim.scorePct}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                <span className="truncate max-w-[170px] text-slate-500">{dim.frameworkPillar}</span>
                <span className={`flex items-center gap-1 font-bold ${isImproved ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isImproved ? <TrendingUp className="w-3 h-3 text-emerald-400" /> : <TrendingDown className="w-3 h-3 text-rose-400" />}
                  {dim.previousScorePct}% ➔ {dim.scorePct}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
