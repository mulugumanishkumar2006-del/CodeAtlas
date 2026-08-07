'use client';

import React, { useState } from 'react';
import { ReleaseCandidate } from './release-types';
import { MOCK_RELEASE_CANDIDATES } from './release-mock-data';
import { ReleaseScorecardDashboard } from './release-scorecard-dashboard';
import { ReleaseTimelinePipeline } from './release-timeline-pipeline';
import { ReleaseRiskHeatmap } from './release-risk-heatmap';
import { ReleaseSimulationStudio } from './release-simulation-studio';
import { ReleaseRollbackIntelligence } from './release-rollback-intelligence';
import { ReleaseAIAdvisorModal } from './release-ai-advisor-modal';
import {
  Rocket,
  Clock,
  Activity,
  Zap,
  RefreshCw,
  Sparkles,
  Layers,
  ShieldCheck,
  Bot,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function ReleaseCommandCenter() {
  const [candidates] = useState<ReleaseCandidate[]>(MOCK_RELEASE_CANDIDATES);
  const [activeCandidateId, setActiveCandidateId] = useState<string>(MOCK_RELEASE_CANDIDATES[0].id);
  const [activeTab, setActiveTab] = useState<'timeline' | 'heatmap' | 'simulation' | 'rollback'>('timeline');
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);

  const activeRc = candidates.find((c) => c.id === activeCandidateId) || candidates[0];

  return (
    <div className="flex flex-col h-screen w-full bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Top Header Bar */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 shrink-0 font-mono">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-600 p-0.5 shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Rocket className="w-5 h-5 text-emerald-400" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-black text-slate-100 tracking-tight leading-none">
                AI Release Intelligence Command Center
              </h1>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Live SRE Platform
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-sans mt-0.5">
              Target Candidate: <strong className="text-slate-200">{activeRc.name}</strong>
            </p>
          </div>
        </div>

        {/* Tab Navigation Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          {[
            { id: 'timeline', label: '10-Stage Pipeline Timeline', icon: Clock },
            { id: 'heatmap', label: 'Risk Heatmap', icon: Activity },
            { id: 'simulation', label: 'Simulation Studio', icon: Zap },
            { id: 'rollback', label: 'Rollback Intelligence', icon: RefreshCw },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  'px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5',
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-200 border-emerald-500/30 font-bold shadow-md'
                    : 'bg-transparent text-slate-400 border-transparent hover:text-slate-200'
                )}
              >
                <Icon className="w-3.5 h-3.5 text-emerald-400" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Workspace */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
        {/* Scorecard Dashboard */}
        <ReleaseScorecardDashboard
          scorecard={activeRc.scorecard}
          onOpenAdvisor={() => setIsAdvisorOpen(true)}
        />

        {/* INTERCONNECTED SUBSYSTEM LINKS BAR */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 font-mono">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Interconnected CodeAtlas Subsystems (16/16 Active)</span>
          </span>

          <div className="flex flex-wrap gap-1.5">
            {activeRc.interSystemLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                className="px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 hover:border-cyan-500/40 text-[11px] text-slate-300 hover:text-cyan-300 transition-colors flex items-center gap-1"
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="px-1 py-0.2 rounded text-[8px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {link.badge}
                  </span>
                )}
              </a>
            ))}
          </div>
        </div>

        {/* Tab Views */}
        {activeTab === 'timeline' && <ReleaseTimelinePipeline stages={activeRc.timelineStages} />}

        {activeTab === 'heatmap' && <ReleaseRiskHeatmap nodes={activeRc.serviceRiskNodes} />}

        {activeTab === 'simulation' && (
          <ReleaseSimulationStudio deltas={activeRc.preDeploymentDeltas} />
        )}

        {activeTab === 'rollback' && (
          <ReleaseRollbackIntelligence rollbackPlan={activeRc.rollbackPlan} />
        )}
      </div>

      {/* AI Advisor Modal */}
      <ReleaseAIAdvisorModal
        isOpen={isAdvisorOpen}
        onClose={() => setIsAdvisorOpen(false)}
        advice={activeRc.deploymentAdvice}
      />
    </div>
  );
}
