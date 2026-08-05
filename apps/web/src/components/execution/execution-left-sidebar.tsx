'use client';

import React, { useState } from 'react';
import {
  ListTree,
  Flame,
  Search,
  Clock,
  Zap,
  Layers,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { ExecutionStepData, ExecutionFlowTrace } from './execution-mock-data';
import { getExecutionStepIcon } from './execution-custom-nodes';

interface ExecutionLeftSidebarProps {
  trace: ExecutionFlowTrace;
  currentStepIndex: number;
  onSelectStepIndex: (idx: number) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export function ExecutionLeftSidebar({
  trace,
  currentStepIndex,
  onSelectStepIndex,
  isOpen,
  onToggleOpen,
}: ExecutionLeftSidebarProps) {
  const [activeTab, setActiveTab] = useState<'sequence' | 'slowest'>('sequence');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) {
    return (
      <button
        onClick={onToggleOpen}
        className="fixed left-4 top-28 z-40 p-2 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 hover:text-white shadow-xl"
        title="Open Call Flow Tree"
      >
        <ListTree className="w-5 h-5" />
      </button>
    );
  }

  const slowestSteps = [...trace.steps].sort((a, b) => b.durationMs - a.durationMs);

  return (
    <div className="w-72 bg-slate-950/95 border-r border-slate-800/80 flex flex-col h-full shrink-0 select-none z-20 font-sans backdrop-blur-xl">
      {/* Header */}
      <div className="p-3 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
            <ListTree className="w-4 h-4" />
          </div>
          <span className="text-xs font-black tracking-tight text-white uppercase">CALL FLOW SEQUENCE</span>
        </div>
        <button
          onClick={onToggleOpen}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 text-xs font-mono"
        >
          ✕
        </button>
      </div>

      {/* Request Details Card */}
      <div className="p-3 bg-slate-900/60 border-b border-slate-800/80 font-mono text-[11px] space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-cyan-400 font-bold">{trace.method} {trace.endpoint}</span>
          <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[9px] border border-emerald-500/30">
            {trace.status}
          </span>
        </div>
        <div className="flex items-center justify-between text-slate-400 text-[10px]">
          <span>Total: {trace.totalDurationMs} ms</span>
          <span>P95: {trace.p95DurationMs} ms</span>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center border-b border-slate-800/80 p-1 bg-slate-950/60 font-mono text-[10px]">
        <button
          onClick={() => setActiveTab('sequence')}
          className={`flex-1 py-1 rounded-lg font-bold transition-all ${
            activeTab === 'sequence' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Call Sequence
        </button>
        <button
          onClick={() => setActiveTab('slowest')}
          className={`flex-1 py-1 rounded-lg font-bold transition-all ${
            activeTab === 'slowest' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Slowest Steps
        </button>
      </div>

      {/* Sequence List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-none font-mono text-xs">
        {activeTab === 'sequence'
          ? trace.steps.map((step, idx) => {
              const isSelected = idx === currentStepIndex;
              return (
                <button
                  key={step.id}
                  onClick={() => onSelectStepIndex(idx)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all ${
                    isSelected
                      ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-200 font-bold'
                      : 'hover:bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate min-w-0">
                    <span className="w-5 h-5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-[9px] font-bold text-cyan-400 shrink-0">
                      #{step.stepIndex}
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span className="truncate text-[11px] font-bold text-slate-200">{step.name}</span>
                      <span className="text-[9px] text-slate-500 truncate">{step.type}</span>
                    </div>
                  </div>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      step.durationMs > 100
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : 'bg-slate-900 text-slate-400'
                    }`}
                  >
                    {step.durationMs}ms
                  </span>
                </button>
              );
            })
          : slowestSteps.map((step) => {
              const idx = trace.steps.findIndex((s) => s.id === step.id);
              return (
                <button
                  key={step.id}
                  onClick={() => onSelectStepIndex(idx)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 text-left"
                >
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-slate-200 truncate">{step.name}</span>
                    <span className="text-[9px] text-slate-500">{step.type}</span>
                  </div>
                  <span className="text-[10px] font-bold text-amber-300">
                    {step.durationMs} ms
                  </span>
                </button>
              );
            })}
      </div>
    </div>
  );
}
