'use client';

import React, { useState, useEffect } from 'react';
import { CheckpointSnapshot } from './time-machine-types';
import { Play, Pause, SkipBack, SkipForward, Clock, History, Calendar, CheckCircle2, ShieldCheck, Sparkles, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimeMachineCanvasPlayerProps {
  checkpoints: CheckpointSnapshot[];
  selectedCheckpointId: string;
  onSelectCheckpoint: (id: string) => void;
}

export function TimeMachineCanvasPlayer({
  checkpoints,
  selectedCheckpointId,
  onSelectCheckpoint,
}: TimeMachineCanvasPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 2 | 5 | 10>(1);

  const currentIndex = checkpoints.findIndex((c) => c.id === selectedCheckpointId);
  const activeCheckpoint = checkpoints[currentIndex] || checkpoints[checkpoints.length - 1];

  // Playback timer
  useEffect(() => {
    if (!isPlaying) return;
    const intervalTime = 2000 / playbackSpeed;
    const timer = setInterval(() => {
      onSelectCheckpoint(
        checkpoints[(currentIndex + 1) % checkpoints.length].id
      );
    }, intervalTime);
    return () => clearInterval(timer);
  }, [isPlaying, currentIndex, playbackSpeed, checkpoints, onSelectCheckpoint]);

  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 font-sans shadow-xl">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3 font-mono">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-cyan-400" />
          <h2 className="text-sm font-bold text-slate-100">
            Interactive Repository Evolution Time Machine
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            {activeCheckpoint.versionTag} ({activeCheckpoint.timestamp})
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] bg-purple-500/10 text-purple-300 border border-purple-500/30">
            Commit: {activeCheckpoint.commitSha}
          </span>
        </div>
      </div>

      {/* Cinematic Playback Bar */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 font-bold text-xs text-white shadow-lg flex items-center gap-1.5 hover:opacity-90"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pause Playback' : 'Replay Evolution'}</span>
            </button>

            <button
              onClick={() => onSelectCheckpoint(checkpoints[Math.max(0, currentIndex - 1)].id)}
              className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              onClick={() => onSelectCheckpoint(checkpoints[Math.min(checkpoints.length - 1, currentIndex + 1)].id)}
              className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-400 text-[10px]">Speed:</span>
            {([1, 2, 5, 10] as const).map((spd) => (
              <button
                key={spd}
                onClick={() => setPlaybackSpeed(spd)}
                className={cn(
                  'px-2 py-0.5 rounded text-[10px] font-bold border transition-colors',
                  playbackSpeed === spd
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                )}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

        {/* Timeline Slider */}
        <input
          type="range"
          min={0}
          max={checkpoints.length - 1}
          value={currentIndex}
          onChange={(e) => onSelectCheckpoint(checkpoints[parseInt(e.target.value)].id)}
          className="w-full h-2 rounded-lg bg-slate-900 accent-cyan-400 cursor-pointer"
        />

        {/* Milestone Checkpoint Badges */}
        <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
          {checkpoints.map((chk, idx) => (
            <button
              key={chk.id}
              onClick={() => onSelectCheckpoint(chk.id)}
              className={cn(
                'flex flex-col items-center gap-0.5 transition-colors',
                currentIndex === idx ? 'text-cyan-300 font-bold' : 'hover:text-slate-200'
              )}
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>{chk.versionTag}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Snapshot Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Lines of Code:</span>
          <span className="text-sm font-black text-slate-100">{(activeCheckpoint.totalLines / 1000).toFixed(1)}k LOC</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Cyclomatic Complexity:</span>
          <span className="text-sm font-black text-cyan-300">{activeCheckpoint.cyclomaticComplexity}</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Technical Debt:</span>
          <span className="text-sm font-black text-amber-400">{activeCheckpoint.techDebtHours} Hours</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">P95 Latency:</span>
          <span className="text-sm font-black text-emerald-400">{activeCheckpoint.p95LatencyMs} ms</span>
        </div>
      </div>
    </div>
  );
}
