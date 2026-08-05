'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Flame,
  AlertTriangle,
  CheckCircle2,
  Focus,
  X,
  ShieldAlert,
  Code2,
  Layers,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GraphAnalyticsIssue, MOCK_GRAPH_ANALYTICS_ISSUES } from './knowledge-mock-data';

interface KnowledgeAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFocusNodes: (nodeIds: string[]) => void;
}

export function KnowledgeAnalyticsModal({
  isOpen,
  onClose,
  onFocusNodes,
}: KnowledgeAnalyticsModalProps) {
  const [selectedType, setSelectedType] = useState<string>('All');

  if (!isOpen) return null;

  const issueTypes = [
    'All',
    'Single Point of Failure',
    'Knowledge Island',
    'Dead Code'
  ];

  const filteredIssues = selectedType === 'All'
    ? MOCK_GRAPH_ANALYTICS_ISSUES
    : MOCK_GRAPH_ANALYTICS_ISSUES.filter((i) => i.type === selectedType);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto font-sans">
      <div className="w-full max-w-4xl bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 animate-in zoom-in-95 duration-150 relative">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white tracking-tight">Automated Graph Analytics Engine</h2>
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-mono font-bold">
                  {MOCK_GRAPH_ANALYTICS_ISSUES.length} BOTTLENECKS
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Graph PageRank centrality, single points of failure (SPOF), and knowledge islands detection.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none font-mono text-xs">
          {issueTypes.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-bold transition-all ${
                selectedType === t
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Issues List */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 scrollbar-none font-mono">
          {filteredIssues.map((issue) => (
            <div
              key={issue.id}
              className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold uppercase">
                    {issue.severity} RISK
                  </span>
                  <span className="text-xs font-bold text-cyan-400">{issue.type}</span>
                </div>

                <Button
                  onClick={() => {
                    onFocusNodes(issue.affectedNodes);
                    onClose();
                  }}
                  className="bg-cyan-500/15 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-500/40 font-bold text-xs gap-1.5 h-7 rounded-xl"
                >
                  <Focus className="w-3.5 h-3.5" /> Focus Graph Canvas
                </Button>
              </div>

              <h4 className="text-sm font-bold text-white font-sans">{issue.title}</h4>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">{issue.description}</p>

              <div className="flex items-start gap-2 text-xs font-sans text-emerald-300 bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-500/30">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold block">AI Recommendation:</span>
                  <span>{issue.recommendation}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
