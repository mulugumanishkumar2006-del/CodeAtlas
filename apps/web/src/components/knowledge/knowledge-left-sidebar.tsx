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
  Database,
  Cloud,
  User,
  Sparkles
} from 'lucide-react';
import { KnowledgeNodeData, GraphAnalyticsIssue, MOCK_GRAPH_ANALYTICS_ISSUES } from './knowledge-mock-data';
import { getKnowledgeNodeIcon } from './knowledge-custom-nodes';

interface KnowledgeLeftSidebarProps {
  nodes: KnowledgeNodeData[];
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  selectedRelType: string;
  onSelectRelType: (relType: string) => void;
  onOpenAnalyticsIssue: (issue: GraphAnalyticsIssue) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export function KnowledgeLeftSidebar({
  nodes,
  selectedNodeId,
  onSelectNode,
  selectedCategory,
  onSelectCategory,
  selectedRelType,
  onSelectRelType,
  onOpenAnalyticsIssue,
  isOpen,
  onToggleOpen,
}: KnowledgeLeftSidebarProps) {
  const [activeTab, setActiveTab] = useState<'taxonomy' | 'analytics' | 'bookmarks'>('taxonomy');
  const [searchFilter, setSearchFilter] = useState('');

  if (!isOpen) {
    return (
      <button
        onClick={onToggleOpen}
        className="fixed left-4 top-28 z-40 p-2 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 hover:text-white shadow-xl"
        title="Open Knowledge Graph Taxonomy"
      >
        <FolderTree className="w-5 h-5" />
      </button>
    );
  }

  const categories = [
    'All Categories',
    'Code & Architecture',
    'APIs & Data',
    'Infrastructure & Ops',
    'People & Governance',
    'AI & Analytics'
  ];

  const relTypes = [
    'All Relationships',
    'Calls',
    'Uses',
    'Depends On',
    'Writes',
    'Publishes',
    'Deploys To',
    'Owns',
    'Documents'
  ];

  const filteredNodes = nodes.filter((n) => {
    if (selectedCategory !== 'All Categories' && n.category !== selectedCategory) return false;
    if (searchFilter && !n.name.toLowerCase().includes(searchFilter.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="w-72 bg-slate-950/95 border-r border-slate-800/80 flex flex-col h-full shrink-0 select-none z-20 font-sans backdrop-blur-xl">
      {/* Header */}
      <div className="p-3 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
            <FolderTree className="w-4 h-4" />
          </div>
          <span className="text-xs font-black tracking-tight text-white uppercase">KNOWLEDGE TAXONOMY</span>
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
          onClick={() => setActiveTab('taxonomy')}
          className={`flex-1 py-1 rounded-lg font-bold transition-all ${
            activeTab === 'taxonomy' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Taxonomy
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex-1 py-1 rounded-lg font-bold transition-all flex items-center justify-center gap-1 ${
            activeTab === 'analytics' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Analytics
          <span className="px-1 py-0.2 rounded-full bg-rose-500 text-white text-[8px]">
            {MOCK_GRAPH_ANALYTICS_ISSUES.length}
          </span>
        </button>
      </div>

      {/* Tab: Taxonomy */}
      {activeTab === 'taxonomy' && (
        <div className="flex-1 flex flex-col min-h-0 font-mono text-xs">
          {/* Category Filter Selector */}
          <div className="p-2 border-b border-slate-900 space-y-2">
            <div>
              <label className="text-[9px] text-slate-500 font-bold uppercase block mb-1">Knowledge Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => onSelectCategory(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-white text-xs"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="relative">
              <Search className="w-3 h-3 text-slate-500 absolute left-2.5 top-2" />
              <input
                type="text"
                placeholder="Filter artifact nodes..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-7 pr-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          {/* Node Entity Scroll Area */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-none">
            {filteredNodes.map((node) => {
              const isSelected = selectedNodeId === node.id;
              return (
                <button
                  key={node.id}
                  onClick={() => onSelectNode(node.id)}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all ${
                    isSelected
                      ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-200 font-bold shadow'
                      : 'hover:bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate min-w-0">
                    {getKnowledgeNodeIcon(node.type, node.category)}
                    <div className="flex flex-col min-w-0">
                      <span className="truncate text-[11px] font-bold text-slate-200">{node.name}</span>
                      <span className="text-[9px] text-slate-500 truncate">{node.type}</span>
                    </div>
                  </div>
                  {node.status === 'Critical' && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Analytics Issues */}
      {activeTab === 'analytics' && (
        <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-none font-mono text-xs">
          <div className="text-[10px] text-rose-400 font-bold uppercase mb-1 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5" /> Automated Graph Intelligence
          </div>
          {MOCK_GRAPH_ANALYTICS_ISSUES.map((issue) => (
            <button
              key={issue.id}
              onClick={() => onOpenAnalyticsIssue(issue)}
              className="w-full text-left p-2.5 rounded-xl bg-rose-950/20 hover:bg-rose-950/40 border border-rose-500/30 transition-all flex flex-col space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-300 text-[11px] truncate">{issue.title}</span>
                <span className="text-[8px] px-1.5 py-0.5 rounded bg-rose-500/30 text-rose-200 font-bold uppercase">
                  {issue.severity}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-sans line-clamp-2">{issue.description}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
