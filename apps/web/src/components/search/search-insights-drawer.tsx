'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, FlaskConical, ArrowRight, Zap, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchInsightObservation } from './search-mock-data';

interface SearchInsightsDrawerProps {
  observations: SearchInsightObservation[];
  onClose?: () => void;
}

export function SearchInsightsDrawer({ observations }: SearchInsightsDrawerProps) {
  const router = useRouter();

  return (
    <div className="w-84 bg-slate-950/95 border-l border-slate-800/80 flex flex-col h-full shrink-0 select-none z-20 font-sans backdrop-blur-xl animate-in slide-in-from-right duration-200 shadow-2xl">
      {/* Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-black tracking-tight text-white uppercase">AI SEARCH OBSERVATIONS</span>
            <span className="text-[10px] font-mono text-slate-400">Architectural Synthesizer</span>
          </div>
        </div>
      </div>

      {/* Observations List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs scrollbar-none">
        {observations.map((obs) => (
          <div key={obs.id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-cyan-400 uppercase">AI CONFIDENCE: {obs.confidencePct}%</span>
            </div>

            <h4 className="text-xs font-bold text-white font-sans">{obs.title}</h4>
            <p className="text-[11px] text-slate-300 font-sans leading-relaxed">{obs.observation}</p>

            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[10px] text-slate-400">
              <span className="text-amber-400 font-bold block mb-0.5">Evidence:</span>
              <span>{obs.evidence}</span>
            </div>

            <Button
              onClick={() => router.push(obs.targetUrl)}
              className="w-full bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs gap-1.5 rounded-xl h-8 shadow-md"
            >
              <Zap className="w-3.5 h-3.5" /> {obs.suggestedAction}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
