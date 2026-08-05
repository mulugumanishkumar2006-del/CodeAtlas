'use client';

import React, { useState } from 'react';
import {
  Award,
  Flame,
  Search,
  ShieldCheck,
  Zap,
  Layers,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { ReviewFinding } from './review-mock-data';

interface ReviewLeftSidebarProps {
  findings: ReviewFinding[];
  selectedFindingId: string | null;
  onSelectFinding: (id: string) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export function ReviewLeftSidebar({
  findings,
  selectedFindingId,
  onSelectFinding,
  isOpen,
  onToggleOpen,
}: ReviewLeftSidebarProps) {
  if (!isOpen) {
    return (
      <button
        onClick={onToggleOpen}
        className="fixed left-4 top-28 z-40 p-2 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 hover:text-white shadow-xl"
        title="Open Review Findings"
      >
        <Award className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="w-72 bg-slate-950/95 border-r border-slate-800/80 flex flex-col h-full shrink-0 select-none z-20 font-sans backdrop-blur-xl">
      {/* Header */}
      <div className="p-3 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
            <Award className="w-4 h-4" />
          </div>
          <span className="text-xs font-black tracking-tight text-white uppercase">REVIEW FINDINGS ({findings.length})</span>
        </div>
        <button
          onClick={onToggleOpen}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 text-xs font-mono"
        >
          ✕
        </button>
      </div>

      {/* Findings List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5 scrollbar-none font-mono text-xs">
        {findings.map((f) => {
          const isSelected = selectedFindingId === f.id;

          return (
            <button
              key={f.id}
              onClick={() => onSelectFinding(f.id)}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all ${
                isSelected
                  ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-200 font-bold'
                  : 'hover:bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex flex-col min-w-0">
                <span className="truncate text-[11px] font-bold text-slate-200">{f.title}</span>
                <span className="text-[9px] text-slate-500 truncate">{f.category}</span>
              </div>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 shrink-0">
                {f.severity}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
