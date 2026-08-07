'use client';

import React from 'react';
import { RecoveryPlaybook } from './chaos-types';
import { BookOpen, CheckCircle2, Clock, ShieldCheck, Sparkles, AlertTriangle } from 'lucide-react';

interface ChaosRecoveryPlaybookProps {
  playbook: RecoveryPlaybook;
}

export function ChaosRecoveryPlaybook({ playbook }: ChaosRecoveryPlaybookProps) {
  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 font-sans shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-purple-400" />
          <h3 className="text-sm font-bold text-slate-100">
            Automated SRE Incident Recovery Playbook & Postmortem Generator
          </h3>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] bg-purple-500/10 text-purple-300 border border-purple-500/30 font-mono">
          MTTR 1.8 mins
        </span>
      </div>

      <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4 font-sans text-xs">
        <div className="flex justify-between items-center border-b border-slate-900 pb-2 font-mono">
          <span className="font-bold text-slate-100 text-xs">{playbook.title}</span>
          <span className="text-[10px] text-cyan-300">{playbook.timestamp}</span>
        </div>

        {/* Root Cause */}
        <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800 font-mono space-y-1">
          <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">
            Root Cause Analysis (RCA):
          </span>
          <p className="text-slate-200 text-xs font-sans leading-relaxed">{playbook.rootCauseAnalysis}</p>
        </div>

        {/* Recovery Timeline */}
        <div className="p-3.5 rounded-lg bg-slate-900/40 border border-slate-800 font-mono space-y-2">
          <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">
            Recovery Timeline:
          </span>
          <ul className="space-y-1 text-slate-300 text-[11px]">
            {playbook.recoveryTimeline.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="px-1.5 py-0.2 rounded bg-slate-900 text-cyan-300 border border-slate-800 text-[9px]">
                  +{item.time}
                </span>
                <span className="text-slate-200 font-sans">{item.action}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Verification Checklist */}
        <div className="p-3.5 rounded-lg bg-slate-900/40 border border-slate-800 font-mono space-y-2">
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
            SRE Verification Checklist:
          </span>
          <ul className="space-y-1 text-slate-300 text-[11px]">
            {playbook.verificationChecklist.map((check, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-slate-200 font-sans">{check}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
