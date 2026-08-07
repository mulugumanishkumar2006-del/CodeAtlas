'use client';

import React, { useState } from 'react';
import { ChaosFailureLibrary } from './chaos-failure-library';
import { ChaosLiveExperiment } from './chaos-live-experiment';
import { ChaosRecoveryPlaybook } from './chaos-recovery-playbook';
import { ChaosAiAssistant } from './chaos-ai-assistant';
import {
  MOCK_RESILIENCE_SCORECARD,
  MOCK_CHAOS_TEMPLATES,
  MOCK_RECOVERY_PLAYBOOK,
  MOCK_AI_SRE_QA,
} from './chaos-mock-data';
import { ChaosFailureTemplate } from './chaos-types';
import { Flame, Play, BookOpen, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ChaosWorkspaceContainer() {
  const [activeTab, setActiveTab] = useState<'library' | 'live' | 'playbook' | 'assistant'>('library');
  const [activeTemplate, setActiveTemplate] = useState<ChaosFailureTemplate>(MOCK_CHAOS_TEMPLATES[0]);

  return (
    <div className="flex flex-col h-screen w-full bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Top Header */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 shrink-0 font-mono">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 via-amber-500 to-red-500 p-0.5 shadow-lg shadow-rose-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Flame className="w-5 h-5 text-rose-400" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-black text-slate-100 tracking-tight leading-none">
                Enterprise Chaos Engineering Studio
              </h1>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                System Resilience & MTTR Studio
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-sans mt-0.5">
              Simulate database crashes, cache outages, and network latency spikes safely before production deployment.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          {[
            { id: 'library', label: 'Failure Library & Scorecard', icon: Flame },
            { id: 'live', label: 'Live Failure Simulation', icon: Play },
            { id: 'playbook', label: 'SRE Recovery Playbook', icon: BookOpen },
            { id: 'assistant', label: 'AI SRE Assistant', icon: Sparkles },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  'px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5',
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-rose-500/20 to-amber-500/10 text-rose-200 border-rose-500/30 font-bold shadow-md'
                    : 'bg-transparent text-slate-400 border-transparent hover:text-slate-200'
                )}
              >
                <Icon className="w-3.5 h-3.5 text-rose-400" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Workspace */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
        {activeTab === 'library' && (
          <ChaosFailureLibrary
            scorecard={MOCK_RESILIENCE_SCORECARD}
            templates={MOCK_CHAOS_TEMPLATES}
            onExecuteExperiment={(tpl) => {
              setActiveTemplate(tpl);
              setActiveTab('live');
            }}
          />
        )}

        {activeTab === 'live' && <ChaosLiveExperiment activeTemplate={activeTemplate} />}

        {activeTab === 'playbook' && <ChaosRecoveryPlaybook playbook={MOCK_RECOVERY_PLAYBOOK} />}

        {activeTab === 'assistant' && <ChaosAiAssistant qaEntries={MOCK_AI_SRE_QA} />}
      </div>
    </div>
  );
}
