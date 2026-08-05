'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  ArrowRight,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  FlaskConical,
  Zap,
  ChevronDown,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AIQueryExample, MOCK_AI_QUERIES } from './knowledge-mock-data';

interface KnowledgeAiQueryBarProps {
  onExecuteAiQuery: (query: AIQueryExample) => void;
  activeQueryResult: AIQueryExample | null;
  onClearQueryResult: () => void;
}

export function KnowledgeAiQueryBar({
  onExecuteAiQuery,
  activeQueryResult,
  onClearQueryResult,
}: KnowledgeAiQueryBarProps) {
  const [inputQuery, setInputQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleQuerySubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputQuery.trim()) return;

    // Find matching mock query or pick best template
    const match = MOCK_AI_QUERIES.find((q) =>
      q.query.toLowerCase().includes(inputQuery.toLowerCase())
    ) || {
      query: inputQuery,
      answer: `AI Knowledge Engine resolved graph trajectory for "${inputQuery}": PaymentService executes distributed locks against Redis cluster (cache-redis-billing) to maintain sub-millisecond atomic transactions.`,
      highlightNodes: ['svc-payment', 'cache-redis-billing', 'adr-payment-redis'],
      confidencePct: 95,
      impactAnalysis: `Impact Analysis: Disabling Redis connection forces fallback to PostgreSQL relational locks, elevating P95 transaction latency by 140ms.`,
      nextAction: 'Inspect ADR 042 architecture documentation or run simulation.'
    };

    onExecuteAiQuery(match);
    setShowDropdown(false);
  };

  return (
    <div className="flex flex-col gap-2 p-3 bg-slate-950/90 border-b border-slate-800/80 backdrop-blur-xl shrink-0 z-30 font-sans">
      {/* Search Input Bar */}
      <form onSubmit={handleQuerySubmit} className="relative flex items-center gap-2">
        <div className="relative flex-1 flex items-center">
          <Sparkles className="w-4 h-4 text-cyan-400 absolute left-3.5 pointer-events-none animate-pulse" />
          <input
            type="text"
            placeholder='Ask Natural Language AI (e.g. "Why does PaymentService depend on Redis?", "Find single points of failure")...'
            value={inputQuery}
            onChange={(e) => {
              setInputQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            className="w-full pl-10 pr-10 py-2 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 font-mono shadow-inner transition-all"
          />
          {inputQuery && (
            <button
              type="button"
              onClick={() => setInputQuery('')}
              className="absolute right-3 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <Button
          type="submit"
          className="bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs gap-1.5 rounded-2xl px-4 py-2 shadow-lg shadow-cyan-950/50 shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5" /> Ask AI Engine
        </Button>
      </form>

      {/* Suggested Prompt Dropdown */}
      {showDropdown && !activeQueryResult && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-2 shadow-2xl font-mono text-xs space-y-1 max-h-48 overflow-y-auto">
          <div className="text-[10px] text-slate-500 font-bold uppercase px-3 py-1 border-b border-slate-900">
            Suggested Knowledge Queries
          </div>
          {MOCK_AI_QUERIES.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setInputQuery(q.query);
                onExecuteAiQuery(q);
                setShowDropdown(false);
              }}
              className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-slate-900 text-slate-300 hover:text-white flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2 truncate">
                <HelpCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate">{q.query}</span>
              </div>
              <ArrowRight className="w-3 h-3 text-slate-500 shrink-0" />
            </button>
          ))}
        </div>
      )}

      {/* Active AI Answer Card */}
      {activeQueryResult && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-950 to-indigo-950/40 border border-cyan-500/40 space-y-2.5 font-mono text-xs shadow-2xl relative animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold">
                {activeQueryResult.confidencePct}% CONFIDENCE
              </span>
              <span className="text-[10px] text-slate-400 font-bold">AI KNOWLEDGE REASONER</span>
            </div>

            <button
              onClick={onClearQueryResult}
              className="text-[10px] text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-900 border border-slate-800"
            >
              Dismiss
            </button>
          </div>

          <p className="text-xs font-sans text-white leading-relaxed font-medium">
            {activeQueryResult.answer}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] font-sans">
            <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300">
              <span className="text-[9px] font-mono text-amber-400 font-bold uppercase block mb-0.5">Impact Analysis</span>
              <span>{activeQueryResult.impactAnalysis}</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300">
              <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase block mb-0.5">Recommended Action</span>
              <span>{activeQueryResult.nextAction}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
