'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Bot,
  X,
  Send,
  Zap,
  CheckCircle2,
  Flame,
  Globe,
  FlaskConical,
  MessageSquare,
  ChevronUp,
  ChevronDown,
  Layers,
  Search,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  suggestedPrompts?: string[];
  actionLink?: { label: string; href: string };
}

export function AiCommandCenterCopilot() {
  const pathname = usePathname() || '/';
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputQuery, setInputQuery] = useState('');

  // Dynamically compute active page context
  const getPageContextLabel = () => {
    if (pathname === '/') return 'Dashboard / AI Mission Control';
    if (pathname.startsWith('/repositories')) return 'Repositories Topology';
    if (pathname.startsWith('/analyze')) return 'AST Static Analysis';
    if (pathname.startsWith('/architecture')) return 'Architecture Explorer';
    if (pathname.startsWith('/investigate')) return 'AI Root-Cause Investigation';
    if (pathname.startsWith('/simulate')) return 'Digital Twin Simulation Studio';
    if (pathname.startsWith('/improve')) return 'Automated Refactoring Engine';
    if (pathname.startsWith('/monitor')) return 'System Telemetry & Health';
    return 'Software Memory & Knowledge';
  };

  const getSuggestedQuestions = () => {
    if (pathname.startsWith('/architecture')) {
      return [
        'Explain circular dependency in PaymentService DAL',
        'Which modules violate clean layer isolation?',
        'Simulate microservices split for analytics worker'
      ];
    }
    if (pathname.startsWith('/investigate')) {
      return [
        'Why is DB token validation latency spiking under load?',
        'Show exact code lines triggering REST router SQL drift',
        'Suggest 1-click refactoring patch for PaymentService'
      ];
    }
    return [
      'What requires my attention right now?',
      'Show technical debt payoff priorities',
      'Run security vulnerability scan on active repos'
    ];
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: `AI Copilot docked & synced with page: "${getPageContextLabel()}". Active Repo: "codeatlas/payments-service". I have full context of your architecture topology and recent investigations.`,
      suggestedPrompts: getSuggestedQuestions()
    }
  ]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputQuery;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');

    // Simulated intelligent response
    setTimeout(() => {
      let aiReplyText = `Analyzing "${text}" against repository AST topology & telemetry. Found 1 critical recommendation: PaymentService/router.py direct raw SQL queries require DAL repository decoupling.`;
      let actionLink: { label: string; href: string } | undefined = undefined;

      if (text.toLowerCase().includes('attention')) {
        aiReplyText = '3 items require attention: 1) REST router SQL drift in PaymentService, 2) DB token validation lock contention in Auth Gateway, 3) Deprecated Pydantic v1 config objects in Analytics Pipeline.';
        actionLink = { label: 'Open Focus Task List', href: '/' };
      } else if (text.toLowerCase().includes('simulate') || text.toLowerCase().includes('split')) {
        aiReplyText = 'Scenario simulation ready for Analytics Pipeline Kafka Microservices Split. Estimated latency reduction: 34%.';
        actionLink = { label: 'Launch Simulation Studio', href: '/simulate' };
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiReplyText,
        actionLink,
        suggestedPrompts: [
          'Apply 1-click auto patch',
          'Run performance stress test',
          'View dependency graph'
        ]
      };

      setMessages((prev) => [...prev, aiMsg]);
    }, 600);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2 font-mono">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold text-xs shadow-2xl shadow-cyan-950/80 transition-all transform hover:scale-105 cursor-pointer"
        >
          <div className="relative flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-cyan-200" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <span>AI Copilot Mission Control</span>
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20 }}
      className={`fixed bottom-6 right-6 z-50 w-96 bg-slate-950/95 border border-cyan-500/40 rounded-3xl shadow-2xl backdrop-blur-xl flex flex-col font-sans overflow-hidden transition-all duration-200 ${
        isMinimized ? 'h-16' : 'h-[580px]'
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/60 font-mono">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5 shadow-md">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-tight">AI COPILOT DOCKED</h4>
            <span className="text-[10px] text-cyan-400 block truncate max-w-[180px]">
              Context: {getPageContextLabel()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-slate-400">
          <button
            onClick={() => setIsMinimized((p) => !p)}
            className="p-1.5 rounded-xl hover:text-white hover:bg-slate-900 cursor-pointer"
          >
            {isMinimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-xl hover:text-white hover:bg-slate-900 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Active Context Banner */}
          <div className="px-4 py-2 bg-slate-900/40 border-b border-slate-900 font-mono text-[10px] text-slate-400 flex items-center justify-between">
            <span>Repo: <strong className="text-cyan-300">codeatlas/payments-service</strong></span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> SOC2 Verified
            </span>
          </div>

          {/* Conversation Thread */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs scrollbar-none">
            {messages.map((m) => (
              <div key={m.id} className="space-y-2">
                <div
                  className={`p-3 rounded-2xl max-w-[88%] space-y-1.5 ${
                    m.sender === 'user'
                      ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/30 ml-auto font-sans'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 font-sans'
                  }`}
                >
                  <p className="text-xs leading-relaxed">{m.text}</p>

                  {m.actionLink && (
                    <button
                      onClick={() => router.push(m.actionLink!.href)}
                      className="mt-2 px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-[10px] font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                    >
                      {m.actionLink.label} <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Suggested Follow-up Prompts */}
                {m.suggestedPrompts && (
                  <div className="flex flex-wrap gap-1.5 pl-2 font-mono text-[10px]">
                    {m.suggestedPrompts.map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(prompt)}
                        className="px-2.5 py-1 rounded-xl bg-slate-900/80 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/30 transition-all cursor-pointer text-left"
                      >
                        ⚡ {prompt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 border-t border-slate-800/80 bg-slate-900/60 flex items-center gap-2 font-mono"
          >
            <input
              type="text"
              placeholder="Ask AI Copilot about this page..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </>
      )}
    </motion.div>
  );
}
