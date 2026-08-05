'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  FlaskConical,
  FileText,
  Copy,
  Check,
  User,
  ArrowUpRight,
  ArrowDownLeft,
  Activity,
  ShieldAlert,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { KnowledgeNodeData, KnowledgeRelationship } from './knowledge-mock-data';
import { getKnowledgeNodeIcon } from './knowledge-custom-nodes';

interface KnowledgeRightPanelProps {
  selectedNode: KnowledgeNodeData | null;
  selectedRelationship: KnowledgeRelationship | null;
  onClose: () => void;
  onNavigateToNode: (nodeId: string) => void;
  onInvestigate: (nodeId: string) => void;
  onSimulate: (nodeId: string) => void;
  onGenerateDocs: (nodeId: string) => void;
}

export function KnowledgeRightPanel({
  selectedNode,
  selectedRelationship,
  onClose,
  onNavigateToNode,
  onInvestigate,
  onSimulate,
  onGenerateDocs,
}: KnowledgeRightPanelProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'graph' | 'metrics' | 'ai'>('overview');
  const [copiedId, setCopiedId] = useState(false);

  if (!selectedNode && !selectedRelationship) return null;

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div className="w-80 bg-slate-950/95 border-l border-slate-800/80 flex flex-col h-full shrink-0 select-none z-20 font-sans backdrop-blur-xl animate-in slide-in-from-right duration-200 shadow-2xl">
      {/* Panel Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 shadow-inner">
            {selectedNode ? (
              getKnowledgeNodeIcon(selectedNode.type, selectedNode.category)
            ) : (
              <Zap className="w-5 h-5 text-cyan-400" />
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-cyan-400 truncate">
              {selectedNode ? `${selectedNode.type} • ${selectedNode.category}` : 'KNOWLEDGE RELATIONSHIP'}
            </span>
            <h3 className="text-sm font-black text-white truncate leading-tight">
              {selectedNode ? selectedNode.name : `${selectedRelationship?.source} ➔ ${selectedRelationship?.target}`}
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
        {(['overview', 'graph', 'metrics', 'ai'] as const).map((tab) => (
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

      {/* Content Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono scrollbar-none text-xs">
        {selectedNode && (
          <>
            {/* Action Buttons Row */}
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
                <Zap className="w-3.5 h-3.5" /> Simulate
              </Button>
              <Button
                onClick={() => onGenerateDocs(selectedNode.id)}
                className="bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 font-bold text-xs gap-1.5 rounded-xl h-8 col-span-2"
              >
                <FileText className="w-3.5 h-3.5" /> Generate Knowledge Spec
              </Button>
            </div>

            {/* Tab: Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-4">
                {/* AI Executive Summary Card */}
                <div className="p-3 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800/90 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> AI Summary & Purpose
                    </span>
                    <button
                      onClick={() => handleCopyId(selectedNode.id)}
                      className="text-[9px] text-slate-500 hover:text-slate-300 flex items-center gap-1"
                    >
                      {copiedId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId ? 'Copied' : 'ID'}</span>
                    </button>
                  </div>
                  <p className="text-[11px] font-sans text-slate-300 leading-relaxed">
                    {selectedNode.purpose || selectedNode.description}
                  </p>
                </div>

                {/* Core Responsibilities */}
                {selectedNode.responsibilities && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Responsibilities</span>
                    <ul className="space-y-1 font-sans text-[11px] text-slate-300">
                      {selectedNode.responsibilities.map((resp, i) => (
                        <li key={i} className="flex items-start gap-2 bg-slate-900/60 p-2 rounded-xl border border-slate-800/60">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1 shrink-0" />
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Metadata Property Table */}
                <div className="p-3 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2 text-[11px]">
                  <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                    <span className="text-slate-500">Repository</span>
                    <span className="text-slate-200 font-bold truncate max-w-[150px]">{selectedNode.repository}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                    <span className="text-slate-500">Technology</span>
                    <span className="text-cyan-300 font-bold">{selectedNode.technology}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                    <span className="text-slate-500">Owner</span>
                    <span className="text-slate-200 font-bold">{selectedNode.owner}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Graph */}
            {activeTab === 'graph' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <span className="text-[10px] text-cyan-400 font-bold uppercase flex items-center gap-1">
                    <ArrowUpRight className="w-3.5 h-3.5" /> Direct Graph Dependencies
                  </span>
                  <div className="space-y-1">
                    <button
                      onClick={() => onNavigateToNode('cache-redis-billing')}
                      className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800 text-left hover:border-cyan-500/40 transition-colors"
                    >
                      <span className="text-xs font-bold text-slate-200">Redis Billing Session Cache</span>
                      <span className="text-[9px] text-cyan-400 font-mono">Depends On</span>
                    </button>
                    <button
                      onClick={() => onNavigateToNode('db-postgres-customer')}
                      className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800 text-left hover:border-cyan-500/40 transition-colors"
                    >
                      <span className="text-xs font-bold text-slate-200">PostgreSQL Customer DB</span>
                      <span className="text-[9px] text-yellow-400 font-mono">Writes</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Metrics */}
            {activeTab === 'metrics' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col">
                    <span className="text-[9px] text-slate-500">PAGERANK</span>
                    <span className="text-lg font-black text-cyan-300 mt-1">
                      {(selectedNode.metrics?.pageRankScore ?? 0.85).toFixed(2)}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col">
                    <span className="text-[9px] text-slate-500">COUPLING</span>
                    <span className="text-lg font-black text-amber-300 mt-1">
                      {selectedNode.metrics?.couplingDensity ?? 0.4}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Selected Relationship Details */}
        {selectedRelationship && !selectedNode && (
          <div className="space-y-3">
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-[10px] text-cyan-400 font-bold uppercase block">Relationship Protocol</span>
              <div className="text-xs font-bold text-white">{selectedRelationship.type}</div>
              <p className="text-[11px] font-sans text-slate-300">{selectedRelationship.description}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
