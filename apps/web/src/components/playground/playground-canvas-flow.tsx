'use client';

import React, { useState } from 'react';
import { SystemNode, RequestFlowPacket } from './playground-types';
import { Network, Play, Pause, FastForward, Activity, ShieldCheck, Zap, Server, Database, Radio, HardDrive, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlaygroundCanvasFlowProps {
  nodes: SystemNode[];
  requestPackets: RequestFlowPacket[];
}

export function PlaygroundCanvasFlow({ nodes, requestPackets }: PlaygroundCanvasFlowProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string>(nodes[0]?.id || '');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speed, setSpeed] = useState<0.5 | 1 | 2>(1);

  const activeNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  const getNodeIcon = (type: SystemNode['nodeType']) => {
    switch (type) {
      case 'gateway': return Globe;
      case 'database': return Database;
      case 'cache': return HardDrive;
      case 'queue': return Radio;
      default: return Server;
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 font-sans shadow-xl">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3 font-mono">
        <div className="flex items-center gap-2">
          <Network className="w-5 h-5 text-cyan-400" />
          <h2 className="text-sm font-bold text-slate-100">
            Interactive Distributed System Topology Canvas & Animated Request Stream
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-cyan-300 font-bold flex items-center gap-1.5 hover:border-cyan-500/40"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause Flow' : 'Stream Flow'}</span>
          </button>

          {([0.5, 1, 2] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={cn(
                'px-2 py-0.5 rounded text-[10px] font-bold border transition-colors',
                speed === s
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-slate-950 text-slate-400 border-slate-800'
              )}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Interactive System Canvas Badges */}
      <div className="space-y-2 font-mono text-xs">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          Select Topology Node to Inspect Runtime Telemetry:
        </span>
        <div className="flex flex-wrap gap-2">
          {nodes.map((n) => {
            const Icon = getNodeIcon(n.nodeType);
            return (
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
                <Icon className="w-3.5 h-3.5 text-cyan-400" />
                <span>{n.name}</span>
                <span
                  className={cn(
                    'w-1.5 h-1.5 rounded-full',
                    n.status === 'healthy' ? 'bg-emerald-400' : 'bg-amber-400'
                  )}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Node Detailed Inspector */}
      {activeNode && (
        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4 font-sans text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-900 pb-3 font-mono">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                {activeNode.name}
                <span
                  className={cn(
                    'px-2 py-0.5 rounded text-[9px] font-bold uppercase border',
                    activeNode.status === 'healthy'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  )}
                >
                  {activeNode.status}
                </span>
              </h3>
              <p className="text-[10px] text-slate-400">Team Owner: <strong className="text-slate-200">{activeNode.ownerTeam}</strong></p>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-500 block">QPS:</span>
                <strong className="text-cyan-300 font-bold">{(activeNode.qps / 1000).toFixed(0)}k</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">P95 Latency:</span>
                <strong className="text-emerald-400 font-bold">{activeNode.p95LatencyMs} ms</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">CPU Load:</span>
                <strong className="text-purple-300 font-bold">{activeNode.cpuUsagePct}%</strong>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-sans">{activeNode.aiSummary}</p>
        </div>
      )}
    </div>
  );
}
