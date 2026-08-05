'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FlaskConical,
  Zap,
  GitPullRequest,
  GitCommit,
  User,
  ThumbsUp,
  FileCode,
  Flame
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdrRecord } from './adr-mock-data';

interface AdrInspectorPanelProps {
  selectedAdr: AdrRecord | null;
  onClose: () => void;
  onSimulate: (adrId: string) => void;
  onApprove: (adrId: string) => void;
}

export function AdrInspectorPanel({
  selectedAdr,
  onClose,
  onSimulate,
  onApprove,
}: AdrInspectorPanelProps) {
  const [activeTab, setActiveTab] = useState<'governance' | 'services' | 'prs'>('governance');

  if (!selectedAdr) return null;

  return (
    <div className="w-84 bg-slate-950/95 border-l border-slate-800/80 flex flex-col h-full shrink-0 select-none z-20 font-sans backdrop-blur-xl animate-in slide-in-from-right duration-200 shadow-2xl">
      {/* Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center font-mono font-bold text-cyan-300 text-sm shrink-0">
            {selectedAdr.decisionId}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-cyan-400 truncate">
              GOVERNANCE & IMPACT
            </span>
            <h3 className="text-sm font-black text-white truncate leading-tight">
              {selectedAdr.title}
            </h3>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 text-xs font-mono"
        >
          ✕
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center border-b border-slate-800/80 p-1 bg-slate-950/60 text-[10px] font-mono">
        {(['governance', 'services', 'prs'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-1 rounded-lg capitalize font-bold transition-all ${
              activeTab === tab ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono scrollbar-none text-xs">
        {/* Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={() => onSimulate(selectedAdr.id)}
            className="bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/40 font-bold text-xs gap-1.5 rounded-xl h-8"
          >
            <FlaskConical className="w-3.5 h-3.5" /> Simulate Spec
          </Button>
          <Button
            onClick={() => onApprove(selectedAdr.id)}
            className="bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 font-bold text-xs gap-1.5 rounded-xl h-8"
          >
            <ThumbsUp className="w-3.5 h-3.5" /> Approve Decision
          </Button>
        </div>

        {/* Tab: Governance */}
        {activeTab === 'governance' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <span className="text-[10px] text-cyan-400 font-bold uppercase block">Architecture Committee Votes</span>
              <div className="grid grid-cols-3 gap-2 text-[10px]">
                <div className="p-2 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-center">
                  <span className="text-slate-400 block">Approve</span>
                  <span className="text-base font-black text-emerald-400">{selectedAdr.committeeVotes.approve}</span>
                </div>
                <div className="p-2 rounded-xl bg-rose-950/20 border border-rose-500/30 text-center">
                  <span className="text-slate-400 block">Reject</span>
                  <span className="text-base font-black text-rose-400">{selectedAdr.committeeVotes.reject}</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-slate-400 block">Abstain</span>
                  <span className="text-base font-black text-slate-300">{selectedAdr.committeeVotes.abstain}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-[11px]">
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Security Posture</span>
                <span className="font-bold text-emerald-300">{selectedAdr.securityImpact}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Scalability</span>
                <span className="font-bold text-cyan-300">{selectedAdr.scalabilityImpact}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Services */}
        {activeTab === 'services' && (
          <div className="space-y-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Affected Microservices</span>
            {selectedAdr.affectedServices.map((service, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-cyan-300 font-bold flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>{service}</span>
              </div>
            ))}
          </div>
        )}

        {/* Tab: PRs & Commits */}
        {activeTab === 'prs' && (
          <div className="space-y-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Linked GitHub Pull Requests</span>
            {selectedAdr.relatedPrs.map((pr, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-indigo-300 font-bold flex items-center gap-2">
                <GitPullRequest className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>{pr}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
