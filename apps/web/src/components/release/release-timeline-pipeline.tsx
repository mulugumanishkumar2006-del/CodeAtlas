'use client';

import React from 'react';
import { TimelineStage } from './release-types';
import { CheckCircle2, Clock, Play, AlertTriangle, Sparkles, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReleaseTimelinePipelineProps {
  stages: TimelineStage[];
}

export function ReleaseTimelinePipeline({ stages }: ReleaseTimelinePipelineProps) {
  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 font-sans shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-slate-100">
            10-Stage Release Pipeline Timeline & Live AI Recommendation Stream
          </h3>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
          Live Pipeline Stream
        </span>
      </div>

      {/* Horizontal Stage Connector Bar */}
      <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800">
        <div className="flex items-center min-w-[900px] justify-between font-mono text-xs relative">
          <div className="absolute left-0 right-0 top-4 h-0.5 bg-slate-800 -z-10" />

          {stages.map((stg, idx) => {
            const isCompleted = stg.status === 'COMPLETED';
            const isInProgress = stg.status === 'IN_PROGRESS';

            return (
              <div key={stg.id} className="flex flex-col items-center text-center w-24 relative bg-slate-950 px-1 py-1 rounded-xl border border-slate-800/80">
                <div
                  className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shadow-md transition-all',
                    isCompleted && 'bg-emerald-500 text-slate-950 shadow-emerald-500/30',
                    isInProgress && 'bg-cyan-500 text-slate-950 animate-pulse shadow-cyan-500/40',
                    stg.status === 'PENDING' && 'bg-slate-900 text-slate-500 border border-slate-800'
                  )}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </div>
                <span className="text-[10px] font-bold text-slate-200 mt-1 truncate max-w-full">
                  {stg.id.toUpperCase()}
                </span>
                <span className="text-[9px] text-slate-400 font-mono">{stg.duration}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Stage Cards List */}
      <div className="space-y-3 font-sans">
        {stages.map((stg) => {
          const isCompleted = stg.status === 'COMPLETED';
          const isInProgress = stg.status === 'IN_PROGRESS';

          return (
            <div
              key={stg.id}
              className={cn(
                'p-4 rounded-xl border transition-all space-y-2',
                isInProgress
                  ? 'bg-gradient-to-r from-cyan-950/40 via-indigo-950/30 to-slate-950 border-cyan-500/50 shadow-lg shadow-cyan-950/40'
                  : 'bg-slate-950 border-slate-800/80'
              )}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 font-mono">
                <div className="flex items-center gap-2">
                  {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  {isInProgress && <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin-slow shrink-0" />}
                  {!isCompleted && !isInProgress && <Clock className="w-4 h-4 text-slate-500 shrink-0" />}
                  <span className="text-xs font-bold text-slate-100">{stg.name}</span>
                </div>

                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <span>Started: {stg.startedAt}</span>
                  {stg.completedAt && <span>• Completed: {stg.completedAt}</span>}
                  <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300 font-bold">
                    {stg.duration}
                  </span>
                </div>
              </div>

              {/* Description & AI Recommendation */}
              <p className="text-xs text-slate-300 leading-relaxed font-sans">{stg.description}</p>

              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800/80 text-xs font-mono flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-cyan-300 uppercase text-[9px] block">AI Stage Recommendation:</span>
                  <span className="text-slate-200 text-[11px] font-sans">{stg.aiRecommendation}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
