'use client';

import React from 'react';
import { MultiCloudProviderProfile } from './cloud-types';
import { Cloud, CheckCircle2, Sparkles, ShieldCheck, Zap, DollarSign } from 'lucide-react';

interface CloudMultiComparisonProps {
  profiles: MultiCloudProviderProfile[];
}

export function CloudMultiComparison({ profiles }: CloudMultiComparisonProps) {
  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 font-sans shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono">
        <div className="flex items-center gap-2">
          <Cloud className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-slate-100">
            Multi-Cloud Provider Architecture Comparison Lab
          </h3>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono">
          AWS vs GCP vs Azure vs Hybrid
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        {profiles.map((prof, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-900 pb-2">
              <span className="font-bold text-slate-100 text-xs">{prof.provider}</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                AI Score: {prof.aiRecommendationScore}/100
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
              <div>Est. Monthly: <strong className="text-emerald-400">${prof.monthlyCostEstimateUsd.toLocaleString()}/mo</strong></div>
              <div>P95 Latency: <strong className="text-cyan-300">{prof.p95LatencyMs} ms</strong></div>
              <div>Availability SLA: <strong className="text-slate-200">{prof.availabilitySla}</strong></div>
              <div>Complexity: <strong className="text-purple-300">{prof.operationalComplexity}</strong></div>
            </div>

            <p className="text-slate-300 font-sans text-xs pt-1 border-t border-slate-900 leading-relaxed">
              {prof.keyBenefits}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
