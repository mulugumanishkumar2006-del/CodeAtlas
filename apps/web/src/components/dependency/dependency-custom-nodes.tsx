'use client';

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import {
  Layout,
  Layers,
  Zap,
  Box,
  Folder,
  FileCode,
  Code2,
  Globe,
  Database,
  ListOrdered,
  HardDrive,
  Cloud,
  Server,
  PackageCheck,
  CheckCircle2,
  AlertTriangle,
  Flame,
  User,
  ArrowDownLeft,
  ArrowUpRight
} from 'lucide-react';
import { DependencyNodeData, DependencyNodeType } from './dependency-mock-data';

export function getDependencyNodeIcon(type: DependencyNodeType) {
  switch (type) {
    case 'Application':
      return <Layout className="w-4 h-4 text-cyan-400" />;
    case 'Microservice':
      return <Zap className="w-4 h-4 text-emerald-400" />;
    case 'Module':
    case 'Package':
      return <Box className="w-4 h-4 text-blue-400" />;
    case 'REST API':
    case 'GraphQL':
    case 'gRPC':
      return <Globe className="w-4 h-4 text-teal-400" />;
    case 'Database':
      return <Database className="w-4 h-4 text-yellow-400" />;
    case 'Queue':
    case 'Event':
      return <ListOrdered className="w-4 h-4 text-purple-400" />;
    case 'Cache':
      return <HardDrive className="w-4 h-4 text-rose-400" />;
    case 'Third-party Library':
      return <PackageCheck className="w-4 h-4 text-amber-400" />;
    case 'Infrastructure':
    case 'Cloud Service':
      return <Cloud className="w-4 h-4 text-sky-400" />;
    default:
      return <Box className="w-4 h-4 text-slate-400" />;
  }
}

export const DependencyNodeComponent = React.memo(({ data, selected }: { data: any; selected: boolean }) => {
  const node: DependencyNodeData = data.node;
  const isHighlighted: boolean = data.isHighlighted ?? false;
  const isDimmed: boolean = data.isDimmed ?? false;
  const isShortestPath: boolean = data.isShortestPath ?? false;

  let statusBadge = (
    <span className="flex items-center gap-1 text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
      <CheckCircle2 className="w-2.5 h-2.5" /> Healthy
    </span>
  );
  if (node.status === 'Warning' || node.riskScore === 'High') {
    statusBadge = (
      <span className="flex items-center gap-1 text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
        <AlertTriangle className="w-2.5 h-2.5" /> Warning
      </span>
    );
  } else if (node.status === 'Critical' || node.riskScore === 'Critical') {
    statusBadge = (
      <span className="flex items-center gap-1 text-[9px] font-mono px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse">
        <Flame className="w-2.5 h-2.5" /> Critical
      </span>
    );
  }

  return (
    <div
      className={`relative min-w-[270px] max-w-[310px] rounded-2xl bg-slate-950/90 backdrop-blur-xl border p-4 transition-all duration-300 shadow-xl border-slate-800 hover:border-cyan-500/40 ${
        selected ? 'ring-2 ring-cyan-400 border-cyan-400 bg-slate-900/95 scale-[1.02] shadow-cyan-950/80 z-40' : ''
      } ${isShortestPath ? 'ring-2 ring-amber-400 border-amber-400 z-40 animate-pulse' : ''} ${
        isHighlighted ? 'ring-2 ring-emerald-400 border-emerald-400 z-30' : ''
      } ${isDimmed ? 'opacity-30 grayscale-[40%]' : 'opacity-100'}`}
    >
      {/* ReactFlow Handles */}
      <Handle
        type="target"
        position={Position.Left}
        id="target-left"
        className="!w-2.5 !h-2.5 !bg-cyan-400 !border-2 !border-slate-950"
      />
      <Handle
        type="target"
        position={Position.Top}
        id="target-top"
        className="!w-2.5 !h-2.5 !bg-cyan-400 !border-2 !border-slate-950"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="source-right"
        className="!w-2.5 !h-2.5 !bg-cyan-400 !border-2 !border-slate-950"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="source-bottom"
        className="!w-2.5 !h-2.5 !bg-cyan-400 !border-2 !border-slate-950"
      />

      {/* Header */}
      <div className="flex items-start justify-between gap-2 border-b border-slate-800/80 pb-2.5 mb-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 shadow-inner">
            {getDependencyNodeIcon(node.type)}
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

        {statusBadge}
      </div>

      {/* Description */}
      <p className="text-[11px] text-slate-300 font-sans leading-snug line-clamp-2 mb-3">
        {node.description}
      </p>

      {/* Fan-In & Fan-Out Badges Grid */}
      <div className="grid grid-cols-2 gap-2 bg-slate-900/60 rounded-xl p-2 border border-slate-800/60 text-[10px] font-mono">
        <div className="flex items-center gap-1.5">
          <ArrowDownLeft className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <div className="flex flex-col">
            <span className="text-slate-500 text-[9px]">FAN-IN</span>
            <span className="font-bold text-white">{node.fanInCount} callers</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <ArrowUpRight className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <div className="flex flex-col">
            <span className="text-slate-500 text-[9px]">FAN-OUT</span>
            <span className="font-bold text-white">{node.fanOutCount} deps</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-800/60 text-[10px] font-mono">
        <div className="flex items-center gap-1 text-slate-400 truncate max-w-[170px]">
          <User className="w-3 h-3 text-cyan-400 shrink-0" />
          <span className="truncate">{node.owner}</span>
        </div>

        {node.version && (
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
            {node.version}
          </span>
        )}
      </div>
    </div>
  );
});

DependencyNodeComponent.displayName = 'DependencyNodeComponent';
