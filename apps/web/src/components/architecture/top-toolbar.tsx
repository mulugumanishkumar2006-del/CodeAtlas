'use client';

import React, { useState } from 'react';
import {
  LayoutGrid,
  Server,
  Package,
  Globe,
  Database,
  Cloud,
  ShieldCheck,
  Zap,
  Network,
  Layers,
  Search,
  Filter,
  Focus,
  Sparkles,
  Bookmark,
  Maximize2,
  Minimize2,
  Tv,
  Download,
  RotateCcw,
  RotateCw,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SAVED_VIEW_PRESETS, SavedViewPreset } from './architecture-mock-data';

export const ARCH_MODES = [
  { name: 'Component View', icon: LayoutGrid, desc: 'High-level component topology' },
  { name: 'Service View', icon: Server, desc: 'Microservices & communication mesh' },
  { name: 'Package View', icon: Package, desc: 'Code packages & folder structures' },
  { name: 'API View', icon: Globe, desc: 'REST & GraphQL API endpoints' },
  { name: 'Database View', icon: Database, desc: 'Databases, caches & queues' },
  { name: 'Infrastructure View', icon: Cloud, desc: 'Cloud resources & Kubernetes mesh' },
  { name: 'Security View', icon: ShieldCheck, desc: 'Auth perimeters & compliance' },
  { name: 'Performance View', icon: Zap, desc: 'Latency p95 & bottleneck heatmaps' },
  { name: 'Dependency View', icon: Network, desc: 'Direct & transitive dependencies' },
  { name: 'Domain View', icon: Layers, desc: 'Domain boundaries & DDD contexts' },
];

