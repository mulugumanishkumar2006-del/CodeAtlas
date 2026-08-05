'use client';

import React, { useState } from 'react';
import {
  Layers,
  ChevronRight,
  ChevronDown,
  Bookmark,
  AlertTriangle,
  Flame,
  CheckCircle2,
  FolderTree,
  Filter,
  Zap,
  Search,
  Sparkles
} from 'lucide-react';
import { ArchNodeData, SAVED_VIEW_PRESETS, SavedViewPreset, AIInsightItem } from './architecture-mock-data';
import { getArchitectureNodeIcon } from './custom-nodes';

interface LeftNavExplorerProps {
  nodes: ArchNodeData[];
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
  aiInsights: AIInsightItem[];
  onOpenAiInsight: (insight: AIInsightItem) => void;
  onSelectPreset: (preset: SavedViewPreset) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export function LeftNavExplorer({
  nodes,
  selectedNodeId,
  onSelectNode,
  aiInsights,
  onOpenAiInsight,
  onSelectPreset,
  isOpen,
  onToggleOpen,
}: LeftNavExplorerProps) {
  const [activeTab, setActiveTab] = useState<'hierarchy' | 'bookmarks' | 'violations'>('hierarchy');
  const [treeSearch, setTreeSearch] = useState('');
  const [expandedDomains, setExpandedDomains] = useState<Set<string>>(new Set(['Domain: Security & Access Management', 'Domain: Software Intelligence Graph']));

  // Group nodes by domain
  const domainsMap: Record<string, ArchNodeData[]> = {};
  nodes.forEach((node) => {
    const d = node.domain || 'Core Platform';
    if (!domainsMap[d]) domainsMap[d] = [];
    domainsMap[d].push(node);
  });

  const toggleDomain = (domainName: string) => {
    setExpandedDomains((prev) => {
      const next = new Set(prev);
      if (next.has(domainName)) next.delete(domainName);
      else next.add(domainName);
      return next;
    });
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggleOpen}
        className="fixed left-4 top-24 z-40 p-2 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 hover:text-white shadow-xl"
        title="Open Architecture Tree Explorer"
      >
        <FolderTree className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="w-72 bg-slate-950/95 border-r border-slate-800/80 flex flex-col h-full shrink-0 select-none z-20 font-sans backdrop-blur-xl">
      {/* Header */}
      <div className="p-3 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
            <FolderTree className="w-4 h-4" />
          </div>
          <span className="text-xs font-black tracking-tight text-white uppercase">ARCH EXPLORER</span>
        </div>
        <button
          onClick={onToggleOpen}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 text-xs font-mono"
        >
          ✕
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center border-b border-slate-800/80 p-1 bg-slate-950/50 font-mono text-[10px]">
        <button
          onClick={() => setActiveTab('hierarchy')}
          className={`flex-1 py-1 rounded-lg font-bold transition-all ${
            activeTab === 'hierarchy' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Hierarchy
        </button>
        <button
          onClick={() => setActiveTab('bookmarks')}
          className={`flex-1 py-1 rounded-lg font-bold transition-all ${
            activeTab === 'bookmarks' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Bookmarks
        </button>
        <button
          onClick={() => setActiveTab('violations')}
          className={`flex-1 py-1 rounded-lg font-bold transition-all flex items-center justify-center gap-1 ${
            activeTab === 'violations' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Violations
          {aiInsights.length > 0 && (
            <span className="px-1 py-0.2 rounded-full bg-rose-500 text-white text-[8px]">
              {aiInsights.length}
            </span>
          )}
        </button>
      </div>

      {/* Tab 1: Hierarchy Tree */}
      {activeTab === 'hierarchy' && (
        <div className="flex-1 flex flex-col min-h-0">
          {/* Tree Filter Search */}
          <div className="p-2 border-b border-slate-900">
            <div className="relative">
              <Search className="w-3 h-3 text-slate-500 absolute left-2.5 top-2" />
              <input
                type="text"
                placeholder="Filter tree entities..."
                value={treeSearch}
                onChange={(e) => setTreeSearch(e.target.value)}
                className="w-full pl-7 pr-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          {/* Tree Scroll List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-none font-mono text-xs">
            {Object.entries(domainsMap).map(([domainName, domainNodes]) => {
              const isDomainExpanded = expandedDomains.has(`Domain: ${domainName}`);
              const filteredNodes = domainNodes.filter((n) =>
                n.name.toLowerCase().includes(treeSearch.toLowerCase()) ||
                n.type.toLowerCase().includes(treeSearch.toLowerCase())
              );

              if (treeSearch && filteredNodes.length === 0) return null;

              return (
                <div key={domainName} className="space-y-1">
                  {/* Domain Header Accordion */}
                  <button
                    onClick={() => toggleDomain(`Domain: ${domainName}`)}
                    className="w-full flex items-center justify-between p-1.5 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 text-left group"
                  >
                    <div className="flex items-center gap-2 truncate">
                      {isDomainExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      )}
                      <Layers className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span className="font-bold text-slate-200 truncate text-[11px]">{domainName}</span>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                      {filteredNodes.length}
                    </span>
                  </button>

                  {/* Domain Child Nodes */}
                  {isDomainExpanded && (
                    <div className="pl-4 space-y-1 border-l border-slate-800/60 ml-2">
                      {filteredNodes.map((childNode) => {
                        const isSelected = selectedNodeId === childNode.id;
                        return (
                          <button
                            key={childNode.id}
                            onClick={() => onSelectNode(childNode.id)}
                            className={`w-full flex items-center justify-between p-1.5 rounded-lg text-left transition-all ${
                              isSelected
                                ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-200 font-bold'
                                : 'hover:bg-slate-900 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate min-w-0">
                              {getArchitectureNodeIcon(childNode.type, childNode.technology)}
                              <span className="truncate text-[11px]">{childNode.name}</span>
                            </div>
                            {childNode.status === 'Critical' && (
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Bookmarks */}
      {activeTab === 'bookmarks' && (
        <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-none font-mono text-xs">
          <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Architectural Saved Views</div>
          {SAVED_VIEW_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className="w-full text-left p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 transition-all flex flex-col space-y-1 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-cyan-300 group-hover:text-white">{preset.name}</span>
                <Bookmark className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <p className="text-[10px] text-slate-400 font-sans leading-tight">{preset.description}</p>
            </button>
          ))}
        </div>
      )}

      {/* Tab 3: Violations */}
      {activeTab === 'violations' && (
        <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-none font-mono text-xs">
          <div className="text-[10px] text-rose-400 font-bold uppercase mb-1 flex items-center gap-1">
            <Flame className="w-3 h-3" /> AI Detected Violations
          </div>
          {aiInsights.map((insight) => (
            <button
              key={insight.id}
              onClick={() => onOpenAiInsight(insight)}
              className="w-full text-left p-2.5 rounded-xl bg-rose-950/20 hover:bg-rose-950/40 border border-rose-500/30 transition-all flex flex-col space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-300 text-[11px] truncate">{insight.title}</span>
                <span className="text-[8px] px-1.5 py-0.5 rounded bg-rose-500/30 text-rose-200 font-bold uppercase">
                  {insight.severity}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-sans line-clamp-2">{insight.explanation}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
