'use client';

import React, { useState } from 'react';
import {
  Globe,
  Database,
  Layers,
  Zap,
  ListOrdered,
  Cloud,
  ShieldCheck,
  Activity,
  Flame,
  Search,
  Focus,
  Sparkles,
  Maximize2,
  Minimize2,
  RotateCcw,
  ChevronDown,
  SlidersHorizontal,
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export const EXECUTION_MODES = [
  { name: 'Request Flow', icon: Globe, desc: 'End-to-end HTTP request trajectory' },
  { name: 'API Flow', icon: Globe, desc: 'REST/GraphQL API execution path' },
  { name: 'Database Flow', icon: Database, desc: 'SQL & ORM queries execution' },
  { name: 'Authentication Flow', icon: ShieldCheck, desc: 'JWT & OAuth authentication path' },
  { name: 'Dependency Flow', icon: Layers, desc: 'Cross-service call dependencies' },
  { name: 'Background Jobs', icon: ListOrdered, desc: 'Asynchronous Celery/Redis workers' },
  { name: 'Event Flow', icon: Zap, desc: 'Kafka event streaming flows' },
  { name: 'Async Flow', icon: Activity, desc: 'Non-blocking async event loops' },
  { name: 'Distributed Flow', icon: Cloud, desc: 'Jaeger distributed tracing across nodes' },
  { name: 'Microservice Flow', icon: Zap, desc: 'gRPC service-to-service calls' },
  { name: 'Infrastructure Flow', icon: Cloud, desc: 'K8s pods & Istio mesh proxy' },
  { name: 'Performance Flow', icon: Flame, desc: 'Latency p95/p99 heatmaps' },
  { name: 'Security Flow', icon: ShieldCheck, desc: 'Security audit & RBAC traces' },
  { name: 'Error Flow', icon: Flame, desc: 'Exception & failure fallback paths' },
];

interface ExecutionTopToolbarProps {
  currentMode: string;
  onSelectMode: (mode: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  latencyHeatmap: boolean;
  onToggleLatencyHeatmap: () => void;
  onOpenBottlenecksModal: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onResetView: () => void;
}

export function ExecutionTopToolbar({
  currentMode,
  onSelectMode,
  searchQuery,
  onSearchChange,
  latencyHeatmap,
  onToggleLatencyHeatmap,
  onOpenBottlenecksModal,
  isFullscreen,
  onToggleFullscreen,
  onResetView,
}: ExecutionTopToolbarProps) {
  const [showModeMenu, setShowModeMenu] = useState(false);

  const activeModeObj = EXECUTION_MODES.find((m) => m.name === currentMode) || EXECUTION_MODES[0];
  const ModeIcon = activeModeObj.icon;

  return (
    <div className="flex flex-col border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl shrink-0 z-30 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5">
        {/* Mode Switcher */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setShowModeMenu(!showModeMenu)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-white font-bold text-xs shadow-md transition-all group"
            >
              <div className="p-1 rounded-lg bg-cyan-500/20 text-cyan-400">
                <ModeIcon className="w-4 h-4" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[9px] text-slate-400 uppercase tracking-wider font-mono">EXECUTION MODE</span>
                <span className="text-xs font-black text-cyan-200">{activeModeObj.name}</span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-500 ml-1" />
            </button>

            {/* 14 Modes Popover */}
            {showModeMenu && (
              <div className="absolute top-full left-0 mt-2 w-80 bg-slate-950 border border-slate-800 rounded-2xl p-2 shadow-2xl z-50 font-mono">
                <div className="text-[10px] font-bold text-slate-500 uppercase px-3 py-1 border-b border-slate-800/80">
                  Select 14 Execution Modes
                </div>
                <div className="grid grid-cols-1 gap-1 pt-1.5 max-h-80 overflow-y-auto scrollbar-none">
                  {EXECUTION_MODES.map((mode) => {
                    const MIcon = mode.icon;
                    const isSelected = mode.name === currentMode;
                    return (
                      <button
                        key={mode.name}
                        onClick={() => {
                          onSelectMode(mode.name);
                          setShowModeMenu(false);
                        }}
                        className={`flex items-start gap-3 p-2 rounded-xl text-left transition-all ${
                          isSelected
                            ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-200 font-bold'
                            : 'hover:bg-slate-900 text-slate-300'
                        }`}
                      >
                        <MIcon className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
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
        </div>

        {/* Center Search Input */}
        <div className="flex-1 max-w-sm mx-2">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-cyan-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by Request ID, Endpoint, Service, SQL query..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 font-mono shadow-inner transition-all"
            />
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleLatencyHeatmap}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all ${
              latencyHeatmap
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Latency Heatmap</span>
          </button>

          <Button
            onClick={onOpenBottlenecksModal}
            className="bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs gap-1.5 rounded-xl px-3 py-1.5 shadow-md shadow-cyan-950/50"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
            <span>AI Bottlenecks</span>
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
