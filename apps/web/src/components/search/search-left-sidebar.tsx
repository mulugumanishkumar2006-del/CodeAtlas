'use client';

import React, { useState } from 'react';
import {
  Layers,
  Network,
  Zap,
  Flame,
  Globe,
  Database,
  FileText,
  Search,
  TrendingUp,
  Clock
} from 'lucide-react';
import { SearchModeType, TRENDING_SEARCHES } from './search-mock-data';

export const SEARCH_MODES_LIST: { mode: SearchModeType; icon: any }[] = [
  { mode: 'Architecture', icon: Layers },
  { mode: 'Dependency', icon: Zap },
  { mode: 'Execution', icon: Globe },
  { mode: 'Performance', icon: Flame },
  { mode: 'Security', icon: FileText },
  { mode: 'Documentation', icon: FileText },
  { mode: 'Repository', icon: Network },
  { mode: 'Simulation', icon: Zap },
  { mode: 'Monitoring', icon: Flame },
  { mode: 'Knowledge', icon: Network },
  { mode: 'Timeline', icon: Clock },
];

interface SearchLeftSidebarProps {
  selectedMode: SearchModeType;
  onSelectMode: (mode: SearchModeType) => void;
  onSelectPresetQuery: (q: string) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export function SearchLeftSidebar({
  selectedMode,
  onSelectMode,
  onSelectPresetQuery,
  isOpen,
  onToggleOpen,
}: SearchLeftSidebarProps) {
  if (!isOpen) {
    return (
      <button
        onClick={onToggleOpen}
        className="fixed left-4 top-28 z-40 p-2 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 hover:text-white shadow-xl"
        title="Open Search Categories"
      >
        <Search className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="w-72 bg-slate-950/95 border-r border-slate-800/80 flex flex-col h-full shrink-0 select-none z-20 font-sans backdrop-blur-xl">
      {/* Header */}
      <div className="p-3 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
            <Search className="w-4 h-4" />
          </div>
          <span className="text-xs font-black tracking-tight text-white uppercase">SEARCH MODES (11 MODES)</span>
        </div>
        <button
          onClick={onToggleOpen}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 text-xs font-mono"
        >
          ✕
        </button>
      </div>

      {/* 11 Search Modes List */}
      <div className="p-2 border-b border-slate-800/80 space-y-1 font-mono text-xs">
        {SEARCH_MODES_LIST.map((item) => {
          const MIcon = item.icon;
          const isSelected = selectedMode === item.mode;
          return (
            <button
              key={item.mode}
              onClick={() => onSelectMode(item.mode)}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-left transition-all ${
                isSelected
                  ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-200 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <MIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
              <span>{item.mode} Search</span>
            </button>
          );
        })}
      </div>

      {/* Trending Engineering Searches */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 font-mono text-xs scrollbar-none">
        <span className="text-[10px] text-cyan-400 font-bold uppercase flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5" /> Trending Searches
        </span>

        <div className="space-y-1.5">
          {TRENDING_SEARCHES.map((query) => (
            <button
              key={query}
              onClick={() => onSelectPresetQuery(query)}
              className="w-full text-left p-2 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 text-[11px] text-slate-300 hover:text-white truncate block transition-all"
            >
              {query}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
