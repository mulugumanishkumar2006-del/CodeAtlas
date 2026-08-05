'use client';

import React, { useState } from 'react';
import {
  LayoutGrid,
  Network,
  Layers,
  Server,
  Package,
  Grid,
  Activity,
  Clock,
  ShieldCheck,
  Zap,
  Search,
  Focus,
  Sparkles,
  Maximize2,
  Minimize2,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  GitBranch,
  Flame,
  Route
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DependencyNodeData } from './dependency-mock-data';

export const DEP_VIEWS = [
  { name: 'Tree View', icon: GitBranch, desc: 'Top-down hierarchical tree' },
  { name: 'Force Graph', icon: Network, desc: 'Physics-based force layout' },
  { name: 'Radial Graph', icon: Activity, desc: 'Concentric radial dependency rings' },
  { name: 'Layered Graph', icon: Layers, desc: 'Layered column architecture' },
  { name: 'Service Map', icon: Server, desc: 'Microservices & API boundaries' },
  { name: 'Package Map', icon: Package, desc: 'npm / PyPI package graph' },
  { name: 'Matrix View', icon: Grid, desc: 'Adjacency matrix grid' },
  { name: 'Heat Map', icon: Flame, desc: 'Risk & coupling density heat map' },
  { name: 'Timeline View', icon: Clock, desc: 'Historical evolution timeline' },
  { name: 'Architecture View', icon: LayoutGrid, desc: 'High-level system topology' },
  { name: 'Risk View', icon: ShieldCheck, desc: 'Critical risk & vulnerability paths' },
  { name: 'Chord Diagram', icon: Zap, desc: 'Flow matrix chord diagram' },
];

interface DependencyTopToolbarProps {
  currentView: string;
  onSelectView: (view: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  focusMode: boolean;
  onToggleFocusMode: () => void;
  onOpenAiInsights: () => void;
  onOpenImpactAnalysis: () => void;
  nodes: DependencyNodeData[];
  onCalculateShortestPath: (sourceId: string, targetId: string) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onResetView: () => void;
}

export function DependencyTopToolbar({
  currentView,
  onSelectView,
  searchQuery,
  onSearchChange,
  focusMode,
  onToggleFocusMode,
  onOpenAiInsights,
  onOpenImpactAnalysis,
  nodes,
  onCalculateShortestPath,
  isFullscreen,
  onToggleFullscreen,
  onResetView,
}: DependencyTopToolbarProps) {
  const [showViewMenu, setShowViewMenu] = useState(false);
  const [showPathMenu, setShowPathMenu] = useState(false);
  const [sourceNodeId, setSourceNodeId] = useState<string>('app-web-portal');
  const [targetNodeId, setTargetNodeId] = useState<string>('lib-stripe-node');

  const activeViewObj = DEP_VIEWS.find((v) => v.name === currentView) || DEP_VIEWS[3]; // Default Layered Graph
  const ViewIcon = activeViewObj.icon;

  return (
    <div className="flex flex-col border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl shrink-0 z-30 font-sans">
      {/* Primary Toolbar Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5">
        {/* View Switcher Dropdown */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setShowViewMenu(!showViewMenu)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-white font-bold text-xs shadow-md transition-all group"
            >
              <div className="p-1 rounded-lg bg-cyan-500/20 text-cyan-400">
                <ViewIcon className="w-4 h-4" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[9px] text-slate-400 uppercase tracking-wider font-mono">VIEW (12 VIEWS)</span>
                <span className="text-xs font-black text-cyan-200">{activeViewObj.name}</span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-500 ml-1" />
            </button>

            {/* 12 Views Grid Popover */}
            {showViewMenu && (
              <div className="absolute top-full left-0 mt-2 w-80 bg-slate-950 border border-slate-800 rounded-2xl p-2 shadow-2xl z-50 font-mono">
                <div className="text-[10px] font-bold text-slate-500 uppercase px-3 py-1 border-b border-slate-800/80">
                  Select 12 Smart Visualization Views
                </div>
                <div className="grid grid-cols-1 gap-1 pt-1.5 max-h-80 overflow-y-auto scrollbar-none">
                  {DEP_VIEWS.map((view) => {
                    const VIcon = view.icon;
                    const isSelected = view.name === currentView;
                    return (
                      <button
                        key={view.name}
                        onClick={() => {
                          onSelectView(view.name);
                          setShowViewMenu(false);
                        }}
                        className={`flex items-start gap-3 p-2 rounded-xl text-left transition-all ${
                          isSelected
                            ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-200 font-bold'
                            : 'hover:bg-slate-900 text-slate-300'
                        }`}
                      >
                        <VIcon className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                        <div className="flex flex-col">
                          <span className="text-xs font-bold leading-tight">{view.name}</span>
                          <span className="text-[10px] text-slate-400 font-sans leading-tight mt-0.5">
                            {view.desc}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Shortest Path Calculator Button */}
          <div className="relative hidden lg:block">
            <button
              onClick={() => setShowPathMenu(!showPathMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-bold font-mono transition-colors"
            >
              <Route className="w-3.5 h-3.5 text-amber-400" />
              <span>Shortest Path</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {showPathMenu && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-slate-950 border border-slate-800 rounded-2xl p-3 shadow-2xl z-50 font-mono text-xs space-y-3">
                <div className="text-[10px] text-amber-400 font-bold uppercase border-b border-slate-800 pb-1">
                  Trace Shortest Path Between 2 Nodes
                </div>
                <div>
                  <label className="text-[9px] text-slate-500 font-bold uppercase block mb-1">Source Node A</label>
                  <select
                    value={sourceNodeId}
                    onChange={(e) => setSourceNodeId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-white text-xs"
                  >
                    {nodes.map((n) => (
                      <option key={n.id} value={n.id}>{n.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[9px] text-slate-500 font-bold uppercase block mb-1">Target Node B</label>
                  <select
                    value={targetNodeId}
                    onChange={(e) => setTargetNodeId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-white text-xs"
                  >
                    {nodes.map((n) => (
                      <option key={n.id} value={n.id}>{n.name}</option>
                    ))}
                  </select>
                </div>

                <Button
                  onClick={() => {
                    onCalculateShortestPath(sourceNodeId, targetNodeId);
                    setShowPathMenu(false);
                  }}
                  className="w-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold text-xs h-8 rounded-xl"
                >
                  Trace Path
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Center: Search */}
        <div className="flex-1 max-w-sm mx-2">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-cyan-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search 250,000+ dependencies, packages, APIs, DBs..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 font-mono shadow-inner transition-all"
            />
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleFocusMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all ${
              focusMode
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Focus className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Focus Mode</span>
          </button>

          <Button
            onClick={onOpenImpactAnalysis}
            className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40 font-bold text-xs gap-1.5 rounded-xl px-3 py-1.5"
          >
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span>Blast Radius</span>
          </Button>

          <Button
            onClick={onOpenAiInsights}
            className="bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs gap-1.5 rounded-xl px-3 py-1.5 shadow-md shadow-cyan-950/50"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
            <span className="hidden sm:inline">AI Insights</span>
          </Button>

          <button
            onClick={onToggleFullscreen}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={onResetView}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
