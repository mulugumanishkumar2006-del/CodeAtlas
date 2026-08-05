'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Search,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Play,
  ShieldCheck,
  TrendingUp,
  HelpCircle,
  Activity,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface RefactoringAssistantAnswer {
  question: string;
  answerText: string;
  roiPayoff: string;
  riskAssessment: string;
  recommendedAction: string;
}

const PRESET_ASSISTANT_QUESTIONS: { question: string; answer: RefactoringAssistantAnswer }[] = [
  {
    question: 'What should I refactor first?',
    answer: {
      question: 'What should I refactor first?',
      answerText: 'Refactor Payment Processing Service router.py raw REST SQL execution into PaymentsRepository DAL. It has the highest technical debt drag ($18.5k/yr) and lowest refactoring risk.',
      roiPayoff: '$18.5k / yearPayoff',
      riskAssessment: 'Low Risk (Digital Twin Simulation Verified)',
      recommendedAction: 'Execute Step 1 in the 6-Step Visual Refactoring Roadmap.'
    }
  },
  {
    question: 'Which refactoring has the highest ROI?',
    answer: {
      question: 'Which refactoring has the highest ROI?',
      answerText: 'Payment REST router DAL decoupling yields +18 Health Points and recovers $18.5k/yr in debt drag with only 2 days of engineering effort.',
      roiPayoff: '1,540% ROI Rating',
      riskAssessment: 'Low Operational Risk',
      recommendedAction: 'Approve & merge PR #145.'
    }
  },
  {
    question: 'Can this wait?',
    answer: {
      question: 'Can this wait?',
      answerText: 'Postponing raw SQL router DAL refactoring introduces database connection pool lock contention risk during sustained 50,000 QPS burst traffic.',
      roiPayoff: 'Risk of Ingress Downtime',
      riskAssessment: 'High Risk if postponed past current sprint',
      recommendedAction: 'Schedule for current sprint execution.'
    }
  },
  {
    question: 'Show safer alternatives.',
    answer: {
      question: 'Show safer alternatives.',
      answerText: 'Option A (DAL Repository + Redis L2 Cache) is the safest approach. Option C (increasing Postgres max_connections) carries high DB memory saturation risk.',
      roiPayoff: '$18.5k/yr Payoff',
      riskAssessment: 'Option A: Low Risk | Option C: High Risk',
      recommendedAction: 'Select Option A in the AI Trade-off Analysis matrix.'
    }
  },
  {
    question: 'Predict migration risk.',
    answer: {
      question: 'Predict migration risk.',
      answerText: 'Digital Twin load test simulation predicts zero downtime risk with canary deployment rolling update strategy.',
      roiPayoff: 'Zero Downtime SLA',
      riskAssessment: 'Canary rollback trigger set at 0.01% error rate',
      recommendedAction: 'Deploy via zero-downtime canary strategy.'
    }
  },
  {
    question: 'How do we validate success?',
    answer: {
      question: 'How do we validate success?',
      answerText: 'Validation criteria: 1) AST symbol tree confirms zero direct raw SQL imports, 2) 142 unit tests pass, 3) P99 latency drops to sub-12ms.',
      roiPayoff: 'Sub-12ms P99 Latency',
      riskAssessment: '100% Automated Validation Check',
      recommendedAction: 'Verify Step 5 in the Refactoring Roadmap.'
    }
  }
];

export function AiRefactoringAssistant() {
  const [selectedQuestion, setSelectedQuestion] = useState<string>(PRESET_ASSISTANT_QUESTIONS[0].question);
  const [customInput, setCustomInput] = useState<string>('');

  const currentAnswer =
    PRESET_ASSISTANT_QUESTIONS.find((q) => q.question === selectedQuestion)?.answer || PRESET_ASSISTANT_QUESTIONS[0].answer;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans select-none">
      {/* Live Refactoring Execution Progress Tracker (1 Col) */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800/80 shadow-2xl space-y-4 font-mono">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-xs font-black uppercase text-white tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" /> Live Execution Progress
          </h3>
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
            STREAMING
          </span>
        </div>

        <div className="space-y-3 text-xs font-mono">
          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400">Completed Tasks:</span>
            <span className="text-emerald-400 font-bold">1 of 6 Steps</span>
          </div>

          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400">Remaining Work:</span>
            <span className="text-cyan-300 font-bold">5 Steps (~10.5 hrs)</span>
          </div>

          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400">Current Risks:</span>
            <span className="text-amber-400 font-bold">Low Risk</span>
          </div>

          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400">Blocked Items:</span>
            <span className="text-emerald-400 font-bold">0 Blockers</span>
          </div>

          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400">Deployment Readiness:</span>
            <span className="text-emerald-400 font-bold">Scenario Ready</span>
          </div>
        </div>

        <div className="p-3 bg-slate-950 rounded-xl border border-slate-900 space-y-1 font-sans text-xs">
          <span className="text-[10px] text-slate-500 font-mono font-bold uppercase block">AI OBSERVATION:</span>
          <p className="text-slate-300 leading-relaxed">
            Step 1 (Extract DAL Repository) completed successfully. AST symbol validation passed with 0 raw SQL handle breaches.
          </p>
        </div>
      </div>

      {/* Interactive Refactoring Assistant Q&A (2 Cols) */}
      <div className="lg:col-span-2 glass-card rounded-3xl p-6 border border-slate-800/80 shadow-2xl space-y-5 font-sans">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4 font-mono">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
              <Brain className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                AI Refactoring Advisory Assistant
              </h3>
              <p className="text-xs text-slate-400 font-sans">
                Ask questions about refactoring ROI, migration risks, safer alternatives, and validation strategies.
              </p>
            </div>
          </div>

          <span className="text-xs font-mono text-cyan-400 font-bold bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
            Context-Aware Reasoning
          </span>
        </div>

        {/* Preset Query Pills */}
        <div className="flex flex-wrap gap-2 font-mono text-xs">
          {PRESET_ASSISTANT_QUESTIONS.map((item) => (
            <button
              key={item.question}
              onClick={() => setSelectedQuestion(item.question)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedQuestion === item.question
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              ⚡ {item.question}
            </button>
          ))}
        </div>

        {/* Custom Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (customInput.trim()) {
              setSelectedQuestion(customInput);
              setCustomInput('');
            }
          }}
          className="flex items-center gap-2 font-mono"
        >
          <input
            type="text"
            placeholder="Ask AI assistant about refactoring priorities..."
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
          />
          <Button type="submit" size="sm" className="h-9 px-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl cursor-pointer font-bold">
            Ask AI
          </Button>
        </form>

        {/* Answer Output Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentAnswer.question}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="p-5 rounded-2xl bg-slate-950/90 border border-cyan-500/30 space-y-3 font-mono text-xs"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-extrabold text-cyan-300 text-sm flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-400" /> Refactoring Advisor Answer
              </span>
              <span className="text-emerald-400 font-bold text-[10px]">{currentAnswer.riskAssessment}</span>
            </div>

            <p className="text-xs font-sans font-medium text-slate-200 leading-relaxed">
              {currentAnswer.answerText}
            </p>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-sans">Recommended Next Action:</span>
              <span className="text-cyan-300 font-bold">{currentAnswer.recommendedAction}</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
