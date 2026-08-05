'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TopToolbar } from './top-toolbar';
import { LeftNavExplorer } from './left-nav-explorer';
import { ArchitectureCanvas } from './architecture-canvas';
import { RightContextPanel } from './right-context-panel';
import { BottomTimeline } from './bottom-timeline';
import { AiInsightsModal } from './ai-insights-modal';
import {
  INITIAL_ARCH_NODES,
  INITIAL_ARCH_RELATIONSHIPS,
  MOCK_AI_INSIGHTS,
  MOCK_TIMELINE_MILESTONES,
  ArchNodeData,
  ArchRelationship,
  SavedViewPreset,
  AIInsightItem
} from './architecture-mock-data';

export function ArchitectureExplorer() {
  const router = useRouter();

  // State Management
  const [nodesData, setNodesData] = useState<ArchNodeData[]>(INITIAL_ARCH_NODES);
  const [relationshipsData, setRelationshipsData] = useState<ArchRelationship[]>(INITIAL_ARCH_RELATIONSHIPS);

  const [currentMode, setCurrentMode] = useState<string>('Component View');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('app-web');
  const [selectedRelationshipId, setSelectedRelationshipId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [focusMode, setFocusMode] = useState<boolean>(false);
  const [layoutEngine, setLayoutEngine] = useState<'hierarchical' | 'layered' | 'circular' | 'force-directed'>('layered');

  const [layerFilter, setLayerFilter] = useState<string>('All');
  const [riskFilter, setRiskFilter] = useState<string>('All');

  const [leftNavOpen, setLeftNavOpen] = useState<boolean>(true);
  const [timelineOpen, setTimelineOpen] = useState<boolean>(true);
  const [currentMilestoneIndex, setCurrentMilestoneIndex] = useState<number>(3); // Default to Latest (v2.5.0)

  const [showAiModal, setShowAiModal] = useState<boolean>(false);
  const [presentationMode, setPresentationMode] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const [expandedNodeIds, setExpandedNodeIds] = useState<Set<string>>(new Set(['domain-security', 'domain-intelligence']));

  // Selected entities derived
  const selectedNode = nodesData.find((n) => n.id === selectedNodeId) || null;
  const selectedRelationship = relationshipsData.find((r) => r.id === selectedRelationshipId) || null;

  // Toggle Node Expand Subtree
  const handleToggleNodeExpand = useCallback((nodeId: string) => {
    setExpandedNodeIds((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) next.delete(nodeId);
      else next.add(nodeId);
      return next;
    });
  }, []);

  // Action Button Handlers
  const handleInvestigate = (nodeId: string) => {
    router.push(`/investigate?symbol=${nodeId}`);
  };

  const handleSimulate = (nodeId: string) => {
    router.push(`/simulate?target=${nodeId}`);
  };

  const handleGenerateDocs = (nodeId: string) => {
    router.push(`/knowledge?doc=${nodeId}`);
  };

  // Preset Selection
  const handleSelectPreset = (preset: SavedViewPreset) => {
    setCurrentMode(preset.mode);
    if (preset.focusNodeId) {
      setSelectedNodeId(preset.focusNodeId);
      setFocusMode(true);
    } else {
      setFocusMode(false);
    }
  };

  // Keyboard Shortcuts (Cmd+F search, Esc close panel, etc.)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Search 100,000+"]') as HTMLInputElement;
        if (searchInput) searchInput.focus();
      }
      if (e.key === 'Escape') {
        setSelectedNodeId(null);
        setSelectedRelationshipId(null);
        setShowAiModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={`flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans select-none ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Top Toolbar */}
      {!presentationMode && (
        <TopToolbar
          currentMode={currentMode}
          onSelectMode={setCurrentMode}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          focusMode={focusMode}
          onToggleFocusMode={() => setFocusMode(!focusMode)}
          layoutEngine={layoutEngine}
          onChangeLayout={setLayoutEngine}
          onOpenAiInsights={() => setShowAiModal(true)}
          violationCount={MOCK_AI_INSIGHTS.length}
          onSelectPreset={handleSelectPreset}
          presentationMode={presentationMode}
          onTogglePresentationMode={() => setPresentationMode(!presentationMode)}
          isFullscreen={isFullscreen}
          onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
          selectedLayerFilter={layerFilter}
          onSelectLayerFilter={setLayerFilter}
          selectedRiskFilter={riskFilter}
          onSelectRiskFilter={setRiskFilter}
          onResetView={() => {
            setSearchQuery('');
            setFocusMode(false);
            setLayerFilter('All');
            setRiskFilter('All');
            setSelectedNodeId('app-web');
          }}
        />
      )}

      {/* Main Workspace Layout Area */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Navigation Explorer Sidebar */}
        {!presentationMode && (
          <LeftNavExplorer
            nodes={nodesData}
            selectedNodeId={selectedNodeId}
            onSelectNode={(id) => {
              setSelectedNodeId(id);
              setSelectedRelationshipId(null);
            }}
            aiInsights={MOCK_AI_INSIGHTS}
            onOpenAiInsight={(insight) => {
              setSelectedNodeId(insight.affectedNodes[0] || null);
              setFocusMode(true);
            }}
            onSelectPreset={handleSelectPreset}
            isOpen={leftNavOpen}
            onToggleOpen={() => setLeftNavOpen(!leftNavOpen)}
          />
        )}

        {/* Central Architecture Canvas */}
        <div className="flex-1 h-full relative">
          <ArchitectureCanvas
            nodesData={nodesData}
            relationshipsData={relationshipsData}
            selectedNodeId={selectedNodeId}
            onSelectNode={(node) => {
              setSelectedNodeId(node ? node.id : null);
              setSelectedRelationshipId(null);
            }}
            selectedRelationshipId={selectedRelationshipId}
            onSelectRelationship={(rel) => {
              setSelectedRelationshipId(rel ? rel.id : null);
              setSelectedNodeId(null);
            }}
            currentMode={currentMode}
            focusMode={focusMode}
            onToggleFocusMode={() => setFocusMode(!focusMode)}
            layoutEngine={layoutEngine}
            searchQuery={searchQuery}
            layerFilter={layerFilter}
            riskFilter={riskFilter}
            onInvestigate={handleInvestigate}
            onSimulate={handleSimulate}
            onGenerateDocs={handleGenerateDocs}
            expandedNodeIds={expandedNodeIds}
            onToggleNodeExpand={handleToggleNodeExpand}
          />
        </div>

        {/* Right Context Panel */}
        {!presentationMode && (
          <RightContextPanel
            selectedNode={selectedNode}
            selectedRelationship={selectedRelationship}
            onClose={() => {
              setSelectedNodeId(null);
              setSelectedRelationshipId(null);
            }}
            onNavigateToNode={(id) => setSelectedNodeId(id)}
            onInvestigate={handleInvestigate}
            onSimulate={handleSimulate}
            onGenerateDocs={handleGenerateDocs}
          />
        )}
      </div>

      {/* Bottom Timeline */}
      {!presentationMode && (
        <BottomTimeline
          currentMilestoneIndex={currentMilestoneIndex}
          onSelectMilestoneIndex={setCurrentMilestoneIndex}
          isOpen={timelineOpen}
          onToggleOpen={() => setTimelineOpen(!timelineOpen)}
        />
      )}

      {/* AI Insights Modal */}
      <AiInsightsModal
        isOpen={showAiModal}
        onClose={() => setShowAiModal(false)}
        onFocusNodes={(nodeIds) => {
          if (nodeIds.length > 0) {
            setSelectedNodeId(nodeIds[0]);
            setFocusMode(true);
          }
        }}
      />
    </div>
  );
}
