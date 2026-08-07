'use client';

import React, { useState } from 'react';
import { CloudCommandCenter } from './cloud-command-center';
import { CloudMultiComparison } from './cloud-multi-comparison';
import { CloudDeploymentSimulator } from './cloud-deployment-simulator';
import { CloudGitOpsDrift } from './cloud-gitops-drift';
import { CloudArchitectQA } from './cloud-architect-qa';
import {
  MOCK_CLOUD_COMMAND_METRICS,
  MOCK_MULTI_CLOUD_PROFILES,
  MOCK_DEPLOYMENT_SCENARIOS,
  MOCK_GITOPS_DRIFT_ITEMS,
  MOCK_CLOUD_ARCHITECT_QA,
} from './cloud-mock-data';
import { Server, Cloud, Activity, GitBranch, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export function CloudWorkspaceContainer() {
  const [activeTab, setActiveTab] = useState<'center' | 'comparison' | 'deployment' | 'drift' | 'architect'>('center');

  return (
    <div className="flex flex-col h-screen w-full bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Top Header */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 shrink-0 font-mono">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-500 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Server className="w-5 h-5 text-cyan-400" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-black text-slate-100 tracking-tight leading-none">
                AI Cloud & Kubernetes Evolution Studio
              </h1>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                Multi-Cloud & GitOps Studio
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-sans mt-0.5">
              Design, simulate, optimize, and evolve Kubernetes clusters, Terraform IaC, and service mesh deployment strategies before production.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          {[
            { id: 'center', label: 'Cloud Command Center', icon: Server },
            { id: 'comparison', label: 'Multi-Cloud Comparison', icon: Cloud },
            { id: 'deployment', label: 'Deployment Simulator', icon: Activity },
            { id: 'drift', label: 'GitOps & IaC Drift', icon: GitBranch },
            { id: 'architect', label: 'AI Cloud Architect', icon: Sparkles },
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
        {activeTab === 'center' && <CloudCommandCenter metrics={MOCK_CLOUD_COMMAND_METRICS} />}

        {activeTab === 'comparison' && <CloudMultiComparison profiles={MOCK_MULTI_CLOUD_PROFILES} />}

        {activeTab === 'deployment' && <CloudDeploymentSimulator scenarios={MOCK_DEPLOYMENT_SCENARIOS} />}

        {activeTab === 'drift' && <CloudGitOpsDrift driftItems={MOCK_GITOPS_DRIFT_ITEMS} />}

        {activeTab === 'architect' && <CloudArchitectQA architectEntries={MOCK_CLOUD_ARCHITECT_QA} />}
      </div>
    </div>
  );
}
