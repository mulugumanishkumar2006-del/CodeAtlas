'use client';

import React, { useState } from 'react';
import { AIDeploymentAdvice } from './release-types';
import { Bot, X, Send, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReleaseAIAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  advice: AIDeploymentAdvice;
}

const PRESET_ADVISOR_QUESTIONS = [
  'Can we deploy today?',
  'Should this release be postponed?',
  'What is the biggest deployment risk?',
  'Which microservice worries you?',
  'What changed since the previous release?',
];

export function ReleaseAIAdvisorModal({
  isOpen,
  onClose,
  advice,
}: ReleaseAIAdvisorModalProps) {
  const [selectedQuestion, setSelectedQuestion] = useState(advice.question);
  const [customQuestion, setCustomQuestion] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentAdvice, setCurrentAdvice] = useState<AIDeploymentAdvice>(advice);

  if (!isOpen) return null;

  const handleAsk = (qToUse?: string) => {
    const q = qToUse || customQuestion || selectedQuestion;
    setIsGenerating(true);
    setTimeout(() => {
      let verdict: 'DEPLOY_NOW' | 'PROCEED_WITH_CAUTION' | 'POSTPONE_RELEASE' = 'DEPLOY_NOW';
      let recText = '';
      let riskText = '';
      let serviceText = '';

      if (q.includes('postponed')) {
        verdict = 'DEPLOY_NOW';
        recText = 'NO NEED TO POSTPONE. Pre-deployment analysis confirms all 42 automated tests pass with 0 critical OWASP vulnerabilities. Latency is predicted to drop by 92%.';
        riskText = 'Slight risk of third-party Stripe API rate limits (Mitigated via Kafka decoupling).';
        serviceText = 'svc-payment-core (Monitored via 10% Istio Canary)';
      } else if (q.includes('biggest deployment risk')) {
        verdict = 'PROCEED_WITH_CAUTION';
        recText = 'The primary deployment risk is database connection pool saturation during Alembic migration 0042. However, the migration contains zero table lock statements.';
        riskText = 'Temporary spike in PostgreSQL read connection pool during composite index creation.';
        serviceText = 'db-primary (PostgreSQL Relational DB)';
      } else if (q.includes('worries you')) {
        verdict = 'DEPLOY_NOW';
        recText = 'Payment Microservice (svc-payment-core) is under active monitoring. It is isolated behind a 10% Istio VirtualService canary deployment with zero error rate across 14,200 requests.';
        riskText = 'Kafka event processing offset lag under heavy load bursts.';
        serviceText = 'svc-payment-core';
      } else {
        verdict = 'DEPLOY_NOW';
        recText = 'DEPLOY IMMEDIATELY. Release Candidate v4.8.0-rc2 passed all readiness gates with a 96/100 Readiness Score and 99.2% Rollback Confidence.';
        riskText = 'Stripe API latency spikes during peak checkout volume.';
        serviceText = 'svc-payment-core';
      }

      setCurrentAdvice({
        question: q,
        verdict,
        deploymentRecommendation: recText,
        keyEvidence: advice.keyEvidence,
        biggestRiskFactor: riskText,
        highestRiskService: serviceText,
        aiConfidencePct: 99.6,
      });
      setIsGenerating(false);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md font-sans">
      <div className="w-full max-w-3xl rounded-2xl bg-slate-950 border border-cyan-500/30 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 flex items-center gap-2">
                AI Deployment Advisor
                <span className="px-1.5 py-0.5 rounded text-[9px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  Live SRE Reasoning
                </span>
              </h3>
              <p className="text-[10px] text-slate-400">Continuous Pre-Deployment Signoff Engine</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 rounded bg-slate-900 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 font-sans">
          {/* Preset Questions Bar */}
          <div className="space-y-2 font-mono text-xs">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Ask Deployment Advisor Question
            </label>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_ADVISOR_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedQuestion(q);
                    setCustomQuestion('');
                    handleAsk(q);
                  }}
                  className={cn(
                    'px-2.5 py-1 rounded-lg text-xs transition-all border',
                    selectedQuestion === q && !customQuestion
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  )}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Input */}
          <div className="flex gap-2 font-mono">
            <input
              type="text"
              value={customQuestion}
              onChange={(e) => setCustomQuestion(e.target.value)}
              placeholder="Or type custom question (e.g. 'Is database migration 0042 safe?')..."
              className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            />
            <button
              onClick={() => handleAsk()}
              disabled={isGenerating}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 font-bold text-xs text-white shadow-lg flex items-center gap-1.5 hover:opacity-90 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isGenerating ? 'Analyzing...' : 'Ask AI'}</span>
            </button>
          </div>

          {/* Verdict Response Box */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono">
              <span className="text-xs font-bold text-cyan-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>AI SRE Verdict & Recommendation</span>
              </span>

              <span
                className={cn(
                  'px-2.5 py-1 rounded-md text-xs font-black uppercase tracking-wider border',
                  currentAdvice.verdict === 'DEPLOY_NOW'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                )}
              >
                {currentAdvice.verdict.replace('_', ' ')}
              </span>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed font-sans font-medium">
              {currentAdvice.deploymentRecommendation}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-amber-400 font-bold uppercase block">Biggest Deployment Risk:</span>
                <p className="text-slate-300 text-[11px] font-sans leading-relaxed">{currentAdvice.biggestRiskFactor}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-purple-400 font-bold uppercase block">Highest Risk Microservice:</span>
                <p className="text-slate-300 text-[11px] font-sans leading-relaxed">{currentAdvice.highestRiskService}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2 font-mono text-xs">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                Key Supporting Evidence:
              </span>
              <ul className="space-y-1 text-slate-300">
                {currentAdvice.keyEvidence.map((ev, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{ev}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
