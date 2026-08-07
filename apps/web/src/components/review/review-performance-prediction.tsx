'use client';

import React from 'react';
import { PerformancePrediction } from './review-types';
import { Zap, TrendingUp, ArrowRight, Gauge, Cpu, Activity, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReviewPerformancePredictionProps {
  predictions: PerformancePrediction[];
}

export function ReviewPerformancePrediction({ predictions }: ReviewPerformancePredictionProps) {
  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 font-sans shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-slate-100 font-mono">
            AI Performance Prediction & Before/After Latency Analysis
          </h3>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
          Predictive Benchmarking
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
        {predictions.map((pred, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between hover:border-cyan-500/40 transition-colors"
          >
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-200 block">{pred.metric}</span>
              <span className="text-[10px] text-slate-400 font-sans block line-clamp-2">{pred.explanation}</span>
            </div>

            {/* Before vs After Visual Comparison */}
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Before Change:</span>
                <span className="font-bold text-rose-400">{pred.beforeValue} {pred.unit}</span>
              </div>
              <div className="flex items-center justify-between font-bold text-emerald-400">
                <span>After (Predicted):</span>
                <span>{pred.afterValue} {pred.unit}</span>
              </div>
              <div className="pt-1 border-t border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Delta Impact:</span>
                <span className={cn('font-black', pred.isImprovement ? 'text-emerald-400' : 'text-rose-400')}>
                  {pred.changePct > 0 ? `+${pred.changePct}%` : `${pred.changePct}%`}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
