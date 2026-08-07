'use client';

import React, { useState } from 'react';
import { CityBuilding, CityTrafficHighway } from './metaverse-types';
import { Globe, Building2, Database, Radio, Server, Activity, Flame, ShieldAlert, Sparkles, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetaverseCityCanvasProps {
  buildings: CityBuilding[];
  highways: CityTrafficHighway[];
}

export function MetaverseCityCanvas({ buildings, highways }: MetaverseCityCanvasProps) {
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>(buildings[2]?.id || buildings[0]?.id || '');

  const activeBuilding = buildings.find((b) => b.id === selectedBuildingId) || buildings[0];

  const getBuildingIcon = (type: CityBuilding['buildingType']) => {
    switch (type) {
      case 'gateway_tower': return Globe;
      case 'database_datacenter': return Database;
      case 'kafka_highway': return Radio;
      case 'cloud_cluster': return Server;
      default: return Building2;
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 font-sans shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3 font-mono">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-cyan-400" />
          <h2 className="text-sm font-bold text-slate-100">
            Software City 3D Topology Canvas & Animated Traffic Flow
          </h2>
        </div>

        <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono">
          60 FPS Interactive Environment
        </span>
      </div>

      {/* Building Selector Buttons */}
      <div className="space-y-2 font-mono text-xs">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          Select City Building to Inspect Telemetry:
        </span>

        <div className="flex flex-wrap gap-2">
          {buildings.map((b) => {
            const Icon = getBuildingIcon(b.buildingType);
            return (
              <button
                key={b.id}
                onClick={() => setSelectedBuildingId(b.id)}
                className={cn(
                  'px-3 py-1.5 rounded-xl border transition-all text-xs flex items-center gap-1.5',
                  selectedBuildingId === b.id
                    ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/10 text-cyan-300 border-cyan-500/40 font-bold shadow-md'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                )}
              >
                <Icon className="w-3.5 h-3.5 text-cyan-400" />
                <span>{b.name}</span>
                <span
                  className={cn(
                    'w-2 h-2 rounded-full',
                    b.status === 'vibrant_healthy'
                      ? 'bg-emerald-400'
                      : b.status === 'degraded_warning'
                      ? 'bg-amber-400'
                      : 'bg-rose-500 animate-pulse'
                  )}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Building Inspector */}
      {activeBuilding && (
        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4 font-sans text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-900 pb-3 font-mono">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                {activeBuilding.name}
                <span
                  className={cn(
                    'px-2 py-0.5 rounded text-[9px] font-bold uppercase border',
                    activeBuilding.status === 'vibrant_healthy'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : activeBuilding.status === 'degraded_warning'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
                  )}
                >
                  {activeBuilding.status}
                </span>
              </h3>
              <p className="text-[10px] text-slate-400">Team Owner: <strong className="text-slate-200">{activeBuilding.ownerTeam}</strong></p>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-500 block">QPS:</span>
                <strong className="text-cyan-300 font-bold">{(activeBuilding.qps / 1000).toFixed(0)}k</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">P95 Latency:</span>
                <strong className="text-emerald-400 font-bold">{activeBuilding.p95LatencyMs} ms</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Tech Debt:</span>
                <strong className="text-amber-400 font-bold">{activeBuilding.techDebtHours}h</strong>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-sans">{activeBuilding.buildingDescription}</p>
        </div>
      )}
    </div>
  );
}
