'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DriftTopToolbar } from './drift-top-toolbar';
import { DriftLeftSidebar } from './drift-left-sidebar';
import { DriftComparisonCanvas } from './drift-comparison-canvas';
import { DriftTimelineScrubber } from './drift-timeline-scrubber';
import { DriftInspectorPanel } from './drift-inspector-panel';
import { DriftScorecardModal } from './drift-scorecard-modal';
import {
  MOCK_SNAPSHOT_BASELINES,
  MOCK_DRIFT_NODES,
  MOCK_DRIFT_EDGES,
  DriftNodeData,
  DriftEdgeData
} from './drift-mock-data';

export function ArchitectureDriftStudio() {
  const router = useRouter();

  // State Management
  const [nodesData, setNodesData] = useState<DriftNodeData[]>(MOCK_DRIFT_NODES);
  const [edgesData, setEdgesData] = useState<DriftEdgeData[]>(MOCK_DRIFT_EDGES);

  const [baselineA, setBaselineA] = useState<string>('snap-v1.0');
  const [baselineB, setBaselineB] = useState<string>('snap-current');

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('svc-payment-core');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(true);
  const [timelineScrubberOpen, setTimelineScrubberOpen] = useState<boolean>(true);
  const [showScorecardModal, setShowScorecardModal] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const selectedNode = nodesData.find((n) => n.id === selectedNodeId) || null;

  // Action Triggers
  const handleSimulateFix = (nodeId: string) => {
    router.push(`/simulate?target=${nodeId}`);
  };

  const handleGenerateAdr = (nodeId: string) => {
    router.push(`/knowledge?doc=${nodeId}`);
  };

  // Keyboard Shortcuts (Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedNodeId(null);
        setShowScorecardModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={`flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans select-none ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Top Toolbar */}
      <DriftTopToolbar
        baselineA={baselineA}
        onSelectBaselineA={setBaselineA}
        baselineB={baselineB}
        onSelectBaselineB={setBaselineB}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenScorecard={() => setShowScorecardModal(true)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
        onResetView={() => {
          setSearchQuery('');
          setSelectedNodeId('svc-payment-core');
        }}
      />

      {/* Main Workspace Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Drift Sidebar */}
        <DriftLeftSidebar
          nodes={nodesData}
          selectedNodeId={selectedNodeId}
          onSelectNode={(id) => setSelectedNodeId(id)}
          isOpen={leftSidebarOpen}
          onToggleOpen={() => setLeftSidebarOpen(!leftSidebarOpen)}
        />

        {/* Central Canvas Workspace */}
        <div className="flex-1 h-full relative flex flex-col">
          <div className="flex-1 h-full relative">
            <DriftComparisonCanvas
              nodesData={nodesData}
              edgesData={edgesData}
              selectedNodeId={selectedNodeId}
              onSelectNode={(node) => setSelectedNodeId(node ? node.id : null)}
              searchQuery={searchQuery}
              onSimulateFix={handleSimulateFix}
              onGenerateAdr={handleGenerateAdr}
            />
          </div>

          {/* Evolution Timeline Scrubber */}
          <DriftTimelineScrubber
            baselines={MOCK_SNAPSHOT_BASELINES}
            selectedBaselineId={baselineB}
            onSelectBaseline={(id) => setBaselineB(id)}
            isOpen={timelineScrubberOpen}
            onToggleOpen={() => setTimelineScrubberOpen(!timelineScrubberOpen)}
          />
        </div>

        {/* Right Inspector Panel */}
        <DriftInspectorPanel
          selectedNode={selectedNode}
          onClose={() => setSelectedNodeId(null)}
          onSimulateFix={handleSimulateFix}
          onGenerateAdr={handleGenerateAdr}
        />
      </div>

      {/* AI Scorecard Modal */}
      <DriftScorecardModal
        isOpen={showScorecardModal}
        onClose={() => setShowScorecardModal(false)}
        onFocusNode={(nodeId) => setSelectedNodeId(nodeId)}
      />
    </div>
  );
}
