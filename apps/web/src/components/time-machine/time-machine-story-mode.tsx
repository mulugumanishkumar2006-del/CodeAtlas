'use client';

import React from 'react';
import { EngineeringStoryCard } from './time-machine-types';
import { BookOpen, Sparkles, Clock, ArrowDown, CheckCircle2 } from 'lucide-react';

interface TimeMachineStoryModeProps {
  storyCards: EngineeringStoryCard[];
}

export function TimeMachineStoryMode({ storyCards }: TimeMachineStoryModeProps) {
  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 font-sans shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-purple-400" />
          <h3 className="text-sm font-bold text-slate-100">
            Engineering Storytelling Narrative Mode
          </h3>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] bg-purple-500/10 text-purple-300 border border-purple-500/30 font-mono">
          Automated Narrative
        </span>
      </div>

      <div className="space-y-4 relative font-sans">
        <div className="absolute left-6 top-3 bottom-3 w-0.5 bg-slate-800 -z-10" />

        {storyCards.map((card, idx) => (
          <div key={card.id} className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-center font-mono shrink-0 shadow-lg">
              <span className="text-[9px] font-bold text-cyan-400 uppercase">{card.date.split(' ')[0]}</span>
              <span className="text-[10px] font-black text-slate-100">{card.date.split(' ')[1]}</span>
            </div>

            <div className="flex-1 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono">
              <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                <span className="font-bold text-slate-100 text-xs">{card.milestoneTitle}</span>
                <span className="text-[10px] text-cyan-300 font-bold">{card.impactMetrics}</span>
              </div>

              <p className="text-slate-300 font-sans text-xs leading-relaxed">{card.summary}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
