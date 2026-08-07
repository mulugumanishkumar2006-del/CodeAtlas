'use client';

import React, { useState } from 'react';
import { DocPage, DocVersion } from './doc-types';
import { History, X, GitCommit, ArrowLeftRight, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DocDiffVersionModalProps {
  isOpen: boolean;
  onClose: () => void;
  doc: DocPage;
}

export function DocDiffVersionModal({
  isOpen,
  onClose,
  doc,
}: DocDiffVersionModalProps) {
  const [selectedVer, setSelectedVer] = useState<string>('v2.4');

  if (!isOpen) return null;

  const versionHistory: DocVersion[] = doc.versions.length > 0 ? doc.versions : [
    {
      version: 'v2.4',
      updatedAt: '2 mins ago',
      author: 'AI Documentation Engineer',
      commitHash: doc.lastCommitHash,
      triggerEvent: doc.lastTrigger,
      summaryOfChanges: 'Updated route definitions for Payment API & Checkout service.',
      diffAddedLines: 42,
      diffRemovedLines: 12,
    },
    {
      version: 'v2.3',
      updatedAt: '3 hours ago',
      author: 'Sarah Chen (Principal Architect)',
      commitHash: '7b19a02',
      triggerEvent: 'architecture_change',
      summaryOfChanges: 'Added multi-tenant isolate policy notes to architecture diagram.',
      diffAddedLines: 18,
      diffRemovedLines: 4,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md font-sans">
      <div className="w-full max-w-4xl rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-slate-100">Version History & Split Diff Viewer</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 font-sans">
          {/* Version Selector */}
          <div className="space-y-2 font-mono text-xs">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Select Document Version Iteration
            </label>
            <div className="grid grid-cols-2 gap-3">
              {versionHistory.map((ver) => (
                <button
                  key={ver.version}
                  onClick={() => setSelectedVer(ver.version)}
                  className={cn(
                    'p-3.5 rounded-xl border text-left transition-all',
                    selectedVer === ver.version
                      ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-200 font-bold shadow-md'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-100">{ver.version}</span>
                    <span className="text-[10px] text-slate-500">{ver.updatedAt}</span>
                  </div>
                  <p className="text-xs text-slate-300 font-sans mt-1">{ver.summaryOfChanges}</p>
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-2">
                    <span className="text-emerald-400 font-bold">+{ver.diffAddedLines} lines</span>
                    <span className="text-rose-400 font-bold">-{ver.diffRemovedLines} lines</span>
                    <span className="ml-auto text-cyan-400">commit: {ver.commitHash}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Side-by-Side Diff View Box */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 font-mono text-xs overflow-hidden">
            <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5 font-bold text-slate-200">
                <ArrowLeftRight className="w-3.5 h-3.5 text-cyan-400" />
                <span>Side-by-Side Diff: v2.4 (Current) vs v2.3 (Previous)</span>
              </span>
              <span className="text-emerald-400 font-bold">+42 / -12 changes</span>
            </div>

            <div className="p-4 space-y-1 bg-slate-950 text-xs">
              <div className="p-2 rounded bg-emerald-950/40 border border-emerald-500/30 text-emerald-300">
                + [NEW] Added AST Symbol vector embeddings for PaymentGateway microservice router.
              </div>
              <div className="p-2 rounded bg-rose-950/40 border border-rose-500/30 text-rose-300">
                - [REMOVED] Deprecated sync HTTP call signature in favor of FastAPI async routing.
              </div>
              <div className="p-2 rounded bg-slate-900 text-slate-400">
                &nbsp;&nbsp;[UNCHANGED] System architecture overview and database models verified.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
