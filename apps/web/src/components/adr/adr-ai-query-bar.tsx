'use client';

import React, { useState } from 'react';
import { Sparkles, Search, ArrowRight, Bot, X, CheckCircle2 } from 'lucide-react';
import { MOCK_AI_CTO_QUERIES, AiCtoQueryAnswer } from './adr-mock-data';

interface AdrAiQueryBarProps {
  onExecuteQuery: (query: string) => void;
  activeQueryResult: AiCtoQueryAnswer | null;
  onClearQueryResult: () => void;
}

export function AdrAiQueryBar({
  onExecuteQuery,
  activeQueryResult,
  onClearQueryResult,
}: AdrAiQueryBarProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    onExecuteQuery(inputValue);
  };

  return (
    <div className="flex flex-col border-b border-slate-800/80 bg-slate-950/95 backdrop-blur-xl shrink-0 z-30 font-sans p-3 space-y-2">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-1 flex items-center">
          <div className="absolute left-3 w-6 h-6 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center pointer-events-none">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>

          <input
            type="text"
            placeholder="Ask AI CTO Assistant (e.g., 'Why was Redis introduced?', 'Why did we choose PostgreSQL?', 'Compare REST vs GraphQL')..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 font-mono shadow-inner transition-all"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-950/50 shrink-0 font-mono"
        >
          <span>Ask AI CTO</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Preset Query Chips */}
      {!activeQueryResult && (
        <div className="flex flex-wrap items-center gap-2 font-mono text-[10px]">
          <span className="text-slate-500 font-bold uppercase text-[9px]">SAMPLE QUERIES:</span>
          {MOCK_AI_CTO_QUERIES.map((q) => (
            <button
              key={q.query}
              onClick={() => {
                setInputValue(q.query);
                onExecuteQuery(q.query);
              }}
              className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800/80 hover:border-cyan-500/40 text-slate-300 hover:text-white transition-colors"
            >
              {q.query}
            </button>
          ))}
        </div>
      )}

      {/* AI Answer Box */}
      {activeQueryResult && (
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/40 space-y-2 animate-in fade-in duration-150 font-sans text-xs relative">
          <button
            onClick={onClearQueryResult}
            className="absolute right-3 top-3 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono font-bold text-[10px]">
              AI CTO CONFIDENCE: {activeQueryResult.confidencePct}%
            </span>
            <span className="font-bold text-white font-mono">{activeQueryResult.query}</span>
          </div>

          <p className="text-slate-200 leading-relaxed font-sans">{activeQueryResult.executiveSummary}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] font-mono pt-1">
            <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-cyan-400 font-bold block mb-0.5">Empirical Evidence:</span>
              <span className="text-slate-300">{activeQueryResult.evidence}</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-amber-400 font-bold block mb-0.5">Key Architectural Trade-offs:</span>
              <span className="text-slate-300">{activeQueryResult.tradeoffs}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
