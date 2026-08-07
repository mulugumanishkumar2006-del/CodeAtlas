'use client';

import React from 'react';
import { DatabaseCommandMetrics } from './db-types';
import { Database, Activity, HardDrive, ShieldCheck, Sparkles, CheckCircle2, Clock, Layers } from 'lucide-react';

interface DbCommandCenterProps {
  metrics: DatabaseCommandMetrics;
}

export function DbCommandCenter({ metrics }: DbCommandCenterProps) {
  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 font-sans shadow-xl">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3 font-mono">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-cyan-400" />
          <h2 className="text-sm font-bold text-slate-100">
            Database Topology Command Center & Modernization Scorecard
          </h2>
        </div>

        <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono">
          PostgreSQL + Neo4j + Vector Active
        </span>
      </div>

      {/* Primary Scorecard Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Schema Health:</span>
          <span className="text-sm font-black text-emerald-400">{metrics.schemaHealthPct}%</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Avg Query Latency:</span>
          <span className="text-sm font-black text-cyan-300">{metrics.avgQueryLatencyMs} ms</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Migration Readiness:</span>
          <span className="text-sm font-black text-purple-300">{metrics.migrationReadinessScore}/100</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Downtime Estimate:</span>
          <span className="text-sm font-black text-emerald-400">0.0 Mins (Zero Downtime)</span>
        </div>
      </div>

      {/* Database Topology Metrics */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
        <div className="flex justify-between items-center border-b border-slate-900 pb-2">
          <span className="font-bold text-slate-100 flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Database Replication & Backup Telemetry</span>
          </span>
          <span className="text-emerald-400 font-bold text-[10px]">Data Integrity: {metrics.dataIntegrityScorePct}%</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase block">Replication Status:</span>
            <span className="text-slate-200 text-[11px] font-sans font-bold">{metrics.replicationStatus}</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase block">Storage Growth Rate:</span>
            <span className="text-cyan-300 text-[11px] font-sans font-bold">+{metrics.monthlyStorageGrowthGb} GB / Month</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase block">Backup Readiness:</span>
            <span className="text-purple-300 text-[11px] font-sans font-bold">{metrics.backupHealthPct}% Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
}
