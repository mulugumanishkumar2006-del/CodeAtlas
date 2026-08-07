'use client';

import React, { useState } from 'react';
import { ChaosFailureTemplate } from './chaos-types';
import { Flame, Play, CheckCircle2, AlertTriangle, ShieldCheck, Zap, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChaosLiveExperimentProps {
  activeTemplate: ChaosFailureTemplate;
}

export function ChaosLiveExperiment({ activeTemplate }: ChaosLiveExperimentProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStage, setCurrentStage] = useState<'IDLE' | 'DEGRADATION' | 'CIRCUIT_BREAKER' | 'FAILOVER' | 'RECOVERY'>('IDLE');

  const handleRunChaos = () => {
    setIsRunning(true);
    setCurrentStage('DEGRADATION');
    setTimeout(() => setCurrentStage('CIRCUIT_BREAKER'), 400);
    setTimeout(() => setCurrentStage('FAILOVER'), 800);
    setTimeout(() => {
      setCurrentStage('RECOVERY');
      setIsRunning(false);
    }, 1200);
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 font-sans shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-rose-400" />
          <h3 className="text-sm font-bold text-slate-100">
            Live Failure Simulation & Cascading Recovery Stream
          </h3>
        </div>

        <span
          className={cn(
            'px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border',
            isRunning
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
          )}
        >
          {isRunning ? 'Injecting Chaos...' : 'System Stable'}
        </span>
      </div>

      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-slate-900 pb-2">
          <span className="font-bold text-slate-100">{activeTemplate.title}</span>
          <button
            onClick={handleRunChaos}
            disabled={isRunning}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 font-bold text-xs text-white shadow-lg flex items-center gap-1.5 hover:opacity-90 disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{isRunning ? 'Running Chaos...' : 'Run Chaos Experiment'}</span>
          </button>
        </div>

        {/* Live Stage Stepper */}
        <div className="grid grid-cols-4 gap-2 text-[10px] text-center">
          {[
            { id: 'DEGRADATION', label: '1. Degradation' },
            { id: 'CIRCUIT_BREAKER', label: '2. Circuit Breaker' },
            { id: 'FAILOVER', label: '3. Auto Failover' },
            { id: 'RECOVERY', label: '4. System Recovery' },
          ].map((stg) => (
            <div
              key={stg.id}
              className={cn(
                'p-2 rounded-lg border font-bold transition-all',
                currentStage === stg.id
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                  : 'bg-slate-900 text-slate-500 border-slate-800'
              )}
            >
              {stg.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
