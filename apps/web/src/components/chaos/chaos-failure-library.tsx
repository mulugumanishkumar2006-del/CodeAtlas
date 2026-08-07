'use client';

import React, { useState } from 'react';
import { ChaosFailureTemplate, ResilienceScorecard } from './chaos-types';
import { Flame, Play, ShieldAlert, CheckCircle2, Clock, Activity, Zap, Server } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChaosFailureLibraryProps {
  scorecard: ResilienceScorecard;
  templates: ChaosFailureTemplate[];
  onExecuteExperiment: (template: ChaosFailureTemplate) => void;
}

export function ChaosFailureLibrary({ scorecard, templates, onExecuteExperiment }: ChaosFailureLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templates[0]?.id || '');

  const filteredTemplates = templates.filter((t) => {
    return selectedCategory === 'all' || t.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 font-sans shadow-xl">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3 font-mono">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-rose-400" />
          <h2 className="text-sm font-bold text-slate-100">
            Enterprise Chaos Engineering & Resilience Scorecard
          </h2>
        </div>

        <span className="px-2 py-0.5 rounded text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/30 font-mono">
          Gremlin + Chaos Monkey Protocol
        </span>
      </div>

      {/* Resilience Scorecard Header Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Resilience Score:</span>
          <span className="text-sm font-black text-emerald-400">{scorecard.systemResilienceScorePct}%</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">System Availability:</span>
          <span className="text-sm font-black text-cyan-300">{scorecard.availabilityPct}%</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Recovery MTTR:</span>
          <span className="text-sm font-black text-purple-300">{scorecard.recoveryReadinessMttrMins} Mins</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Active Scenarios:</span>
          <span className="text-sm font-black text-amber-400">{scorecard.activeExperimentsCount} Experiments</span>
        </div>
      </div>

      {/* Failure Library Filter Buttons */}
      <div className="flex flex-wrap gap-1.5 font-mono text-xs">
        {['all', 'Database', 'Cache', 'Queue', 'Compute', 'Network', 'Kubernetes', 'Cloud'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              'px-3 py-1.5 rounded-lg border transition-all text-xs uppercase font-bold',
              selectedCategory === cat
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-md'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Failure Scenario Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono">
        {filteredTemplates.map((tpl) => (
          <div
            key={tpl.id}
            onClick={() => {
              setSelectedTemplateId(tpl.id);
              onExecuteExperiment(tpl);
            }}
            className={cn(
              'p-4 rounded-xl border transition-all cursor-pointer space-y-2',
              selectedTemplateId === tpl.id
                ? 'bg-slate-950 border-rose-500/50 shadow-lg shadow-rose-500/10'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            )}
          >
            <div className="flex items-center justify-between border-b border-slate-900 pb-2">
              <span className="font-bold text-xs text-slate-100">{tpl.title}</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-500/10 text-rose-400 uppercase">
                {tpl.severity}
              </span>
            </div>

            <p className="text-[11px] text-slate-400 font-sans leading-snug">{tpl.description}</p>

            <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
              <span>Target: <strong className="text-cyan-300">{tpl.targetService}</strong></span>
              <span>Est. MTTR: <strong className="text-emerald-400">{tpl.estimatedMttrMinutes} mins</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
