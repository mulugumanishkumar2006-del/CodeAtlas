'use client';

import React from 'react';
import { TraceSpan } from './playground-types';
import { Activity, Sparkles, Clock, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react';

interface PlaygroundTraceViewerProps {
  traceSpans: TraceSpan[];
}

export function PlaygroundTraceViewer({ traceSpans }: PlaygroundTraceViewerProps) {
  const rootSpan = traceSpans[0];

  const renderSpan = (span: TraceSpan, depth = 0) => (
    <div key={span.id} className="space-y-2 font-mono text-xs">
      <div
        className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 hover:border-cyan-500/40 transition-colors"
        style={{ marginLeft: `${depth * 20}px` }}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-900 pb-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              {span.serviceName}
            </span>
            <span className="font-bold text-slate-100">{span.operationName}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-emerald-400 font-bold">{span.durationMs} ms</span>
            <span
              className={`px-1.5 py-0.2 rounded text-[8px] font-bold uppercase ${
                span.status === 'ok' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
              }`}
            >
              {span.status}
            </span>
          </div>
        </div>

        {/* Latency Waterfall Bar */}
        <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden relative">
          <div
            className={`h-full ${span.status === 'ok' ? 'bg-cyan-400' : 'bg-rose-500'}`}
            style={{ width: `${Math.min(100, (span.durationMs / 200) * 100)}%` }}
          />
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 text-[9px] text-slate-400 pt-0.5">
          {Object.entries(span.tags).map(([k, v], idx) => (
            <span key={idx} className="px-1.5 py-0.2 rounded bg-slate-900 text-slate-300 border border-slate-800">
              {k}: <strong className="text-cyan-300">{v}</strong>
            </span>
          ))}
        </div>
      </div>

      {span.children?.map((child) => renderSpan(child, depth + 1))}
    </div>
  );

  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 font-sans shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-bold text-slate-100">
            Interactive Distributed Trace Explorer (Jaeger / OpenTelemetry Stream)
          </h3>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 font-mono">
          Span Hierarchy Active
        </span>
      </div>

      {rootSpan && renderSpan(rootSpan)}

      {/* AI Root Cause Summary */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs">
        <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>AI Trace Root Cause Analysis:</span>
        </span>
        <p className="text-slate-200 font-sans text-xs leading-relaxed">
          Critical path bottleneck detected in <strong className="text-cyan-300">db-primary</strong> (154ms wait on row locks). Introduce Redis cache layer in front of Auth/Payment to resolve.
        </p>
      </div>
    </div>
  );
}
