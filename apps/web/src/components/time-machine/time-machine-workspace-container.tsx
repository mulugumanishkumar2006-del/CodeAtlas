'use client';

import React, { useState } from 'react';
import { TimeMachineCanvasPlayer } from './time-machine-canvas-player';
import { TimeMachineSideDiff } from './time-machine-side-diff';
import { TimeMachineStoryMode } from './time-machine-story-mode';
import { TimeMachineQA } from './time-machine-qa';
import {
  MOCK_CHECKPOINTS,
  MOCK_SIDE_DIFF,
  MOCK_STORY_CARDS,
  MOCK_EVOLUTION_QA,
} from './time-machine-mock-data';
import { History, Layers, BookOpen, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export function TimeMachineWorkspaceContainer() {
  const [activeTab, setActiveTab] = useState<'timeline' | 'diff' | 'story' | 'qa'>('timeline');
  const [selectedCheckpointId, setSelectedCheckpointId] = useState<string>(MOCK_CHECKPOINTS[MOCK_CHECKPOINTS.length - 1].id);

  return (
    <div className="flex flex-col h-screen w-full bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Top Header */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 shrink-0 font-mono">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-500 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <History className="w-5 h-5 text-cyan-400" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-black text-slate-100 tracking-tight leading-none">
                Repository Time Machine & Software Evolution Platform
              </h1>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                Interactive Evolutionary History
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-sans mt-0.5">
              Travel through the complete architectural, dependency, and performance evolution of your software system over time.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          {[
            { id: 'timeline', label: 'Cinematic Timeline Player', icon: History },
            { id: 'diff', label: 'Side-by-Side Time Diff', icon: Layers },
            { id: 'story', label: 'Engineering Story Mode', icon: BookOpen },
            { id: 'qa', label: 'AI Evolution Q&A', icon: Sparkles },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  'px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5',
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/10 text-cyan-200 border-cyan-500/30 font-bold shadow-md'
                    : 'bg-transparent text-slate-400 border-transparent hover:text-slate-200'
                )}
              >
                <Icon className="w-3.5 h-3.5 text-cyan-400" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Workspace */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
        {activeTab === 'timeline' && (
          <TimeMachineCanvasPlayer
            checkpoints={MOCK_CHECKPOINTS}
            selectedCheckpointId={selectedCheckpointId}
            onSelectCheckpoint={setSelectedCheckpointId}
          />
        )}

        {activeTab === 'diff' && <TimeMachineSideDiff diff={MOCK_SIDE_DIFF} />}

        {activeTab === 'story' && <TimeMachineStoryMode storyCards={MOCK_STORY_CARDS} />}

        {activeTab === 'qa' && <TimeMachineQA qaEntries={MOCK_EVOLUTION_QA} />}
      </div>
    </div>
  );
}
