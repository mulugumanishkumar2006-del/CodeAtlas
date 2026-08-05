'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from './sidebar';
import { ProtectedRoute } from './protected-route';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { CommandPaletteModal } from '@/components/ui/command-palette-modal';
import { AiCommandCenterCopilot } from '@/components/ui/ai-command-center-copilot';
import {
  Menu,
  Search,
  Bell,
  Sparkles,
  LogOut,
  Command,
  ShieldCheck,
  GitBranch,
  Layers,
  Network,
  Zap,
  Globe,
  FlaskConical,
  Activity,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

export const ENGINEERING_JOURNEY_STEPS = [
  { step: 'Connect', route: '/repositories', icon: GitBranch },
  { step: 'Analyze', route: '/analyze', icon: Zap },
  { step: 'Understand', route: '/architecture', icon: Layers },
  { step: 'Investigate', route: '/investigate', icon: Globe },
  { step: 'Simulate', route: '/simulate', icon: FlaskConical },
  { step: 'Improve', route: '/improve', icon: Sparkles },
  { step: 'Monitor', route: '/monitor', icon: Activity },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const isAuthPage = pathname?.startsWith('/login');

  const getTitle = () => {
    if (!pathname || pathname === '/') return 'Dashboard Workflow';
    if (pathname.startsWith('/repositories')) return 'Repositories Workflow';
    if (pathname.startsWith('/analyze')) return 'Analyze Workflow';
    if (pathname.startsWith('/architecture')) return 'Architecture Workflow';
    if (pathname.startsWith('/dependency-graph')) return 'Dependency Intelligence Workflow';
    if (pathname.startsWith('/investigate')) return 'Investigate Workflow';
    if (pathname.startsWith('/simulate')) return 'Simulate Workflow';
    if (pathname.startsWith('/improve')) return 'Improve Workflow';
    if (pathname.startsWith('/monitor')) return 'Monitor Workflow';
    if (pathname.startsWith('/search')) return 'Search Workflow';
    if (pathname.startsWith('/architect')) return 'ADR Intelligence Workflow';
    if (pathname.startsWith('/are')) return 'Architecture Review Workflow';
    if (pathname.startsWith('/enterprise')) return 'Enterprise Architecture Workspace';
    if (pathname.startsWith('/settings')) return 'Platform Settings';
    return 'Software Intelligence Platform';
  };

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100 font-sans select-none">
        {/* Sidebar Component */}
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col overflow-hidden relative">
          {/* Top Header & Engineering Journey Stepper */}
          <header className="flex flex-col border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl shrink-0 z-30 font-sans">
            <div className="flex h-14 items-center justify-between px-6">
              {/* Left Title & Mobile Menu */}
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="lg:hidden bg-slate-900 border-slate-800 text-slate-300 hover:text-white"
                  onClick={() => setSidebarOpen(true)}
                  title="Open sidebar"
                >
                  <Menu className="h-5 w-5" />
                </Button>

                <div className="flex items-center gap-2">
                  <h1 className="text-sm font-black tracking-tight text-white">{getTitle()}</h1>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <ShieldCheck className="w-3 h-3" /> SOC2 Verified
                  </span>
                </div>
              </div>

              {/* Center Command Palette Search Trigger */}
              <div className="hidden md:flex items-center flex-1 max-w-sm mx-4">
                <button
                  onClick={() => setCommandPaletteOpen(true)}
                  className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 text-xs hover:border-cyan-500/40 hover:text-slate-200 transition-all shadow-inner font-mono"
                >
                  <div className="flex items-center gap-2">
                    <Search className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Search AST symbols, repos, ADRs...</span>
                  </div>
                  <kbd className="flex items-center gap-0.5 text-[10px] font-mono bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 text-slate-400">
                    <Command className="w-3 h-3" /> K
                  </kbd>
                </button>
              </div>

              {/* Right Profile & Notifications */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => router.push('/monitor')}
                  className="relative p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white transition-all"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4 text-slate-300" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400" />
                </button>

                {user && (
                  <div className="flex items-center gap-2 border-l border-slate-800/80 pl-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-xs font-black text-white shadow-md shadow-cyan-500/20">
                        {user.username?.charAt(0).toUpperCase() || 'E'}
                      </div>
                      <div className="hidden xl:flex flex-col">
                        <span className="text-xs font-bold text-white leading-none">
                          {user.username || 'Engineer'}
                        </span>
                        <span className="text-[9px] text-cyan-400 font-mono leading-tight">
                          Lead Architect
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={logout}
                      className="h-7 w-7 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl"
                      title="Sign out"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Continuous Engineering Journey Stepper Bar */}
            <div className="flex items-center gap-1 px-6 py-1.5 bg-slate-950/90 border-t border-slate-900 font-mono text-[11px] overflow-x-auto scrollbar-none">
              <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-wider mr-2 shrink-0">ENGINEERING JOURNEY:</span>

              {ENGINEERING_JOURNEY_STEPS.map((stepItem, idx) => {
                const SIcon = stepItem.icon;
                const isActive = pathname?.startsWith(stepItem.route);

                return (
                  <React.Fragment key={stepItem.step}>
                    <button
                      onClick={() => router.push(stepItem.route)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl transition-all font-bold shrink-0 ${
                        isActive
                          ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/40 shadow-inner'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                      }`}
                    >
                      <SIcon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                      <span>{stepItem.step}</span>
                    </button>
                    {idx < ENGINEERING_JOURNEY_STEPS.length - 1 && (
                      <ChevronRight className="w-3 h-3 text-slate-700 shrink-0" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </header>

          {/* Viewport Main Content Area */}
          <main className="flex-1 overflow-y-auto p-6 bg-slate-950 relative">{children}</main>

          {/* Persistent Floating AI Command Center Copilot */}
          <AiCommandCenterCopilot />

          {/* Raycast Command Palette Modal */}
          <CommandPaletteModal
            isOpen={commandPaletteOpen}
            onClose={() => setCommandPaletteOpen(false)}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}
