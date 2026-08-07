'use client';

import React from 'react';
import { ServiceRiskNode } from './release-types';
import { Layers, ShieldCheck, AlertTriangle, Activity, ArrowRight, Network } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReleaseRiskHeatmapProps {
  nodes: ServiceRiskNode[];
}

export function ReleaseRiskHeatmap({ nodes }: ReleaseRiskHeatmapProps) {
  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 font-sans shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-bold text-slate-100">
            Service Deployment Risk Heatmap & Failure Propagation Analysis
          </h3>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
          Risk Heatmap Active
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans">
        {nodes.map((node) => {
          const isLowRisk = node.riskLevel === 'LOW';

          return (
            <div
              key={node.serviceId}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 hover:border-cyan-500/40 transition-colors"
            >
              <div className="flex items-center justify-between font-mono border-b border-slate-900 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-slate-100">{node.serviceName}</span>
                </div>
                <span
                  className={cn(
                    'px-2 py-0.5 rounded text-[10px] font-bold uppercase border',
                    isLowRisk ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                  )}
                >
                  Risk Score: {node.riskScore}/100
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  Failure Propagation Impact:
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed font-sans">{node.failurePropagationImpact}</p>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                <span>Tier: <strong className="text-purple-300 uppercase">{node.tier}</strong></span>
                <span>Status: <strong className="text-emerald-400">{node.status}</strong></span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
