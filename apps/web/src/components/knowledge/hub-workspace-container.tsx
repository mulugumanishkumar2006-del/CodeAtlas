'use client';

import React, { useState } from 'react';
import { HubInteractiveGraph } from './hub-interactive-graph';
import { HubMemoryQA } from './hub-memory-qa';
import { HubSmartSearch } from './hub-smart-search';
import { HubEngineeringWiki } from './hub-engineering-wiki';
import { HubCollaborationPanel } from './hub-collaboration-panel';
import {
  MOCK_HUB_NODES,
  MOCK_HUB_EDGES,
  MOCK_MEMORY_QA_ENTRIES,
  MOCK_SMART_SEARCH_RESULTS,
  MOCK_WIKI_PAGES,
  MOCK_PROACTIVE_RECOMMENDATIONS,
  MOCK_INTER_SYSTEM_LINKS,
} from './hub-mock-data';
import { Network, Brain, Search, BookOpen, Sparkles, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

export function HubWorkspaceContainer() {
  const [activeTab, setActiveTab] = useState<'graph' | 'memory' | 'search' | 'wiki' | 'collaboration'>('graph');

  return (
    <div className="flex flex-col h-screen w-full bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Top Header */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 shrink-0 font-mono">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-500 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Brain className="w-5 h-5 text-cyan-400" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-black text-slate-100 tracking-tight leading-none">
                AI Engineering Knowledge Hub
              </h1>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                Living Engineering Brain
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-sans mt-0.5">
              Continuously capturing, connecting, and retrieving organizational engineering memory across time.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          {[
            { id: 'graph', label: 'Interactive Knowledge Graph', icon: Network },
            { id: 'memory', label: 'Engineering Memory Q&A', icon: Brain },
            { id: 'search', label: 'Smart Semantic Search', icon: Search },
            { id: 'wiki', label: 'Engineering Wiki', icon: BookOpen },
            { id: 'collaboration', label: 'Proactive AI Assistant', icon: Sparkles },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  'px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5',
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/10 text-cyan-200 border-cyan-500/30 font-bold shadow-md'
                    : 'bg-transparent text-slate-400 border-transparent hover:text-slate-200'
                )}
              >
                <Icon className="w-3.5 h-3.5 text-cyan-400" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Workspace */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
        {/* INTERCONNECTED SUBSYSTEM LINKS BAR */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 font-mono">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Interconnected CodeAtlas Subsystems (16/16 Connected)</span>
          </span>

          <div className="flex flex-wrap gap-1.5">
            {MOCK_INTER_SYSTEM_LINKS.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                className="px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 hover:border-cyan-500/40 text-[11px] text-slate-300 hover:text-cyan-300 transition-colors flex items-center gap-1"
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="px-1 py-0.2 rounded text-[8px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {link.badge}
                  </span>
                )}
              </a>
            ))}
          </div>
        </div>

        {/* Tab Views */}
        {activeTab === 'graph' && (
          <HubInteractiveGraph nodes={MOCK_HUB_NODES} edges={MOCK_HUB_EDGES} />
        )}

        {activeTab === 'memory' && (
          <HubMemoryQA memoryEntries={MOCK_MEMORY_QA_ENTRIES} />
        )}

        {activeTab === 'search' && (
          <HubSmartSearch results={MOCK_SMART_SEARCH_RESULTS} />
        )}

        {activeTab === 'wiki' && (
          <HubEngineeringWiki wikiPages={MOCK_WIKI_PAGES} />
        )}

        {activeTab === 'collaboration' && (
          <HubCollaborationPanel recommendations={MOCK_PROACTIVE_RECOMMENDATIONS} />
        )}
      </div>
    </div>
  );
}
