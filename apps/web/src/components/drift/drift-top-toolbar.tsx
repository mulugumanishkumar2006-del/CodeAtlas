'use client';

import React, { useState } from 'react';
import {
  GitBranch,
  Search,
  Focus,
  Sparkles,
  Maximize2,
  Minimize2,
  RotateCcw,
  ChevronDown,
  Layers,
  Flame,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ArchitectureBaselineSnapshot, MOCK_SNAPSHOT_BASELINES } from './drift-mock-data';

interface DriftTopToolbarProps {
  baselineA: string;
  onSelectBaselineA: (id: string) => void;
  baselineB: string;
  onSelectBaselineB: (id: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenScorecard: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onResetView: () => void;
}

export function DriftTopToolbar({
  baselineA,
  onSelectBaselineA,
  baselineB,
  onSelectBaselineB,
  searchQuery,
  onSearchChange,
  onOpenScorecard,
  isFullscreen,
  onToggleFullscreen,
  onResetView,
}: DriftTopToolbarProps) {
  return (
    <div className="flex flex-col border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl shrink-0 z-30 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5">
        {/* Snapshot A vs Snapshot B Selectors */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-[10px] font-black text-cyan-400 uppercase">COMPARE BASELINE:</span>
          <select
            value={baselineA}
            onChange={(e) => onSelectBaselineA(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white font-bold text-xs focus:border-cyan-500"
          >
            {MOCK_SNAPSHOT_BASELINES.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>

          <span className="text-slate-500 font-bold">VS</span>

          <select
            value={baselineB}
            onChange={(e) => onSelectBaselineB(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-amber-300 font-bold text-xs focus:border-amber-500"
          >
            {MOCK_SNAPSHOT_BASELINES.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>

        {/* Center Search Input */}
        <div className="flex-1 max-w-sm mx-2">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-cyan-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search drifted services, databases, layer violations..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 font-mono shadow-inner transition-all"
            />
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2">
          <Button
            onClick={onOpenScorecard}
            className="bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs gap-1.5 rounded-xl px-3 py-1.5 shadow-md shadow-cyan-950/50"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
            <span>AI Scorecard</span>
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
