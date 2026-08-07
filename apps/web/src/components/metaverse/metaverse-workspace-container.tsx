'use client';

import React from 'react';
import { MetaverseCityCanvas } from './metaverse-city-canvas';
import { MetaverseStoryMode } from './metaverse-story-mode';
import { MetaverseMultiplayerBar } from './metaverse-multiplayer-bar';
import { MetaversePortalDock } from './metaverse-portal-dock';
import {
  MOCK_CITY_BUILDINGS,
  MOCK_CITY_HIGHWAYS,
  MOCK_STORY_STEPS,
  MOCK_MULTIPLAYER_COLLABORATORS,
  MOCK_SUBSYSTEM_PORTALS,
} from './metaverse-mock-data';
import { Globe, Video, Users, Layers } from 'lucide-react';

export function MetaverseWorkspaceContainer() {
  return (
    <div className="flex flex-col h-screen w-full bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Top Header */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 shrink-0 font-mono">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-500 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Globe className="w-5 h-5 text-cyan-400" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-black text-slate-100 tracking-tight leading-none">
                Engineering Metaverse
              </h1>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                Flagship Immersive Software OS
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-sans mt-0.5">
              Explore software architecture as a living interactive city with AI story mode, live simulations, and real-time multiplayer collaboration.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Workspace */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
        <MetaverseMultiplayerBar collaborators={MOCK_MULTIPLAYER_COLLABORATORS} />

        <MetaverseCityCanvas buildings={MOCK_CITY_BUILDINGS} highways={MOCK_CITY_HIGHWAYS} />

        <MetaverseStoryMode steps={MOCK_STORY_STEPS} />

        <MetaversePortalDock portals={MOCK_SUBSYSTEM_PORTALS} />
      </div>
    </div>
  );
}
