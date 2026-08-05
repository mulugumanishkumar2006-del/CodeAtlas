'use client';

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import {
  PlusCircle,
  MinusCircle,
  AlertTriangle,
  CheckCircle2,
  Layers,
  Zap,
  Box,
  Database,
  ListOrdered,
  Flame,
  User,
  TrendingDown,
  TrendingUp,
  ShieldAlert
} from 'lucide-react';
import { DriftNodeData, DriftChangeStatus } from './drift-mock-data';

export const DriftNodeComponent = React.memo(({ data, selected }: { data: any; selected: boolean }) => {
  const node: DriftNodeData = data.node;
  const isHighlighted: boolean = data.isHighlighted ?? false;
  const isDimmed: boolean = data.isDimmed ?? false;

  let changeBadge = (
    <span className="flex items-center gap-1 text-[9px] font-mono px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800">
      <CheckCircle2 className="w-2.5 h-2.5" /> UNCHANGED
    </span>
  );

  if (node.changeStatus === 'Added') {
    changeBadge = (
      <span className="flex items-center gap-1 text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold shadow-lg shadow-emerald-950/50">
        <PlusCircle className="w-2.5 h-2.5" /> [+] ADDED
      </span>
    );
  } else if (node.changeStatus === 'Removed') {
    changeBadge = (
      <span className="flex items-center gap-1 text-[9px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 font-bold line-through">
        <MinusCircle className="w-2.5 h-2.5" /> [-] REMOVED
      </span>
    );
  } else if (node.changeStatus === 'Drifted') {
    changeBadge = (
      <span className="flex items-center gap-1 text-[9px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/50 font-bold animate-pulse">
        <AlertTriangle className="w-2.5 h-2.5" /> [!] DRIFTED
      </span>
    );
  }

  return (
    <div
      className={`relative min-w-[270px] max-w-[310px] rounded-2xl bg-slate-950/95 backdrop-blur-xl border p-4 transition-all duration-300 shadow-xl ${
        selected ? 'ring-2 ring-cyan-400 border-cyan-400 bg-slate-900/95 scale-105 shadow-cyan-950/80 z-40' : 'border-slate-800 hover:border-cyan-500/40'
      } ${node.changeStatus === 'Drifted' ? 'border-amber-500/40 shadow-amber-950/30' : ''} ${
        isDimmed ? 'opacity-30 grayscale-[40%]' : 'opacity-100'
      }`}
    >
      {/* ReactFlow Handles */}
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

      {/* Header */}
      <div className="flex items-start justify-between gap-2 border-b border-slate-800/80 pb-2.5 mb-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
            {node.type === 'Database' ? (
              <Database className="w-4 h-4 text-yellow-400" />
            ) : node.type === 'Microservice' ? (
              <Zap className="w-4 h-4 text-emerald-400" />
            ) : (
              <Box className="w-4 h-4 text-slate-400" />
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-cyan-400 leading-none mb-1 truncate">
              {node.type} • {node.layer}
            </span>
            <h4 className="text-xs font-bold text-white tracking-tight leading-snug truncate" title={node.name}>
              {node.name}
            </h4>
          </div>
        </div>

        {changeBadge}
      </div>

      {/* Description */}
      <p className="text-[11px] text-slate-300 font-sans leading-snug line-clamp-2 mb-3">
        {node.driftDescription}
      </p>

      {/* Health Trend Grid */}
      {node.changeStatus !== 'Removed' && (
        <div className="grid grid-cols-2 gap-2 bg-slate-900/60 rounded-xl p-2 border border-slate-800/60 text-[10px] font-mono">
          <div className="flex flex-col">
            <span className="text-slate-500 text-[9px]">HEALTH BEFORE</span>
            <span className="font-bold text-slate-400 mt-0.5">{node.healthBefore}%</span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-500 text-[9px]">HEALTH AFTER</span>
            <span className={`font-bold mt-0.5 flex items-center gap-1 ${
              node.healthAfter < node.healthBefore ? 'text-rose-400' : 'text-emerald-400'
            }`}>
              {node.healthAfter}%
              {node.healthAfter < node.healthBefore ? (
                <TrendingDown className="w-3 h-3 text-rose-400" />
              ) : (
                <TrendingUp className="w-3 h-3 text-emerald-400" />
              )}
            </span>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-800/60 text-[10px] font-mono">
        <span className="text-slate-400 truncate max-w-[170px]">{node.ownerTeam}</span>
        <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
          {node.riskRating} Risk
        </span>
      </div>
    </div>
  );
});

DriftNodeComponent.displayName = 'DriftNodeComponent';