interface TopToolbarProps {
  currentMode: string;
  onSelectMode: (mode: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  focusMode: boolean;
  onToggleFocusMode: () => void;
  layoutEngine: 'hierarchical' | 'layered' | 'circular' | 'force-directed';
  onChangeLayout: (layout: 'hierarchical' | 'layered' | 'circular' | 'force-directed') => void;
  onOpenAiInsights: () => void;
  violationCount: number;
  onSelectPreset: (preset: SavedViewPreset) => void;
  presentationMode: boolean;
  onTogglePresentationMode: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  selectedLayerFilter: string;
  onSelectLayerFilter: (layer: string) => void;
  selectedRiskFilter: string;
  onSelectRiskFilter: (risk: string) => void;
  onResetView: () => void;
}

export function TopToolbar({
  currentMode,
  onSelectMode,
  searchQuery,
  onSearchChange,
  focusMode,
  onToggleFocusMode,
  layoutEngine,
  onChangeLayout,
  onOpenAiInsights,
  violationCount,
  onSelectPreset,
  presentationMode,
  onTogglePresentationMode,
  isFullscreen,
  onToggleFullscreen,
  selectedLayerFilter,
  onSelectLayerFilter,
  selectedRiskFilter,
  onSelectRiskFilter,
  onResetView,
}: TopToolbarProps) {
  const [showModesMenu, setShowModesMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showPresetsMenu, setShowPresetsMenu] = useState(false);
  const [showLayoutMenu, setShowLayoutMenu] = useState(false);

  const activeModeObj = ARCH_MODES.find((m) => m.name === currentMode) || ARCH_MODES[0];
  const IconComponent = activeModeObj.icon;

  return (
    <div className="flex flex-col border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl shrink-0 z-30 font-sans">
      {/* Primary Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5">
        {/* Left: Mode Switcher Dropdown */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setShowModesMenu(!showModesMenu)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 hover:border-cyan-500/50 text-white font-bold text-xs shadow-md transition-all group"
            >
              <div className="p-1 rounded-lg bg-cyan-500/20 text-cyan-400 group-hover:scale-105 transition-transform">
                <IconComponent className="w-4 h-4" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[9px] text-slate-400 uppercase tracking-wider font-mono">MODE</span>
                <span className="text-xs font-black text-cyan-200">{activeModeObj.name}</span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-500 ml-1 group-hover:text-slate-300" />
            </button>

            {/* 10 Modes Grid Popover */}
            {showModesMenu && (
              <div className="absolute top-full left-0 mt-2 w-80 bg-slate-950 border border-slate-800 rounded-2xl p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 font-mono">
                <div className="text-[10px] font-bold text-slate-500 uppercase px-3 py-1 border-b border-slate-800/80">
                  Select Visual Architecture Mode (10 Views)
                </div>
                <div className="grid grid-cols-1 gap-1 pt-1.5 max-h-80 overflow-y-auto scrollbar-none">
                  {ARCH_MODES.map((mode) => {
                    const ModeIcon = mode.icon;
                    const isSelected = mode.name === currentMode;
                    return (
                      <button
                        key={mode.name}
                        onClick={() => {
                          onSelectMode(mode.name);
                          setShowModesMenu(false);
                        }}
                        className={`flex items-start gap-3 p-2 rounded-xl text-left transition-all ${
                          isSelected
                            ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-200 font-bold'
                            : 'hover:bg-slate-900 text-slate-300'
                        }`}
                      >
                        <ModeIcon className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                        <div className="flex flex-col">
                          <span className="text-xs font-bold leading-tight">{mode.name}</span>
                          <span className="text-[10px] text-slate-400 font-sans leading-tight mt-0.5">
                            {mode.desc}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Quick Presets Menu */}
          <div className="relative hidden lg:block">
            <button
              onClick={() => setShowPresetsMenu(!showPresetsMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-bold font-mono transition-colors"
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-400" />
              <span>Saved Views</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {showPresetsMenu && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-slate-950 border border-slate-800 rounded-2xl p-2 shadow-2xl z-50 animate-in fade-in duration-150 font-mono">
                <div className="text-[10px] font-bold text-slate-500 uppercase px-3 py-1 border-b border-slate-800/80">
                  Architectural View Bookmarks
                </div>
                <div className="space-y-1 pt-1.5">
                  {SAVED_VIEW_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => {
                        onSelectPreset(preset);
                        setShowPresetsMenu(false);
                      }}
                      className="w-full text-left p-2 rounded-xl hover:bg-slate-900 transition-colors flex flex-col"
                    >
                      <span className="text-xs font-bold text-slate-200">{preset.name}</span>
                      <span className="text-[10px] text-slate-400 font-sans">{preset.description}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center: Node Search */}
        <div className="flex-1 max-w-sm mx-2">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-cyan-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search 100,000+ nodes, APIs, classes, services..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 font-mono shadow-inner transition-all"
            />
          </div>
        </div>

        {/* Right Controls: Filters, Focus, AI Insights, Layout, Presentation */}
        <div className="flex items-center gap-2">
          {/* Smart Filters Button */}
          <div className="relative">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all ${
                selectedLayerFilter !== 'All' || selectedRiskFilter !== 'All'
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Filter</span>
            </button>

            {showFilterMenu && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-slate-950 border border-slate-800 rounded-2xl p-3 shadow-2xl z-50 font-mono text-xs space-y-3">
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Architecture Layer</label>
                  <select
                    value={selectedLayerFilter}
                    onChange={(e) => onSelectLayerFilter(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-white text-xs"
                  >
                    <option value="All">All Layers</option>
                    <option value="Frontend">Frontend</option>
                    <option value="API Gateway">API Gateway</option>
                    <option value="Microservice">Microservices</option>
                    <option value="Data Store">Data Stores & Databases</option>
                    <option value="Messaging">Messaging & Queues</option>
                    <option value="Infrastructure">Infrastructure</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Risk Rating</label>
                  <select
                    value={selectedRiskFilter}
                    onChange={(e) => onSelectRiskFilter(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-white text-xs"
                  >
                    <option value="All">All Risk Levels</option>
                    <option value="Low">Low Risk</option>
                    <option value="Medium">Medium Risk</option>
                    <option value="High">High Risk</option>
                    <option value="Critical">Critical Risk</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Focus Mode Button */}
          <button
            onClick={onToggleFocusMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all ${
              focusMode
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-md shadow-cyan-950/50'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Isolate selected node and direct connections"
          >
            <Focus className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Focus Mode</span>
          </button>

          {/* Auto Layout Selector */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setShowLayoutMenu(!showLayoutMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono font-bold capitalize hover:border-slate-700"
            >
              <span>{layoutEngine}</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {showLayoutMenu && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-slate-950 border border-slate-800 rounded-2xl p-1.5 shadow-2xl z-50 font-mono text-xs space-y-1">
                {(['hierarchical', 'layered', 'circular', 'force-directed'] as const).map((layout) => (
                  <button
                    key={layout}
                    onClick={() => {
                      onChangeLayout(layout);
                      setShowLayoutMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg capitalize transition-colors ${
                      layoutEngine === layout ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    {layout} Layout
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* AI Insights Launcher Trigger */}
          <Button
            onClick={onOpenAiInsights}
            className="bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs gap-1.5 rounded-xl px-3 py-1.5 shadow-md shadow-cyan-950/50 relative"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
            <span className="hidden sm:inline">AI Insights</span>
            {violationCount > 0 && (
              <span className="px-1.5 py-0.5 text-[9px] font-mono font-black rounded-full bg-rose-500 text-white animate-pulse">
                {violationCount}
              </span>
            )}
          </Button>

          {/* Presentation Mode Toggle */}
          <button
            onClick={onTogglePresentationMode}
            className={`p-2 rounded-xl border transition-colors ${
              presentationMode
                ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Toggle Presentation Mode"
          >
            <Tv className="w-4 h-4 text-purple-400" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={onToggleFullscreen}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Reset View Button */}
          <button
            onClick={onResetView}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Reset Canvas View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mode Sub-Strip Bar */}
      <div className="flex items-center gap-2 px-4 py-1 border-t border-slate-900 bg-slate-950/60 overflow-x-auto text-[11px] font-mono text-slate-400">
        <span className="text-slate-500 font-bold uppercase text-[9px]">ACTIVE MODE:</span>
        <span className="text-cyan-300 font-bold">{activeModeObj.name}</span>
        <span className="text-slate-600">•</span>
        <span>{activeModeObj.desc}</span>
      </div>
    </div>
  );
}
