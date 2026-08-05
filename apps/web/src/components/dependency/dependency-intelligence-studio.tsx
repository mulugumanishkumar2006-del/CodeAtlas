'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DependencyTopToolbar } from './dependency-top-toolbar';
import { DependencyLeftSidebar } from './dependency-left-sidebar';
import { DependencyGraphCanvas } from './dependency-graph-canvas';
import { DependencyMatrixView } from './dependency-matrix-view';
import { DependencyImpactPanel } from './dependency-impact-panel';
import { DependencyInsightsModal } from './dependency-insights-modal';
import {
  INITIAL_DEP_NODES,
  INITIAL_DEP_EDGES,
  MOCK_DEP_AI_INSIGHTS,
  DependencyNodeData,
  DependencyEdgeData
} from './dependency-mock-data';

export function DependencyIntelligenceStudio() {
  const router = useRouter();

  // State Management
  const [nodesData, setNodesData] = useState<DependencyNodeData[]>(INITIAL_DEP_NODES);
  const [edgesData, setEdgesData] = useState<DependencyEdgeData[]>(INITIAL_DEP_EDGES);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('svc-payment-core');
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);

  const [currentView, setCurrentView] = useState<string>('Layered Graph');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [focusMode, setFocusMode] = useState<boolean>(false);

  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(true);
  const [showAiModal, setShowAiModal] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const [shortestPathNodeIds, setShortestPathNodeIds] = useState<string[]>([]);

  // Selected Entities
  const selectedNode = nodesData.find((n) => n.id === selectedNodeId) || null;
  const selectedEdge = edgesData.find((e) => e.id === selectedEdgeId) || null;

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

  // Shortest Path Calculator
  const handleCalculateShortestPath = (sourceId: string, targetId: string) => {
    // Simple path finder: Source -> Gateway / Intermediary -> Target
    setShortestPathNodeIds([sourceId, 'svc-payment-core', targetId]);
    setSelectedNodeId(sourceId);
  };

  // Keyboard Shortcuts (Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedNodeId(null);
        setSelectedEdgeId(null);
        setShowAiModal(false);
        setShortestPathNodeIds([]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={`flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans select-none ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Top Toolbar */}
      <DependencyTopToolbar
        currentView={currentView}
        onSelectView={setCurrentView}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        focusMode={focusMode}
        onToggleFocusMode={() => setFocusMode(!focusMode)}
        onOpenAiInsights={() => setShowAiModal(true)}
        onOpenImpactAnalysis={() => {
          if (selectedNodeId) setSelectedNodeId(selectedNodeId);
        }}
        nodes={nodesData}
        onCalculateShortestPath={handleCalculateShortestPath}
        isFullscreen={isFullscreen}
        onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
        onResetView={() => {
          setSearchQuery('');
          setFocusMode(false);
          setShortestPathNodeIds([]);
          setSelectedNodeId('svc-payment-core');
        }}
      />

      {/* Main Workspace Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Dependency Sidebar */}
        <DependencyLeftSidebar
          nodes={nodesData}
          selectedNodeId={selectedNodeId}
          onSelectNode={(id) => {
            setSelectedNodeId(id);
            setSelectedEdgeId(null);
          }}
          isOpen={leftSidebarOpen}
          onToggleOpen={() => setLeftSidebarOpen(!leftSidebarOpen)}
        />

        {/* Central Workspace (Matrix View or Graph Canvas) */}
        <div className="flex-1 h-full relative">
          {currentView === 'Matrix View' ? (
            <DependencyMatrixView
              nodes={nodesData}
              edges={edgesData}
              onSelectNode={(id) => setSelectedNodeId(id)}
            />
          ) : (
            <DependencyGraphCanvas
              nodesData={nodesData}
              edgesData={edgesData}
              selectedNodeId={selectedNodeId}
              onSelectNode={(node) => {
                setSelectedNodeId(node ? node.id : null);
                setSelectedEdgeId(null);
              }}
              selectedEdgeId={selectedEdgeId}
              onSelectEdge={(edge) => {
                setSelectedEdgeId(edge ? edge.id : null);
                setSelectedNodeId(null);
              }}
              focusMode={focusMode}
              onToggleFocusMode={() => setFocusMode(!focusMode)}
              currentView={currentView}
              searchQuery={searchQuery}
              shortestPathNodeIds={shortestPathNodeIds}
              onInvestigate={handleInvestigate}
              onSimulate={handleSimulate}
              onOpenImpactReport={() => {
                if (selectedNodeId) setSelectedNodeId(selectedNodeId);
              }}
            />
          )}
        </div>

        {/* Right Impact Panel Inspector */}
        <DependencyImpactPanel
          selectedNode={selectedNode}
          onClose={() => {
            setSelectedNodeId(null);
            setSelectedEdgeId(null);
          }}
          onNavigateToNode={(id) => setSelectedNodeId(id)}
          onInvestigate={handleInvestigate}
          onSimulate={handleSimulate}
          onGenerateDocs={handleGenerateDocs}
        />
      </div>

      {/* AI Insights Modal */}
      <DependencyInsightsModal
        isOpen={showAiModal}
        onClose={() => setShowAiModal(false)}
        onFocusNodes={(ids) => {
          if (ids.length > 0) {
            setSelectedNodeId(ids[0]);
            setFocusMode(true);
          }
        }}
      />
    </div>
  );
}
