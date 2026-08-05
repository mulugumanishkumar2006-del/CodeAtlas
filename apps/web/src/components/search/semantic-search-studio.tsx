'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Sparkles,
  ArrowRight,
  X,
  Maximize2,
  Minimize2,
  RotateCcw,
  Bot
} from 'lucide-react';
import { SearchLeftSidebar } from './search-left-sidebar';
import { SearchResultCard } from './search-result-card';
import { SearchInsightsDrawer } from './search-insights-drawer';
import {
  MOCK_SEARCH_RESULTS,
  MOCK_SEARCH_INSIGHTS,
  SearchResultItem,
  SearchModeType
} from './search-mock-data';

export function SemanticSearchStudio() {
  const router = useRouter();

  // State Management
  const [searchQuery, setSearchQuery] = useState<string>('Explain checkout architecture');
  const [selectedMode, setSelectedMode] = useState<SearchModeType>('Architecture');
  const [results, setResults] = useState<SearchResultItem[]>(MOCK_SEARCH_RESULTS);
  const [selectedItem, setSelectedItem] = useState<SearchResultItem | null>(MOCK_SEARCH_RESULTS[0]);

  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Filter results by searchQuery and selectedMode
  const filteredResults = results.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.type.toLowerCase().includes(q) ||
      item.aiSummary.toLowerCase().includes(q) ||
      item.layer.toLowerCase().includes(q)
    );
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  // Keyboard Shortcuts (Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchQuery('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={`flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans select-none ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Top Google/Raycast Style Search Header */}
      <div className="border-b border-slate-800/80 bg-slate-950/95 backdrop-blur-xl p-4 shrink-0 z-30 space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-3 max-w-5xl mx-auto">
          <div className="relative flex-1 flex items-center">
            <div className="absolute left-4 w-7 h-7 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center pointer-events-none shadow-md">
              <Search className="w-4 h-4 text-white" />
            </div>

            <input
              type="text"
              placeholder="Search CodeAtlas by Intent, Architecture, Concept, Behavior, API, DB, Risk (e.g. 'Explain checkout architecture', 'Which APIs call Redis?')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-10 py-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 font-mono shadow-2xl transition-all"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-4 text-slate-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </form>
      </div>

      {/* Main Workspace Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Categories Sidebar */}
        <SearchLeftSidebar
          selectedMode={selectedMode}
          onSelectMode={setSelectedMode}
          onSelectPresetQuery={(q) => setSearchQuery(q)}
          isOpen={leftSidebarOpen}
          onToggleOpen={() => setLeftSidebarOpen(!leftSidebarOpen)}
        />

        {/* Central Results List */}
        <div className="flex-1 h-full overflow-y-auto p-6 space-y-4 scrollbar-none font-sans">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex items-center justify-between font-mono text-xs text-slate-400 border-b border-slate-900 pb-2">
              <span>FOUND {filteredResults.length} INTENT RESULTS (<span className="text-cyan-400 font-bold">12ms response time</span>)</span>
              <span>MODE: <strong className="text-white uppercase">{selectedMode} SEARCH</strong></span>
            </div>

            {filteredResults.map((item) => (
              <SearchResultCard
                key={item.id}
                item={item}
                onSelect={(res) => setSelectedItem(res)}
              />
            ))}
          </div>
        </div>

        {/* Right AI Search Insights Drawer */}
        <SearchInsightsDrawer
          observations={MOCK_SEARCH_INSIGHTS}
        />
      </div>
    </div>
  );
}
