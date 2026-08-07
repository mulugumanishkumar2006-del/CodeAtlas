'use client';

import React, { useState } from 'react';
import {
  FolderGit2,
  Network,
  Box,
  FolderTree,
  FileCode2,
  Braces,
  Webhook,
  Database,
  Server,
  Rocket,
  Terminal,
  Compass,
  GitPullRequest,
  FileText,
  Layers,
  CheckCircle2,
  ShieldCheck,
  Zap,
  AlertTriangle,
  HelpCircle,
  BookMarked,
  Tag,
  ArrowLeftRight,
  Clock,
  BookOpen,
  Search,
  ChevronDown,
  ChevronRight,
  Star,
  Sparkles,
  Activity,
  CheckCircle,
  AlertCircle,
  FileCheck,
  Lock,
  Plus,
} from 'lucide-react';
import { DocPage, DocTypeId, DocTypeCategory } from './doc-types';
import { CATEGORY_DEFINITIONS, DOC_TYPES_REGISTRY } from './doc-mock-data';
import { cn } from '@/lib/utils';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  FolderGit2,
  Network,
  Box,
  FolderTree,
  FileCode2,
  Braces,
  Webhook,
  Database,
  Server,
  Rocket,
  Terminal,
  Compass,
  GitPullRequest,
  FileText,
  Layers,
  CheckCircle2,
  ShieldCheck,
  Zap,
  AlertTriangle,
  HelpCircle,
  BookMarked,
  Tag,
  ArrowLeftRight,
  Clock,
  BookOpen,
  FileCheck,
};

interface DocSidebarProps {
  docs: DocPage[];
  activeDocId: string;
  onSelectDoc: (id: string) => void;
  onOpenSearch: () => void;
  onOpenLiveSync: () => void;
  onOpenExplainer: () => void;
  isSyncing: boolean;
}

