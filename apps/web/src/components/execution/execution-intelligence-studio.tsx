'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ExecutionTopToolbar } from './execution-top-toolbar';
import { ExecutionLeftSidebar } from './execution-left-sidebar';
import { ExecutionGraphCanvas } from './execution-graph-canvas';
import { ExecutionPlaybackBar } from './execution-playback-bar';
import { ExecutionInspectorPanel } from './execution-inspector-panel';
import { ExecutionBottlenecksModal } from './execution-bottlenecks-modal';
import {
  MOCK_EXECUTION_TRACES,
  MOCK_EXECUTION_BOTTLENECKS,
  ExecutionFlowTrace,
  ExecutionStepData
} from './execution-mock-data';

export function ExecutionIntelligenceStudio() {
  const router = useRouter();

  // State Management
  const [activeTrace, setActiveTrace] = useState<ExecutionFlowTrace>(MOCK_EXECUTION_TRACES[0]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(4); // Default on Stripe API step (step 5, idx 4)

  const [currentMode, setCurrentMode] = useState<string>('Request Flow');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [latencyHeatmap, setLatencyHeatmap] = useState<boolean>(true);

  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(true);
  const [playbackBarOpen, setPlaybackBarOpen] = useState<boolean>(true);
  const [showBottlenecksModal, setShowBottlenecksModal] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const selectedStep = activeTrace.steps[currentStepIndex] || null;

  // Action Button Triggers
  const handleSimulate = (stepId: string) => {
    router.push(`/simulate?target=${stepId}`);
  };

  const handleOptimize = (stepId: string) => {
    router.push(`/improve?optimize=${stepId}`);
  };

  // Keyboard Shortcuts (Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowBottlenecksModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={`flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans select-none ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Top Execution Toolbar */}
      <ExecutionTopToolbar
        currentMode={currentMode}
        onSelectMode={setCurrentMode}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        latencyHeatmap={latencyHeatmap}
        onToggleLatencyHeatmap={() => setLatencyHeatmap(!latencyHeatmap)}
        onOpenBottlenecksModal={() => setShowBottlenecksModal(true)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
        onResetView={() => {
          setSearchQuery('');
          setCurrentStepIndex(0);
          setLatencyHeatmap(true);
        }}
      />

      {/* Main Workspace Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sequence Sidebar */}
        <ExecutionLeftSidebar
          trace={activeTrace}
          currentStepIndex={currentStepIndex}
          onSelectStepIndex={setCurrentStepIndex}
          isOpen={leftSidebarOpen}
          onToggleOpen={() => setLeftSidebarOpen(!leftSidebarOpen)}
        />

        {/* Central Execution Canvas */}
        <div className="flex-1 h-full relative flex flex-col">
          <div className="flex-1 h-full relative">
            <ExecutionGraphCanvas
              trace={activeTrace}
              currentStepIndex={currentStepIndex}
              onSelectStepIndex={setCurrentStepIndex}
              currentMode={currentMode}
              searchQuery={searchQuery}
              latencyHeatmap={latencyHeatmap}
              onSimulate={handleSimulate}
              onOptimize={handleOptimize}
            />
          </div>

          {/* DevTools Timeline Playback Scrubber Bar */}
          <ExecutionPlaybackBar
            steps={activeTrace.steps}
            currentStepIndex={currentStepIndex}
            onSelectStepIndex={setCurrentStepIndex}
            isOpen={playbackBarOpen}
            onToggleOpen={() => setPlaybackBarOpen(!playbackBarOpen)}
          />
        </div>

        {/* Right Inspector Panel */}
        <ExecutionInspectorPanel
          selectedStep={selectedStep}
          onClose={() => setCurrentStepIndex(0)}
          onSimulate={handleSimulate}
          onOptimize={handleOptimize}
        />
      </div>

      {/* Automated AI Bottlenecks Modal */}
      <ExecutionBottlenecksModal
        isOpen={showBottlenecksModal}
        onClose={() => setShowBottlenecksModal(false)}
        onFocusStep={(stepId) => {
          const idx = activeTrace.steps.findIndex((s) => s.id === stepId);
          if (idx !== -1) setCurrentStepIndex(idx);
        }}
      />
    </div>
  );
}
