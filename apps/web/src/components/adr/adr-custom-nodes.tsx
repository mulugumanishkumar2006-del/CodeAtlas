'use client';

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Zap,
  Layers,
  Clock
} from 'lucide-react';
import { AdrRecord } from './adr-mock-data';

export const AdrNodeComponent = React.memo(({ data, selected }: { data: any; selected: boolean }) => {
  const adr: AdrRecord = data.adr;
  const isHighlighted: boolean = data.isHighlighted ?? false;

  let statusBadge = (
    <span className="flex items-center gap-1 text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
      <CheckCircle2 className="w-2.5 h-2.5" /> APPROVED
    </span>
  );

  if (adr.status === 'Violated') {
    statusBadge = (
      <span className="flex items-center gap-1 text-[9px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold animate-pulse">
        <Flame className="w-2.5 h-2.5" /> VIOLATED
      </span>
    );
  }

  return (
    <div
      className={`relative min-w-[270px] max-w-[310px] rounded-2xl bg-slate-950/95 backdrop-blur-xl border p-4 transition-all duration-300 shadow-xl ${
        selected ? 'ring-2 ring-cyan-400 border-cyan-400 bg-slate-900/95 scale-105 shadow-cyan-950/80 z-40' : 'border-slate-800 hover:border-cyan-500/40'
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        id="target-left"
        className="!w-2.5 !h-2.5 !bg-cyan-400 !border-2 !border-slate-950"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="source-right"
        className="!w-2.5 !h-2.5 !bg-cyan-400 !border-2 !border-slate-950"
      />

      <div className="flex items-start justify-between gap-2 border-b border-slate-800/80 pb-2.5 mb-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 shrink-0 font-mono font-bold text-xs">
            {adr.decisionId}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-cyan-400 leading-none mb-1 truncate">
              ADR SPECIFICATION
            </span>
            <h4 className="text-xs font-bold text-white tracking-tight leading-snug truncate" title={adr.title}>
              {adr.title}
            </h4>
          </div>
        </div>

        {statusBadge}
      </div>

      <p className="text-[11px] text-slate-300 font-sans leading-snug line-clamp-2 mb-3">
        {adr.decision}
      </p>

      <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[10px] font-mono text-slate-400">
        <span>By {adr.author}</span>
        <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300 font-bold">
          Confidence: {adr.aiConfidenceScorePct}%
        </span>
      </div>
    </div>
  );
});

AdrNodeComponent.displayName = 'AdrNodeComponent';
