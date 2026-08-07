'use client';

import React, { useState } from 'react';
import { NaturalQueryExample, SimulationResult } from './twin-types';
import { Sparkles, Send, CheckCircle2, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TwinNaturalQueryProps {
  queries: NaturalQueryExample[];
  simulationResults: SimulationResult[];
  onRunSimulation: (q: string) => void;
}

export function TwinNaturalQuery({ queries, simulationResults, onRunSimulation }: TwinNaturalQueryProps) {
  const [selectedQuery, setSelectedQuery] = useState(queries[1]?.query || '');
  const [customInput, setCustomInput] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);

  const activeResult = simulationResults[0];

  const handleExecute = (qToUse?: string) => {
    const q = qToUse || customInput || selectedQuery;
    setIsSimulating(true);
    onRunSimulation(q);
    setTimeout(() => {
      setIsSimulating(false);
    }, 600);
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 font-sans shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-slate-100">
            Natural Language Simulation Assistant
          </h3>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono">
          AI Architecture Simulation
        </span>
      </div>

      {/* Preset Natural Queries */}
      <div className="space-y-2 font-mono text-xs">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          Ask Architectural Simulation Questions:
        </span>
        <div className="flex flex-wrap gap-2">
          {queries.map((qItem, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedQuery(qItem.query);
                setCustomInput('');
                handleExecute(qItem.query);
              }}
              className={cn(
                'px-3 py-1.5 rounded-lg border transition-all text-xs text-left',
                selectedQuery === qItem.query && !customInput
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold shadow-md'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              )}
            >
              {qItem.query}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Natural Query Input */}
      <div className="flex gap-2 font-mono">
        <input
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          placeholder="Ask natural simulation (e.g. 'What if we replace PostgreSQL with CockroachDB?')..."
          className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
          onKeyDown={(e) => e.key === 'Enter' && handleExecute()}
        />
        <button
          onClick={() => handleExecute()}
          disabled={isSimulating}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 font-bold text-xs text-white shadow-lg flex items-center gap-1.5 hover:opacity-90 disabled:opacity-50"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{isSimulating ? 'Simulating...' : 'Run Simulation'}</span>
        </button>
      </div>

      {/* Simulation Result Card */}
      {activeResult && (
        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4 font-sans text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-900 pb-3 font-mono">
            <span className="font-bold text-cyan-300 text-xs">{activeResult.scenarioTitle}</span>
            <span className="px-2.5 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Confidence: {activeResult.confidencePct}%
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-[10px] text-rose-400 font-bold uppercase block">Before State:</span>
              <p className="text-slate-300 text-[11px] font-sans leading-relaxed">{activeResult.architectureComparison.beforeState}</p>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-[10px] text-emerald-400 font-bold uppercase block">After State (Simulated):</span>
              <p className="text-slate-300 text-[11px] font-sans leading-relaxed">{activeResult.architectureComparison.afterState}</p>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs font-mono flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-emerald-300 uppercase text-[9px] block">AI Recommendation:</span>
              <span className="text-slate-100 text-[11px] font-sans font-medium">{activeResult.aiRecommendation}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
