'use client';

import React, { useState } from 'react';
import {
  Layers,
  Activity,
  GitBranch,
  Network,
  Zap,
  ShieldAlert,
  Sparkles,
  FlaskConical,
  Clock,
  ShieldCheck,
  Search,
  Command,
} from 'lucide-react';

import { WorkspaceBreadcrumbContext } from './workspace-breadcrumb-context';
import { WorkspaceSystemMapCanvas } from './workspace-system-map-canvas';
import { WorkspaceOverviewTab } from './workspace-overview-tab';
import { WorkspaceReposHub } from './workspace-repos-hub';
import { CrossRepoDependencyStudio } from './cross-repo-dependency-studio';
import { CrossRepoImpactStudio } from './cross-repo-impact-studio';
import { CrossRepoRiskMatrix } from './cross-repo-risk-matrix';
import { WorkspaceAiCto } from './workspace-ai-cto';
import { WorkspaceSimulationStudio } from './workspace-simulation-studio';
import { WorkspaceTimelineMachine } from './workspace-timeline-machine';
import { WorkspaceAuditAccessPanel } from './workspace-audit-access-panel';
import { CommandPaletteModal } from '@/components/ui/command-palette-modal';

type WorkspaceTab =
  | 'system-map'
  | 'overview'
  | 'repositories'
  | 'dependencies'
  | 'impact'
  | 'risk'
  | 'ai-cto'
  | 'simulation'
  | 'timeline'
  | 'audit';

export function MultiRepositoryWorkspaceView() {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('system-map');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  const tabs = [
    { id: 'system-map', label: 'Ecosystem Map', icon: Layers },
    { id: 'overview', label: 'Overview & Health', icon: Activity },
    { id: 'repositories', label: 'Repositories', icon: GitBranch },
    { id: 'dependencies', label: 'Dependencies', icon: Network },
    { id: 'impact', label: 'Impact Analysis', icon: Zap },
    { id: 'risk', label: 'Risk Radar', icon: ShieldAlert },
    { id: 'ai-cto', label: 'Workspace AI CTO', icon: Sparkles },
    { id: 'simulation', label: 'Simulation Studio', icon: FlaskConical },
    { id: 'timeline', label: 'Time Machine', icon: Clock },
    { id: 'audit', label: 'Governance & Audit', icon: ShieldCheck },
  ];

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 font-sans overflow-hidden relative">
      {/* 1. Context Breadcrumb Navigation Bar */}
      <WorkspaceBreadcrumbContext
        organizationName="Acme Enterprise"
        workspaceName="FinTech Core Ecosystem"
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      {/* 2. Workspace Navigation Tabs */}
      <div className="h-11 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl px-4 flex items-center justify-between shrink-0 font-mono text-xs z-10 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as WorkspaceTab)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all font-bold shrink-0 ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Main Dynamic Content Body */}
      <div className="flex-1 overflow-hidden relative">
        {activeTab === 'system-map' && <WorkspaceSystemMapCanvas />}
        {activeTab === 'overview' && <WorkspaceOverviewTab />}
        {activeTab === 'repositories' && <WorkspaceReposHub />}
        {activeTab === 'dependencies' && <CrossRepoDependencyStudio />}
        {activeTab === 'impact' && <CrossRepoImpactStudio />}
        {activeTab === 'risk' && <CrossRepoRiskMatrix />}
        {activeTab === 'ai-cto' && <WorkspaceAiCto />}
        {activeTab === 'simulation' && <WorkspaceSimulationStudio />}
        {activeTab === 'timeline' && <WorkspaceTimelineMachine />}
        {activeTab === 'audit' && <WorkspaceAuditAccessPanel />}
      </div>

      {/* Universal Command Palette Modal */}
      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </div>
  );
}
