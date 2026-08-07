'use client';

import React from 'react';
import { SideBySideDiff } from './time-machine-types';
import { Sparkles, Layers, PlusCircle, MinusCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface TimeMachineSideDiffProps {
  diff: SideBySideDiff;
}

export function TimeMachineSideDiff({ diff }: TimeMachineSideDiffProps) {
  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 font-sans shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-bold text-slate-100">
            Side-by-Side Timeline Comparison Matrix
          </h3>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 font-mono">
          Snapshot A vs Snapshot B Diff
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        {/* Added Components */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Added Components & Microservices:</span>
          </span>
          <ul className="space-y-1 text-slate-300 text-[11px] font-sans">
            {diff.addedServices.map((svc, idx) => (
              <li key={idx} className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>{svc}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Removed Components */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
            <MinusCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>Removed / Replaced Components:</span>
          </span>
          <ul className="space-y-1 text-slate-300 text-[11px] font-sans">
            {diff.removedServices.map((svc, idx) => (
              <li key={idx} className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                <span>{svc}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* AI Comparison Summary */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2">
        <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>AI Architecture Evolution Summary:</span>
        </span>
        <p className="text-slate-200 font-sans text-xs leading-relaxed">{diff.aiComparisonSummary}</p>
      </div>
    </div>
  );
}
