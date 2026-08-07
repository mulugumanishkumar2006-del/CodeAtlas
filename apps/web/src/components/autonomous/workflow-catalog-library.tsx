'use client';

import React, { useState } from 'react';
import { WorkflowTemplate } from './workflow-types';
import { Layers, Play, Clock, ShieldCheck, Sparkles, CheckCircle2, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WorkflowCatalogLibraryProps {
  templates: WorkflowTemplate[];
  onLaunchWorkflow: (template: WorkflowTemplate) => void;
}

export function WorkflowCatalogLibrary({ templates, onLaunchWorkflow }: WorkflowCatalogLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredTemplates = templates.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.purpose.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 font-sans shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3 font-mono">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-purple-400" />
          <h2 className="text-sm font-bold text-slate-100">
            Autonomous Engineering Workflow Catalog & Reusable Templates
          </h2>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search workflows..."
              className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500 font-sans"
            />
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-sans">
        {filteredTemplates.map((tpl) => (
          <div
            key={tpl.id}
            className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-purple-500/40 transition-all flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between font-mono">
                <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-purple-500/10 text-purple-300 border border-purple-500/30">
                  {tpl.category}
                </span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  <span>Est. {tpl.estimatedDuration}</span>
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-100">{tpl.name}</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans text-[11px] line-clamp-3">{tpl.purpose}</p>

              {/* Required Inputs & Outputs */}
              <div className="space-y-1 font-mono text-[10px] text-slate-400 pt-1">
                <div>
                  <span className="font-bold text-slate-300 uppercase">Inputs: </span>
                  <span>{tpl.requiredInputs.join(', ')}</span>
                </div>
                <div>
                  <span className="font-bold text-emerald-400 uppercase">Outputs: </span>
                  <span className="text-slate-200">{tpl.expectedOutputs.join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Bottom Launch Bar */}
            <div className="pt-2 border-t border-slate-900 flex items-center justify-between font-mono">
              <div className="flex items-center gap-1 text-[10px] text-slate-400">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>AI Confidence: <strong className="text-slate-100">{tpl.aiConfidencePct}%</strong></span>
              </div>

              <button
                onClick={() => onLaunchWorkflow(tpl)}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md flex items-center gap-1 transition-all"
              >
                <Play className="w-3 h-3 fill-white" />
                <span>Launch Workflow</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
