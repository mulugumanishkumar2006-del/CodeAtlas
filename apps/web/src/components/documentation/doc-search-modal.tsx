'use client';

import React, { useState } from 'react';
import { DocPage } from './doc-types';
import { Search, X, Sparkles, ArrowRight, FileText, CheckCircle2, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DocSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  docs: DocPage[];
  onSelectDoc: (id: string) => void;
}

const SEARCH_PRESETS = [
  'Explain checkout flow.',
  'Where is authentication implemented?',
  'Show deployment architecture.',
  'Find API documentation.',
  'Show payment workflow.',
  'Find onboarding guide.',
];

export function DocSearchModal({
  isOpen,
  onClose,
  docs,
  onSelectDoc,
}: DocSearchModalProps) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!isOpen) return null;

  const searchResults = docs
    .map((d) => {
      let score = 70;
      const q = query.toLowerCase();

      if (!query) return { doc: d, score: 95 };

      if (d.title.toLowerCase().includes(q)) score += 25;
      if (d.summary.toLowerCase().includes(q)) score += 15;
      if (d.typeId.toLowerCase().includes(q)) score += 20;

      return { doc: d, score: Math.min(score, 99.8) };
    })
    .filter((res) => {
      if (selectedCategory !== 'all' && res.doc.category !== selectedCategory) return false;
      if (!query) return true;
      return res.score > 75;
    })
    .sort((a, b) => b.score - a.score);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/75 backdrop-blur-md font-sans">
      <div className="w-full max-w-3xl rounded-2xl bg-slate-950 border border-cyan-500/30 shadow-2xl shadow-cyan-950/80 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Bar Header */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type semantic query (e.g. 'Where is authentication implemented?')..."
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none font-mono"
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-slate-500 hover:text-slate-300">
              <X className="w-4 h-4" />
            </button>
          )}
          <button onClick={onClose} className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white">
            <kbd className="px-1.5 py-0.5 text-[9px] font-mono">ESC</kbd>
          </button>
        </div>

        {/* Quick Search Presets */}
        <div className="px-4 py-2 bg-slate-900/40 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto scrollbar-none font-mono text-[11px]">
          <span className="text-slate-400 font-bold shrink-0">Sample Queries:</span>
          {SEARCH_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => setQuery(preset)}
              className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 shrink-0 transition-colors"
            >
              {preset}
            </button>
          ))}
        </div>

        {/* Category Filters */}
        <div className="px-4 py-2 bg-slate-950 border-b border-slate-800/80 flex items-center gap-2 font-mono text-xs">
          <span className="text-slate-400 text-[10px] font-bold uppercase flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3 text-cyan-400" /> Filter:
          </span>
          {['all', 'overview', 'code_reference', 'system_apis', 'infrastructure', 'guides'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                'px-2 py-0.5 rounded text-[11px] uppercase transition-colors',
                selectedCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              )}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* AI Query Summary */}
        {query && (
          <div className="p-3.5 bg-gradient-to-r from-cyan-950/40 via-indigo-950/30 to-slate-950 border-b border-slate-800 text-xs font-sans flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-200 font-mono">AI Search Synthesis: </span>
              <span className="text-slate-300">
                Found {searchResults.length} relevant documentation nodes matching query &quot;{query}&quot;. Results interlinked with live code AST symbols.
              </span>
            </div>
          </div>
        )}

        {/* Search Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 font-sans scrollbar-thin scrollbar-thumb-slate-800">
          {searchResults.map(({ doc, score }) => (
            <button
              key={doc.id}
              onClick={() => {
                onSelectDoc(doc.id);
                onClose();
              }}
              className="w-full p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900 text-left transition-all group flex items-start justify-between"
            >
              <div className="space-y-1 pr-4">
                <div className="flex items-center gap-2 font-mono">
                  <FileText className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform shrink-0" />
                  <span className="text-sm font-bold text-slate-100 group-hover:text-cyan-300">
                    {doc.title}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-slate-800 text-slate-400">
                    {doc.typeId}
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{doc.summary}</p>
              </div>

              <div className="flex flex-col items-end shrink-0 font-mono">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                  {score.toFixed(1)}% Match
                </span>
                <span className="text-[9px] text-slate-500 mt-1">v2.4 Live</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
