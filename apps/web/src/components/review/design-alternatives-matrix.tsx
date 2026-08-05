'use client';

import React from 'react';
import {
  Sparkles,
  FlaskConical,
  CheckCircle2,
  XCircle,
  Zap,
  ArrowRight,
  ShieldCheck,
  Clock,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ReviewFinding, DesignOption } from './review-mock-data';

interface DesignAlternativesMatrixProps {
  finding: ReviewFinding;
  onSimulateOption: (findingId: string, optionName: string) => void;
}

export function DesignAlternativesMatrix({ finding, onSimulateOption }: DesignAlternativesMatrixProps) {
  return (
    <div className="w-full bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-2xl space-y-6 font-sans select-none">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-mono font-bold">
                {finding.severity} SEVERITY
              </span>
              <span className="text-xs font-mono text-cyan-400 font-bold">{finding.category}</span>
            </div>
            <h3 className="text-base font-black text-white tracking-tight mt-0.5">
              3-Option Design Alternatives: {finding.title}
            </h3>
          </div>
        </div>
      </div>

      {/* 3-Option Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        {finding.designOptions.map((opt) => (
          <div
            key={opt.optionName}
            className={`p-5 rounded-2xl bg-slate-950/90 border flex flex-col justify-between space-y-4 transition-all hover:border-cyan-500/50 shadow-xl ${
              opt.optionName.includes('Recommended')
                ? 'border-cyan-500/50 ring-2 ring-cyan-500/30 bg-slate-900/90'
                : 'border-slate-800/80'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold">
                  {opt.optionName}
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">
                  -{opt.riskReductionPct}% Risk
                </span>
              </div>

              <h4 className="text-sm font-bold text-white font-sans leading-snug">{opt.title}</h4>
              <p className="text-[11px] text-slate-300 font-sans leading-relaxed">{opt.description}</p>

              {/* Pros */}
              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-[11px] font-sans space-y-1">
                <span className="font-mono text-[10px] font-bold text-emerald-400 uppercase block">Advantages (+)</span>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  {opt.advantages.map((adv, idx) => (
                    <li key={idx}>{adv}</li>
                  ))}
                </ul>
              </div>

              {/* Cons */}
              <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30 text-[11px] font-sans space-y-1">
                <span className="font-mono text-[10px] font-bold text-rose-400 uppercase block">Disadvantages (-)</span>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  {opt.disadvantages.map((dis, idx) => (
                    <li key={idx}>{dis}</li>
                  ))}
                </ul>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 pt-1">
                <div>
                  <span>Effort: </span>
                  <strong className="text-amber-300">{opt.effortHours} hrs</strong>
                </div>
                <div>
                  <span>Complexity: </span>
                  <strong className="text-slate-200">{opt.complexity}</strong>
                </div>
              </div>
            </div>

            <Button
              onClick={() => onSimulateOption(finding.id, opt.optionName)}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs gap-1.5 rounded-xl h-9 shadow-lg mt-3"
            >
              <FlaskConical className="w-3.5 h-3.5" /> Simulate {opt.optionName.split(' ')[0]}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
