'use client';

import React, { useState } from 'react';
import { ExecutionNode, WorkflowStatus } from './workflow-types';
import { Play, Pause, RefreshCw, SkipForward, XCircle, GitBranch, Copy, CheckCircle2, Clock, Sparkles, ShieldCheck, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WorkflowExecutionEngineProps {
  nodes: ExecutionNode[];
  activeWorkflowName: string;
}

export function WorkflowExecutionEngine({ nodes, activeWorkflowName }: WorkflowExecutionEngineProps) {
  const [status, setStatus] = useState<WorkflowStatus>('RUNNING');
  const [currentNodeIdx, setCurrentNodeIdx] = useState(6);

  const togglePause = () => {
    setStatus((prev) => (prev === 'RUNNING' ? 'PAUSED' : 'RUNNING'));
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 font-sans shadow-xl">
      {/* Top Controls & Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3 font-mono">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Visual Execution Engine & Node Graph
              <span
                className={cn(
                  'px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border',
                  status === 'RUNNING' && 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse',
                  status === 'PAUSED' && 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                )}
              >
                {status}
              </span>
            </h3>
            <p className="text-[10px] text-slate-400">Workflow: <strong className="text-slate-200">{activeWorkflowName}</strong></p>
          </div>
        </div>

        {/* Workflow Action Controls */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            onClick={togglePause}
            className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-purple-500/40 text-slate-200 flex items-center gap-1"
          >
            {status === 'RUNNING' ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{status === 'RUNNING' ? 'Pause' : 'Resume'}</span>
          </button>

          <button className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-purple-500/40 text-slate-200 flex items-center gap-1">
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Retry</span>
          </button>

          <button className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-purple-500/40 text-slate-200 flex items-center gap-1">
            <SkipForward className="w-3.5 h-3.5 text-indigo-400" />
            <span>Skip Step</span>
          </button>

          <button className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-purple-500/40 text-slate-200 flex items-center gap-1">
            <GitBranch className="w-3.5 h-3.5 text-purple-400" />
            <span>Branch</span>
          </button>

          <button className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-purple-500/40 text-slate-200 flex items-center gap-1">
            <Copy className="w-3.5 h-3.5 text-slate-400" />
            <span>Duplicate</span>
          </button>
        </div>
      </div>

      {/* Visual Execution Graph (Horizontal Node Stream) */}
      <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800">
        <div className="flex items-center min-w-[1000px] justify-between font-mono text-xs relative">
          <div className="absolute left-0 right-0 top-4 h-0.5 bg-slate-800 -z-10" />

          {nodes.map((node, idx) => {
            const isCompleted = node.status === 'COMPLETED';
            const isAwaiting = node.status === 'AWAITING_APPROVAL';

            return (
              <div key={node.id} className="flex flex-col items-center text-center w-28 relative bg-slate-950 p-1.5 rounded-xl border border-slate-800/80">
                <div
                  className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shadow-md transition-all',
                    isCompleted && 'bg-emerald-500 text-slate-950 shadow-emerald-500/30',
                    isAwaiting && 'bg-amber-500 text-slate-950 animate-pulse shadow-amber-500/40',
                    node.status === 'PENDING' && 'bg-slate-900 text-slate-500 border border-slate-800'
                  )}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </div>
                <span className="text-[10px] font-bold text-slate-200 mt-1 truncate max-w-full">
                  {node.label}
                </span>
                <span className="text-[9px] text-slate-400 font-mono">{node.duration}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Steps Stream & Reasoning */}
      <div className="space-y-3 font-sans">
        {nodes.map((node) => {
          const isCompleted = node.status === 'COMPLETED';
          const isAwaiting = node.status === 'AWAITING_APPROVAL';

          return (
            <div
              key={node.id}
              className={cn(
                'p-4 rounded-xl border transition-all space-y-2',
                isAwaiting
                  ? 'bg-gradient-to-r from-amber-950/30 via-purple-950/20 to-slate-950 border-amber-500/50 shadow-lg shadow-amber-950/30'
                  : 'bg-slate-950 border-slate-800/80'
              )}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-[10px] text-cyan-400">
                    {node.stepNumber}
                  </span>
                  <span className="text-xs font-bold text-slate-100">{node.label}</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] bg-slate-900 text-purple-300 border border-slate-800">
                    {node.agentRole.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                  <span>Duration: {node.duration}</span>
                  <span
                    className={cn(
                      'px-2 py-0.5 rounded font-bold uppercase border',
                      isCompleted && 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
                      isAwaiting && 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                    )}
                  >
                    {node.status}
                  </span>
                </div>
              </div>

              {/* AI Explanation & Evidence */}
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800/80 text-xs font-mono flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-cyan-300 uppercase text-[9px] block">AI Step Reasoning & Explanation:</span>
                  <span className="text-slate-200 text-[11px] font-sans">{node.aiExplanation}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
