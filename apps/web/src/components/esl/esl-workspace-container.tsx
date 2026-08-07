'use client';

import React, { useState } from 'react';
import { EslCommandCenter } from './esl-command-center';
import { EslBoardroomDebate } from './esl-boardroom-debate';
import { EslScenarioComparison } from './esl-scenario-comparison';
import { EslDecisionReports } from './esl-decision-reports';
import {
  MOCK_ENTERPRISE_SCENARIOS,
  MOCK_BOARDROOM_PARTICIPANTS,
  MOCK_EXECUTIVE_REPORT,
} from './esl-mock-data';
import { EnterpriseScenarioItem } from './esl-types';
import { Layers, Users, FileText, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export function EslWorkspaceContainer() {
  const [activeTab, setActiveTab] = useState<'center' | 'boardroom' | 'comparison' | 'reports'>('center');
  const [selectedScenario, setSelectedScenario] = useState<EnterpriseScenarioItem>(MOCK_ENTERPRISE_SCENARIOS[0]);

  return (
    <div className="flex flex-col h-screen w-full bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Top Header */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 shrink-0 font-mono">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-500 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Layers className="w-5 h-5 text-cyan-400" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-black text-slate-100 tracking-tight leading-none">
                Enterprise Scenario Laboratory
              </h1>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                Decision Intelligence Platform
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-sans mt-0.5">
              Create, compare, simulate, and evaluate multiple engineering strategies before implementation.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          {[
            { id: 'center', label: 'Scenario Command Center', icon: Layers },
            { id: 'boardroom', label: 'AI Boardroom Debate', icon: Users },
            { id: 'comparison', label: 'Multi-Scenario Matrix', icon: Sparkles },
            { id: 'reports', label: 'Executive Decision Reports', icon: FileText },
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
        {activeTab === 'center' && (
          <EslCommandCenter
            scenarios={MOCK_ENTERPRISE_SCENARIOS}
            selectedScenarioId={selectedScenario.id}
            onSelectScenario={(scen) => {
              setSelectedScenario(scen);
              setActiveTab('boardroom');
            }}
          />
        )}

        {activeTab === 'boardroom' && <EslBoardroomDebate participants={MOCK_BOARDROOM_PARTICIPANTS} />}

        {activeTab === 'comparison' && <EslScenarioComparison scenarios={MOCK_ENTERPRISE_SCENARIOS} />}

        {activeTab === 'reports' && <EslDecisionReports report={MOCK_EXECUTIVE_REPORT} />}
      </div>
    </div>
  );
}
