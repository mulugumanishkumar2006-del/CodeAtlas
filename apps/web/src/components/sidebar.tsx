'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BetaFeedbackModal } from '@/components/ui/beta-feedback-modal';
import {
  LayoutDashboard,
  Building2,
  Sparkles,
  ShieldAlert,
  FileText,
  Users,
  BookOpen,
  Layers,
  FlaskConical,
  Zap,
  Compass,
  Settings,
  Network,
  Command,
  Activity,
  Bot,
} from 'lucide-react';

interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  shortcut: string;
  isHeader?: boolean;
}

const navigation: NavigationItem[] = [
  // CORE WORKFLOW HUBS
  { name: 'CORE WORKFLOW HUBS', href: '#', icon: LayoutDashboard, shortcut: '', isHeader: true },
  { name: 'Dashboard', href: '/', icon: LayoutDashboard, shortcut: '⌘1' },
  { name: 'Repositories & Software', href: '/repositories', icon: BookOpen, shortcut: '⌘2' },
  { name: 'Architecture Intelligence', href: '/architecture', icon: Layers, shortcut: '⌘4' },
  { name: 'Investigate & Call Flows', href: '/investigate', icon: FlaskConical, shortcut: '⌘5' },
  { name: 'Simulation Studio', href: '/simulate', icon: FlaskConical, shortcut: '⌘6' },
  { name: 'Autonomous Optimization', href: '/improve', icon: Zap, shortcut: '⌘7' },

  // INTELLIGENCE & GOVERNANCE
  { name: 'INTELLIGENCE & GOVERNANCE', href: '#', icon: ShieldAlert, shortcut: '', isHeader: true },
  { name: 'Cross-Org Risk Radar', href: '/risk', icon: ShieldAlert, shortcut: '⌘R' },
  { name: 'Governance & Compliance', href: '/governance', icon: FileText, shortcut: '⌘G' },
  { name: 'Team Intelligence', href: '/team-intelligence', icon: Users, shortcut: '⌘T' },
  { name: 'Knowledge Graph', href: '/knowledge', icon: Network, shortcut: '⌘K' },
  { name: 'AI CTO Advisor', href: '/ai-cto', icon: Sparkles, shortcut: '⌘AI' },
  { name: 'Executive Command Center', href: '/enterprise', icon: Building2, shortcut: '⌘W' },

  // WORKSPACE & TOOLING
  { name: 'WORKSPACE & TOOLING', href: '#', icon: Settings, shortcut: '', isHeader: true },
  { name: 'Unified Search', href: '/search', icon: Compass, shortcut: '⌘9' },
  { name: 'Settings', href: '/settings', icon: Settings, shortcut: '⌘S' },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isFeedbackOpen, setIsFeedbackOpen] = React.useState(false);

  return (
    <>
      <aside className="w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col h-screen shrink-0 font-sans z-20 select-none">
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/50">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-rose-500 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-sm tracking-wider text-white font-mono flex items-center gap-1">
                CODEATLAS
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
                  BETA
                </span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Software Intelligence Platform</span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-none font-mono text-xs">
          {navigation.map((item, idx) => {
            if (item.isHeader) {
              return (
                <div
                  key={idx}
                  className="px-3 pt-4 pb-1.5 text-[9.5px] font-black text-slate-500 uppercase tracking-widest"
                >
                  {item.name}
                </div>
              );
            }

            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all font-semibold ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-md shadow-cyan-500/5'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span className="truncate">{item.name}</span>
                </div>
                {item.shortcut && (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-500 font-bold shrink-0">
                    {item.shortcut}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Beta Feedback Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/30 font-mono text-xs space-y-2">
          <button
            onClick={() => setIsFeedbackOpen(true)}
            className="w-full p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 font-bold flex items-center justify-between transition-all"
          >
            <span>Give Beta Feedback</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 font-bold">Feedback</span>
          </button>
        </div>
      </aside>

      <BetaFeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
    </>
  );
}
