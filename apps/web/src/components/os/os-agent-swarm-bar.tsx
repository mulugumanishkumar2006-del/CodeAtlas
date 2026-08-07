'use client';

import React from 'react';
import { useCodeAtlasOS } from './os-context';
import { Bot, Sparkles, Activity, ShieldCheck, Zap } from 'lucide-react';

export function OSAgentSwarmBar() {
  const { state } = useCodeAtlasOS();

  return (
    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4 font-mono text-xs shadow-xl select-none">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 animate-pulse">
          <Bot className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-100">{state.activeSwarmAgent} Swarm Active</span>
            <span className="px-1.5 py-0.2 rounded text-[9px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              11 Agents Connected
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-sans">{state.swarmTask}</span>
        </div>
      </div>

      <div className="flex items-center gap-4 text-[11px]">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Swarm Progress:</span>
          <div className="w-24 h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
            <div className="h-full bg-cyan-400 transition-all duration-500" style={{ width: `${state.swarmProgressPct}%` }} />
          </div>
          <strong className="text-cyan-300">{state.swarmProgressPct}%</strong>
        </div>

        <div className="text-[10px] text-slate-400 border-l border-slate-800 pl-3">
          AI Confidence: <strong className="text-emerald-400">{state.swarmConfidencePct}%</strong>
        </div>
      </div>
    </div>
  );
}
