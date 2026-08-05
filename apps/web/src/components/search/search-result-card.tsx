'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Layers,
  Network,
  Zap,
  FlaskConical,
  FileText,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Globe,
  Database,
  HardDrive,
  Box,
  Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchResultItem } from './search-mock-data';

interface SearchResultCardProps {
  item: SearchResultItem;
  onSelect: (item: SearchResultItem) => void;
}

export function SearchResultCard({ item, onSelect }: SearchResultCardProps) {
  const router = useRouter();

  let riskBadge = (
    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-mono font-bold">
      LOW RISK
    </span>
  );
  if (item.riskRating === 'High' || item.riskRating === 'Critical') {
    riskBadge = (
      <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[9px] font-mono font-bold animate-pulse">
        {item.riskRating.toUpperCase()} RISK
      </span>
    );
  } else if (item.riskRating === 'Medium') {
    riskBadge = (
      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-mono font-bold">
        MEDIUM RISK
      </span>
    );
  }

  return (
    <div
      onClick={() => onSelect(item)}
      className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 backdrop-blur-xl transition-all duration-200 shadow-xl space-y-4 cursor-pointer group hover:bg-slate-900/95"
    >
      {/* Card Header */}
      <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 shadow-inner group-hover:border-cyan-500/40">
            {item.type === 'Database' ? (
              <Database className="w-5 h-5 text-yellow-400" />
            ) : item.type === 'Cache' ? (
              <HardDrive className="w-5 h-5 text-rose-400" />
            ) : item.type === 'Microservice' ? (
              <Zap className="w-5 h-5 text-emerald-400" />
            ) : item.type === 'REST API' ? (
              <Globe className="w-5 h-5 text-teal-400" />
            ) : (
              <FileText className="w-5 h-5 text-cyan-400" />
            )}
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                {item.type} • {item.layer}
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                {item.repository}
              </span>
            </div>
            <h3 className="text-base font-black text-white tracking-tight leading-snug group-hover:text-cyan-200 transition-colors">
              {item.title}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {riskBadge}
          <span className="px-2.5 py-0.5 rounded-full bg-slate-950 text-cyan-400 border border-slate-800 text-[10px] font-mono font-bold">
            Health: {item.healthScorePct}%
          </span>
        </div>
      </div>

      {/* AI Summary */}
      <p className="text-xs text-slate-300 font-sans leading-relaxed">
        {item.aiSummary}
      </p>

      {/* Relationships Pills */}
      {item.relationships.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 font-mono text-[10px]">
          <span className="text-slate-500 font-bold uppercase text-[9px]">RELATIONSHIPS:</span>
          {item.relationships.map((rel, idx) => (
            <span key={idx} className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
              <span className="text-cyan-400 font-bold">{rel.label}</span> ➔ {rel.targetName}
            </span>
          ))}
        </div>
      )}

      {/* 1-Click Intelligent Navigation Bar */}
      <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-800/60 font-mono text-xs">
        <span className="text-[10px] font-bold text-slate-500 uppercase mr-1">1-CLICK JUMP:</span>

        <Button
          onClick={(e) => {
            e.stopPropagation();
            router.push(item.navigationTarget.architectureUrl);
          }}
          className="bg-cyan-500/15 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold text-[11px] gap-1 h-7 rounded-xl"
        >
          <Layers className="w-3 h-3" /> Architecture
        </Button>

        <Button
          onClick={(e) => {
            e.stopPropagation();
            router.push(item.navigationTarget.knowledgeUrl);
          }}
          className="bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold text-[11px] gap-1 h-7 rounded-xl"
        >
          <Network className="w-3 h-3" /> Knowledge Graph
        </Button>

        <Button
          onClick={(e) => {
            e.stopPropagation();
            router.push(item.navigationTarget.dependencyUrl);
          }}
          className="bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold text-[11px] gap-1 h-7 rounded-xl"
        >
          <Zap className="w-3 h-3" /> Dependencies
        </Button>

        <Button
          onClick={(e) => {
            e.stopPropagation();
            router.push(item.navigationTarget.executionUrl);
          }}
          className="bg-indigo-500/15 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 font-bold text-[11px] gap-1 h-7 rounded-xl"
        >
          <Globe className="w-3 h-3" /> Execution Flow
        </Button>

        <Button
          onClick={(e) => {
            e.stopPropagation();
            router.push(item.navigationTarget.simulationUrl);
          }}
          className="bg-purple-500/15 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 font-bold text-[11px] gap-1 h-7 rounded-xl ml-auto"
        >
          <FlaskConical className="w-3 h-3" /> Simulate
        </Button>
      </div>
    </div>
  );
}
