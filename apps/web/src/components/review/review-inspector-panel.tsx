'use client';

import React, { useState } from 'react';
import {
  Flame,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FlaskConical,
  Zap,
  ShieldCheck,
  FileCode,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ReviewFinding } from './review-mock-data';

interface ReviewInspectorPanelProps {
  selectedFinding: ReviewFinding | null;
  onClose: () => void;
  onSimulate: (findingId: string) => void;
}

export function ReviewInspectorPanel({
  selectedFinding,
  onClose,
  onSimulate,
}: ReviewInspectorPanelProps) {
  const [activeTab, setActiveTab] = useState<'finding' | 'framework' | 'impact'>('finding');

  if (!selectedFinding) return null;

  return (
    <div className="w-84 bg-slate-950/95 border-l border-slate-800/80 flex flex-col h-full shrink-0 select-none z-20 font-sans backdrop-blur-xl animate-in slide-in-from-right duration-200 shadow-2xl">
      {/* Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center shrink-0 shadow-inner text-rose-400">
            <Flame className="w-5 h-5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-cyan-400 truncate">
              ARCHITECTURE CRITIQUE FINDING
            </span>
            <h3 className="text-sm font-black text-white truncate leading-tight">
              {selectedFinding.title}
            </h3>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 text-xs font-mono"
        >
          ✕
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center border-b border-slate-800/80 p-1 bg-slate-950/60 text-[10px] font-mono">
        {(['finding', 'framework', 'impact'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-1 rounded-lg capitalize font-bold transition-all ${
              activeTab === tab ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono scrollbar-none text-xs">
        {/* Action Triggers */}
        <Button
          onClick={() => onSimulate(selectedFinding.id)}
          className="w-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-500/40 font-bold text-xs gap-1.5 rounded-xl h-8"
        >
          <FlaskConical className="w-3.5 h-3.5" /> Simulate Recommended Solution
        </Button>

        {/* Tab: Finding */}
        {activeTab === 'finding' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-2">
              <span className="text-[10px] text-rose-400 font-bold uppercase block">Empirical Evidence</span>
              <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                {selectedFinding.evidence}
              </p>
            </div>

            <div className="space-y-2 text-[11px]">
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Affected Component</span>
                <span className="font-bold text-cyan-300 truncate max-w-[150px]">{selectedFinding.affectedComponent}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Severity</span>
                <span className="font-bold text-rose-400">{selectedFinding.severity}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Framework */}
        {activeTab === 'framework' && (
          <div className="space-y-3">
            <span className="text-[10px] text-cyan-400 font-bold uppercase block">Pillar & Standard Mapping</span>
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-[11px] text-cyan-200 font-sans leading-relaxed">
              {selectedFinding.frameworkMapping}
            </div>
          </div>
        )}

        {/* Tab: Impact */}
        {activeTab === 'impact' && (
          <div className="space-y-3 font-sans text-xs">
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase block">Business & Scalability Impact</span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {selectedFinding.businessImpact}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
