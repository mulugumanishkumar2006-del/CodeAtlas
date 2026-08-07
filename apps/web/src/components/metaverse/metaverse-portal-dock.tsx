'use client';

import React from 'react';
import { SubsystemPortal } from './metaverse-types';
import { Layers, ArrowRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface MetaversePortalDockProps {
  portals: SubsystemPortal[];
}

export function MetaversePortalDock({ portals }: MetaversePortalDockProps) {
  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 font-sans shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-bold text-slate-100">
            Unified Software Metaverse Portals Dock (17 Subsystems)
          </h3>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 font-mono">
          One-Click Teleportation
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2.5 font-mono text-xs">
        {portals.map((p) => (
          <Link
            key={p.id}
            href={p.route}
            className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 hover:border-cyan-500/50 hover:bg-slate-900/80 transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-100 text-[11px] group-hover:text-cyan-300 transition-colors">
                {p.name}
              </span>
              <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            </div>
            <p className="text-[9px] text-slate-400 font-sans leading-tight">{p.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
