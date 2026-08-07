'use client';

import React, { useState } from 'react';
import { WhatIfScenarioOption } from './forecast-types';
import { Sliders, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, Zap, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ForecastWhatIfSimulatorProps {
  scenarios: WhatIfScenarioOption[];
}

export function ForecastWhatIfSimulator({ scenarios }: ForecastWhatIfSimulatorProps) {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(scenarios[0]?.id || '');
  const [customQuestion, setCustomQuestion] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);

  const activeScenario = scenarios.find((s) => s.id === selectedScenarioId) || scenarios[0];

  const handleSimulateCustom = () => {
    if (!customQuestion.trim()) return;
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 600);
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 font-sans shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-slate-100">
            What-If Scenario Simulator & Outcome Matrix
          </h3>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
          Side-by-Side Simulation
        </span>
      </div>

      {/* Preset Scenario Tabs */}
      <div className="space-y-2 font-mono text-xs">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          Select Preset What-If Simulation
        </label>
        <div className="flex flex-wrap gap-2">
          {scenarios.map((scen) => (
            <button
              key={scen.id}
              onClick={() => setSelectedScenarioId(scen.id)}
              className={cn(
                'px-3 py-1.5 rounded-lg border transition-all text-xs',
                selectedScenarioId === scen.id
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold shadow-md'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              )}
            >
              {scen.question}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Question Input */}
      <div className="flex gap-2 font-mono">
        <input
          type="text"
          value={customQuestion}
          onChange={(e) => setCustomQuestion(e.target.value)}
          placeholder="Type custom scenario (e.g. 'What if we replace PostgreSQL with DynamoDB?')..."
          className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
          onKeyDown={(e) => e.key === 'Enter' && handleSimulateCustom()}
        />
        <button
          onClick={handleSimulateCustom}
          disabled={isSimulating}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 font-bold text-xs text-white shadow-lg flex items-center gap-1.5 hover:opacity-90 disabled:opacity-50"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>{isSimulating ? 'Simulating...' : 'Simulate'}</span>
        </button>
      </div>

      {/* Side-by-Side Outcome Table */}
      {activeScenario && (
        <div className="space-y-4 font-sans">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between font-mono text-xs border-b border-slate-900 pb-2">
              <span className="font-bold text-cyan-300">{activeScenario.question}</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Confidence: {activeScenario.confidencePct}%
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800 font-mono text-xs">
              <table className="w-full text-left bg-slate-900/50">
                <thead className="bg-slate-900 border-b border-slate-800 text-[10px] text-slate-400 uppercase">
                  <tr>
                    <th className="p-3">Simulation Dimension</th>
                    <th className="p-3">Current Baseline</th>
                    <th className="p-3">Simulated Future State</th>
                    <th className="p-3">Delta Impact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {activeScenario.sideBySideOutcome.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/80">
                      <td className="p-3 font-bold text-purple-300">{row.metric}</td>
                      <td className="p-3 text-slate-400 font-sans">{row.currentBaseline}</td>
                      <td className="p-3 text-emerald-300 font-sans font-bold">{row.simulatedFuture}</td>
                      <td className="p-3">
                        <span
                          className={cn(
                            'px-2 py-0.5 rounded text-[10px] font-bold font-mono',
                            row.isPositive
                              ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                              : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                          )}
                        >
                          {row.impactDelta}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* AI Simulation Recommendation Box */}
            <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-xs font-mono flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-cyan-300 uppercase text-[9px] block">AI Scenario Recommendation:</span>
                <span className="text-slate-200 text-[11px] font-sans">{activeScenario.aiRecommendation}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
