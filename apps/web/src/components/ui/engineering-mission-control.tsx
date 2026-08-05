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

export function EngineeringMissionControl() {
  const [selectedRepo, setSelectedRepo] = useState<string>('repo-codeatlas');
  const [isIndexingModalOpen, setIsIndexingModalOpen] = useState<boolean>(false);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20 font-sans select-none">
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

      {/* 1. TOP HERO SECTION */}
      <AiMissionControlHero
        selectedRepo={selectedRepo}
        onRepoChange={setSelectedRepo}
        onRunAudit={() => setIsIndexingModalOpen(true)}
      />

      {/* 2. ENGINEERING OVERVIEW - INTELLIGENT SCORECARDS */}
      <EngineeringScorecards />

      {/* 3. TODAY'S FOCUS & REAL-TIME AI ACTIVITY STREAM */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TodaysFocusTasks />
        <AiCommandCenterStream />
      </div>

      {/* 4. LIVE REPOSITORY DIGITAL TWINS */}
      <RepositoryDigitalTwins />

      {/* 5. PROACTIVE AI INSIGHTS PANEL */}
      <AiInsightsPanel />

      {/* 6. LIVE ENGINEERING TIMELINE & 1-CLICK QUICK ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <EngineeringTimeline />
        <QuickActionsGrid />
      </div>
    </div>
  );
}
