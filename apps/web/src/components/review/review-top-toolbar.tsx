'use client';

import React, { useState } from 'react';
import {
  Award,
  Layers,
  Sparkles,
  ChevronDown,
  Maximize2,
  Minimize2,
  RotateCcw,
  Download,
  Share2,
  UserCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ReviewRolePerspective, ReviewModeType, MOCK_SCORECARD_DIMENSIONS } from './review-mock-data';

export const REVIEW_ROLES: ReviewRolePerspective[] = [
  'Developer',
  'Tech Lead',
  'Staff Engineer',
  'Principal Engineer',
  'Engineering Manager',
  'Director',
  'CTO'
];

interface ReviewTopToolbarProps {
  currentRole: ReviewRolePerspective;
  onSelectRole: (role: ReviewRolePerspective) => void;
  currentMode: string;
  onSelectMode: (mode: string) => void;
  overallGrade: string;
  overallScorePct: number;
  onRunAiReview: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onResetView: () => void;
}

export function ReviewTopToolbar({
  currentRole,
  onSelectRole,
  currentMode,
  onSelectMode,
  overallGrade,
  overallScorePct,
  onRunAiReview,
  isFullscreen,
  onToggleFullscreen,
  onResetView,
}: ReviewTopToolbarProps) {
  return (
    <div className="flex flex-col border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl shrink-0 z-30 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5">
        {/* Role & Grade Overview */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="px-3 py-1 rounded-xl bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 text-cyan-300 font-black text-sm flex items-center gap-2">
            <Award className="w-4 h-4 text-cyan-400" />
            <span>GRADE: {overallGrade} ({overallScorePct}%)</span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-2 py-1">
            <UserCheck className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[10px] text-slate-500 font-bold uppercase">PERSPECTIVE:</span>
            <select
              value={currentRole}
              onChange={(e) => onSelectRole(e.target.value as ReviewRolePerspective)}
              className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
            >
              {REVIEW_ROLES.map((role) => (
                <option key={role} value={role} className="bg-slate-950 text-white">{role}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2">
          <Button
            onClick={onRunAiReview}
            className="bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs gap-1.5 rounded-xl px-3.5 py-1.5 shadow-md shadow-cyan-950/50"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
            <span>Run AI Review Board</span>
          </Button>

          <button
            onClick={() => alert('Exporting Executive Presentation PDF Report...')}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Export Presentation Report"
          >
            <Download className="w-4 h-4" />
          </button>

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
