'use client';

import React, { useState } from 'react';
import {
  FileText,
  Search,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Clock,
  Filter
} from 'lucide-react';
import { AdrRecord } from './adr-mock-data';

interface AdrLeftSidebarProps {
  adrs: AdrRecord[];
  selectedAdrId: string | null;
  onSelectAdr: (id: string) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export function AdrLeftSidebar({
  adrs,
  selectedAdrId,
  onSelectAdr,
  isOpen,
  onToggleOpen,
}: AdrLeftSidebarProps) {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) {
    return (
      <button
        onClick={onToggleOpen}
        className="fixed left-4 top-28 z-40 p-2 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 hover:text-white shadow-xl"
        title="Open ADR Explorer"
      >
        <FileText className="w-5 h-5" />
      </button>
    );
  }

  const filteredAdrs = adrs.filter((adr) => {
    const matchesSearch =
      adr.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      adr.decisionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      adr.category.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeFilter === 'All') return matchesSearch;
    return matchesSearch && adr.status === activeFilter;
  });

  return (
    <div className="w-72 bg-slate-950/95 border-r border-slate-800/80 flex flex-col h-full shrink-0 select-none z-20 font-sans backdrop-blur-xl">
      {/* Header */}
      <div className="p-3 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
            <FileText className="w-4 h-4" />
          </div>
          <span className="text-xs font-black tracking-tight text-white uppercase">ADR SPECIFICATIONS</span>
        </div>
        <button
          onClick={onToggleOpen}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 text-xs font-mono"
        >
          ✕
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center border-b border-slate-800/80 p-1 bg-slate-950/60 font-mono text-[10px]">
        {(['All', 'Approved', 'Violated'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`flex-1 py-1 rounded-lg font-bold transition-all ${
              activeFilter === filter ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="p-2 border-b border-slate-900 font-mono text-xs">
        <div className="relative">
          <Search className="w-3 h-3 text-slate-500 absolute left-2.5 top-2" />
          <input
            type="text"
            placeholder="Filter ADRs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-7 pr-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-white focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>
      </div>

      {/* ADR List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5 scrollbar-none font-mono text-xs">
        {filteredAdrs.map((adr) => {
          const isSelected = selectedAdrId === adr.id;

          return (
            <button
              key={adr.id}
              onClick={() => onSelectAdr(adr.id)}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all ${
                isSelected
                  ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-200 font-bold'
                  : 'hover:bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2 truncate min-w-0">
                <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[9px] font-bold text-cyan-400 shrink-0">
                  {adr.decisionId}
                </span>
                <div className="flex flex-col min-w-0">
                  <span className="truncate text-[11px] font-bold text-slate-200">{adr.title}</span>
                  <span className="text-[9px] text-slate-500 truncate">{adr.category}</span>
                </div>
              </div>
              <span
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                  adr.status === 'Approved'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}
              >
                {adr.status}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
