'use client';

import React from 'react';
import { GitOpsDriftItem } from './cloud-types';
import { GitBranch, AlertTriangle, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';

interface CloudGitOpsDriftProps {
  driftItems: GitOpsDriftItem[];
}

export function CloudGitOpsDrift({ driftItems }: CloudGitOpsDriftProps) {
  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 font-sans shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono">
        <div className="flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold text-slate-100">
            GitOps & Terraform Infrastructure Drift Analyzer (ArgoCD / FluxCD)
          </h3>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono">
          ArgoCD Sync Active
        </span>
      </div>

      <div className="space-y-3 font-mono text-xs">
        {driftItems.map((item) => (
          <div key={item.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between border-b border-slate-900 pb-2">
              <span className="font-bold text-slate-100 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>{item.resourceName}</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-300 uppercase">
                {item.driftStatus}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-slate-400 font-sans">
              <div>Expected: <strong className="text-cyan-300 font-mono">{item.expectedState}</strong></div>
              <div>Actual: <strong className="text-rose-400 font-mono">{item.actualState}</strong></div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 font-mono text-xs space-y-1 mt-2">
              <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider block flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>AI Refactoring Suggestion:</span>
              </span>
              <p className="text-slate-300 text-[11px] font-sans">{item.aiRefactoringSuggestion}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
