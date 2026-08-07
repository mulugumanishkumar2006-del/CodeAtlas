'use client';

import React from 'react';
import { SimulationStage } from './twin-types';
import { CheckCircle2, RefreshCw, Clock, Sparkles, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TwinLiveStagesProps {
  currentStage: SimulationStage;
  isSimulating: boolean;
}

const STAGES: { id: SimulationStage; label: string; desc: string }[] = [
  { id: 'PREPARATION', label: 'Stage 1: Preparation', desc: 'Ingesting repository AST symbols & topology graph.' },
  { id: 'ANALYSIS', label: 'Stage 2: Analysis', desc: 'Parsing microservice call dependencies & database schemas.' },
  { id: 'PREDICTION', label: 'Stage 3: Prediction', desc: 'Executing Monte Carlo traffic surge predictions.' },
  { id: 'IMPACT_CALCULATION', label: 'Stage 4: Impact Calculation', desc: 'Evaluating latency deltas, memory pressure, and API changes.' },
  { id: 'RISK_EVALUATION', label: 'Stage 5: Risk Evaluation', desc: 'Auditing OWASP security risks and breaking change bounds.' },
  { id: 'VISUALIZATION', label: 'Stage 6: Visualization', desc: 'Rendering side-by-side architecture comparison graphs.' },
  { id: 'RECOMMENDATION', label: 'Stage 7: Recommendation', desc: 'Generating SRE migration advice and rollback MTTR plan.' },
  { id: 'SUMMARY', label: 'Stage 8: Summary', desc: 'Finalizing simulation results with confidence score.' },
];

export function TwinLiveStages({ currentStage, isSimulating }: TwinLiveStagesProps) {
  const getStageIndex = (stg: SimulationStage) => STAGES.findIndex((s) => s.id === stg);
  const currentIndex = getStageIndex(currentStage);

  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 font-sans shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-slate-100">
            8-Stage Live Simulation Execution Stream
          </h3>
        </div>

        <span
          className={cn(
            'px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border',
            isSimulating
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 animate-pulse'
              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
          )}
        >
          {isSimulating ? 'Simulating Live...' : 'Simulation Complete'}
        </span>
      </div>

      {/* Horizontal Stage Progress Stepper */}
      <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800">
        <div className="flex items-center min-w-[900px] justify-between font-mono text-xs relative">
          <div className="absolute left-0 right-0 top-4 h-0.5 bg-slate-800 -z-10" />

          {STAGES.map((stg, idx) => {
            const isDone = idx < currentIndex || (!isSimulating && currentIndex === STAGES.length - 1);
            const isCurrent = isSimulating && idx === currentIndex;

            return (
              <div key={stg.id} className="flex flex-col items-center text-center w-24 relative bg-slate-950 px-1 py-1 rounded-xl border border-slate-800/80">
                <div
                  className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shadow-md transition-all',
                    isDone && 'bg-emerald-500 text-slate-950 shadow-emerald-500/30',
                    isCurrent && 'bg-cyan-500 text-slate-950 animate-pulse shadow-cyan-500/40',
                    !isDone && !isCurrent && 'bg-slate-900 text-slate-500 border border-slate-800'
                  )}
                >
                  {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </div>
                <span className="text-[9px] font-bold text-slate-200 mt-1 truncate max-w-full">
                  {stg.id}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
