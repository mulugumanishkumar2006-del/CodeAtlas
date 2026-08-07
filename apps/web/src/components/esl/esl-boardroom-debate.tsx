'use client';

import React from 'react';
import { AiBoardroomParticipant } from './esl-types';
import { Users, CheckCircle2, AlertTriangle, Sparkles, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EslBoardroomDebateProps {
  participants: AiBoardroomParticipant[];
}

export function EslBoardroomDebate({ participants }: EslBoardroomDebateProps) {
  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 font-sans shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-400" />
          <h3 className="text-sm font-bold text-slate-100">
            AI Boardroom Decision Simulation & Executive Debate
          </h3>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] bg-purple-500/10 text-purple-300 border border-purple-500/30 font-mono font-bold">
          Unanimous Boardroom Approval
        </span>
      </div>

      <div className="space-y-4 font-sans text-xs">
        {participants.map((p, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-900 pb-2">
              <div className="flex items-center gap-2">
                <span className={cn('w-3 h-3 rounded-full', p.avatarColor)} />
                <span className="font-bold text-slate-100">{p.role}</span>
                <span className="text-[10px] text-slate-400">({p.agentName})</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-400 uppercase border border-emerald-500/30">
                {p.verdict}
              </span>
            </div>

            <p className="text-slate-200 font-sans text-xs leading-relaxed">{p.statement}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px] text-slate-400 pt-2 border-t border-slate-900">
              <div>Trade-off: <strong className="text-cyan-300 font-sans">{p.tradeOffSummary}</strong></div>
              <div>Risk Note: <strong className="text-amber-400 font-sans">{p.riskWarning}</strong></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
