'use client';

import React from 'react';
import { MultiplayerCollaborator } from './metaverse-types';
import { Users, Mic, Volume2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetaverseMultiplayerBarProps {
  collaborators: MultiplayerCollaborator[];
}

export function MetaverseMultiplayerBar({ collaborators }: MetaverseMultiplayerBarProps) {
  return (
    <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3 font-sans shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 font-mono">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-slate-100">
            Multiplayer Live Engineering Room ({collaborators.length} Active Engineers)
          </span>
        </div>

        <span className="px-2 py-0.5 rounded text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono flex items-center gap-1">
          <Mic className="w-3 h-3 text-emerald-400" />
          <span>Voice Connected</span>
        </span>
      </div>

      <div className="flex flex-wrap gap-2 font-mono text-xs">
        {collaborators.map((c) => (
          <div key={c.id} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-2">
            <span className={cn('w-2.5 h-2.5 rounded-full', c.avatarColor)} />
            <div>
              <span className="font-bold text-slate-100 text-[11px] block">{c.name}</span>
              <span className="text-[9px] text-slate-400 font-sans">{c.role}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
