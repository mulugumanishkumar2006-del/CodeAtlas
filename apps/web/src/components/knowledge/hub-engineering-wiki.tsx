'use client';

import React, { useState } from 'react';
import { WikiPage, WikiSectionType } from './hub-types';
import { BookOpen, Sparkles, Clock, Edit, FileText, ChevronRight, Tag, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HubEngineeringWikiProps {
  wikiPages: WikiPage[];
}

const WIKI_SECTIONS: { id: WikiSectionType; label: string }[] = [
  { id: 'architecture', label: 'Architecture' },
  { id: 'repositories', label: 'Repositories' },
  { id: 'standards', label: 'Standards' },
  { id: 'guidelines', label: 'Guidelines' },
  { id: 'best_practices', label: 'Best Practices' },
  { id: 'runbooks', label: 'Runbooks' },
  { id: 'playbooks', label: 'Playbooks' },
  { id: 'troubleshooting', label: 'Troubleshooting' },
  { id: 'glossary', label: 'Glossary' },
  { id: 'policies', label: 'Engineering Policies' },
];

export function HubEngineeringWiki({ wikiPages }: HubEngineeringWikiProps) {
  const [selectedSection, setSelectedSection] = useState<WikiSectionType>('architecture');
  const [selectedPageId, setSelectedPageId] = useState<string>(wikiPages[0]?.id || '');

  const activePage = wikiPages.find((p) => p.id === selectedPageId) || wikiPages[0];

  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 font-sans shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-purple-400" />
          <h2 className="text-sm font-bold text-slate-100">
            Living Engineering Wiki & Automated Documentation Engine
          </h2>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] bg-purple-500/10 text-purple-300 border border-purple-500/30 font-mono">
          Continuously Maintained
        </span>
      </div>

      {/* 10 Wiki Section Buttons */}
      <div className="flex flex-wrap gap-1.5 font-mono text-xs">
        {WIKI_SECTIONS.map((sec) => (
          <button
            key={sec.id}
            onClick={() => setSelectedSection(sec.id)}
            className={cn(
              'px-3 py-1.5 rounded-lg border transition-all text-xs',
              selectedSection === sec.id
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 font-bold shadow-md'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
            )}
          >
            {sec.label}
          </button>
        ))}
      </div>

      {/* Split Screen Reader */}
      {activePage && (
        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4 font-sans text-xs">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 border-b border-slate-900 pb-3">
            <span>Engineering Wiki</span>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="capitalize text-purple-300 font-bold">{activePage.section}</span>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-slate-200 font-bold">{activePage.title}</span>
          </div>

          {/* Metadata Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-slate-400">
            <div className="flex items-center gap-3">
              <span>Author: <strong className="text-cyan-300">{activePage.author}</strong></span>
              <span>Version: <strong className="text-emerald-400">{activePage.version}</strong></span>
              <span>Updated: {activePage.lastUpdated}</span>
            </div>

            <div className="flex items-center gap-1">
              {activePage.tags.map((t, idx) => (
                <span key={idx} className="px-1.5 py-0.2 rounded bg-slate-900 text-slate-300 border border-slate-800 text-[9px]">
                  #{t}
                </span>
              ))}
            </div>
          </div>

          {/* AI Wiki Page Markdown Renderer Box */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3 font-sans leading-relaxed text-slate-200 text-xs">
            <div className="prose prose-invert max-w-none text-xs">
              <pre className="font-sans whitespace-pre-wrap leading-relaxed text-slate-200">
                {activePage.aiGeneratedContent}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
