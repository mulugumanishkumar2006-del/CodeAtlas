'use client';

import React, { useState } from 'react';
import { SmartSearchResult } from './hub-types';
import { Search, Sparkles, Layers, CheckCircle2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HubSmartSearchProps {
  results: SmartSearchResult[];
}

export function HubSmartSearch({ results }: HubSmartSearchProps) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredResults = results.filter((r) => {
    const matchesQuery = r.conceptTitle.toLowerCase().includes(query.toLowerCase()) || r.aiSummary.toLowerCase().includes(query.toLowerCase());
    return matchesQuery;
  });

  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 font-sans shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3 font-mono">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-cyan-400" />
          <h2 className="text-sm font-bold text-slate-100">
            Smart Concept-Based Semantic Search Engine
          </h2>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono">
          Semantic Search Active
        </span>
      </div>

      {/* Search Bar */}
      <div className="relative font-mono">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by concept (e.g. 'authentication', 'payment refactoring', 'technical debt')..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 font-sans"
        />
      </div>

      {/* Results List */}
      <div className="space-y-3 font-sans">
        {filteredResults.map((res) => (
          <div
            key={res.id}
            className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 hover:border-cyan-500/40 transition-colors"
          >
            <div className="flex items-center justify-between font-mono text-xs border-b border-slate-900 pb-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-purple-500/10 text-purple-300 border border-purple-500/30">
                  {res.matchedCategory}
                </span>
                <span className="font-bold text-slate-100">{res.conceptTitle}</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold">
                Relevance: {res.relevanceScore}%
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">{res.aiSummary}</p>

            <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 pt-1">
              <span>Connected Nodes: <strong className="text-cyan-300">{res.connectedNodes.join(', ')}</strong></span>
              <span>Updated: {res.lastUpdated}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
