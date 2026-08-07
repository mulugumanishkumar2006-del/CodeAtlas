'use client';

import React, { useState } from 'react';
import { ReviewStatus } from './review-types';
import { CheckCircle2, AlertTriangle, UserPlus, Share2, FileDown, Sparkles, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReviewCollaborationBarProps {
  status: ReviewStatus;
  onApprove: () => void;
  onRequestChanges: () => void;
  onExportReport: (format: 'pdf' | 'markdown') => void;
}

export function ReviewCollaborationBar({
  status,
  onApprove,
  onRequestChanges,
  onExportReport,
}: ReviewCollaborationBarProps) {
  const [approved, setApproved] = useState(status === 'APPROVED');

  const handleApproveClick = () => {
    setApproved(true);
    onApprove();
  };

  return (
    <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 font-sans select-none shrink-0 shadow-2xl">
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono font-bold text-slate-400">
          Review Verdict:
        </span>
        <span
          className={cn(
            'px-2.5 py-1 rounded-md text-xs font-mono font-black uppercase tracking-wider border',
            approved
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
          )}
        >
          {approved ? 'Approved by AI Staff Engineer' : status}
        </span>
      </div>

      <div className="flex items-center gap-2 font-mono text-xs">
        <button
          onClick={() => onExportReport('markdown')}
          className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
        >
          <FileDown className="w-3.5 h-3.5 text-cyan-400" />
          <span>Export Markdown</span>
        </button>

        <button
          onClick={onRequestChanges}
          className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 font-bold transition-colors flex items-center gap-1.5"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Request Changes</span>
        </button>

        <button
          onClick={handleApproveClick}
          className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 font-bold text-slate-950 shadow-lg shadow-emerald-950/50 flex items-center gap-1.5 transition-all"
        >
          <CheckCircle2 className="w-4 h-4 fill-slate-950 text-emerald-400" />
          <span>{approved ? 'Approved ✓' : 'Approve Pull Request'}</span>
        </button>
      </div>
    </div>
  );
}