export function DocSidebar({
  docs,
  activeDocId,
  onSelectDoc,
  onOpenSearch,
  onOpenLiveSync,
  onOpenExplainer,
  isSyncing,
}: DocSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<DocTypeCategory, boolean>>({
    overview: true,
    architecture: true,
    code_reference: true,
    system_apis: true,
    infrastructure: false,
    guides: true,
    governance: false,
    changelog_handbook: false,
  });

  const toggleCategory = (cat: DocTypeCategory) => {
    setExpandedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const filteredDocs = docs.filter((d) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return d.title.toLowerCase().includes(q) || d.summary.toLowerCase().includes(q) || d.typeId.includes(q);
  });

  const favorites = docs.filter((d) => d.isFavorite || d.isBookmarked);

  return (
    <aside className="w-80 border-r border-slate-800/80 bg-slate-950/90 flex flex-col h-full font-sans select-none shrink-0">
      {/* Header & Quick Action */}
      <div className="p-4 border-b border-slate-800/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-0.5 shadow-md shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-1.5 leading-none">
                Doc Engineer
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  AI Live
                </span>
              </h2>
              <p className="text-[10px] text-slate-400 font-mono">CodeAtlas Auto-Sync Docs</p>
            </div>
          </div>

          <button
            onClick={onOpenLiveSync}
            className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-[10px] font-mono font-medium text-slate-300 hover:text-cyan-300 transition-colors"
            title="Live Sync Drawer"
          >
            <span className="relative flex h-2 w-2">
              <span
                className={cn(
                  'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
                  isSyncing ? 'bg-amber-400' : 'bg-emerald-400'
                )}
              />
              <span
                className={cn(
                  'relative inline-flex rounded-full h-2 w-2',
                  isSyncing ? 'bg-amber-500' : 'bg-emerald-500'
                )}
              />
            </span>
            {isSyncing ? 'Syncing...' : 'Live Sync'}
          </button>
        </div>

        {/* Search Bar launcher */}
        <div className="flex gap-2">
          <button
            onClick={onOpenSearch}
            className="flex-1 flex items-center justify-between px-3 py-2 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-all font-mono shadow-inner group"
          >
            <span className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
              <span>Search documentation...</span>
            </span>
            <kbd className="px-1.5 py-0.5 text-[9px] bg-slate-950 border border-slate-800 rounded text-slate-500">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* AI Explainer Shortcut Button */}
        <button
          onClick={onOpenExplainer}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-600/20 via-indigo-600/20 to-purple-600/20 border border-cyan-500/30 hover:border-cyan-400/60 text-xs font-semibold text-cyan-200 transition-all shadow-lg shadow-cyan-950/50 group"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform" />
          <span>Ask AI Explanation</span>
        </button>
      </div>

      {/* Navigation Tree */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4 font-mono text-xs scrollbar-thin scrollbar-thumb-slate-800">
        {/* Favorites section */}
        {favorites.length > 0 && !searchTerm && (
          <div className="space-y-1">
            <div className="px-2 py-1 text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Star className="w-3 h-3 fill-amber-400/20 text-amber-400" />
              <span>Pinned & Favorites</span>
            </div>
            <div className="space-y-0.5">
              {favorites.map((doc) => {
                const IconComponent = ICON_MAP[doc.icon] || FileText;
                const isActive = doc.id === activeDocId;
                return (
                  <button
                    key={`fav-${doc.id}`}
                    onClick={() => onSelectDoc(doc.id)}
                    className={cn(
                      'w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-all text-[11px]',
                      isActive
                        ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/10 text-amber-200 border border-amber-500/30 font-semibold'
                        : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                    )}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <IconComponent className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">{doc.title}</span>
                    </div>
                    <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 shrink-0">
                      {doc.aiConfidence}%
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Categories & 25 Document Types */}
        <div className="space-y-3">
          <div className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>25 AI Document Types</span>
            <span className="text-[9px] text-cyan-400 font-mono">25/25 Auto-Synced</span>
          </div>

          {CATEGORY_DEFINITIONS.map((cat) => {
            const catDocs = filteredDocs.filter((d) => d.category === cat.id);
            if (catDocs.length === 0) return null;
            const isExpanded = expandedCategories[cat.id] ?? true;

            return (
              <div key={cat.id} className="space-y-1">
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(cat.id)}
                  className="w-full flex items-center justify-between px-2 py-1 text-slate-300 hover:text-white font-semibold text-[11px] group rounded-md hover:bg-slate-900/50"
                >
                  <div className="flex items-center gap-2">
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-300" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-300" />
                    )}
                    <span>{cat.label}</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] bg-slate-900 text-slate-400 border border-slate-800">
                    {catDocs.length}
                  </span>
                </button>

                {/* Category Items */}
                {isExpanded && (
                  <div className="pl-3 space-y-0.5 border-l border-slate-800/80 ml-3">
                    {catDocs.map((doc) => {
                      const IconComponent = ICON_MAP[doc.icon] || FileText;
                      const isActive = doc.id === activeDocId;

                      return (
                        <button
                          key={doc.id}
                          onClick={() => onSelectDoc(doc.id)}
                          className={cn(
                            'w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-all text-xs group relative',
                            isActive
                              ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/10 text-cyan-200 border border-cyan-500/30 font-bold shadow-md shadow-cyan-950/40'
                              : 'text-slate-400 hover:bg-slate-900/80 hover:text-slate-200'
                          )}
                        >
                          {isActive && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-cyan-400 rounded-r-full shadow-lg shadow-cyan-400/50" />
                          )}
                          <div className="flex items-center gap-2 min-w-0 pr-1">
                            <IconComponent
                              className={cn(
                                'w-3.5 h-3.5 shrink-0 transition-colors',
                                isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'
                              )}
                            />
                            <span className="truncate">{doc.title}</span>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            {doc.approvalStatus === 'live' && (
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Live Approved" />
                            )}
                            {doc.approvalStatus === 'in_review' && (
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="Pending Review" />
                            )}
                            <span
                              className={cn(
                                'text-[9px] font-mono px-1 rounded',
                                isActive
                                  ? 'bg-cyan-500/20 text-cyan-300'
                                  : 'text-slate-500 group-hover:text-slate-400'
                              )}
                            >
                              {doc.aiConfidence}%
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950 text-[10px] text-slate-400 flex items-center justify-between font-mono">
        <span className="flex items-center gap-1.5">
          <Activity className="w-3 h-3 text-cyan-400" />
          <span>Continuous Indexing</span>
        </span>
        <span className="text-emerald-400 font-bold">100% HEALTH</span>
      </div>
    </aside>
  );
}
