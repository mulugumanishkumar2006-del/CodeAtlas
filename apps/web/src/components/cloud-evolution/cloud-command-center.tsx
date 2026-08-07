'use client';

import React from 'react';
import { CloudCommandMetrics } from './cloud-types';
import { Server, Activity, Cpu, HardDrive, ShieldCheck, Sparkles, CheckCircle2, RefreshCw } from 'lucide-react';

interface CloudCommandCenterProps {
  metrics: CloudCommandMetrics;
}

export function CloudCommandCenter({ metrics }: CloudCommandCenterProps) {
  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 font-sans shadow-xl">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3 font-mono">
        <div className="flex items-center gap-2">
          <Server className="w-5 h-5 text-cyan-400" />
          <h2 className="text-sm font-bold text-slate-100">
            Cloud Infrastructure & Kubernetes Operations Command Center
          </h2>
        </div>

        <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono">
          AWS EKS + Istio + ArgoCD Active
        </span>
      </div>

      {/* Primary Scorecard Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Cluster Health:</span>
          <span className="text-sm font-black text-emerald-400">{metrics.clusterHealthPct}%</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Running Pods:</span>
          <span className="text-sm font-black text-cyan-300">{metrics.runningPodsCount} Pods ({metrics.crashLoopBackOffCount} Crashes)</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Security Score:</span>
          <span className="text-sm font-black text-purple-300">{metrics.securityScore}/100</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Availability SLA:</span>
          <span className="text-sm font-black text-emerald-400">{metrics.availabilityPct}%</span>
        </div>
      </div>

      {/* Service Mesh & GitOps Telemetry */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
        <div className="flex justify-between items-center border-b border-slate-900 pb-2">
          <span className="font-bold text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Service Mesh & GitOps Telemetry</span>
          </span>
          <span className="text-cyan-300 font-bold text-[10px]">Optimization Score: {metrics.aiOptimizationScorePct}%</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase block">Service Mesh Security:</span>
            <span className="text-emerald-400 text-[11px] font-sans font-bold">{metrics.serviceMeshMtlsStatus}</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase block">GitOps Sync State:</span>
            <span className="text-cyan-300 text-[11px] font-sans font-bold">{metrics.gitOpsSyncStatus}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
