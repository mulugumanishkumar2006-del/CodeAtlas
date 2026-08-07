'use client';

import React, { useState } from 'react';
import { FaultExperiment } from './playground-types';
import { Flame, Play, CheckCircle2, ShieldAlert, Sparkles, Zap, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlaygroundFaultLabProps {
  experiments: FaultExperiment[];
}

export function PlaygroundFaultLab({ experiments }: PlaygroundFaultLabProps) {
  const [selectedExpId, setSelectedExpId] = useState<string>(experiments[0]?.id || '');
  const [isRunningExp, setIsRunningExp] = useState(false);

  const activeExp = experiments.find((e) => e.id === selectedExpId) || experiments[0];

  const handleRunExperiment = () => {
    setIsRunningExp(true);
    setTimeout(() => {
      setIsRunningExp(false);
    }, 600);
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 font-sans shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-rose-400" />
          <h3 className="text-sm font-bold text-slate-100">
            Fault Injection Chaos Laboratory (Cascading Failure Propagation)
          </h3>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/30 font-mono">
          Chaos Engineering
        </span>
      </div>

      {/* Fault Experiment Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono">
        {experiments.map((exp) => (
          <div
            key={exp.id}
            onClick={() => setSelectedExpId(exp.id)}
            className={cn(
              'p-4 rounded-xl border transition-all cursor-pointer space-y-2',
              selectedExpId === exp.id
                ? 'bg-slate-950 border-rose-500/50 shadow-lg shadow-rose-500/10'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            )}
          >
            <div className="flex items-center justify-between border-b border-slate-900 pb-2">
              <span className="font-bold text-xs text-rose-300 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-rose-400" />
                <span>{exp.title}</span>
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-500/10 text-rose-400 uppercase">
                {exp.faultType}
              </span>
            </div>

            <p className="text-[11px] text-slate-400 font-sans leading-snug">{exp.description}</p>
          </div>
        ))}
      </div>

      {/* Experiment Trigger & Results Inspector */}
      {activeExp && (
        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4 font-sans text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-900 pb-3 font-mono">
            <span className="font-bold text-rose-300 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>{activeExp.title}</span>
            </span>

            <button
              onClick={handleRunExperiment}
              disabled={isRunningExp}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 font-bold text-xs text-white shadow-lg flex items-center gap-1.5 hover:opacity-90 disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{isRunningExp ? 'Injecting Fault...' : 'Inject Chaos Experiment'}</span>
            </button>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800 font-mono text-xs space-y-1">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
              Propagated System Impact:
            </span>
            <p className="text-slate-200 text-xs font-sans leading-relaxed">{activeExp.propagatedImpact}</p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800 font-mono text-xs space-y-1">
            <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider block flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>AI Cascading Failure Summary & Resilience Signoff:</span>
            </span>
            <p className="text-slate-200 text-xs font-sans leading-relaxed">{activeExp.aiCascadingSummary}</p>
          </div>
        </div>
      )}
    </div>
  );
}
