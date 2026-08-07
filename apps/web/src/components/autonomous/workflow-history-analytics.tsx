'use client';

import React from 'react';
import { WorkflowHistoryRecord } from './workflow-types';
import { History, CheckCircle2, Clock, FileText, Layers, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WorkflowHistoryAnalyticsProps {
  records: WorkflowHistoryRecord[];
}

export function WorkflowHistoryAnalytics({ records }: WorkflowHistoryAnalyticsProps) {
  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 font-sans shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-bold text-slate-100">
            Workflow Execution History & Audit Logs
          </h3>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 font-mono">
          Full Audit Trail
        </span>
      </div>

      <div className="space-y-3 font-mono text-xs">
        {records.map((rec) => (
          <div key={rec.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-sans">
            <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs border-b border-slate-900 pb-2">
              <span className="font-bold text-slate-100">{rec.workflowName}</span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400">Duration: {rec.duration}</span>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase">
                  {rec.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Repository & Agents:</span>
                <p className="text-slate-200 text-[11px] font-sans">{rec.repository}</p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {rec.agentsUsed.map((ag, aIdx) => (
                    <span key={aIdx} className="px-1.5 py-0.2 rounded text-[8px] bg-slate-900 text-purple-300 border border-slate-800">
                      {ag.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Artifacts Generated:</span>
                <ul className="space-y-0.5 text-slate-300 text-[11px]">
                  {rec.artifactsGenerated.map((art, artIdx) => (
                    <li key={artIdx} className="flex items-center gap-1">
                      <FileText className="w-3 h-3 text-cyan-400" />
                      <span>{art}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
