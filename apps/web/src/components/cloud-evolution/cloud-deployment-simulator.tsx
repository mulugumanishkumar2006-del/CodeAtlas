'use client';

import React, { useState } from 'react';
import { DeploymentSimulationScenario } from './cloud-types';
import { Play, Sparkles, CheckCircle2, RefreshCw, ShieldCheck, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CloudDeploymentSimulatorProps {
  scenarios: DeploymentSimulationScenario[];
}

export function CloudDeploymentSimulator({ scenarios }: CloudDeploymentSimulatorProps) {
  const [selectedId, setSelectedId] = useState<string>(scenarios[0]?.id || '');
  const [isDeploying, setIsDeploying] = useState(false);

  const activeScenario = scenarios.find((s) => s.id === selectedId) || scenarios[0];

  const handleSimulate = () => {
    setIsDeploying(true);
    setTimeout(() => {
      setIsDeploying(false);
    }, 500);
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 font-sans shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-bold text-slate-100">
            Kubernetes Deployment Strategy Simulator & Canary Traffic Router
          </h3>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 font-mono">
          Istio VirtualService Active
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
        {scenarios.map((scen) => (
          <div
            key={scen.id}
            onClick={() => setSelectedId(scen.id)}
            className={cn(
              'p-3.5 rounded-xl border transition-all cursor-pointer space-y-2',
              selectedId === scen.id
                ? 'bg-slate-950 border-indigo-500/50 shadow-lg shadow-indigo-500/10'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            )}
          >
            <span className="font-bold text-xs text-slate-100 block">{scen.title}</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-500/10 text-indigo-300 uppercase">
              {scen.strategy}
            </span>
          </div>
        ))}
      </div>

      {activeScenario && (
        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4 font-sans text-xs">
          <div className="flex justify-between items-center border-b border-slate-900 pb-2 font-mono">
            <span className="font-bold text-cyan-300 text-xs">{activeScenario.title}</span>
            <button
              onClick={handleSimulate}
              disabled={isDeploying}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 font-bold text-xs text-white shadow-lg flex items-center gap-1.5 hover:opacity-90 disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{isDeploying ? 'Simulating Canary...' : 'Simulate Deployment'}</span>
            </button>
          </div>

          <p className="text-slate-200 font-sans text-xs leading-relaxed">{activeScenario.expectedPerformanceP95}</p>

          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 font-mono text-xs space-y-1">
            <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider block flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>AI Deployment Recommendation:</span>
            </span>
            <p className="text-slate-300 text-[11px] font-sans">{activeScenario.aiSummary}</p>
          </div>
        </div>
      )}
    </div>
  );
}
