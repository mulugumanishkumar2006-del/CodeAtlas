'use client';

import React, { useState } from 'react';
import { AiSreQA } from './chaos-types';
import { Sparkles, Send, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChaosAiAssistantProps {
  qaEntries: AiSreQA[];
}

export function ChaosAiAssistant({ qaEntries }: ChaosAiAssistantProps) {
  const [selectedQuestion, setSelectedQuestion] = useState(qaEntries[0]?.question || '');
  const [customInput, setCustomInput] = useState('');
  const [isQuerying, setIsQuerying] = useState(false);

  const activeQA = qaEntries.find((q) => q.question === selectedQuestion) || qaEntries[0];

  const handleQuery = (qToUse?: string) => {
    const q = qToUse || customInput || selectedQuestion;
    setIsQuerying(true);
    setTimeout(() => {
      setIsQuerying(false);
    }, 400);
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 font-sans shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-slate-100">
            AI SRE Resilience Assistant
          </h3>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono">
          AI Resilience Evaluation
        </span>
      </div>

      {/* Preset Questions */}
      <div className="space-y-2 font-mono text-xs">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          Ask AI SRE Assistant Questions:
        </span>
        <div className="flex flex-wrap gap-2">
          {qaEntries.map((qItem, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedQuestion(qItem.question);
                setCustomInput('');
                handleQuery(qItem.question);
              }}
              className={cn(
                'px-3 py-1.5 rounded-lg border transition-all text-xs text-left',
                selectedQuestion === qItem.question && !customInput
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold shadow-md'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              )}
            >
              {qItem.question}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Input */}
      <div className="flex gap-2 font-mono">
        <input
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          placeholder="Ask AI SRE (e.g. 'Predict recovery time if Kafka broker restarts during 100k QPS')..."
          className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
          onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
        />
        <button
          onClick={() => handleQuery()}
          disabled={isQuerying}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 font-bold text-xs text-white shadow-lg flex items-center gap-1.5 hover:opacity-90 disabled:opacity-50"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{isQuerying ? 'Evaluating...' : 'Ask AI SRE'}</span>
        </button>
      </div>

      {/* Answer & Telemetry Evidence Card */}
      {activeQA && (
        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-sans text-xs">
          <div className="flex items-center justify-between border-b border-slate-900 pb-2 font-mono">
            <span className="font-bold text-cyan-300 text-xs">{activeQA.question}</span>
            <span className="px-2.5 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Confidence: {activeQA.confidencePct}%
            </span>
          </div>

          <p className="text-slate-200 font-sans text-xs leading-relaxed">{activeQA.answerSummary}</p>

          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 font-mono text-xs space-y-1">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
              Telemetry Verification:
            </span>
            <p className="text-slate-300 text-[11px] font-sans">{activeQA.evidenceTelemetry}</p>
          </div>
        </div>
      )}
    </div>
  );
}
