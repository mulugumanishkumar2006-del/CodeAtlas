'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  BarChart3,
  Share2,
  Users,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Zap,
  FlaskConical,
  Flame,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EnterpriseTopBar } from './enterprise-top-bar';
import { EnterpriseLeftSidebar } from './enterprise-left-sidebar';
import { EnterpriseGraphMap } from './enterprise-graph-map';
import { CollaborativeWhiteboard } from './collaborative-whiteboard';
import { ArbGovernancePanel } from './arb-governance-panel';
import {
  MOCK_ORG_METRICS,
  MOCK_DORA_METRICS,
  MOCK_TECH_RADAR,
  MOCK_TEAMS,
  ExecutiveRolePerspective
} from './enterprise-mock-data';

export function EnterpriseWorkspaceStudio() {
  const router = useRouter();

  // State Management
  const [currentTab, setCurrentTab] = useState<string>('command_center');
  const [currentRole, setCurrentRole] = useState<ExecutiveRolePerspective>('CTO');
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>('team-core');

  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const selectedTeam = MOCK_TEAMS.find((t) => t.id === selectedTeamId) || MOCK_TEAMS[0];

  const handleSimulate = (targetId: string) => {
    router.push(`/simulate?target=${targetId}`);
  };

  return (
    <div className={`flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans select-none ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Top Header & Navigation */}
      <EnterpriseTopBar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        currentRole={currentRole}
        onSelectRole={setCurrentRole}
        isFullscreen={isFullscreen}
        onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
      />

      {/* Main Workspace Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Team Sidebar */}
        <EnterpriseLeftSidebar
          selectedTeamId={selectedTeamId}
          onSelectTeam={(id) => {
            setSelectedTeamId(id);
            setCurrentTab('teams');
          }}
          isOpen={leftSidebarOpen}
          onToggleOpen={() => setLeftSidebarOpen(!leftSidebarOpen)}
        />

        {/* Central Dynamic Workspace */}
        <div className="flex-1 h-full overflow-y-auto p-6 space-y-6 scrollbar-none font-sans">
          {/* Tab 1: Org Command Center */}
          {currentTab === 'command_center' && (
            <div className="max-w-5xl mx-auto space-y-6">
              {/* DORA Metrics Grid */}
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                    ORGANIZATION DORA DEPLOYMENT METRICS
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold">
                    ELITE PERFORMANCE
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
                  {MOCK_DORA_METRICS.map((m) => (
                    <div key={m.label} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-1">
                      <span className="text-slate-400 text-[10px] uppercase block">{m.label}</span>
                      <span className="text-xl font-black text-white">{m.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technology Radar Summary */}
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-2xl space-y-4">
                <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider block">
                  ENTERPRISE TECHNOLOGY LIFECYCLE RADAR
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
                  {(['Adopt', 'Trial', 'Assess', 'Hold'] as const).map((status) => {
                    const items = MOCK_TECH_RADAR.filter((i) => i.status === status);
                    return (
                      <div key={status} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                        <span className={`text-[10px] font-bold uppercase block ${
                          status === 'Adopt' ? 'text-emerald-400' : status === 'Trial' ? 'text-cyan-400' : status === 'Assess' ? 'text-amber-400' : 'text-rose-400'
                        }`}>
                          {status} ({items.length})
                        </span>

                        <div className="space-y-1.5">
                          {items.map((item) => (
                            <div key={item.id} className="p-2 rounded-xl bg-slate-900 border border-slate-800/80 text-[11px] text-slate-200">
                              <span className="font-bold block">{item.name}</span>
                              <span className="text-[9px] text-slate-500">{item.adoptedTeamsCount} teams adopted</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Multi-Repo Graph Map */}
          {currentTab === 'graph' && (
            <EnterpriseGraphMap />
          )}

          {/* Tab 3: Team Workspaces */}
          {currentTab === 'teams' && selectedTeam && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-2xl space-y-4 font-mono">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                  <div>
                    <span className="text-[10px] font-bold text-cyan-400 uppercase block">TEAM WORKSPACE</span>
                    <h2 className="text-xl font-black text-white tracking-tight">{selectedTeam.teamName}</h2>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
                    Health: {selectedTeam.healthScorePct}%
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-slate-400 text-[10px] block">Team Lead</span>
                    <span className="text-sm font-bold text-white">{selectedTeam.leadName}</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-slate-400 text-[10px] block">Bus Factor Score</span>
                    <span className="text-sm font-bold text-cyan-300">{selectedTeam.busFactorScore}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mb-2">Owned Critical Services</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedTeam.criticalServices.map((svc, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 text-xs font-bold">
                        {svc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Collaborative Whiteboard */}
          {currentTab === 'whiteboard' && (
            <CollaborativeWhiteboard />
          )}

          {/* Tab 5: ARB Governance */}
          {currentTab === 'arb' && (
            <div className="max-w-4xl mx-auto space-y-4">
              <ArbGovernancePanel onSimulate={handleSimulate} />
            </div>
          )}

          {/* Tab 6: Executive AI CTO Insights */}
          {currentTab === 'ai_exec' && (
            <div className="max-w-4xl mx-auto space-y-4 font-sans">
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-2xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5">
                    <div className="p-2 bg-slate-950 rounded-[12px]">
                      <Sparkles className="w-5 h-5 text-cyan-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white tracking-tight">Executive AI CTO Strategic Action Plan</h3>
                    <p className="text-xs font-mono text-slate-400">Synthesized automatically across 1,042 repositories.</p>
                  </div>
                </div>

                <div className="space-y-3 font-mono text-xs pt-2">
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <span className="text-cyan-400 font-bold block">1. Modernization Priority: Refactor PaymentService Layer Bypass</span>
                    <p className="text-slate-300 font-sans text-xs">
                      PaymentService direct Neo4j Cypher queries create SPOF risk under surge traffic. Offload to Kafka event bus to eliminate gateway timeouts.
                    </p>
                    <Button
                      onClick={() => handleSimulate('svc-payment-core')}
                      className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold text-xs gap-1.5 rounded-xl h-8"
                    >
                      <FlaskConical className="w-3.5 h-3.5" /> Simulate Modernization Scenario
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right ARB Governance Drawer */}
        <ArbGovernancePanel onSimulate={handleSimulate} />
      </div>
    </div>
  );
}
