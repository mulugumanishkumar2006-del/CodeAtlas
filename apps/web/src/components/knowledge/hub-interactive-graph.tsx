'use client';

import React, { useState } from 'react';
import { HubNode, HubEdge } from './hub-types';
import { Network, Focus, ExternalLink, Sparkles, Layers, Users, BookOpen, Clock, ShieldCheck, Database, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HubInteractiveGraphProps {
  nodes: HubNode[];
  edges: HubEdge[];
}

export function HubInteractiveGraph({ nodes, edges }: HubInteractiveGraphProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string>(nodes[0]?.id || '');

  const activeNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 font-sans shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3 font-mono">
        <div className="flex items-center gap-2">
          <Network className="w-5 h-5 text-cyan-400" />
          <h2 className="text-sm font-bold text-slate-100">
            Interactive AI Engineering Knowledge Graph Canvas
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            {nodes.length} Connected Nodes
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] bg-purple-500/10 text-purple-300 border border-purple-500/30">
            {edges.length} Dependency Edges
          </span>
        </div>
      </div>

      {/* Interactive Graph Node Badges Selector */}
      <div className="space-y-2 font-mono text-xs">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          Select Knowledge Node to Inspect Topology:
        </span>
        <div className="flex flex-wrap gap-2">
          {nodes.map((n) => (
            <button
              key={n.id}
              onClick={() => setSelectedNodeId(n.id)}
              className={cn(
                'px-3 py-1.5 rounded-xl border transition-all text-xs flex items-center gap-1.5',
                selectedNodeId === n.id
                  ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/10 text-cyan-300 border-cyan-500/40 font-bold shadow-md'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              )}
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>{n.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Node Detailed Inspector */}
      {activeNode && (
        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4 font-sans text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-900 pb-3 font-mono">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                {activeNode.label}
                <span className="px-2 py-0.5 rounded text-[9px] bg-purple-500/10 text-purple-300 border border-purple-500/30 uppercase">
                  {activeNode.nodeType}
                </span>
              </h3>
              <p className="text-[10px] text-slate-400">Team: <strong className="text-slate-200">{activeNode.teamOwner}</strong> • Tech: <strong className="text-cyan-300">{activeNode.technology}</strong></p>
            </div>

            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>{activeNode.historyEventsCount} History Events</span>
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-sans">{activeNode.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-purple-400" />
                <span>Key Contributors:</span>
              </span>
              <p className="text-slate-200 text-[11px] font-sans">{activeNode.contributors.join(', ')}</p>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                <span>Related Documentation & ADRs:</span>
              </span>
              <p className="text-slate-200 text-[11px] font-sans">{activeNode.relatedDocIds.join(', ')}</p>
            </div>
          </div>

          {/* AI Recommendation */}
          <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-xs font-mono flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-cyan-300 uppercase text-[9px] block">AI Knowledge Recommendation:</span>
              <span className="text-slate-200 text-[11px] font-sans">{activeNode.aiRecommendation}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
