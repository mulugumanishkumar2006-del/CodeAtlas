'use client';

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import {
  Layout,
  Layers,
  Zap,
  Box,
  FolderArchive,
  Code2,
  FileCode2,
  Play,
  Globe,
  Radio,
  ListOrdered,
  Database,
  HardDrive,
  Server,
  Cloud,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Activity,
  User,
  GitBranch
} from 'lucide-react';
import { ArchNodeData } from './architecture-mock-data';

// Tech & Node Icon Helper
export function getArchitectureNodeIcon(type: ArchNodeData['type'], tech: string) {
  const techLower = tech.toLowerCase();
  
  if (techLower.includes('next') || techLower.includes('react')) {
    return <Globe className="w-4 h-4 text-cyan-400" />;
  }
  if (techLower.includes('python') || techLower.includes('fastapi')) {
    return <Zap className="w-4 h-4 text-amber-400" />;
  }
  if (techLower.includes('neo4j') || techLower.includes('graph')) {
    return <Database className="w-4 h-4 text-emerald-400" />;
  }
  if (techLower.includes('postgres') || techLower.includes('sql')) {
    return <Database className="w-4 h-4 text-blue-400" />;
  }
  if (techLower.includes('redis')) {
    return <HardDrive className="w-4 h-4 text-rose-400" />;
  }
  if (techLower.includes('kafka')) {
    return <ListOrdered className="w-4 h-4 text-purple-400" />;
  }
  if (techLower.includes('rust') || techLower.includes('tree-sitter')) {
    return <Box className="w-4 h-4 text-orange-400" />;
  }
  if (techLower.includes('pytorch') || techLower.includes('gemini')) {
    return <Activity className="w-4 h-4 text-indigo-400" />;
  }
  if (techLower.includes('kong') || techLower.includes('istio') || techLower.includes('k8s')) {
    return <Server className="w-4 h-4 text-sky-400" />;
  }

  // Type fallbacks
  switch (type) {
    case 'Application':
      return <Layout className="w-4 h-4 text-cyan-400" />;
    case 'Domain':
      return <Layers className="w-4 h-4 text-indigo-400" />;
    case 'Microservice':
      return <Zap className="w-4 h-4 text-emerald-400" />;
    case 'Module':
      return <Box className="w-4 h-4 text-blue-400" />;
    case 'Package':
      return <FolderArchive className="w-4 h-4 text-amber-400" />;
    case 'Class':
      return <Code2 className="w-4 h-4 text-rose-400" />;
    case 'Interface':
      return <FileCode2 className="w-4 h-4 text-violet-400" />;
    case 'Function':
      return <Play className="w-4 h-4 text-teal-400" />;
    case 'REST API':
      return <Globe className="w-4 h-4 text-emerald-400" />;
    case 'GraphQL API':
      return <Radio className="w-4 h-4 text-pink-400" />;
    case 'Queue':
      return <ListOrdered className="w-4 h-4 text-purple-400" />;
    case 'Database':
      return <Database className="w-4 h-4 text-yellow-400" />;
    case 'Cache':
      return <HardDrive className="w-4 h-4 text-rose-400" />;
    case 'External Service':
      return <Server className="w-4 h-4 text-orange-400" />;
    case 'Infrastructure':
      return <Cloud className="w-4 h-4 text-sky-400" />;
    default:
      return <Box className="w-4 h-4 text-slate-400" />;
  }
}

export const ArchNodeComponent = React.memo(({ data, selected }: { data: any; selected: boolean }) => {
  const node: ArchNodeData = data.node;
  const isExpanded: boolean = data.isExpanded ?? false;
  const onToggleExpand = data.onToggleExpand;
  const isDimmed: boolean = data.isDimmed ?? false;
  const isHighlighted: boolean = data.isHighlighted ?? false;

  // Status Styling
  let statusBadge = (
    <span className="flex items-center gap-1 text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
      <CheckCircle2 className="w-2.5 h-2.5" /> Healthy
    </span>
  );
  let borderGlow = 'border-slate-800 hover:border-cyan-500/40';

  if (node.status === 'Warning' || node.riskScore === 'High') {
    statusBadge = (
      <span className="flex items-center gap-1 text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
        <AlertTriangle className="w-2.5 h-2.5" /> Warning
      </span>
    );
    borderGlow = 'border-amber-500/40 hover:border-amber-400';
  } else if (node.status === 'Critical' || node.riskScore === 'Critical') {
    statusBadge = (
      <span className="flex items-center gap-1 text-[9px] font-mono px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse">
        <Flame className="w-2.5 h-2.5" /> Critical
      </span>
    );
    borderGlow = 'border-rose-500/60 shadow-lg shadow-rose-950/50';
  }

  return (
    <div
      className={`relative min-w-[260px] max-w-[300px] rounded-2xl bg-slate-950/90 backdrop-blur-xl border p-4 transition-all duration-300 shadow-xl ${borderGlow} ${
        selected ? 'ring-2 ring-cyan-400 border-cyan-400 bg-slate-900/95 scale-[1.02] shadow-cyan-950/80 z-40' : ''
      } ${isHighlighted ? 'ring-2 ring-emerald-400 border-emerald-400 z-30' : ''} ${
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

      {/* Node Header */}
      <div className="flex items-start justify-between gap-2 border-b border-slate-800/80 pb-2.5 mb-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 shadow-inner">
            {getArchitectureNodeIcon(node.type, node.technology)}
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

      {/* Description Snippet */}
      <p className="text-[11px] text-slate-400 leading-snug line-clamp-2 mb-3">
        {node.description}
      </p>

      {/* Metrics & Metadata Grid */}
      <div className="grid grid-cols-2 gap-2 bg-slate-900/60 rounded-xl p-2 border border-slate-800/60 text-[10px] font-mono">
        <div className="flex flex-col">
          <span className="text-slate-500 text-[9px]">HEALTH SCORE</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  node.healthScore > 90
                    ? 'bg-emerald-400'
                    : node.healthScore > 75
                    ? 'bg-amber-400'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${node.healthScore}%` }}
              />
            </div>
            <span className="font-bold text-white">{node.healthScore}</span>
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-slate-500 text-[9px]">COMPLEXITY / LOC</span>
          <span className="font-bold text-slate-200 mt-0.5">
            {node.loc ? `${(node.loc / 1000).toFixed(1)}k LOC` : `CC: ${node.complexity}`}
          </span>
        </div>
      </div>

      {/* Node Footer: Owner & Technology Tag */}
      <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-800/60 text-[10px] font-mono">
        <div className="flex items-center gap-1.5 text-slate-400 truncate max-w-[170px]">
          <User className="w-3 h-3 text-cyan-400 shrink-0" />
          <span className="truncate">{node.owner}</span>
        </div>

        {node.hasChildren && onToggleExpand && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(node.id);
            }}
            className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 hover:bg-cyan-500/20 text-cyan-300 text-[9px] font-bold border border-slate-700 transition-colors"
          >
            {isExpanded ? (
              <>
                <ChevronDown className="w-3 h-3" /> Collapse
              </>
            ) : (
              <>
                <ChevronRight className="w-3 h-3" /> Expand
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
});

ArchNodeComponent.displayName = 'ArchNodeComponent';
