'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Zap,
  Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ArbChangeRequest, MOCK_ARB_REQUESTS } from './enterprise-mock-data';

interface ArbGovernancePanelProps {
  onSimulate: (requestId: string) => void;
}

export function ArbGovernancePanel({ onSimulate }: ArbGovernancePanelProps) {
  const [requests, setRequests] = useState<ArbChangeRequest[]>(MOCK_ARB_REQUESTS);

  const handleVote = (id: string, isApprove: boolean) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              committeeVotes: {
                ...r.committeeVotes,
                approve: isApprove ? r.committeeVotes.approve + 1 : r.committeeVotes.approve,
                reject: !isApprove ? r.committeeVotes.reject + 1 : r.committeeVotes.reject,
              },
            }
          : r
      )
    );
  };

  return (
    <div className="w-84 bg-slate-950/95 border-l border-slate-800/80 flex flex-col h-full shrink-0 select-none z-20 font-sans backdrop-blur-xl animate-in slide-in-from-right duration-200 shadow-2xl">
      {/* Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-black tracking-tight text-white uppercase">ARB GOVERNANCE BOARD</span>
            <span className="text-[10px] font-mono text-slate-400">Architecture Review Committee</span>
          </div>
        </div>
      </div>

      {/* Change Requests List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs scrollbar-none">
        {requests.map((req) => (
          <div key={req.id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[9px] font-bold">
                {req.requestId}
              </span>
              <span className="text-[10px] text-slate-400 font-bold">{req.status}</span>
            </div>

            <h4 className="text-xs font-bold text-white font-sans">{req.title}</h4>
            <p className="text-[11px] text-slate-300 font-sans leading-relaxed">{req.summary}</p>

            {/* Voting Bar */}
            <div className="grid grid-cols-3 gap-2 text-[10px] text-center pt-1">
              <button
                onClick={() => handleVote(req.id, true)}
                className="p-1.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 font-bold hover:bg-emerald-500/20"
              >
                Approve ({req.committeeVotes.approve})
              </button>
              <button
                onClick={() => handleVote(req.id, false)}
                className="p-1.5 rounded-xl bg-rose-950/20 border border-rose-500/30 text-rose-300 font-bold hover:bg-rose-500/20"
              >
                Reject ({req.committeeVotes.reject})
              </button>
              <div className="p-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 font-bold">
                Abstain ({req.committeeVotes.abstain})
              </div>
            </div>

            <Button
              onClick={() => onSimulate(req.id)}
              className="w-full bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/40 font-bold text-xs gap-1.5 rounded-xl h-8 shadow-md"
            >
              <Zap className="w-3.5 h-3.5" /> Simulate Proposed ARB Change
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
