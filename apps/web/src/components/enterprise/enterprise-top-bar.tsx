'use client';

import React from 'react';
import {
  Building2,
  BarChart3,
  Share2,
  Users,
  DollarSign,
  Sparkles,
  MessageSquare,
  ShieldCheck,
  Maximize2,
  Minimize2,
  RotateCcw,
  UserCheck
} from 'lucide-react';
import { ExecutiveRolePerspective, MOCK_ORG_METRICS } from './enterprise-mock-data';

export const ENTERPRISE_TABS = [
  { id: 'command_center', label: 'Org Command Center', icon: BarChart3 },
  { id: 'graph', label: 'Multi-Repo Graph Map', icon: Share2 },
  { id: 'teams', label: 'Team Workspaces', icon: Users },
  { id: 'whiteboard', label: 'Collaborative Whiteboard', icon: MessageSquare },
  { id: 'arb', label: 'ARB Governance & Tech Radar', icon: ShieldCheck },
  { id: 'ai_exec', label: 'Executive AI CTO Insights', icon: Sparkles },
];

export const EXECUTIVE_ROLES: ExecutiveRolePerspective[] = [
  'CTO',
  'VP Engineering',
  'Director of Architecture',
  'Engineering Manager',
  'Staff Engineer',
  'Principal Architect',
  'SRE Lead'
];

interface EnterpriseTopBarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  currentRole: ExecutiveRolePerspective;
  onSelectRole: (role: ExecutiveRolePerspective) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export function EnterpriseTopBar({
  currentTab,
  onSelectTab,
  currentRole,
  onSelectRole,
  isFullscreen,
  onToggleFullscreen,
}: EnterpriseTopBarProps) {
  return (
    <div className="flex flex-col border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl shrink-0 z-30 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5">
        {/* Org Title & KPIs */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5 shadow-md">
            <div className="p-1.5 bg-slate-950 rounded-[10px] text-cyan-400">
              <Building2 className="w-5 h-5" />
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-base tracking-tight">{MOCK_ORG_METRICS.orgName}</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                {MOCK_ORG_METRICS.healthGrade} ({MOCK_ORG_METRICS.healthScorePct}%)
              </span>
            </div>
            <span className="text-[10px] text-slate-400">
              1,042 Repositories • 18,420 Cross-Deps • Cloud Spend: {MOCK_ORG_METRICS.annualCloudSpend}
            </span>
          </div>
        </div>

        {/* Right Role Adapter & Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 font-mono text-xs">
            <UserCheck className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[10px] text-slate-500 font-bold uppercase">ROLE:</span>
            <select
              value={currentRole}
              onChange={(e) => onSelectRole(e.target.value as ExecutiveRolePerspective)}
              className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
            >
              {EXECUTIVE_ROLES.map((role) => (
                <option key={role} value={role} className="bg-slate-950 text-white">{role}</option>
              ))}
            </select>
          </div>

          <button
            onClick={onToggleFullscreen}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-1 px-4 py-1 bg-slate-950/60 border-t border-slate-900 font-mono text-xs overflow-x-auto scrollbar-none">
        {ENTERPRISE_TABS.map((tab) => {
          const TIcon = tab.icon;
          const isSelected = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                isSelected
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-inner'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <TIcon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
