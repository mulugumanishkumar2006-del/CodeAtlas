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
  TrendingDown,
  FileText,
  ShieldAlert,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DriftNodeData } from './drift-mock-data';

interface DriftInspectorPanelProps {
  selectedNode: DriftNodeData | null;
  onClose: () => void;
  onSimulateFix: (nodeId: string) => void;
  onGenerateAdr: (nodeId: string) => void;
}

export function DriftInspectorPanel({
  selectedNode,
  onClose,
  onSimulateFix,
  onGenerateAdr,
}: DriftInspectorPanelProps) {
  const [activeTab, setActiveTab] = useState<'drift' | 'violations' | 'remediation'>('drift');

  if (!selectedNode) return null;

  return (
    <div className="w-84 bg-slate-950/95 border-l border-slate-800/80 flex flex-col h-full shrink-0 select-none z-20 font-sans backdrop-blur-xl animate-in slide-in-from-right duration-200 shadow-2xl">
      {/* Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 shadow-inner text-amber-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-cyan-400 truncate">
              ARCHITECTURE DRIFT INSPECTOR
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
        {(['drift', 'violations', 'remediation'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-1 rounded-lg capitalize font-bold transition-all ${
              activeTab === tab ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono scrollbar-none text-xs">
        {/* Action Triggers */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={() => onSimulateFix(selectedNode.id)}
            className="bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/40 font-bold text-xs gap-1.5 rounded-xl h-8"
          >
            <FlaskConical className="w-3.5 h-3.5" /> Simulate Fix
          </Button>
          <Button
            onClick={() => onGenerateAdr(selectedNode.id)}
            className="bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/40 font-bold text-xs gap-1.5 rounded-xl h-8"
          >
            <FileText className="w-3.5 h-3.5" /> Generate ADR
          </Button>
        </div>

        {/* Tab: Drift Overview */}
        {activeTab === 'drift' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2">
              <span className="text-[10px] text-amber-400 font-bold uppercase block">Drift Analysis</span>
              <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                {selectedNode.driftDescription}
              </p>
            </div>

            <div className="space-y-2 text-[11px]">
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Owner Team</span>
                <span className="font-bold text-white">{selectedNode.ownerTeam}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Layer Boundary</span>
                <span className="font-bold text-cyan-300">{selectedNode.layer}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Risk Severity</span>
                <span className="font-bold text-rose-400">{selectedNode.riskRating} Risk</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Violations */}
        {activeTab === 'violations' && (
          <div className="space-y-3">
            <span className="text-[10px] text-rose-400 font-bold uppercase block">Layer Boundary Violations</span>
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
              {selectedNode.violatingLayer || 'No direct architectural boundary violations detected.'}
            </div>
          </div>
        )}

        {/* Tab: Remediation */}
        {activeTab === 'remediation' && (
          <div className="space-y-3 font-sans text-xs">
            <div className="p-3 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase block">Recommended Fix</span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Refactor direct database access to use GraphQueryRepository service wrapper and update Istio routing rules.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
