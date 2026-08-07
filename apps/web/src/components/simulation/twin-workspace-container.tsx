'use client';

import React, { useState } from 'react';
import { EngineeringSimulationStudio } from '@/components/ui/engineering-simulation-studio';
import { TwinLiveStages } from './twin-live-stages';
import { TwinNaturalQuery } from './twin-natural-query';
import {
  MOCK_SIMULATION_RESULTS,
  MOCK_NATURAL_QUERIES,
} from './twin-mock-data';
import { SimulationStage } from './twin-types';
import { Zap, Layers, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export function TwinWorkspaceContainer() {
  const [activeTab, setActiveTab] = useState<'canvas' | 'stages' | 'assistant'>('canvas');
  const [currentStage, setCurrentStage] = useState<SimulationStage>('SUMMARY');
  const [isSimulating, setIsSimulating] = useState(false);

  const handleRunSimulation = (query: string) => {
    setIsSimulating(true);
    setCurrentStage('PREPARATION');
    setTimeout(() => setCurrentStage('ANALYSIS'), 200);
    setTimeout(() => setCurrentStage('PREDICTION'), 400);
    setTimeout(() => setCurrentStage('IMPACT_CALCULATION'), 600);
    setTimeout(() => setCurrentStage('RISK_EVALUATION'), 800);
    setTimeout(() => setCurrentStage('VISUALIZATION'), 1000);
    setTimeout(() => setCurrentStage('RECOMMENDATION'), 1200);
    setTimeout(() => {
      setCurrentStage('SUMMARY');
      setIsSimulating(false);
    }, 1400);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Top Header */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 shrink-0 font-mono">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-500 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Zap className="w-5 h-5 text-cyan-400" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-black text-slate-100 tracking-tight leading-none">
                Engineering Digital Twin & Simulation Studio
              </h1>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                Figma + Maps + AI Architect
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-sans mt-0.5">
              Simulate architectural changes, database replacements, and traffic scaling safely before writing code.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          {[
            { id: 'canvas', label: 'Interactive Canvas Studio', icon: Zap },
            { id: 'stages', label: '8-Stage Execution Stream', icon: Layers },
            { id: 'assistant', label: 'Natural Language Assistant', icon: Sparkles },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  'px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5',
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/10 text-cyan-200 border-cyan-500/30 font-bold shadow-md'
                    : 'bg-transparent text-slate-400 border-transparent hover:text-slate-200'
                )}
              >
                <Icon className="w-3.5 h-3.5 text-cyan-400" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Workspace */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
        {activeTab === 'canvas' && <EngineeringSimulationStudio />}

        {activeTab === 'stages' && (
          <TwinLiveStages currentStage={currentStage} isSimulating={isSimulating} />
        )}

        {activeTab === 'assistant' && (
          <TwinNaturalQuery
            queries={MOCK_NATURAL_QUERIES}
            simulationResults={MOCK_SIMULATION_RESULTS}
            onRunSimulation={handleRunSimulation}
          />
        )}
      </div>
    </div>
  );
}
