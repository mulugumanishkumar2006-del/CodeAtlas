'use client';

import React, { useState } from 'react';
import { StoryModeTourStep } from './metaverse-types';
import { Sparkles, Play, ChevronRight, ChevronLeft, ArrowRight, Video } from 'lucide-react';
import Link from 'next/link';

interface MetaverseStoryModeProps {
  steps: StoryModeTourStep[];
}

export function MetaverseStoryMode({ steps }: MetaverseStoryModeProps) {
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);

  const activeStep = steps[currentStepIdx] || steps[0];

  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 font-sans shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono">
        <div className="flex items-center gap-2">
          <Video className="w-5 h-5 text-purple-400" />
          <h3 className="text-sm font-bold text-slate-100">
            AI Story Mode (Interactive Engineering Documentary)
          </h3>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] bg-purple-500/10 text-purple-300 border border-purple-500/30 font-mono">
          Guided AI Documentary
        </span>
      </div>

      {activeStep && (
        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-sans text-xs">
          <div className="flex justify-between items-center border-b border-slate-900 pb-2 font-mono">
            <span className="font-bold text-cyan-300 text-xs flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Step {activeStep.stepIndex} of {steps.length}: {activeStep.title}</span>
            </span>

            <div className="flex items-center gap-1 font-mono">
              <button
                onClick={() => setCurrentStepIdx(Math.max(0, currentStepIdx - 1))}
                disabled={currentStepIdx === 0}
                className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-slate-100 disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentStepIdx(Math.min(steps.length - 1, currentStepIdx + 1))}
                disabled={currentStepIdx === steps.length - 1}
                className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-slate-100 disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <p className="text-slate-200 text-xs font-sans leading-relaxed text-sm italic">
            "{activeStep.narrationText}"
          </p>

          <div className="pt-2">
            <Link
              href={activeStep.subsystemLink}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 font-bold text-xs text-white shadow-lg hover:opacity-90 transition-all font-mono"
            >
              <span>{activeStep.actionText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
