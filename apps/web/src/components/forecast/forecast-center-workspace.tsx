'use client';

import React, { useState } from 'react';
import { ForecastScorecardDashboard } from './forecast-scorecard-dashboard';
import { ForecastRiskRadar } from './forecast-risk-radar';
import { ForecastWhatIfSimulator } from './forecast-what-if-simulator';
import { ForecastPredictiveTrends } from './forecast-predictive-trends';
import { ForecastReportsStudio } from './forecast-reports-studio';
import {
  MOCK_FORECAST_SCORECARD,
  MOCK_RISK_RADAR_ITEMS,
  MOCK_WHAT_IF_SCENARIOS,
  MOCK_FORECAST_REPORTS,
  MOCK_PREDICTIVE_TRENDS,
  MOCK_INTER_SYSTEM_LINKS,
} from './forecast-mock-data';
import { Sparkles, Activity, Sliders, LineChart, FileText, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ForecastCenterWorkspace() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'radar' | 'whatif' | 'trends' | 'reports'>('dashboard');

  return (
    <div className="flex flex-col h-screen w-full bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Top Header */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 shrink-0 font-mono">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-500 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-black text-slate-100 tracking-tight leading-none">
                AI Engineering Forecasting Platform
              </h1>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                Future Intelligence Engine
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-sans mt-0.5">
              Continuously predicting future states of repositories, services, architectures, and teams.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          {[
            { id: 'dashboard', label: '10-Dimension Scorecard', icon: Sparkles },
            { id: 'radar', label: 'Risk Radar', icon: Activity },
            { id: 'whatif', label: 'What-If Simulator', icon: Sliders },
            { id: 'trends', label: 'Predictive Trends', icon: LineChart },
            { id: 'reports', label: 'Forecast Reports', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  'px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5',
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/10 text-indigo-200 border-indigo-500/30 font-bold shadow-md'
                    : 'bg-transparent text-slate-400 border-transparent hover:text-slate-200'
                )}
              >
                <Icon className="w-3.5 h-3.5 text-indigo-400" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Workspace */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
        {/* Scorecard Summary Bar */}
        <ForecastScorecardDashboard scorecard={MOCK_FORECAST_SCORECARD} />

        {/* INTERCONNECTED SUBSYSTEM LINKS BAR */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 font-mono">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Interconnected CodeAtlas Subsystems (16/16 Connected)</span>
          </span>

          <div className="flex flex-wrap gap-1.5">
            {MOCK_INTER_SYSTEM_LINKS.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                className="px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 hover:border-indigo-500/40 text-[11px] text-slate-300 hover:text-indigo-300 transition-colors flex items-center gap-1"
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="px-1 py-0.2 rounded text-[8px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {link.badge}
                  </span>
                )}
              </a>
            ))}
          </div>
        </div>

        {/* Tab Content Views */}
        {activeTab === 'dashboard' && <ForecastRiskRadar items={MOCK_RISK_RADAR_ITEMS} />}
        {activeTab === 'radar' && <ForecastRiskRadar items={MOCK_RISK_RADAR_ITEMS} />}
        {activeTab === 'whatif' && <ForecastWhatIfSimulator scenarios={MOCK_WHAT_IF_SCENARIOS} />}
        {activeTab === 'trends' && <ForecastPredictiveTrends trends={MOCK_PREDICTIVE_TRENDS} />}
        {activeTab === 'reports' && <ForecastReportsStudio reports={MOCK_FORECAST_REPORTS} />}
      </div>
    </div>
  );
}
