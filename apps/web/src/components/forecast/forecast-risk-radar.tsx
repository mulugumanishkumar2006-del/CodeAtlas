'use client';

import React from 'react';
import { RiskRadarItem } from './forecast-types';
import { ShieldAlert, AlertTriangle, CheckCircle2, Clock, Sparkles, ArrowRight, Activity, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ForecastRiskRadarProps {
  items: RiskRadarItem[];
}

export function ForecastRiskRadar({ items }: ForecastRiskRadarProps) {
  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 font-sans shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-rose-400" />
          <h3 className="text-sm font-bold text-slate-100">
            Interactive Engineering Risk Radar & Predictive Threat Matrix
          </h3>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/30">
          Radar Active
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 hover:border-rose-500/40 transition-colors"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-900 pb-2 font-mono">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border',
                    item.impactLevel === 'CRITICAL'
                      ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                      : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                  )}
                >
                  {item.impactLevel}
                </span>
                <span className="text-xs font-bold text-slate-200">{item.title}</span>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <span>Probability: <strong className="text-rose-400">{item.probabilityPct}%</strong></span>
                <span>• Timeline: <strong className="text-cyan-300">{item.estimatedTimelineDays}d</strong></span>
              </div>
            </div>

            {/* Evidence & Impact */}
            <div className="space-y-1.5 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  Evidence & Signal:
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed font-sans">{item.evidence}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded bg-slate-900/40 border border-slate-800/80">
                  <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase block">Business Impact:</span>
                  <span className="text-slate-300 text-[10px] line-clamp-2">{item.businessImpact}</span>
                </div>
                <div className="p-2 rounded bg-slate-900/40 border border-slate-800/80">
                  <span className="text-[9px] font-mono font-bold text-purple-400 uppercase block">Engineering Impact:</span>
                  <span className="text-slate-300 text-[10px] line-clamp-2">{item.engineeringImpact}</span>
                </div>
              </div>
            </div>

            {/* Recommended Action & Simulation Link */}
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs font-mono">
              <div className="space-y-0.5">
                <span className="text-[9px] font-bold text-cyan-400 uppercase block">Recommended Action:</span>
                <span className="text-slate-200 text-[11px] font-sans font-medium">{item.recommendedAction}</span>
              </div>

              <a
                href={item.simulationLink}
                className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-[10px] text-cyan-300 hover:border-cyan-500/40 flex items-center gap-1 shrink-0 ml-2"
              >
                <span>Simulate</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
