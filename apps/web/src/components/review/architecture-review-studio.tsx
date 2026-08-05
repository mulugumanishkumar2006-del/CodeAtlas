'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ReviewTopToolbar } from './review-top-toolbar';
import { ReviewLeftSidebar } from './review-left-sidebar';
import { ReviewScorecard } from './review-scorecard';
import { DesignAlternativesMatrix } from './design-alternatives-matrix';
import { ReviewInspectorPanel } from './review-inspector-panel';
import {
  MOCK_SCORECARD_DIMENSIONS,
  MOCK_REVIEW_FINDINGS,
  ReviewRolePerspective,
  ReviewFinding
} from './review-mock-data';

export function ArchitectureReviewStudio() {
  const router = useRouter();

  // State Management
  const [currentRole, setCurrentRole] = useState<ReviewRolePerspective>('Staff Engineer');
  const [currentMode, setCurrentMode] = useState<string>('Overall Architecture');

  const [selectedFindingId, setSelectedFindingId] = useState<string | null>('finding-1');
  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const selectedFinding = MOCK_REVIEW_FINDINGS.find((f) => f.id === selectedFindingId) || null;

  // Action Button Handlers
  const handleSimulate = (targetId: string) => {
    router.push(`/simulate?target=${targetId}`);
  };

  const handleRunAiReview = () => {
    alert('AI Architecture Review Board is re-evaluating codebase against SOLID and AWS Well-Architected frameworks...');
  };

  // Keyboard Shortcuts (Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedFindingId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={`flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans select-none ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Top Toolbar */}
      <ReviewTopToolbar
        currentRole={currentRole}
        onSelectRole={setCurrentRole}
        currentMode={currentMode}
        onSelectMode={setCurrentMode}
        overallGrade="A+"
        overallScorePct={94}
        onRunAiReview={handleRunAiReview}
        isFullscreen={isFullscreen}
        onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
        onResetView={() => setSelectedFindingId('finding-1')}
      />

      {/* Main Workspace Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Findings Sidebar */}
        <ReviewLeftSidebar
          findings={MOCK_REVIEW_FINDINGS}
          selectedFindingId={selectedFindingId}
          onSelectFinding={(id) => setSelectedFindingId(id)}
          isOpen={leftSidebarOpen}
          onToggleOpen={() => setLeftSidebarOpen(!leftSidebarOpen)}
        />

        {/* Central Scorecard & Alternatives Workspace */}
        <div className="flex-1 h-full overflow-y-auto p-6 space-y-6 scrollbar-none font-sans">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* 13-Dimension Scorecard */}
            <ReviewScorecard
              dimensions={MOCK_SCORECARD_DIMENSIONS}
              overallGrade="A+"
              overallScorePct={94}
            />

            {/* 3-Option Design Alternatives Comparison */}
            {selectedFinding && (
              <DesignAlternativesMatrix
                finding={selectedFinding}
                onSimulateOption={(findingId, optName) => handleSimulate(findingId)}
              />
            )}
          </div>
        </div>

        {/* Right Inspector Panel */}
        <ReviewInspectorPanel
          selectedFinding={selectedFinding}
          onClose={() => setSelectedFindingId(null)}
          onSimulate={handleSimulate}
        />
      </div>
    </div>
  );
}
