'use client';

import React, { useState } from 'react';
import {
  GitBranch,
  Flame,
  Search,
  Clock,
  Zap,
  Layers,
  AlertTriangle,
  PlusCircle,
  MinusCircle,
  CheckCircle2
} from 'lucide-react';
import { DriftNodeData, MOCK_DRIFT_NODES } from './drift-mock-data';

interface DriftLeftSidebarProps {
  nodes: DriftNodeData[];
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export function DriftLeftSidebar({
  nodes,
  selectedNodeId,
  onSelectNode,
  isOpen,
  onToggleOpen,
}: DriftLeftSidebarProps) {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) {
    return (
      <button
        onClick={onToggleOpen}
        className="fixed left-4 top-28 z-40 p-2 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 hover:text-white shadow-xl"
        title="Open Drift Explorer"
      >
        <GitBranch className="w-5 h-5" />
      </button>
    );
  }

  const filteredNodes = nodes.filter((n) => {
    const matchesSearch = n.name.toLowerCase().includes(searchQuery.toLowerCase()) || n.type.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeFilter === 'All') return matchesSearch;
    return matchesSearch && n.changeStatus === activeFilter;
  });

  return (
    <div className="w-72 bg-slate-950/95 border-r border-slate-800/80 flex flex-col h-full shrink-0 select-none z-20 font-sans backdrop-blur-xl">
      {/* Header */}
      <div className="p-3 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
            <GitBranch className="w-4 h-4" />
          </div>
          <span className="text-xs font-black tracking-tight text-white uppercase">DRIFTED COMPONENTS</span>
        </div>
        <button
          onClick={onToggleOpen}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 text-xs font-mono"
        >
          ✕
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center border-b border-slate-800/80 p-1 bg-slate-950/60 font-mono text-[10px]">
        {(['All', 'Added', 'Drifted', 'Removed'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`flex-1 py-1 rounded-lg font-bold transition-all ${
              activeFilter === filter ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="p-2 border-b border-slate-900 font-mono text-xs">
        <div className="relative">
          <Search className="w-3 h-3 text-slate-500 absolute left-2.5 top-2" />
          <input
            type="text"
            placeholder="Filter components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-7 pr-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-white focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>
      </div>

      {/* Component List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5 scrollbar-none font-mono text-xs">
        {filteredNodes.map((node) => {
          const isSelected = selectedNodeId === node.id;
          return (
            <button
              key={node.id}
              onClick={() => onSelectNode(node.id)}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all ${
                isSelected
                  ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-200 font-bold'
                  : 'hover:bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex flex-col min-w-0">
                <span className="truncate text-[11px] font-bold text-slate-200">{node.name}</span>
                <span className="text-[9px] text-slate-500 truncate">{node.layer}</span>
              </div>
              <span
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                  node.changeStatus === 'Drifted'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : node.changeStatus === 'Added'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}
              >
                {node.changeStatus}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
