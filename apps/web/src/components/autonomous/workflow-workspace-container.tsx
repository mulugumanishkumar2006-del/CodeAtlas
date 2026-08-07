'use client';

import React, { useState } from 'react';
import { WorkflowCatalogLibrary } from './workflow-catalog-library';
import { WorkflowExecutionEngine } from './workflow-execution-engine';
import { WorkflowAgentOrchestrator } from './workflow-agent-orchestrator';
import { WorkflowAutonomousTasks } from './workflow-autonomous-tasks';
import { WorkflowHistoryAnalytics } from './workflow-history-analytics';
import {
  MOCK_WORKFLOW_TEMPLATES,
  MOCK_EXECUTION_NODES,
  MOCK_AI_AGENTS,
  MOCK_AUTONOMOUS_TASKS,
  MOCK_WORKFLOW_HISTORY,
  MOCK_INTER_SYSTEM_LINKS,
} from './workflow-mock-data';
import { WorkflowTemplate } from './workflow-types';
import { Sparkles, Layers, Bot, Lock, History, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export function WorkflowWorkspaceContainer() {
  const [activeTab, setActiveTab] = useState<'catalog' | 'execution' | 'agents' | 'tasks' | 'history'>('execution');
  const [activeWorkflowName, setActiveWorkflowName] = useState<string>('Investigate Production Incident (SEV-1)');

  const handleLaunchWorkflow = (tpl: WorkflowTemplate) => {
    setActiveWorkflowName(tpl.name);
    setActiveTab('execution');
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Top Navigation Header */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 shrink-0 font-mono">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-500 via-indigo-500 to-cyan-500 p-0.5 shadow-lg shadow-purple-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-black text-slate-100 tracking-tight leading-none">
                Autonomous Engineering Workflows Platform
              </h1>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-purple-500/10 text-purple-300 border border-purple-500/30">
                Multi-Agent Swarm Active
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-sans mt-0.5">
              Active Workflow: <strong className="text-slate-200">{activeWorkflowName}</strong>
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          {[
            { id: 'catalog', label: 'Workflow Library', icon: Layers },
            { id: 'execution', label: 'Visual Execution Engine', icon: Sparkles },
            { id: 'agents', label: 'Multi-AI Orchestration', icon: Bot },
            { id: 'tasks', label: 'Autonomous Tasks & Approval', icon: Lock },
            { id: 'history', label: 'Workflow History', icon: History },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  'px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5',
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-500/20 to-indigo-500/10 text-purple-200 border-purple-500/30 font-bold shadow-md'
                    : 'bg-transparent text-slate-400 border-transparent hover:text-slate-200'
                )}
              >
                <Icon className="w-3.5 h-3.5 text-purple-400" />
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
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span>Interconnected CodeAtlas Subsystems (16/16 Connected)</span>
          </span>

          <div className="flex flex-wrap gap-1.5">
            {MOCK_INTER_SYSTEM_LINKS.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                className="px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 hover:border-purple-500/40 text-[11px] text-slate-300 hover:text-purple-300 transition-colors flex items-center gap-1"
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="px-1 py-0.2 rounded text-[8px] bg-purple-500/10 text-purple-300 border border-purple-500/20">
                    {link.badge}
                  </span>
                )}
              </a>
            ))}
          </div>
        </div>

        {/* Tab Views */}
        {activeTab === 'catalog' && (
          <WorkflowCatalogLibrary
            templates={MOCK_WORKFLOW_TEMPLATES}
            onLaunchWorkflow={handleLaunchWorkflow}
          />
        )}

        {activeTab === 'execution' && (
          <WorkflowExecutionEngine
            nodes={MOCK_EXECUTION_NODES}
            activeWorkflowName={activeWorkflowName}
          />
        )}

        {activeTab === 'agents' && (
          <WorkflowAgentOrchestrator agents={MOCK_AI_AGENTS} />
        )}

        {activeTab === 'tasks' && (
          <WorkflowAutonomousTasks tasks={MOCK_AUTONOMOUS_TASKS} />
        )}

        {activeTab === 'history' && (
          <WorkflowHistoryAnalytics records={MOCK_WORKFLOW_HISTORY} />
        )}
      </div>
    </div>
  );
}
