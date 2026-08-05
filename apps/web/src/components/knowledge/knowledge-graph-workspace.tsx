'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { KnowledgeAiQueryBar } from './knowledge-ai-query-bar';
import { KnowledgeLeftSidebar } from './knowledge-left-sidebar';
import { KnowledgeGraphCanvas } from './knowledge-graph-canvas';
import { KnowledgeRightPanel } from './knowledge-right-panel';
import { KnowledgeAnalyticsModal } from './knowledge-analytics-modal';
import {
  INITIAL_KNOWLEDGE_NODES,
  INITIAL_KNOWLEDGE_RELATIONSHIPS,
  MOCK_GRAPH_ANALYTICS_ISSUES,
  KnowledgeNodeData,
  KnowledgeRelationship,
  AIQueryExample,
  GraphAnalyticsIssue
} from './knowledge-mock-data';
import {
  Focus,
  Maximize2,
  Minimize2,
  Tv,
  RotateCcw,
  Sparkles,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function KnowledgeGraphWorkspace() {
  const router = useRouter();

  // State Management
  const [nodesData, setNodesData] = useState<KnowledgeNodeData[]>(INITIAL_KNOWLEDGE_NODES);
  const [relationshipsData, setRelationshipsData] = useState<KnowledgeRelationship[]>(INITIAL_KNOWLEDGE_RELATIONSHIPS);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('svc-payment');
  const [selectedRelationshipId, setSelectedRelationshipId] = useState<string | null>(null);

  const [focusMode, setFocusMode] = useState<boolean>(false);
  const [layoutEngine, setLayoutEngine] = useState<'radial' | 'hierarchical' | 'force-directed' | 'circular'>('radial');

  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [selectedRelType, setSelectedRelType] = useState<string>('All Relationships');

  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(true);
  const [activeQueryResult, setActiveQueryResult] = useState<AIQueryExample | null>(null);

  const [showAnalyticsModal, setShowAnalyticsModal] = useState<boolean>(false);
  const [presentationMode, setPresentationMode] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showLayoutMenu, setShowLayoutMenu] = useState<boolean>(false);

  // Derived selected entities
  const selectedNode = nodesData.find((n) => n.id === selectedNodeId) || null;
  const selectedRelationship = relationshipsData.find((r) => r.id === selectedRelationshipId) || null;

  // Action Button Triggers
  const handleInvestigate = (nodeId: string) => {
    router.push(`/investigate?symbol=${nodeId}`);
  };

  const handleSimulate = (nodeId: string) => {
    router.push(`/simulate?target=${nodeId}`);
  };

  const handleGenerateDocs = (nodeId: string) => {
    router.push(`/knowledge?doc=${nodeId}`);
  };

  // Keyboard Shortcuts (Esc to close panels)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedNodeId(null);
        setSelectedRelationshipId(null);
        setShowAnalyticsModal(false);
        setActiveQueryResult(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={`flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans select-none ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* AI Query Assistant Bar */}
      {!presentationMode && (
        <KnowledgeAiQueryBar
          onExecuteAiQuery={(query) => {
            setActiveQueryResult(query);
            if (query.highlightNodes.length > 0) {
              setSelectedNodeId(query.highlightNodes[0]);
              setFocusMode(true);
            }
          }}
          activeQueryResult={activeQueryResult}
          onClearQueryResult={() => setActiveQueryResult(null)}
        />
      )}

      {/* Primary Toolbar */}
      {!presentationMode && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2 bg-slate-950/90 border-b border-slate-800/80 shrink-0 z-30 font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase text-cyan-400">LAYOUT ENGINE:</span>
            <div className="relative">
              <button
                onClick={() => setShowLayoutMenu(!showLayoutMenu)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold capitalize hover:border-slate-700"
              >
                <span>{layoutEngine} Layout</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {showLayoutMenu && (
                <div className="absolute top-full left-0 mt-1 w-44 bg-slate-950 border border-slate-800 rounded-xl p-1 shadow-2xl z-50">
                  {(['radial', 'hierarchical', 'force-directed', 'circular'] as const).map((layout) => (
                    <button
                      key={layout}
                      onClick={() => {
                        setLayoutEngine(layout);
                        setShowLayoutMenu(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg capitalize transition-colors ${
                        layoutEngine === layout ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-300 hover:bg-slate-900'
                      }`}
                    >
                      {layout}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFocusMode(!focusMode)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs font-bold transition-all ${
                focusMode
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Focus className="w-3.5 h-3.5 text-cyan-400" /> Focus Mode
            </button>

            <Button
              onClick={() => setShowAnalyticsModal(true)}
              className="bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs gap-1.5 rounded-xl px-3 py-1 h-7"
            >
              <Sparkles className="w-3.5 h-3.5" /> Graph Analytics
              <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[9px]">
                {MOCK_GRAPH_ANALYTICS_ISSUES.length}
              </span>
            </Button>

            <button
              onClick={() => setPresentationMode(!presentationMode)}
              className={`p-1.5 rounded-xl border transition-colors ${
                presentationMode
                  ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Tv className="w-4 h-4 text-purple-400" />
            </button>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* Main Workspace Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Knowledge Taxonomy Sidebar */}
        {!presentationMode && (
          <KnowledgeLeftSidebar
            nodes={nodesData}
            selectedNodeId={selectedNodeId}
            onSelectNode={(id) => {
              setSelectedNodeId(id);
              setSelectedRelationshipId(null);
            }}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            selectedRelType={selectedRelType}
            onSelectRelType={setSelectedRelType}
            onOpenAnalyticsIssue={(issue) => {
              if (issue.affectedNodes.length > 0) {
                setSelectedNodeId(issue.affectedNodes[0]);
                setFocusMode(true);
              }
            }}
            isOpen={leftSidebarOpen}
            onToggleOpen={() => setLeftSidebarOpen(!leftSidebarOpen)}
          />
        )}

        {/* Central Graph Canvas */}
        <div className="flex-1 h-full relative">
          <KnowledgeGraphCanvas
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
            focusMode={focusMode}
            onToggleFocusMode={() => setFocusMode(!focusMode)}
            layoutEngine={layoutEngine}
            selectedCategory={selectedCategory}
            onInvestigate={handleInvestigate}
            onSimulate={handleSimulate}
            onGenerateDocs={handleGenerateDocs}
            highlightedNodeIds={activeQueryResult?.highlightNodes || []}
          />
        </div>

        {/* Right Knowledge Inspector Panel */}
        {!presentationMode && (
          <KnowledgeRightPanel
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

      {/* Automated Graph Analytics Modal */}
      <KnowledgeAnalyticsModal
        isOpen={showAnalyticsModal}
        onClose={() => setShowAnalyticsModal(false)}
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
