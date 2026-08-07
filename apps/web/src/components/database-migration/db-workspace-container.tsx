'use client';

import React, { useState } from 'react';
import { DbCommandCenter } from './db-command-center';
import { DbMigrationTemplates } from './db-migration-templates';
import { DbImpactAnalysis } from './db-impact-analysis';
import { DbAdvisorQA } from './db-advisor-qa';
import {
  MOCK_DB_COMMAND_METRICS,
  MOCK_MIGRATION_TEMPLATES,
  MOCK_IMPACT_ANALYSIS,
  MOCK_EXECUTION_PLAN,
  MOCK_DB_ADVISOR_QA,
} from './db-mock-data';
import { MigrationPathTemplate } from './db-types';
import { Database, Layers, Sparkles, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export function DbWorkspaceContainer() {
  const [activeTab, setActiveTab] = useState<'center' | 'templates' | 'impact' | 'advisor'>('center');
  const [selectedTemplate, setSelectedTemplate] = useState<MigrationPathTemplate>(MOCK_MIGRATION_TEMPLATES[0]);

  return (
    <div className="flex flex-col h-screen w-full bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Top Header */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 shrink-0 font-mono">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-500 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Database className="w-5 h-5 text-cyan-400" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-black text-slate-100 tracking-tight leading-none">
                AI Database Migration & Modernization Studio
              </h1>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                Zero-Downtime Database Engine
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-sans mt-0.5">
              Simulate relational, NoSQL, graph, and vector database migrations with zero downtime and verified data integrity.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          {[
            { id: 'center', label: 'Database Command Center', icon: Database },
            { id: 'templates', label: '12 Migration Paths', icon: Layers },
            { id: 'impact', label: 'AI Impact Analysis & Runbook', icon: ShieldCheck },
            { id: 'advisor', label: 'AI Database Advisor', icon: Sparkles },
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
        {activeTab === 'center' && <DbCommandCenter metrics={MOCK_DB_COMMAND_METRICS} />}

        {activeTab === 'templates' && (
          <DbMigrationTemplates
            templates={MOCK_MIGRATION_TEMPLATES}
            onSelectTemplate={(tpl) => {
              setSelectedTemplate(tpl);
              setActiveTab('impact');
            }}
          />
        )}

        {activeTab === 'impact' && (
          <DbImpactAnalysis impact={MOCK_IMPACT_ANALYSIS} plan={MOCK_EXECUTION_PLAN} />
        )}

        {activeTab === 'advisor' && <DbAdvisorQA advisorEntries={MOCK_DB_ADVISOR_QA} />}
      </div>
    </div>
  );
}
