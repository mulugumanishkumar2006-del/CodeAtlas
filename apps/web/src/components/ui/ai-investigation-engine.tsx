'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Search,
  Sparkles,
  Zap,
  Play,
  CheckCircle2,
  Clock,
  Layers,
  Flame,
  ShieldCheck,
  Building2,
  Maximize2,
  Minimize2,
  Bookmark,
  Share2,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AiInvestigationPipeline } from '@/components/ui/ai-investigation-pipeline';
import { AiInvestigationReasoningTree } from '@/components/ui/ai-investigation-reasoning-tree';
import { AiInvestigationReport } from '@/components/ui/ai-investigation-report';
import { AiInvestigationCollaboration } from '@/components/ui/ai-investigation-collaboration';

const PRESET_INVESTIGATIONS = [
  { id: 'inv-1', label: 'Investigate slow checkout', query: 'Investigate slow checkout latency & DB lock spikes', category: 'Performance' },
  { id: 'inv-2', label: 'Investigate authentication failures', query: 'Investigate authentication gateway token validation errors', category: 'Security' },
  { id: 'inv-3', label: 'Investigate increasing memory usage', query: 'Investigate increasing memory usage in analytics worker pool', category: 'Performance' },
  { id: 'inv-4', label: 'Investigate architecture drift', query: 'Investigate REST router architecture drift in PaymentService', category: 'Architecture' },
  { id: 'inv-5', label: 'Investigate dependency conflicts', query: 'Investigate dependency resolution conflicts in Auth module', category: 'Dependency' },
  { id: 'inv-6', label: 'Investigate technical debt', query: 'Investigate technical debt drag in legacy Pydantic v1 configs', category: 'Technical Debt' },
  { id: 'inv-7', label: 'Investigate security risks', query: 'Investigate SOC2 posture and dependency CVE advisories', category: 'Security' },
  { id: 'inv-8', label: 'Investigate flaky tests', query: 'Investigate flaky AST boundary test assertions', category: 'Testing' },
  { id: 'inv-9', label: 'Investigate API latency', query: 'Investigate P99 API latency degradation under 50k QPS', category: 'Performance' },
  { id: 'inv-10', label: 'Investigate circular dependencies', query: 'Investigate circular reference between PaymentService and UserRepository', category: 'Architecture' },
  { id: 'inv-11', label: 'Investigate build failures', query: 'Investigate TypeScript AST compilation build warnings', category: 'Build' },
  { id: 'inv-12', label: 'Investigate database bottlenecks', query: 'Investigate PostgreSQL connection pool saturation under burst load', category: 'Database' }
];

export function AIInvestigationEngine() {
  const [currentQuery, setCurrentQuery] = useState<string>('Investigate slow checkout latency & DB lock spikes');
  const [customInput, setCustomInput] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const handleStartInvestigation = (queryText: string) => {
    setCurrentQuery(queryText);
    setIsAnalyzing(true);
  };

  return (
    <div className={`space-y-8 max-w-7xl mx-auto pb-24 font-sans select-none ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-950 p-6 overflow-y-auto max-w-none' : ''}`}>
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-5 font-mono">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-500 p-0.5 shadow-lg shadow-cyan-950/60">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Brain className="w-6 h-6 text-cyan-400 animate-pulse" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-white tracking-tight">AI Investigation Engine</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" /> AUTONOMOUS INCIDENT RESPONSE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Correlate code architecture, execution call graphs, commit diffs, security posture, and simulations in seconds.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={() => setIsFullscreen((p) => !p)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Preset Investigation Triggers & Search Bar */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800/80 shadow-2xl space-y-4 font-mono">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-cyan-400" /> Start AI Engineering Investigation
          </span>
          <span className="text-[10px] text-cyan-400 font-bold">12 PRESET TRIGGER SCENARIOS</span>
        </div>

        {/* Custom Input Search Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (customInput.trim()) {
              handleStartInvestigation(customInput);
              setCustomInput('');
            }
          }}
          className="flex items-center gap-2 font-mono"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Describe any engineering problem (e.g., Investigate slow checkout, circular dependencies...)"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 font-mono shadow-inner"
            />
          </div>
          <Button
            type="submit"
            className="bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold font-mono px-5 h-11 rounded-2xl shadow-lg shadow-cyan-950/60 cursor-pointer gap-2"
          >
            <Zap className="w-4 h-4 text-cyan-200" /> Start Investigation
          </Button>
        </form>

        {/* Preset Query Pills */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[10px] text-slate-500 uppercase font-bold block">12 INSTANT INVESTIGATION PRESETS:</span>
          <div className="flex flex-wrap gap-2 text-xs">
            {PRESET_INVESTIGATIONS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleStartInvestigation(preset.query)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentQuery === preset.query
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'bg-slate-950/80 border border-slate-800/80 text-slate-300 hover:text-white hover:border-slate-700'
                }`}
              >
                ⚡ {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 1. REAL-TIME INVESTIGATION PIPELINE (15 Stages) */}
      <AiInvestigationPipeline
        isAnalyzing={isAnalyzing}
        onComplete={() => setIsAnalyzing(false)}
      />

      {/* 2. TRANSPARENT AI CHAIN-OF-THOUGHT REASONING TREE */}
      <AiInvestigationReasoningTree />

      {/* 3. STRUCTURED INTERACTIVE INVESTIGATION REPORT */}
      <AiInvestigationReport />

      {/* 4. TEAM COLLABORATION & FOLLOW-UP TASK EXPORT */}
      <AiInvestigationCollaboration />
    </div>
  );
}
