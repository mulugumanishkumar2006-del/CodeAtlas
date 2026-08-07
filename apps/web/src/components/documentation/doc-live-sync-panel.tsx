'use client';

import React, { useState } from 'react';
import { LiveSyncEvent, LiveTriggerType } from './doc-types';
import { MOCK_LIVE_EVENTS } from './doc-mock-data';
import { RefreshCw, X, Play, Zap, ShieldAlert, GitPullRequest, Database, Layers, CheckCircle2, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DocLiveSyncPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerEvent: (type: LiveTriggerType, description: string) => void;
}

export function DocLiveSyncPanel({
  isOpen,
  onClose,
  onTriggerEvent,
}: DocLiveSyncPanelProps) {
  const [events, setEvents] = useState<LiveSyncEvent[]>(MOCK_LIVE_EVENTS);

  if (!isOpen) return null;

  const handleSimulate = (type: LiveTriggerType, desc: string, source: string) => {
    const newEvent: LiveSyncEvent = {
      id: `evt-${Date.now()}`,
      timestamp: 'Just now',
      triggerType: type,
      source,
      affectedDocsCount: Math.floor(Math.random() * 3) + 1,
      docIds: ['doc-repo-overview', 'doc-api'],
      description: desc,
      status: 'synced',
    };

    setEvents((prev) => [newEvent, ...prev]);
    onTriggerEvent(type, desc);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-slate-950/95 border-l border-slate-800 shadow-2xl backdrop-blur-xl flex flex-col font-sans select-none">
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin-slow" />
          <div>
            <h3 className="text-sm font-bold text-slate-100 leading-none">Live Auto-Sync Engine</h3>
            <p className="text-[10px] font-mono text-slate-400 mt-0.5">Continuous Repository Indexing</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Trigger Event Simulator Bar */}
      <div className="p-4 bg-slate-900/40 border-b border-slate-800 space-y-2">
        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
          Simulate Repository Update Events
        </span>

        <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
          <button
            onClick={() =>
              handleSimulate('api_change', 'PaymentGateway API endpoint updated schema', 'Git PR #490 Merged')
            }
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-cyan-300 flex items-center gap-1.5 transition-colors text-left"
          >
            <GitPullRequest className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
            <span>Simulate PR Merge</span>
          </button>

          <button
            onClick={() =>
              handleSimulate('database_change', 'Multi-tenant column index created', 'Alembic Migration 0043')
            }
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-indigo-300 flex items-center gap-1.5 transition-colors text-left"
          >
            <Database className="w-3.5 h-3.5 shrink-0 text-indigo-400" />
            <span>Simulate DB Migration</span>
          </button>

          <button
            onClick={() =>
              handleSimulate('drift_detected', 'Architecture Drift detected in Kafka loop', 'AEO Drift Engine')
            }
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-amber-300 flex items-center gap-1.5 transition-colors text-left"
          >
            <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-amber-400" />
            <span>Simulate Drift Alert</span>
          </button>

          <button
            onClick={() =>
              handleSimulate('simulation_completed', 'Completed 100k Peak Load Simulation', 'Simulation Studio')
            }
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-purple-500/50 text-purple-300 flex items-center gap-1.5 transition-colors text-left"
          >
            <Zap className="w-3.5 h-3.5 shrink-0 text-purple-400" />
            <span>Simulate Stress Test</span>
          </button>
        </div>
      </div>

      {/* Events Log Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs scrollbar-thin scrollbar-thumb-slate-800">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          Recent Event History Stream
        </span>

        {events.map((evt) => (
          <div
            key={evt.id}
            className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                {evt.triggerType.replace('_', ' ')}
              </span>
              <span className="text-[10px] text-slate-500">{evt.timestamp}</span>
            </div>

            <div className="font-bold text-slate-200 text-[11px]">{evt.source}</div>
            <p className="text-[11px] text-slate-400 font-sans leading-relaxed">{evt.description}</p>

            <div className="flex items-center justify-between text-[10px] pt-1 text-slate-400">
              <span>Affected Docs: <strong className="text-cyan-300">{evt.affectedDocsCount} pages</strong></span>
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                <CheckCircle2 className="w-3 h-3" />
                <span>Auto-Synced</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
