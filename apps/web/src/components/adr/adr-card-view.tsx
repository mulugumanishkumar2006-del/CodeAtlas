'use client';

import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Clock,
  Sparkles,
  Zap,
  FlaskConical,
  ThumbsUp,
  ThumbsDown,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Share2,
  Copy,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdrRecord } from './adr-mock-data';

interface AdrCardViewProps {
  adr: AdrRecord;
  onSimulate: (adrId: string) => void;
  onApprove: (adrId: string) => void;
}

export function AdrCardView({ adr, onSimulate, onApprove }: AdrCardViewProps) {
  const [copied, setCopied] = useState(false);
  const [votes, setVotes] = useState(adr.committeeVotes);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  let statusBadge = (
    <span className="flex items-center gap-1 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg shadow-emerald-950/40">
      <CheckCircle2 className="w-3 h-3" /> APPROVED
    </span>
  );

  if (adr.status === 'Proposed') {
    statusBadge = (
      <span className="flex items-center gap-1 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
        <Clock className="w-3 h-3" /> PROPOSED
      </span>
    );
  } else if (adr.status === 'Violated') {
    statusBadge = (
      <span className="flex items-center gap-1 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
        <Flame className="w-3 h-3" /> VIOLATED / ACTION REQUIRED
      </span>
    );
  }

  return (
    <div className="w-full h-full bg-slate-950 p-6 overflow-y-auto font-sans text-slate-100 select-none scrollbar-none">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Document Header Card */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-2xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono font-black text-sm">
                {adr.decisionId}
              </div>
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                {adr.category} • {adr.repository}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {statusBadge}
              <span className="px-2.5 py-0.5 rounded-full bg-slate-950 text-cyan-400 border border-slate-800 text-[10px] font-mono font-bold">
                AI Confidence: {adr.aiConfidenceScorePct}%
              </span>
            </div>
          </div>

          <h1 className="text-2xl font-black text-white tracking-tight leading-snug">
            {adr.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 pt-1">
            <span>Author: <strong className="text-slate-200">{adr.author}</strong></span>
            <span>Date: <strong className="text-slate-200">{adr.date}</strong></span>
            <span>Est. Effort: <strong className="text-amber-300">{adr.engineeringEffortHours} hrs</strong></span>
            <span>Cost: <strong className="text-emerald-300">{adr.estimatedCost}</strong></span>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-800/80">
            <Button
              onClick={() => onSimulate(adr.id)}
              className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-500/40 font-bold text-xs gap-1.5 rounded-xl h-8"
            >
              <FlaskConical className="w-3.5 h-3.5" /> Simulate Architecture
            </Button>

            <Button
              onClick={() => {
                setVotes((v) => ({ ...v, approve: v.approve + 1 }));
                onApprove(adr.id);
              }}
              className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-500/40 font-bold text-xs gap-1.5 rounded-xl h-8"
            >
              <ThumbsUp className="w-3.5 h-3.5" /> Approve Decision ({votes.approve})
            </Button>

            <button
              onClick={handleCopyLink}
              className="p-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white ml-auto"
              title="Copy Spec Link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Section 1: Context & Problem Statement */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider block">1. Architecture Context</span>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">{adr.context}</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block">2. Problem Statement</span>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">{adr.problemStatement}</p>
          </div>
        </div>

        {/* Section 2: Decision & Alternatives */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider block">3. Decision & Solution</span>
          <p className="text-sm font-bold text-white font-sans leading-relaxed">{adr.decision}</p>

          <div className="pt-2 border-t border-slate-800/60">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block mb-1">Alternatives Considered:</span>
            <div className="flex flex-wrap gap-2">
              {adr.alternativesConsidered.map((alt, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300">
                  {alt}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Pros, Cons & Trade-offs Matrix */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider block">4. Pros, Cons & Trade-offs Matrix</span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
            <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
              <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase block">Pros (+)</span>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                {adr.pros.map((pro, idx) => (
                  <li key={idx}>{pro}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-1">
              <span className="text-[10px] font-mono font-bold text-rose-400 uppercase block">Cons (-)</span>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                {adr.cons.map((con, idx) => (
                  <li key={idx}>{con}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-sans text-cyan-200">
            <span className="font-mono text-[10px] font-bold text-cyan-400 uppercase block mb-0.5">Core Trade-off Summary:</span>
            {adr.tradeoffs}
          </div>
        </div>

        {/* Section 4: Rollback & Migration Strategy */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider block">5. Migration Strategy</span>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">{adr.migrationStrategy}</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-wider block">6. Canary Rollback Strategy</span>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">{adr.rollbackStrategy}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
