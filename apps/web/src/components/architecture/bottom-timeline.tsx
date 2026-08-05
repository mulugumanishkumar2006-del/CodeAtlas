'use client';

import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Clock,
  GitBranch,
  History,
  Sparkles,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { MOCK_TIMELINE_MILESTONES, TimelineMilestone } from './architecture-mock-data';

interface BottomTimelineProps {
  currentMilestoneIndex: number;
  onSelectMilestoneIndex: (idx: number) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export function BottomTimeline({
  currentMilestoneIndex,
  onSelectMilestoneIndex,
  isOpen,
  onToggleOpen,
}: BottomTimelineProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState<number>(1);

  const activeMilestone = MOCK_TIMELINE_MILESTONES[currentMilestoneIndex] || MOCK_TIMELINE_MILESTONES[0];

  // Auto playback interval
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        onSelectMilestoneIndex(
          (currentMilestoneIndex + 1) % MOCK_TIMELINE_MILESTONES.length
        );
      }, 3000 / playSpeed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, playSpeed, currentMilestoneIndex, onSelectMilestoneIndex]);

  if (!isOpen) {
    return (
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 font-sans">
        <button
          onClick={onToggleOpen}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 text-slate-200 text-xs font-bold font-mono shadow-2xl backdrop-blur-xl transition-all"
        >
          <Clock className="w-4 h-4 text-cyan-400" />
          <span>Architecture Evolution Timeline ({activeMilestone.version})</span>
          <ChevronUp className="w-4 h-4 text-slate-500" />
        </button>
      </div>
    );
  }

  return (
    <div className="border-t border-slate-800/80 bg-slate-950/95 backdrop-blur-xl shrink-0 z-30 font-mono text-xs select-none shadow-2xl">
      {/* Header & Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2 border-b border-slate-900">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
            <Clock className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider font-black">EVOLUTION TIMELINE</span>
          </div>

          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1">
            <button
              onClick={() => onSelectMilestoneIndex(Math.max(0, currentMilestoneIndex - 1))}
              className="p-1 rounded-lg text-slate-400 hover:text-white"
              title="Step Back"
            >
              <SkipBack className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-1.5 rounded-lg font-bold text-xs flex items-center gap-1 ${
                isPlaying ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-cyan-300 hover:bg-slate-700'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            </button>
            <button
              onClick={() => onSelectMilestoneIndex((currentMilestoneIndex + 1) % MOCK_TIMELINE_MILESTONES.length)}
              className="p-1 rounded-lg text-slate-400 hover:text-white"
              title="Step Forward"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => setPlaySpeed((s) => (s === 1 ? 2 : s === 2 ? 4 : 1))}
            className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[10px] text-slate-400 font-bold hover:text-white"
          >
            {playSpeed}x Speed
          </button>
        </div>

        {/* Current Active Milestone Overview */}
        <div className="flex items-center gap-3 text-slate-300">
          <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold text-xs">
            {activeMilestone.version}
          </span>
          <span className="font-bold text-white text-xs">{activeMilestone.title}</span>
          <span className="text-[10px] text-slate-500">({activeMilestone.date})</span>
        </div>

        <button
          onClick={onToggleOpen}
          className="p-1 rounded-lg text-slate-400 hover:text-white"
          title="Minimize Timeline"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Interactive Milestone Nodes Slider */}
      <div className="px-6 py-3 flex items-center justify-between relative overflow-x-auto">
        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-slate-800 z-0" />

        {MOCK_TIMELINE_MILESTONES.map((milestone, idx) => {
          const isActive = idx === currentMilestoneIndex;
          const isPassed = idx <= currentMilestoneIndex;

          return (
            <button
              key={milestone.version}
              onClick={() => {
                onSelectMilestoneIndex(idx);
                setIsPlaying(false);
              }}
              className="relative z-10 flex flex-col items-center group cursor-pointer"
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                  isActive
                    ? 'bg-cyan-400 border-white text-slate-950 scale-125 shadow-lg shadow-cyan-500/50 font-black'
                    : isPassed
                    ? 'bg-slate-900 border-cyan-500 text-cyan-400'
                    : 'bg-slate-950 border-slate-800 text-slate-600'
                }`}
              >
                <span className="text-[9px]">{idx + 1}</span>
              </div>
              <span
                className={`text-[10px] font-bold mt-1.5 transition-colors ${
                  isActive ? 'text-cyan-300' : 'text-slate-500 group-hover:text-slate-300'
                }`}
              >
                {milestone.version}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
