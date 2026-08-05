'use client';

import React, { useState } from 'react';
import {
  FolderTree,
  Bookmark,
  AlertTriangle,
  Flame,
  Search,
  Filter,
  Layers,
  ChevronDown,
  ChevronRight,
  ArrowDownLeft,
  ArrowUpRight,
  Zap
} from 'lucide-react';
import { DependencyNodeData } from './dependency-mock-data';
import { getDependencyNodeIcon } from './dependency-custom-nodes';

interface DependencyLeftSidebarProps {
  nodes: DependencyNodeData[];
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export function DependencyLeftSidebar({
  nodes,
  selectedNodeId,
  onSelectNode,
  isOpen,
  onToggleOpen,
}: DependencyLeftSidebarProps) {
  const [activeTab, setActiveTab] = useState<'hierarchy' | 'leaderboard'>('hierarchy');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) {
    return (
      <button
        onClick={onToggleOpen}
        className="fixed left-4 top-28 z-40 p-2 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 hover:text-white shadow-xl"
        title="Open Dependency Explorer"
      >
        <FolderTree className="w-5 h-5" />
      </button>
    );
  }

  // Leaderboard sorting: highest Fan-In (most consumed) & highest Fan-Out (most dependent)
  const topFanIn = [...nodes].sort((a, b) => b.fanInCount - a.fanInCount).slice(0, 5);
  const topFanOut = [...nodes].sort((a, b) => b.fanOutCount - a.fanOutCount).slice(0, 5);

  const filteredNodes = nodes.filter((n) =>
    n.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-72 bg-slate-950/95 border-r border-slate-800/80 flex flex-col h-full shrink-0 select-none z-20 font-sans backdrop-blur-xl">
      {/* Header */}
      <div className="p-3 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
            <FolderTree className="w-4 h-4" />
          </div>
          <span className="text-xs font-black tracking-tight text-white uppercase">DEPENDENCY EXPLORER</span>
        </div>
        <button
          onClick={onToggleOpen}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 text-xs font-mono"
        >
          ✕
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center border-b border-slate-800/80 p-1 bg-slate-950/60 font-mono text-[10px]">
        <button
          onClick={() => setActiveTab('hierarchy')}
          className={`flex-1 py-1 rounded-lg font-bold transition-all ${
            activeTab === 'hierarchy' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Hierarchy
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`flex-1 py-1 rounded-lg font-bold transition-all ${
            activeTab === 'leaderboard' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Leaderboards
        </button>
      </div>

      {/* Tab: Hierarchy */}
      {activeTab === 'hierarchy' && (
        <div className="flex-1 flex flex-col min-h-0 font-mono text-xs">
          <div className="p-2 border-b border-slate-900">
            <div className="relative">
              <Search className="w-3 h-3 text-slate-500 absolute left-2.5 top-2" />
              <input
                type="text"
                placeholder="Filter dependencies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-7 pr-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-none">
            {filteredNodes.map((node) => {
              const isSelected = selectedNodeId === node.id;
              return (
                <button
                  key={node.id}
                  onClick={() => onSelectNode(node.id)}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all ${
                    isSelected
                      ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-200 font-bold'
                      : 'hover:bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate min-w-0">
                    {getDependencyNodeIcon(node.type)}
                    <div className="flex flex-col min-w-0">
                      <span className="truncate text-[11px] font-bold text-slate-200">{node.name}</span>
                      <span className="text-[9px] text-slate-500 truncate">{node.type}</span>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-slate-500">In:{node.fanInCount}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Leaderboard */}
      {activeTab === 'leaderboard' && (
        <div className="flex-1 overflow-y-auto p-3 space-y-4 font-mono text-xs scrollbar-none">
          <div className="space-y-2">
            <span className="text-[10px] text-cyan-400 font-bold uppercase flex items-center gap-1">
              <ArrowDownLeft className="w-3.5 h-3.5" /> High Fan-In (Most Consumed)
            </span>
            {topFanIn.map((node) => (
              <button
                key={node.id}
                onClick={() => onSelectNode(node.id)}
                className="w-full text-left p-2 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 flex justify-between items-center"
              >
                <span className="font-bold text-slate-200 truncate">{node.name}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                  {node.fanInCount} callers
                </span>
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <span className="text-[10px] text-amber-400 font-bold uppercase flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> High Fan-Out (Most Dependent)
            </span>
            {topFanOut.map((node) => (
              <button
                key={node.id}
                onClick={() => onSelectNode(node.id)}
                className="w-full text-left p-2 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 flex justify-between items-center"
              >
                <span className="font-bold text-slate-200 truncate">{node.name}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                  {node.fanOutCount} deps
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
