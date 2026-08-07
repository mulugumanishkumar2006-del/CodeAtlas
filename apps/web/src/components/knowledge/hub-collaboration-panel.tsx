'use client';

import React from 'react';
import { ProactiveRecommendation } from './hub-types';
import { Bookmark, Star, MessageSquare, Users, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HubCollaborationPanelProps {
  recommendations: ProactiveRecommendation[];
}

export function HubCollaborationPanel({ recommendations }: HubCollaborationPanelProps) {
  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 font-sans shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold text-slate-100">
            Proactive AI Knowledge Assistant & Collaboration Hub
          </h3>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/30 font-mono">
          Proactive AI Active
        </span>
      </div>

      {/* Proactive AI Recommendation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-sans">
        {recommendations.map((rec) => (
          <div key={rec.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono">
            <div className="flex items-center justify-between border-b border-slate-900 pb-2">
              <span className="font-bold text-cyan-300 text-xs">{rec.title}</span>
              <span className="text-[10px] text-amber-400 font-bold">{rec.relevancePct}% Match</span>
            </div>

            <p className="text-slate-300 font-sans text-xs leading-relaxed">{rec.summary}</p>

            <div className="pt-1 flex justify-end">
              <a
                href={rec.targetLink}
                className="px-2.5 py-1 rounded bg-slate-900 text-cyan-300 hover:text-white border border-slate-800 text-[10px] flex items-center gap-1"
              >
                <span>Inspect Context</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
