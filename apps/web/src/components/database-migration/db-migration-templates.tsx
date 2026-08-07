'use client';

import React, { useState } from 'react';
import { MigrationPathTemplate } from './db-types';
import { Database, Sparkles, CheckCircle2, ArrowRight, Layers, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DbMigrationTemplatesProps {
  templates: MigrationPathTemplate[];
  onSelectTemplate: (template: MigrationPathTemplate) => void;
}

export function DbMigrationTemplates({ templates, onSelectTemplate }: DbMigrationTemplatesProps) {
  const [selectedId, setSelectedId] = useState<string>(templates[0]?.id || '');

  const activeTemplate = templates.find((t) => t.id === selectedId) || templates[0];

  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 font-sans shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-slate-100">
            Enterprise Database Migration & Modernization Paths
          </h3>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono">
          Zero-Downtime Migration Engine
        </span>
      </div>

      {/* Migration Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
        {templates.map((tpl) => (
          <div
            key={tpl.id}
            onClick={() => {
              setSelectedId(tpl.id);
              onSelectTemplate(tpl);
            }}
            className={cn(
              'p-4 rounded-xl border transition-all cursor-pointer space-y-2',
              selectedId === tpl.id
                ? 'bg-slate-950 border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            )}
          >
            <div className="flex items-center justify-between border-b border-slate-900 pb-2">
              <span className="font-bold text-xs text-slate-100">{tpl.title}</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-500/10 text-purple-300 uppercase">
                {tpl.migrationType}
              </span>
            </div>

            <p className="text-[11px] text-slate-400 font-sans leading-snug">{tpl.description}</p>

            <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
              <span>Compatibility: <strong className="text-emerald-400">{tpl.compatibilityPct}%</strong></span>
              <span>Est. Downtime: <strong className="text-cyan-300">{tpl.downtimeEstimateMins} mins</strong></span>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Template AI Inspector */}
      {activeTemplate && (
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs">
          <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>AI Modernization Advisor Note:</span>
          </span>
          <p className="text-slate-200 font-sans text-xs leading-relaxed">{activeTemplate.aiRecommendationNote}</p>
        </div>
      )}
    </div>
  );
}
