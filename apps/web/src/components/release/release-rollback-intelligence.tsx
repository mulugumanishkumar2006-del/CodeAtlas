'use client';

import React, { useState } from 'react';
import { RollbackIntelligencePlan } from './release-types';
import { RefreshCw, ShieldAlert, CheckCircle2, Clock, Terminal, FileText, ArrowRight, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReleaseRollbackIntelligenceProps {
  rollbackPlan: RollbackIntelligencePlan;
}

export function ReleaseRollbackIntelligence({ rollbackPlan }: ReleaseRollbackIntelligenceProps) {
  const [checklist, setChecklist] = useState(rollbackPlan.recoveryChecklist);
  const [executedStep, setExecutedStep] = useState<number | null>(null);

  const toggleCheck = (idx: number) => {
    setChecklist((prev) =>
      prev.map((c, i) => (i === idx ? { ...c, verified: !c.verified } : c))
    );
  };

  const handleExecuteStep = (stepNum: number) => {
    setExecutedStep(stepNum);
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6 font-sans shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3 font-mono">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-amber-400" />
          <div>
            <h3 className="text-sm font-bold text-slate-100">
              Automated Rollback Intelligence & Incident Recovery Strategy
            </h3>
            <p className="text-[10px] text-slate-400">
              Estimated Mean-Time-To-Recovery (MTTR): <strong className="text-emerald-400">{rollbackPlan.estimatedRecoveryTimeMinutes} minutes</strong>
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase bg-amber-500/10 text-amber-300 border border-amber-500/30">
          Rollback Plan Armed
        </span>
      </div>

      {/* Risk Analysis Card */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1 font-sans text-xs">
        <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block">
          Rollback Risk Analysis:
        </span>
        <p className="text-slate-300 leading-relaxed text-[11px]">{rollbackPlan.riskAnalysis}</p>
      </div>

      {/* Step-by-Step Rollback Execution Order */}
      <div className="space-y-3 font-mono text-xs">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
          Automated Rollback Execution Order
        </span>

        <div className="space-y-2">
          {rollbackPlan.rollbackOrder.map((step) => {
            const isDone = executedStep !== null && executedStep >= step.stepNumber;

            return (
              <div
                key={step.stepNumber}
                className={cn(
                  'p-3.5 rounded-xl border transition-all space-y-2',
                  isDone
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                    : 'bg-slate-950 border-slate-800 text-slate-200'
                )}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-[10px] text-cyan-400">
                      {step.stepNumber}
                    </span>
                    <span className="font-bold text-slate-100">{step.action}</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] bg-slate-900 text-slate-400 border border-slate-800">
                      {step.targetService}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400">{step.estimatedDurationSec}s</span>
                    <button
                      onClick={() => handleExecuteStep(step.stepNumber)}
                      className="px-2 py-1 rounded bg-slate-900 text-slate-300 hover:text-white border border-slate-800 text-[10px] flex items-center gap-1"
                    >
                      <Play className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                      <span>{isDone ? 'Executed ✓' : 'Run Step'}</span>
                    </button>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900/90 text-cyan-300 text-[11px] overflow-x-auto">
                  <code>{step.commandSnippet}</code>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Alternative Recovery Strategies */}
      <div className="space-y-3 font-sans text-xs">
        <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
          Alternative Recovery Strategies
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {rollbackPlan.alternativeRecoveryOptions.map((opt, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 font-mono">
              <span className="font-bold text-cyan-300 block text-xs">{opt.strategyName}</span>
              <p className="text-slate-300 font-sans text-[11px] leading-relaxed">{opt.description}</p>
              <div className="flex justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-900">
                <span>Recovery Time: <strong className="text-emerald-400">{opt.recoveryTimeMin}m</strong></span>
                <span>{opt.dataLossRisk}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recovery Verification Checklist */}
      <div className="space-y-2 font-mono text-xs">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
          Recovery Verification Checklist
        </span>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          {checklist.map((item, idx) => (
            <button
              key={idx}
              onClick={() => toggleCheck(idx)}
              className="w-full flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 hover:bg-slate-900 text-left transition-colors"
            >
              <span className={cn('text-xs', item.verified ? 'text-emerald-300 line-through' : 'text-slate-200')}>
                {item.task}
              </span>
              <CheckCircle2
                className={cn('w-4 h-4 shrink-0', item.verified ? 'text-emerald-400 fill-emerald-400/20' : 'text-slate-600')}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Incident Postmortem Template */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs">
        <div className="flex items-center justify-between text-slate-400 border-b border-slate-900 pb-2">
          <span className="font-bold text-slate-200 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-purple-400" />
            <span>Automated Incident Postmortem Template</span>
          </span>
          <span className="text-[10px] text-purple-400">{rollbackPlan.postmortemTemplate.severity}</span>
        </div>

        <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
          {rollbackPlan.postmortemTemplate.mitigationSummary}
        </p>
      </div>
    </div>
  );
}
