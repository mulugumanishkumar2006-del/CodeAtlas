'use client';

import React from 'react';
import { AIAgentState } from './workflow-types';
import { Bot, CheckCircle2, Clock, Sparkles, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WorkflowAgentOrchestratorProps {
  agents: AIAgentState[];
}

export function WorkflowAgentOrchestrator({ agents }: WorkflowAgentOrchestratorProps) {
  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 font-sans shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-bold text-slate-100">
            Multi-AI Agent Orchestration & Real-Time Swarm Progress
          </h3>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 font-mono">
          8 Active Agents
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
        {agents.map((ag) => {
          const isWorking = ag.status === 'WORKING';
          const isAwaiting = ag.status === 'AWAITING_HUMAN';
          const isCompleted = ag.status === 'COMPLETED';

          return (
            <div
              key={ag.role}
              className={cn(
                'p-3.5 rounded-xl bg-slate-950 border transition-all space-y-2',
                isAwaiting
                  ? 'border-amber-500/50 shadow-lg shadow-amber-950/20'
                  : 'border-slate-800/80 hover:border-indigo-500/40'
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{ag.avatar}</span>
                  <span className="text-xs font-bold text-slate-200 truncate">{ag.displayName}</span>
                </div>
                <span
                  className={cn(
                    'w-2 h-2 rounded-full',
                    isWorking && 'bg-cyan-400 animate-ping',
                    isAwaiting && 'bg-amber-400 animate-pulse',
                    isCompleted && 'bg-emerald-400'
                  )}
                />
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase block">Current Task:</span>
                <p className="text-slate-300 text-[10px] font-sans truncate">{ag.currentTask}</p>
              </div>

              <div className="space-y-1 pt-1 border-t border-slate-900">
                <div className="flex justify-between text-[9px] text-slate-400">
                  <span>Artifact: <strong className="text-slate-200">{ag.activeArtifact}</strong></span>
                  <span>{ag.progressPct}%</span>
                </div>

                <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                  <div
                    className={cn(
                      'h-full transition-all duration-500',
                      isCompleted && 'bg-emerald-400',
                      isAwaiting && 'bg-amber-400',
                      isWorking && 'bg-cyan-400'
                    )}
                    style={{ width: `${ag.progressPct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
