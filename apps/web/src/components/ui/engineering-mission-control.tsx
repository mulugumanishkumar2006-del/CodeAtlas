'use client';

import React, { useState } from 'react';
import { AiMissionControlHero } from '@/components/ui/ai-mission-control-hero';
import { EngineeringScorecards } from '@/components/ui/engineering-scorecards';
import { AiCommandCenterStream } from '@/components/ui/ai-command-center-stream';
import { TodaysFocusTasks } from '@/components/ui/todays-focus-tasks';
import { RepositoryDigitalTwins } from '@/components/ui/repository-digital-twins';
import { EngineeringTimeline } from '@/components/ui/engineering-timeline';
import { AiInsightsPanel } from '@/components/ui/ai-insights-panel';
import { QuickActionsGrid } from '@/components/ui/quick-actions-grid';
import { IndexingProgress } from '@/components/ui/indexing-progress';
import { CodeAtlasOSProvider } from '@/components/os/os-context';
import { OSAgentSwarmBar } from '@/components/os/os-agent-swarm-bar';
import { OSActionDock } from '@/components/os/os-action-dock';
import { Layers } from 'lucide-react';

export function EngineeringMissionControl() {
  const [selectedRepo, setSelectedRepo] = useState<string>('repo-codeatlas');
  const [isIndexingModalOpen, setIsIndexingModalOpen] = useState<boolean>(false);

  const subsystems = [
    { label: 'AI Mission Control', url: '/command-center', badge: 'Command' },
    { label: 'AI CTO Workspace', url: '/ai-cto', badge: 'CTO' },
    { label: 'AI Investigation Engine', url: '/investigate', badge: 'Root Cause' },
    { label: 'AI Refactoring Planner', url: '/improve', badge: 'Refactor' },
    { label: 'AI Doc Engineer', url: '/docs', badge: 'Docs' },
    { label: 'AI Code Review Intelligence', url: '/review', badge: 'Review' },
    { label: 'AI Release Intelligence', url: '/release', badge: 'Release' },
    { label: 'AI Engineering Forecasting', url: '/forecast', badge: 'Forecast' },
    { label: 'Autonomous Workflows', url: '/workflows', badge: 'Swarm' },
    { label: 'Knowledge Hub', url: '/knowledge', badge: 'Graph' },
    { label: 'Repository Explorer', url: '/repositories', badge: 'AST' },
    { label: 'Architecture Intelligence', url: '/architecture', badge: 'Topology' },
    { label: 'Dependency Intelligence', url: '/dependency-graph', badge: 'Graph' },
    { label: 'Simulation Studio', url: '/simulate', badge: 'Monte Carlo' },
    { label: 'Real-Time Monitoring', url: '/monitor', badge: 'Datadog' },
    { label: 'Software Memory Engine', url: '/memory', badge: 'Memory' },
    { label: 'AI Copilot', url: '/search', badge: 'Copilot' },
  ];

  return (
    <CodeAtlasOSProvider>
      <div className="space-y-8 max-w-7xl mx-auto pb-24 font-sans select-none relative">
        {/* Indexing Audit Pipeline Modal */}
        {isIndexingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <div className="w-full max-w-3xl">
              <IndexingProgress
                onComplete={() => setIsIndexingModalOpen(false)}
                repoName={selectedRepo}
              />
            </div>
          </div>
        )}

        {/* 1. GLOBAL MULTI-AI SWARM STATUS BAR */}
        <OSAgentSwarmBar />

        {/* 2. TOP HERO SECTION */}
        <AiMissionControlHero
          selectedRepo={selectedRepo}
          onRepoChange={setSelectedRepo}
          onRunAudit={() => setIsIndexingModalOpen(true)}
        />

        {/* 3. INTERCONNECTED CODEATLAS SUBSYSTEM NAVIGATOR */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 font-mono">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>CodeAtlas AI Engineering Operating System (17/17 Subsystems Connected)</span>
          </span>

          <div className="flex flex-wrap gap-1.5">
            {subsystems.map((sub, idx) => (
              <a
                key={idx}
                href={sub.url}
                className="px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 hover:border-cyan-500/40 text-[11px] text-slate-300 hover:text-cyan-300 transition-colors flex items-center gap-1"
              >
                <span>{sub.label}</span>
                {sub.badge && (
                  <span className="px-1 py-0.2 rounded text-[8px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
                    {sub.badge}
                  </span>
                )}
              </a>
            ))}
          </div>
        </div>

        {/* 4. ENGINEERING OVERVIEW - INTELLIGENT SCORECARDS */}
        <EngineeringScorecards />

        {/* 5. TODAY'S FOCUS & REAL-TIME AI ACTIVITY STREAM */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TodaysFocusTasks />
          <AiCommandCenterStream />
        </div>

        {/* 6. LIVE REPOSITORY DIGITAL TWINS */}
        <RepositoryDigitalTwins />

        {/* 7. PROACTIVE AI INSIGHTS PANEL */}
        <AiInsightsPanel />

        {/* 8. LIVE ENGINEERING TIMELINE & 1-CLICK QUICK ACTIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <EngineeringTimeline />
          <QuickActionsGrid />
        </div>

        {/* PERSISTENT FLOATING UNIFIED ACTION DOCK */}
        <OSActionDock />
      </div>
    </CodeAtlasOSProvider>
  );
}
