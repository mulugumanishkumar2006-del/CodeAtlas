'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Search,
  Layers,
  GitBranch,
  Network,
  Clock,
  ShieldCheck,
  Zap,
  Flame,
  FileText,
  Play,
  CheckCircle2,
  Loader2,
  Pause,
  RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface PipelineStage {
  id: number;
  label: string;
  category: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED';
  detail: string;
}

const PIPELINE_STAGES: PipelineStage[] = [
  { id: 1, label: 'Loading repository topology & AST AST trees', category: 'Repository Analysis', status: 'COMPLETED', detail: '142,500 AST symbol nodes synchronized' },
  { id: 2, label: 'Reading clean-architecture boundary rules', category: 'Architecture Inspection', status: 'COMPLETED', detail: '24 layer coupling rules verified' },
  { id: 3, label: 'Building dependency graph & package tree', category: 'Dependency Inspection', status: 'COMPLETED', detail: '42 third-party packages audited' },
  { id: 4, label: 'Traversing Knowledge Graph semantic edges', category: 'Knowledge Graph', status: 'COMPLETED', detail: 'Semantic relationship links mapped' },
  { id: 5, label: 'Inspecting execution paths & call stack', category: 'Execution Flow', status: 'COMPLETED', detail: 'Direct raw SQL handler calls traced' },
  { id: 6, label: 'Analyzing recent git commits & PR diffs', category: 'Commit Analysis', status: 'COMPLETED', detail: 'PR #142 commit history correlated' },
  { id: 7, label: 'Comparing architectural drift against baseline', category: 'Drift Detection', status: 'COMPLETED', detail: 'Layer breach #14 detected in PaymentService' },
  { id: 8, label: 'Evaluating technical debt drag & payoff ROI', category: 'Technical Debt', status: 'COMPLETED', detail: '$18.5k/yr debt drag calculated' },
  { id: 9, label: 'Running SOC2 & CVE security vulnerability scan', category: 'Security Scan', status: 'COMPLETED', detail: 'Zero critical CVEs found' },
  { id: 10, label: 'Scanning P99 latency & DB lock contention', category: 'Performance Scan', status: 'COMPLETED', detail: '+45ms latency degradation identified' },
  { id: 11, label: 'Reviewing documentation & ADR coverage specs', category: 'Documentation Review', status: 'COMPLETED', detail: 'Missing godoc docstrings flagged' },
  { id: 12, label: 'Running Digital Twin scenario simulation', category: 'Simulation', status: 'COMPLETED', detail: '+350% QPS throughput predicted' },
  { id: 13, label: 'Comparing historical baseline snapshots', category: 'Historical Comparison', status: 'COMPLETED', detail: 'Release 18 baseline compared' },
  { id: 14, label: 'Correlating real-time telemetry monitoring', category: 'Monitoring Correlation', status: 'COMPLETED', detail: '50k QPS ingress spike correlated' },
  { id: 15, label: 'Synthesizing AI conclusions & migration plan', category: 'AI Reasoning', status: 'COMPLETED', detail: 'Final investigation report generated' }
];

interface PipelineProps {
  isAnalyzing: boolean;
  onComplete?: () => void;
}

export function AiInvestigationPipeline({ isAnalyzing, onComplete }: PipelineProps) {
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(15);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  useEffect(() => {
    if (!isAnalyzing || isPaused) return;

    setCurrentStageIndex(0);
    const interval = setInterval(() => {
      setCurrentStageIndex((prev) => {
        if (prev >= PIPELINE_STAGES.length - 1) {
          clearInterval(interval);
          if (onComplete) onComplete();
          return PIPELINE_STAGES.length - 1;
        }
        return prev + 1;
      });
    }, 400);

    return () => clearInterval(interval);
  }, [isAnalyzing, isPaused]);

  const progressPercent = Math.round(((currentStageIndex + 1) / PIPELINE_STAGES.length) * 100);

  return (
    <div className="glass-card rounded-3xl p-6 border border-slate-800/80 shadow-2xl space-y-4 font-sans select-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4 font-mono">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
            <Brain className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              Real-Time AI Investigation Pipeline
            </h3>
            <p className="text-xs text-slate-400 font-sans">
              15-stage autonomous analysis traversing AST trees, call stacks, commit diffs, and digital twin simulations.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono">
          <span className="text-xs text-cyan-300 font-bold bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
            {progressPercent}% Complete ({currentStageIndex + 1}/15 Stages)
          </span>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsPaused((p) => !p)}
            className="h-8 text-xs font-mono font-bold bg-slate-900 border-slate-800 text-slate-300 hover:text-white rounded-xl gap-1 cursor-pointer"
          >
            {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5 text-amber-400" />}
            {isPaused ? 'Resume' : 'Pause'}
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1 font-mono">
        <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800/80 p-0.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 h-full rounded-full"
          />
        </div>
      </div>

      {/* Active Stage Ticker Line */}
      <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2.5">
          <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
          <span className="text-slate-400 font-bold">CURRENT STAGE:</span>
          <span className="text-cyan-300 font-bold">{PIPELINE_STAGES[currentStageIndex]?.label}</span>
        </div>
        <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          {PIPELINE_STAGES[currentStageIndex]?.detail}
        </span>
      </div>

      {/* Stages Grid Stepper */}
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-2 font-mono text-[11px]">
        {PIPELINE_STAGES.map((stage, idx) => {
          const isDone = idx <= currentStageIndex;
          const isCurrent = idx === currentStageIndex;

          return (
            <div
              key={stage.id}
              className={`p-2.5 rounded-xl border transition-all duration-200 space-y-1 ${
                isCurrent
                  ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-md'
                  : isDone
                  ? 'bg-slate-950/60 border-slate-800 text-slate-300'
                  : 'bg-slate-950/30 border-slate-900 text-slate-600'
              }`}
            >
              <div className="flex items-center justify-between text-[9px]">
                <span className="font-bold uppercase">STAGE {stage.id}</span>
                {isDone ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-slate-800" />
                )}
              </div>
              <div className="font-bold truncate text-[10px]">{stage.category}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
