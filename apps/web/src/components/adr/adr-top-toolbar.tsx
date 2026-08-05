'use client';

import React from 'react';
import {
  FileText,
  Clock,
  Network,
  GitBranch,
  Search,
  Sparkles,
  Maximize2,
  Minimize2,
  RotateCcw,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ADR_VIEWS = [
  { name: 'Cards View', icon: FileText, desc: 'Notion-style interactive ADR document reader' },
  { name: 'Timeline View', icon: Clock, desc: 'Decision lifecycle playback' },
  { name: 'Knowledge Graph View', icon: Network, desc: 'Connected ADR graph canvas' },
  { name: 'ADR Diff View', icon: GitBranch, desc: 'Side-by-side decision comparison' },
];

interface AdrTopToolbarProps {
  currentView: string;
  onSelectView: (view: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenGenerator: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onResetView: () => void;
}

export function AdrTopToolbar({
  currentView,
  onSelectView,
  searchQuery,
  onSearchChange,
  onOpenGenerator,
  isFullscreen,
  onToggleFullscreen,
  onResetView,
}: AdrTopToolbarProps) {
  return (
    <div className="flex flex-col border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl shrink-0 z-30 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5">
        {/* Visual Views Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-2xl font-mono text-xs">
          {ADR_VIEWS.map((view) => {
            const VIcon = view.icon;
            const isSelected = view.name === currentView;

            return (
              <button
                key={view.name}
                onClick={() => onSelectView(view.name)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold transition-all ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-inner'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <VIcon className="w-3.5 h-3.5" />
                <span>{view.name}</span>
              </button>
            );
          })}
        </div>

        {/* Center Search Bar */}
        <div className="flex-1 max-w-sm mx-2">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-cyan-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search ADRs by Title, ID, Service, Category..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 font-mono shadow-inner transition-all"
            />
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2">
          <Button
            onClick={onOpenGenerator}
            className="bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs gap-1.5 rounded-xl px-3 py-1.5 shadow-md shadow-cyan-950/50"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
            <span>Auto-Generate ADR</span>
          </Button>

          <button
            onClick={onToggleFullscreen}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={onResetView}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
