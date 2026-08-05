'use client';

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import {
  GitBranch,
  Layout,
  Layers,
  Zap,
  Box,
  Folder,
  FileCode,
  Code2,
  FileText,
  Play,
  Globe,
  Radio,
  Database,
  Table,
  Columns,
  ListOrdered,
  HardDrive,
  Settings,
  Key,
  Cloud,
  Server,
  FileCheck,
  HelpCircle,
  GitPullRequest,
  GitCommit,
  User,
  Sparkles,
  FlaskConical,
  ShieldAlert,
  History,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Activity
} from 'lucide-react';
import { KnowledgeNodeData, KnowledgeNodeType } from './knowledge-mock-data';

export function getKnowledgeNodeIcon(type: KnowledgeNodeType, category: string) {
  switch (type) {
    case 'Repository':
      return <GitBranch className="w-4 h-4 text-cyan-400" />;
    case 'Application':
      return <Layout className="w-4 h-4 text-sky-400" />;
    case 'Domain':
      return <Layers className="w-4 h-4 text-indigo-400" />;
    case 'Microservice':
      return <Zap className="w-4 h-4 text-emerald-400" />;
    case 'Package':
    case 'Module':
      return <Box className="w-4 h-4 text-blue-400" />;
    case 'Folder':
      return <Folder className="w-4 h-4 text-amber-400" />;
    case 'File':
      return <FileCode className="w-4 h-4 text-slate-400" />;
    case 'Class':
    case 'Interface':
    case 'Enum':
      return <Code2 className="w-4 h-4 text-rose-400" />;
    case 'Function':
    case 'Method':
      return <Play className="w-4 h-4 text-teal-400" />;
    case 'REST API':
      return <Globe className="w-4 h-4 text-emerald-400" />;
    case 'GraphQL API':
      return <Radio className="w-4 h-4 text-pink-400" />;
    case 'Database':
      return <Database className="w-4 h-4 text-yellow-400" />;
    case 'Table':
      return <Table className="w-4 h-4 text-amber-300" />;
    case 'Column':
      return <Columns className="w-4 h-4 text-slate-300" />;
    case 'Queue':
    case 'Topic':
      return <ListOrdered className="w-4 h-4 text-purple-400" />;
    case 'Cache':
      return <HardDrive className="w-4 h-4 text-rose-400" />;
    case 'Configuration':
      return <Settings className="w-4 h-4 text-gray-400" />;
    case 'Secret Reference':
      return <Key className="w-4 h-4 text-yellow-500" />;
    case 'Infrastructure':
    case 'Docker':
    case 'Kubernetes':
    case 'Terraform':
      return <Cloud className="w-4 h-4 text-sky-400" />;
    case 'Documentation':
    case 'Architecture Decision':
      return <FileText className="w-4 h-4 text-teal-300" />;
    case 'Issue':
      return <HelpCircle className="w-4 h-4 text-amber-400" />;
    case 'Pull Request':
      return <GitPullRequest className="w-4 h-4 text-purple-400" />;
    case 'Commit':
      return <GitCommit className="w-4 h-4 text-cyan-300" />;
    case 'Developer':
      return <User className="w-4 h-4 text-cyan-400" />;
    case 'AI Insight':
      return <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />;
    case 'Simulation':
      return <Zap className="w-4 h-4 text-purple-400" />;
    case 'Investigation':
      return <FlaskConical className="w-4 h-4 text-indigo-400" />;
    case 'Monitoring Alert':
      return <ShieldAlert className="w-4 h-4 text-rose-400" />;
    case 'Repository Snapshot':
      return <History className="w-4 h-4 text-slate-400" />;
    default:
      return <Box className="w-4 h-4 text-slate-400" />;
  }
}

export const KnowledgeNodeComponent = React.memo(({ data, selected }: { data: any; selected: boolean }) => {
  const node: KnowledgeNodeData = data.node;
  const isHighlighted: boolean = data.isHighlighted ?? false;
  const isDimmed: boolean = data.isDimmed ?? false;

  // Category Color Accent
  let categoryColor = 'border-cyan-500/40 text-cyan-400';
  if (node.category === 'APIs & Data') categoryColor = 'border-yellow-500/40 text-yellow-400';
  else if (node.category === 'Infrastructure & Ops') categoryColor = 'border-sky-500/40 text-sky-400';
  else if (node.category === 'People & Governance') categoryColor = 'border-purple-500/40 text-purple-400';
  else if (node.category === 'AI & Analytics') categoryColor = 'border-pink-500/40 text-pink-400';

  // Status Badge
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
      className={`relative min-w-[270px] max-w-[310px] rounded-2xl bg-slate-950/90 backdrop-blur-xl border p-4 transition-all duration-300 shadow-xl ${categoryColor} ${
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

      {/* Header */}
      <div className="flex items-start justify-between gap-2 border-b border-slate-800/80 pb-2.5 mb-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 shadow-inner">
            {getKnowledgeNodeIcon(node.type, node.category)}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 leading-none mb-1 truncate">
              {node.type}
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

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-2 bg-slate-900/60 rounded-xl p-2 border border-slate-800/60 text-[10px] font-mono">
        <div className="flex flex-col">
          <span className="text-slate-500 text-[9px]">PAGERANK SCORE</span>
          <span className="font-bold text-cyan-300 mt-0.5">
            {(node.metrics?.pageRankScore ?? 0.8).toFixed(2)}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-slate-500 text-[9px]">TECH DEBT</span>
          <span className="font-bold text-amber-300 mt-0.5">
            {node.metrics?.techDebtHours ?? 8} hrs
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-800/60 text-[10px] font-mono">
        <div className="flex items-center gap-1 text-slate-400 truncate max-w-[170px]">
          <User className="w-3 h-3 text-cyan-400 shrink-0" />
          <span className="truncate">{node.owner}</span>
        </div>

        <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
          {node.technology}
        </span>
      </div>
    </div>
  );
});

KnowledgeNodeComponent.displayName = 'KnowledgeNodeComponent';
