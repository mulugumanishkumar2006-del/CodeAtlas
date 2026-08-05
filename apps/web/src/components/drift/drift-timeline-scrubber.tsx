'use client';

import React from 'react';
import { Clock, Play, Pause, ChevronUp, ChevronDown, Activity, Sparkles } from 'lucide-react';
import { ArchitectureBaselineSnapshot, MOCK_SNAPSHOT_BASELINES } from './drift-mock-data';

interface DriftTimelineScrubberProps {
  baselines: ArchitectureBaselineSnapshot[];
  selectedBaselineId: string;
  onSelectBaseline: (id: string) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export function DriftTimelineScrubber({
  baselines,
  selectedBaselineId,
  onSelectBaseline,
  isOpen,
  onToggleOpen,
}: DriftTimelineScrubberProps) {
  if (!isOpen) {
    return (
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 font-sans">
        <button
          onClick={onToggleOpen}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 text-slate-200 text-xs font-bold font-mono shadow-2xl backdrop-blur-xl transition-all"
        >
          <Clock className="w-4 h-4 text-cyan-400" />
          <span>Architecture Evolution Timeline Scrubber</span>
          <ChevronUp className="w-4 h-4 text-slate-500" />
        </button>
      </div>
    );
  }

  const activeBaseline = baselines.find((b) => b.id === selectedBaselineId) || baselines[0];

  return (
    <div className="border-t border-slate-800/80 bg-slate-950/95 backdrop-blur-xl shrink-0 z-30 font-mono text-xs select-none shadow-2xl">
      {/* Control Bar Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2 border-b border-slate-900">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
            <Clock className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider font-black">EVOLUTION TIMELINE SCRUBBER</span>
          </div>

          <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold text-xs">
            {activeBaseline.releaseTag}
          </span>
          <span className="text-white font-bold text-xs">{activeBaseline.name}</span>
        </div>

        <button
          onClick={onToggleOpen}
          className="p-1 rounded-lg text-slate-400 hover:text-white"
          title="Minimize Scrubber"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Timeline Milestone Slider */}
      <div className="px-6 py-4 flex items-center justify-between relative">
        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-slate-800 z-0" />

        {baselines.map((b) => {
          const isSelected = b.id === selectedBaselineId;

          return (
            <button
              key={b.id}
              onClick={() => onSelectBaseline(b.id)}
              className="relative z-10 flex flex-col items-center group cursor-pointer"
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${
                  isSelected
                    ? 'bg-cyan-400 border-white text-slate-950 scale-125 shadow-lg shadow-cyan-500/50 font-black'
                    : 'bg-slate-900 border-slate-700 text-slate-400 group-hover:border-cyan-400'
                }`}
              >
                <span className="text-[9px]">{b.releaseTag}</span>
              </div>
              <span
                className={`text-[9px] font-bold mt-1.5 truncate max-w-[110px] transition-colors ${
                  isSelected ? 'text-cyan-300' : 'text-slate-500 group-hover:text-slate-300'
                }`}
              >
                {b.name.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
