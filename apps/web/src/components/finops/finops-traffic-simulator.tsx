'use client';

import React, { useState } from 'react';
import { WorkloadSimulationResult } from './finops-types';
import { Activity, Zap, Cpu, HardDrive, DollarSign, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FinOpsTrafficSimulatorProps {
  simulations: WorkloadSimulationResult[];
}

export function FinOpsTrafficSimulator({ simulations }: FinOpsTrafficSimulatorProps) {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);

  const activeSim = simulations[selectedIdx] || simulations[0];

  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 font-sans shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-slate-100">
            Workload & Traffic Scaling Simulator (1x to 100x Multipliers)
          </h3>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono">
          Interactive Workload Scaling
        </span>
      </div>

      {/* Multiplier Selectors */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 font-mono text-xs">
        {simulations.map((sim, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedIdx(idx)}
            className={cn(
              'p-3 rounded-xl border transition-all text-left space-y-1',
              selectedIdx === idx
                ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/10 text-cyan-200 border-cyan-500/40 font-bold shadow-md'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
            )}
          >
            <span className="text-xs font-bold block">{sim.multiplierLabel}</span>
            <span className="text-[10px] text-slate-400">{(sim.trafficQps / 1000).toFixed(0)}k QPS</span>
          </button>
        ))}
      </div>

      {/* Selected Multiplier Predicted Telemetry Card */}
      <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-slate-900 pb-2">
          <span className="font-bold text-cyan-300 text-xs">{activeSim.multiplierLabel} Workload Predictions</span>
          <span className="text-emerald-400 font-bold">Cost: ${activeSim.predictedMonthlyCostUsd.toLocaleString()}/mo</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase block">P95 Latency:</span>
            <strong className="text-emerald-400 text-sm font-black">{activeSim.p95LatencyMs} ms</strong>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase block">CPU Load:</span>
            <strong className="text-purple-300 text-sm font-black">{activeSim.cpuPct}%</strong>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase block">Disk IOPS:</span>
            <strong className="text-cyan-300 text-sm font-black">{activeSim.diskIops.toLocaleString()} IOPS</strong>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase block">HPA Pod Replicas:</span>
            <strong className="text-amber-400 text-sm font-black">{activeSim.autoscalingReplicas} Pods</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
