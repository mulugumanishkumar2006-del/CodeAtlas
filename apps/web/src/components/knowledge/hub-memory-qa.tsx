'use client';

import React, { useState } from 'react';
import { EngineeringMemoryQA } from './hub-types';
import { Brain, Sparkles, Send, CheckCircle2, ArrowRight, BookOpen, ExternalLink, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HubMemoryQAProps {
  memoryEntries: EngineeringMemoryQA[];
}

const PRESET_MEMORY_QUESTIONS = [
  'Why was Kafka adopted for PaymentService checkout processing?',
  'Who introduced the Redis cache eviction fallback mechanism and why?',
  'Why was PostgreSQL chosen over MongoDB for billing ledgers?',
  'What changed before Release v4.8.0-rc2?',
];

export function HubMemoryQA({ memoryEntries }: HubMemoryQAProps) {
  const [selectedQuestion, setSelectedQuestion] = useState(memoryEntries[0]?.question || '');
  const [customQuery, setCustomQuery] = useState('');
  const [isQuerying, setIsQuerying] = useState(false);

  const activeQA = memoryEntries.find((m) => m.question === selectedQuestion) || memoryEntries[0];

  const handleQuery = (qToUse?: string) => {
    const q = qToUse || customQuery || selectedQuestion;
    setIsQuerying(true);
    setTimeout(() => {
      setIsQuerying(false);
    }, 400);
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 font-sans shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-indigo-400" />
          <h2 className="text-sm font-bold text-slate-100">
            Engineering Memory Q&A Engine (Permanent Organizational Memory)
          </h2>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 font-mono">
          Connected Reasoning
        </span>
      </div>

      {/* Preset Questions Bar */}
      <div className="space-y-2 font-mono text-xs">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          Ask Engineering Memory Preset Questions:
        </label>
        <div className="flex flex-wrap gap-2">
          {PRESET_MEMORY_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedQuestion(q);
                setCustomQuery('');
                handleQuery(q);
              }}
              className={cn(
                'px-3 py-1.5 rounded-lg border transition-all text-xs text-left',
                selectedQuestion === q && !customQuery
                  ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 font-bold shadow-md'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              )}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Query Input */}
      <div className="flex gap-2 font-mono">
        <input
          type="text"
          value={customQuery}
          onChange={(e) => setCustomQuery(e.target.value)}
          placeholder="Ask engineering memory (e.g. 'Why did we refactor PaymentService in PR #482?')..."
          className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
          onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
        />
        <button
          onClick={() => handleQuery()}
          disabled={isQuerying}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 font-bold text-xs text-white shadow-lg flex items-center gap-1.5 hover:opacity-90 disabled:opacity-50"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{isQuerying ? 'Searching...' : 'Ask Memory'}</span>
        </button>
      </div>

      {/* Answer & Connected Reasoning Card */}
      {activeQA && (
        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4 font-sans text-xs">
          <div className="flex items-center justify-between border-b border-slate-900 pb-3 font-mono">
            <span className="font-bold text-cyan-300 text-xs flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>{activeQA.question}</span>
            </span>

            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Confidence: {activeQA.confidencePct}%
            </span>
          </div>

          {/* Answer Summary */}
          <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider block">
              AI Answer Summary:
            </span>
            <p className="text-slate-200 leading-relaxed font-sans text-xs">{activeQA.answerSummary}</p>
          </div>

          {/* Connected Reasoning Chain */}
          <div className="p-3.5 rounded-lg bg-slate-900/40 border border-slate-800 space-y-2 font-mono">
            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">
              Connected Reasoning Chain & Timeline:
            </span>
            <ul className="space-y-1 text-slate-300 text-[11px]">
              {activeQA.reasoningChain.map((step, sIdx) => (
                <li key={sIdx} className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-[9px] text-cyan-400 shrink-0 mt-0.5">
                    {sIdx + 1}
                  </span>
                  <span className="text-slate-300 leading-relaxed font-sans">{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Source Artifacts */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-900 font-mono text-[11px]">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 uppercase font-bold text-[9px]">Source Artifacts:</span>
              {activeQA.sourceArtifacts.map((art, aIdx) => (
                <a
                  key={aIdx}
                  href={art.link}
                  className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300 hover:text-white flex items-center gap-1 text-[10px]"
                >
                  <BookOpen className="w-3 h-3" />
                  <span>{art.title}</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              ))}
            </div>

            <div className="text-[10px] text-slate-400">
              Key Contributors: <strong className="text-slate-200">{activeQA.keyContributors.join(', ')}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
