'use client';

import React from 'react';
import { ExecutiveDecisionReport } from './esl-types';
import { FileText, CheckCircle2, Clock, ShieldCheck, Sparkles } from 'lucide-react';

interface EslDecisionReportsProps {
  report: ExecutiveDecisionReport;
}

export function EslDecisionReports({ report }: EslDecisionReportsProps) {
  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 font-sans shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-slate-100">
            Executive Decision Intelligence Report & Migration Roadmap Generator
          </h3>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
          Executive Signoff
        </span>
      </div>

      <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4 font-sans text-xs">
        <div className="flex justify-between items-center border-b border-slate-900 pb-2 font-mono">
          <span className="font-bold text-slate-100 text-xs">{report.title}</span>
          <span className="text-emerald-400 font-bold text-[10px]">{report.roiProjection}</span>
        </div>

        {/* Executive Summary */}
        <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800 font-mono space-y-1">
          <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider block">
            Executive Summary & Boardroom Verdict:
          </span>
          <p className="text-slate-200 text-xs font-sans leading-relaxed">{report.executiveSummary}</p>
        </div>

        {/* Migration Roadmap */}
        <div className="p-3.5 rounded-lg bg-slate-900/40 border border-slate-800 font-mono space-y-2">
          <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider block">
            Migration Roadmap Milestones:
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            {report.migrationRoadmapMilestones.map((m, idx) => (
              <div key={idx} className="p-2.5 rounded bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[9px] font-bold text-cyan-300 uppercase">{m.phase} ({m.durationWeeks} Wks)</span>
                <p className="text-slate-200 font-sans text-[11px]">{m.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
