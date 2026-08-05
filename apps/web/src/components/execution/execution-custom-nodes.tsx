'use client';

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import {
  Globe,
  Layers,
  Zap,
  Box,
  Database,
  ListOrdered,
  HardDrive,
  Cloud,
  CheckCircle2,
  AlertTriangle,
  Flame,
  User,
  Clock,
  Activity,
  Cpu,
  FileCode
} from 'lucide-react';
import { ExecutionStepData, ExecutionStepType } from './execution-mock-data';

export function getExecutionStepIcon(type: ExecutionStepType) {
  switch (type) {
    case 'HTTP Request':
    case 'External API':
    case 'Third-party SDK':
      return <Globe className="w-4 h-4 text-emerald-400" />;
    case 'Controller':
    case 'Service':
    case 'Business Logic':
      return <Zap className="w-4 h-4 text-cyan-400" />;
    case 'Middleware':
    case 'Authentication':
    case 'Authorization':
    case 'Validation':
      return <Layers className="w-4 h-4 text-indigo-400" />;
    case 'Repository':
    case 'Database':
      return <Database className="w-4 h-4 text-yellow-400" />;
    case 'Cache':
      return <HardDrive className="w-4 h-4 text-rose-400" />;
    case 'Queue':
    case 'Background Job':
    case 'Message Broker':
      return <ListOrdered className="w-4 h-4 text-purple-400" />;
    default:
      return <Box className="w-4 h-4 text-slate-400" />;
  }
}

export const ExecutionNodeComponent = React.memo(({ data, selected }: { data: any; selected: boolean }) => {
  const step: ExecutionStepData = data.step;
  const isActiveStep: boolean = data.isActiveStep ?? false;
  const isDimmed: boolean = data.isDimmed ?? false;

  // Latency Heatmap Color Coding
  let durationColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  if (step.durationMs > 100) {
    durationColor = 'text-rose-400 bg-rose-500/20 border-rose-500/40 animate-pulse';
  } else if (step.durationMs > 25) {
    durationColor = 'text-amber-400 bg-amber-500/15 border-amber-500/30';
  }

  return (
    <div
      className={`relative min-w-[270px] max-w-[310px] rounded-2xl bg-slate-950/95 backdrop-blur-xl border p-4 transition-all duration-300 shadow-xl ${
        isActiveStep
          ? 'ring-4 ring-cyan-400 border-cyan-400 bg-cyan-950/30 scale-105 shadow-2xl shadow-cyan-500/40 z-50'
          : selected
          ? 'ring-2 ring-cyan-400 border-cyan-400 bg-slate-900/95 z-40'
          : 'border-slate-800 hover:border-cyan-500/40'
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
        type="source"
        position={Position.Right}
        id="source-right"
        className="!w-2.5 !h-2.5 !bg-cyan-400 !border-2 !border-slate-950"
      />

      {/* Header */}
      <div className="flex items-start justify-between gap-2 border-b border-slate-800/80 pb-2.5 mb-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center font-mono font-bold text-xs text-cyan-300 shrink-0">
            #{step.stepIndex}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-cyan-400 leading-none mb-1 truncate">
              {step.type}
            </span>
            <h4 className="text-xs font-bold text-white tracking-tight leading-snug truncate" title={step.name}>
              {step.name}
            </h4>
          </div>
        </div>

        <span className={`flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${durationColor}`}>
          <Clock className="w-3 h-3" /> {step.durationMs} ms
        </span>
      </div>

      {/* Description */}
      <p className="text-[11px] text-slate-300 font-sans leading-snug line-clamp-2 mb-3">
        {step.description}
      </p>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-2 bg-slate-900/60 rounded-xl p-2 border border-slate-800/60 text-[10px] font-mono">
        <div className="flex flex-col">
          <span className="text-slate-500 text-[9px]">P95 LATENCY</span>
          <span className="font-bold text-cyan-300 mt-0.5">{step.p95Ms} ms</span>
        </div>
        <div className="flex flex-col">
          <span className="text-slate-500 text-[9px]">CPU / MEM</span>
          <span className="font-bold text-slate-200 mt-0.5">
            {step.cpuUsagePct}% / {step.memoryUsageMb}MB
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-800/60 text-[10px] font-mono">
        <span className="text-slate-400 truncate max-w-[170px]">by {step.owner}</span>
        <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
          {step.technology}
        </span>
      </div>
    </div>
  );
});

ExecutionNodeComponent.displayName = 'ExecutionNodeComponent';
