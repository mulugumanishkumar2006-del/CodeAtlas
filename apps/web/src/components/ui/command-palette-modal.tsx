'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Command,
  Zap,
  Layers,
  Network,
  Globe,
  FlaskConical,
  FileText,
  ShieldCheck,
  Flame,
  X,
  ArrowRight
} from 'lucide-react';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPaletteModal({ isOpen, onClose }: CommandPaletteModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    { label: 'Search Architecture & Entities', icon: Search, shortcut: 'Enter', route: `/search?q=${encodeURIComponent(query)}` },
    { label: 'Open Architecture Explorer', icon: Layers, shortcut: '⌘A', route: '/architecture' },
    { label: 'Open Knowledge Graph Intelligence', icon: Network, shortcut: '⌘K', route: '/knowledge' },
    { label: 'Open Dependency Intelligence', icon: Zap, shortcut: '⌘D', route: '/dependency-graph' },
    { label: 'Open Call Flow & Execution Intelligence', icon: Globe, shortcut: '⌘E', route: '/investigate' },
    { label: 'Open Scenario Simulator', icon: FlaskConical, shortcut: '⌘S', route: '/simulate' },
    { label: 'Open AI Architecture Decisions (ADR)', icon: FileText, shortcut: '⌘R', route: '/architect' },
    { label: 'Open AI Architecture Review & Critique', icon: ShieldCheck, shortcut: '⌘V', route: '/are' },
    { label: 'Open Enterprise Workspace', icon: Command, shortcut: '⌘W', route: '/enterprise' },
  ];

  const filteredActions = actions.filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/80 backdrop-blur-md p-4 font-sans select-none">
      <div className="w-full max-w-xl bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden space-y-2 animate-in zoom-in-95 duration-150">
        {/* Search Bar Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800/80 bg-slate-900/60">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            type="text"
            placeholder="Type a command or search AST symbols, microservices, ADRs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none font-mono"
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Command Actions List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1 scrollbar-none font-mono text-xs">
          {filteredActions.map((act) => {
            const AIcon = act.icon;
            return (
              <button
                key={act.label}
                onClick={() => {
                  router.push(act.route);
                  onClose();
                }}
                className="w-full flex items-center justify-between p-3 rounded-2xl text-left hover:bg-slate-900 text-slate-300 hover:text-white transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 group-hover:border-cyan-500/40">
                    <AIcon className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-slate-200 group-hover:text-cyan-200">{act.label}</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                  {act.shortcut}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
