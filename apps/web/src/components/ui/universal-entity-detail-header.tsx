'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  FlaskConical,
  Zap,
  Search,
  Network,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Building2,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UniversalEntityDetailHeaderProps {
  entityName: string;
  entityType: 'REPOSITORY' | 'SERVICE' | 'SYSTEM' | 'APPLICATION' | 'API' | 'DATABASE' | 'DEPENDENCY' | 'TEAM' | 'RISK' | 'POLICY' | 'SCENARIO' | 'OPTIMIZATION';
  owner?: string;
  healthScore?: number;
  riskLevel?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status?: string;
  lastUpdated?: string;
  onOpenGraphDrawer?: () => void;
}

export function UniversalEntityDetailHeader({
  entityName,
  entityType,
  owner = 'Platform Core Team',
  healthScore = 92.4,
  riskLevel = 'HIGH',
  status = 'ACTIVE',
  lastUpdated = '2026-08-08',
  onOpenGraphDrawer,
}: UniversalEntityDetailHeaderProps) {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'CRITICAL':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'HIGH':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'MEDIUM':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      default:
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    }
  };

  return (
    <div className="w-full p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 space-y-4 font-mono shadow-xl">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold uppercase">
              {entityType}
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded border font-bold uppercase ${getRiskColor(riskLevel)}`}>
              RISK: {riskLevel}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800 font-bold uppercase">
              STATUS: {status}
            </span>
          </div>
          <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            {entityName}
          </h1>
          <div className="flex items-center gap-4 text-slate-400 font-sans text-xs pt-1">
            <span>Owner: <strong className="text-slate-200 font-mono">{owner}</strong></span>
            <span>Health Score: <strong className="text-emerald-400 font-mono">{healthScore}/100</strong></span>
            <span>Updated: <strong className="text-slate-200 font-mono">{lastUpdated}</strong></span>
          </div>
        </div>

        {/* 1-Click Contextual Action Bar */}
        <div className="flex items-center gap-2 flex-wrap">
          <Link href={`/investigate?entity=${encodeURIComponent(entityName)}`}>
            <Button size="sm" variant="outline" className="bg-slate-950 border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/40 text-xs font-mono h-8">
              <FlaskConical className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
              Investigate
            </Button>
          </Link>

          <Link href={`/simulate?target=${encodeURIComponent(entityName)}`}>
            <Button size="sm" variant="outline" className="bg-slate-950 border-slate-800 text-slate-300 hover:text-white hover:border-indigo-500/40 text-xs font-mono h-8">
              <Zap className="w-3.5 h-3.5 mr-1.5 text-indigo-400" />
              Simulate Change
            </Button>
          </Link>

          <Link href={`/improve?entity=${encodeURIComponent(entityName)}`}>
            <Button size="sm" variant="outline" className="bg-slate-950 border-slate-800 text-slate-300 hover:text-white hover:border-amber-500/40 text-xs font-mono h-8">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
              Optimize
            </Button>
          </Link>

          <Link href={`/ai-cto?prompt=${encodeURIComponent(`Explain risks and recommendations for ${entityName}`)}`}>
            <Button size="sm" variant="outline" className="bg-slate-950 border-slate-800 text-slate-300 hover:text-white hover:border-rose-500/40 text-xs font-mono h-8">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-rose-400" />
              Ask AI CTO
            </Button>
          </Link>

          {onOpenGraphDrawer && (
            <Button size="sm" onClick={onOpenGraphDrawer} className="bg-cyan-500/10 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 text-xs font-mono h-8">
              <Network className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
              Graph Context
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
