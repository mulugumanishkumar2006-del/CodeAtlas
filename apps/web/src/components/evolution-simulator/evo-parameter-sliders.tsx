'use client';

import React from 'react';
import { SimulationParameters } from './evo-types';
import { Sliders, Activity, Users, DollarSign, Rocket, ShieldAlert } from 'lucide-react';

interface EvoParameterSlidersProps {
  parameters: SimulationParameters;
  onChangeParameters: (params: SimulationParameters) => void;
}

export function EvoParameterSliders({ parameters, onChangeParameters }: EvoParameterSlidersProps) {
  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 font-sans shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-purple-400" />
          <h3 className="text-sm font-bold text-slate-100">
            Interactive Business & Engineering Simulation Controls
          </h3>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] bg-purple-500/10 text-purple-300 border border-purple-500/30 font-mono">
          Real-Time Recalculation
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        {/* Traffic QPS */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-300 font-bold flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>Traffic QPS Load:</span>
            </span>
            <span className="text-cyan-300 font-bold">{(parameters.trafficQps / 1000).toFixed(0)}k QPS</span>
          </div>
          <input
            type="range"
            min={10000}
            max={1000000}
            step={10000}
            value={parameters.trafficQps}
            onChange={(e) =>
              onChangeParameters({ ...parameters, trafficQps: parseInt(e.target.value) })
            }
            className="w-full h-2 rounded-lg bg-slate-900 accent-cyan-400 cursor-pointer"
          />
        </div>

        {/* Team Size */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-300 font-bold flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-purple-400" />
              <span>Team Engineers:</span>
            </span>
            <span className="text-purple-300 font-bold">{parameters.teamSizeEngineers} Engineers</span>
          </div>
          <input
            type="range"
            min={5}
            max={250}
            step={5}
            value={parameters.teamSizeEngineers}
            onChange={(e) =>
              onChangeParameters({ ...parameters, teamSizeEngineers: parseInt(e.target.value) })
            }
            className="w-full h-2 rounded-lg bg-slate-900 accent-purple-400 cursor-pointer"
          />
        </div>

        {/* Monthly Budget */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-300 font-bold flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>Monthly Cloud Budget:</span>
            </span>
            <span className="text-emerald-400 font-bold">${parameters.infraBudgetUsd}/mo</span>
          </div>
          <input
            type="range"
            min={1000}
            max={50000}
            step={1000}
            value={parameters.infraBudgetUsd}
            onChange={(e) =>
              onChangeParameters({ ...parameters, infraBudgetUsd: parseInt(e.target.value) })
            }
            className="w-full h-2 rounded-lg bg-slate-900 accent-emerald-400 cursor-pointer"
          />
        </div>

        {/* Deploy Frequency */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-300 font-bold flex items-center gap-1.5">
              <Rocket className="w-3.5 h-3.5 text-indigo-400" />
              <span>Deploy Cadence:</span>
            </span>
            <span className="text-indigo-300 font-bold">{parameters.deploymentFrequencyPerDay} Deploys/Day</span>
          </div>
          <input
            type="range"
            min={1}
            max={50}
            step={1}
            value={parameters.deploymentFrequencyPerDay}
            onChange={(e) =>
              onChangeParameters({ ...parameters, deploymentFrequencyPerDay: parseInt(e.target.value) })
            }
            className="w-full h-2 rounded-lg bg-slate-900 accent-indigo-400 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
