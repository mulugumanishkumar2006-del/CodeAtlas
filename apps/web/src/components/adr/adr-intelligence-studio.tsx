'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdrTopToolbar } from './adr-top-toolbar';
import { AdrAiQueryBar } from './adr-ai-query-bar';
import { AdrLeftSidebar } from './adr-left-sidebar';
import { AdrCardView } from './adr-card-view';
import { AdrGraphCanvas } from './adr-graph-canvas';
import { AdrInspectorPanel } from './adr-inspector-panel';
import { AdrGeneratorModal } from './adr-generator-modal';
import {
  MOCK_ADR_RECORDS,
  MOCK_AI_CTO_QUERIES,
  AdrRecord,
  AiCtoQueryAnswer
} from './adr-mock-data';

export function AdrIntelligenceStudio() {
  const router = useRouter();

  // State Management
  const [adrs, setAdrs] = useState<AdrRecord[]>(MOCK_ADR_RECORDS);
  const [selectedAdrId, setSelectedAdrId] = useState<string | null>('adr-001');

  const [currentView, setCurrentView] = useState<string>('Cards View');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [activeQueryResult, setActiveQueryResult] = useState<AiCtoQueryAnswer | null>(null);

  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(true);
  const [showGeneratorModal, setShowGeneratorModal] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const selectedAdr = adrs.find((a) => a.id === selectedAdrId) || null;

  // Action Button Triggers
  const handleSimulate = (adrId: string) => {
    router.push(`/simulate?target=${adrId}`);
  };

  const handleApprove = (adrId: string) => {
    setAdrs((prev) =>
      prev.map((a) =>
        a.id === adrId ? { ...a, status: 'Approved', committeeVotes: { ...a.committeeVotes, approve: a.committeeVotes.approve + 1 } } : a
      )
    );
  };

  const handleGenerateAdr = (title: string, category: any) => {
    const newAdr: AdrRecord = {
      id: `adr-${adrs.length + 1}`,
      decisionId: `ADR-00${adrs.length + 1}`,
      title,
      category,
      status: 'Proposed',
      author: 'AI Copilot Staff Architect',
      date: 'Just Now',
      repository: 'CodeAtlas/apps/backend',
      aiConfidenceScorePct: 96,
      context: 'Synthesized automatically by AI CTO from code commits and dependency topology.',
      problemStatement: 'Optimizing software performance and decoupling microservice boundaries.',
      decision: title,
      alternativesConsidered: ['Do Nothing', 'Custom In-House Service'],
      pros: ['Increases scalability and throughput', 'Restores domain isolation'],
      cons: ['Requires engineering migration effort'],
      tradeoffs: 'Traded initial development hours for long-term architecture stability.',
      affectedServices: ['PaymentService', 'AuthService'],
      affectedDatabases: ['PostgreSQL DB'],
      estimatedCost: '$80/mo',
      engineeringEffortHours: 16,
      performanceImpact: 'P95 latency speedup expected.',
      securityImpact: 'Enforces RBAC compliance.',
      scalabilityImpact: 'Scales linearly.',
      rollbackStrategy: 'Revert deployment via canary Istio split.',
      migrationStrategy: 'Deploy shadow worker ➔ Cutover traffic.',
      committeeVotes: { approve: 1, reject: 0, abstain: 0 },
      relatedPrs: ['PR #Auto'],
      relatedCommits: ['a1b2c3d']
    };

    setAdrs([newAdr, ...adrs]);
    setSelectedAdrId(newAdr.id);
  };

  // Keyboard Shortcuts (Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowGeneratorModal(false);
        setActiveQueryResult(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={`flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans select-none ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Top Toolbar */}
      <AdrTopToolbar
        currentView={currentView}
        onSelectView={setCurrentView}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenGenerator={() => setShowGeneratorModal(true)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
        onResetView={() => {
          setSearchQuery('');
          setSelectedAdrId('adr-001');
          setActiveQueryResult(null);
        }}
      />

      {/* AI CTO Assistant Bar */}
      <AdrAiQueryBar
        onExecuteQuery={(query) => {
          const found = MOCK_AI_CTO_QUERIES.find((q) => q.query.toLowerCase().includes(query.toLowerCase())) || MOCK_AI_CTO_QUERIES[0];
          setActiveQueryResult(found);
          if (found.recommendedAdrId) setSelectedAdrId(found.recommendedAdrId);
        }}
        activeQueryResult={activeQueryResult}
        onClearQueryResult={() => setActiveQueryResult(null)}
      />

      {/* Main Workspace Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left ADR Sidebar */}
        <AdrLeftSidebar
          adrs={adrs}
          selectedAdrId={selectedAdrId}
          onSelectAdr={(id) => setSelectedAdrId(id)}
          isOpen={leftSidebarOpen}
          onToggleOpen={() => setLeftSidebarOpen(!leftSidebarOpen)}
        />

        {/* Central Workspace (Card View or Graph Canvas) */}
        <div className="flex-1 h-full relative">
          {currentView === 'Knowledge Graph View' ? (
            <AdrGraphCanvas
              adrs={adrs}
              selectedAdrId={selectedAdrId}
              onSelectAdr={(adr) => setSelectedAdrId(adr ? adr.id : null)}
              searchQuery={searchQuery}
              onSimulate={handleSimulate}
              onApprove={handleApprove}
            />
          ) : (
            selectedAdr && (
              <AdrCardView
                adr={selectedAdr}
                onSimulate={handleSimulate}
                onApprove={handleApprove}
              />
            )
          )}
        </div>

        {/* Right Inspector Panel */}
        <AdrInspectorPanel
          selectedAdr={selectedAdr}
          onClose={() => setSelectedAdrId(null)}
          onSimulate={handleSimulate}
          onApprove={handleApprove}
        />
      </div>

      {/* Auto Generator Modal */}
      <AdrGeneratorModal
        isOpen={showGeneratorModal}
        onClose={() => setShowGeneratorModal(false)}
        onGenerate={handleGenerateAdr}
      />
    </div>
  );
}
