'use client';

import React, { useState } from 'react';
import { PredictiveTrendPoint } from './forecast-types';
import { LineChart, TrendingUp, Clock, Zap, DollarSign, Activity, Layers, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ForecastPredictiveTrendsProps {
  trends: PredictiveTrendPoint[];
}

export function ForecastPredictiveTrends({ trends }: ForecastPredictiveTrendsProps) {
  const [selectedHorizon, setSelectedHorizon] = useState<string>('1 Year');

  const activePoint = trends.find((t) => t.timeHorizon === selectedHorizon) || trends[4];

  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 font-sans shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono">
        <div className="flex items-center gap-2">
          <LineChart className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-bold text-slate-100">
            Multi-Year Predictive Trend Forecasting & Future Time Machine
          </h3>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
          Time Horizon Slider
        </span>
      </div>

      {/* Time Horizon Selector */}
      <div className="space-y-2 font-mono text-xs">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          Select Predictive Time Horizon
        </span>
        <div className="flex flex-wrap gap-2">
          {trends.map((t) => (
            <button
              key={t.timeHorizon}
              onClick={() => setSelectedHorizon(t.timeHorizon)}
              className={cn(
                'px-3.5 py-1.5 rounded-xl border transition-all text-xs font-bold',
                selectedHorizon === t.timeHorizon
                  ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/10 text-cyan-300 border-cyan-500/40 shadow-md'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              )}
            >
              {t.timeHorizon}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Horizon Predictive Snapshot Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Engineering Health Score</span>
          <span className="text-xl font-black text-emerald-400">{activePoint.healthScore}%</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Cloud Infrastructure Cost</span>
          <span className="text-xl font-black text-rose-400">${activePoint.cloudCostUsd.toLocaleString()} / mo</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">QPS Traffic Capacity</span>
          <span className="text-xl font-black text-cyan-300">{activePoint.qpsCapacity.toLocaleString()} QPS</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Microservices Count</span>
          <span className="text-xl font-black text-purple-300">{activePoint.microservicesCount} Microservices</span>
        </div>
      </div>
    </div>
  );
}
