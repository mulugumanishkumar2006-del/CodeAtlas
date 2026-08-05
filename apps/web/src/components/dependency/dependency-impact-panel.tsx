'use client';

import React, { useState } from 'react';
import {
  Flame,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileCode,
  Globe,
  Database,
  FlaskConical,
  Zap,
  Sparkles,
  ArrowUpRight,
  ArrowDownLeft,
  Copy,
  Check,
  RotateCcw,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DependencyNodeData, ImpactAnalysisReport, MOCK_IMPACT_REPORT } from './dependency-mock-data';
import { getDependencyNodeIcon } from './dependency-custom-nodes';

interface DependencyImpactPanelProps {
  selectedNode: DependencyNodeData | null;
  onClose: () => void;
  onNavigateToNode: (nodeId: string) => void;
  onInvestigate: (nodeId: string) => void;
  onSimulate: (nodeId: string) => void;
  onGenerateDocs: (nodeId: string) => void;
}

export function DependencyImpactPanel({
  selectedNode,
  onClose,
  onNavigateToNode,
  onInvestigate,
  onSimulate,
  onGenerateDocs,
}: DependencyImpactPanelProps) {
  const [activeTab, setActiveTab] = useState<'blast-radius' | 'files' | 'services' | 'migration'>('blast-radius');
  const [copiedId, setCopiedId] = useState(false);

  if (!selectedNode) return null;

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const impactReport = MOCK_IMPACT_REPORT;

  return (
    <div className="w-84 bg-slate-950/95 border-l border-slate-800/80 flex flex-col h-full shrink-0 select-none z-20 font-sans backdrop-blur-xl animate-in slide-in-from-right duration-200 shadow-2xl">
      {/* Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 shadow-inner">
            {getDependencyNodeIcon(selectedNode.type)}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-cyan-400 truncate">
              BLAST RADIUS IMPACT ANALYZER
            </span>
            <h3 className="text-sm font-black text-white truncate leading-tight">
              {selectedNode.name}
            </h3>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 text-xs font-mono"
        >
          ✕
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center border-b border-slate-800/80 p-1 bg-slate-950/60 text-[10px] font-mono">
        {(['blast-radius', 'files', 'services', 'migration'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-1 rounded-lg capitalize font-bold transition-all ${
              activeTab === tab ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono scrollbar-none text-xs">
        {/* Action Triggers */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={() => onInvestigate(selectedNode.id)}
            className="bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/40 font-bold text-xs gap-1.5 rounded-xl h-8"
          >
            <FlaskConical className="w-3.5 h-3.5" /> Investigate
          </Button>
          <Button
            onClick={() => onSimulate(selectedNode.id)}
            className="bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/40 font-bold text-xs gap-1.5 rounded-xl h-8"
          >
            <Zap className="w-3.5 h-3.5" /> Simulate Impact
          </Button>
        </div>

        {/* Tab: Blast Radius Overview */}
        {activeTab === 'blast-radius' && (
          <div className="space-y-4">
            {/* Impact Metric Gauge */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-rose-400 font-bold uppercase flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" /> What Breaks If Changed?
                </span>
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold text-[10px]">
                  {impactReport.riskLevel} RISK
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-500">ESTIMATED EFFORT</span>
                  <span className="text-base font-black text-amber-300 block mt-0.5">
                    {impactReport.engineeringEffortHours} hrs
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-500">AI CONFIDENCE</span>
                  <span className="text-base font-black text-emerald-300 block mt-0.5">
                    {impactReport.confidenceScorePct}%
                  </span>
                </div>
              </div>
            </div>

            {/* Affected Counts Overview */}
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Affected Files</span>
                <span className="font-bold text-cyan-300">{impactReport.affectedFiles.length}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Affected Services</span>
                <span className="font-bold text-indigo-300">{impactReport.affectedServices.length}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Failing Tests</span>
                <span className="font-bold text-rose-400">{impactReport.affectedTests.length}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Broken APIs</span>
                <span className="font-bold text-amber-300">{impactReport.affectedApis.length}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Affected Files */}
        {activeTab === 'files' && (
          <div className="space-y-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Impacted Codebase Files</span>
            {impactReport.affectedFiles.map((file, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 flex items-center gap-2">
                <FileCode className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate">{file}</span>
              </div>
            ))}
          </div>
        )}

        {/* Tab: Migration Plan */}
        {activeTab === 'migration' && (
          <div className="space-y-3 font-sans text-xs">
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase block">Safe Migration Strategy</span>
              <p className="text-[11px] text-slate-300 leading-relaxed">{impactReport.migrationPlan}</p>
            </div>
            <div className="p-3 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-1">
              <span className="text-[10px] font-mono text-rose-400 font-bold uppercase block">Canary Rollback Strategy</span>
              <p className="text-[11px] text-slate-300 leading-relaxed">{impactReport.rollbackStrategy}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
