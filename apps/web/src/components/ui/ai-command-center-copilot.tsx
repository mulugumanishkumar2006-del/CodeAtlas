'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ActivityItem {
  id: string;
  time: string;
  type: 'Drift' | 'Graph' | 'Simulation' | 'Security';
  message: string;
}

export function AiCommandCenterCopilot() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    {
      sender: 'ai',
      text: 'AI Copilot connected to repo: CodeAtlas/apps/backend. How can I assist with your software architecture journey today?',
    },
  ]);

  const activities: ActivityItem[] = [
    { id: 'act-1', time: 'Just now', type: 'Drift', message: 'Architecture drift detected in PaymentService layer boundary.' },
    { id: 'act-2', time: '2m ago', type: 'Graph', message: 'Knowledge Graph parsed 10,420 AST symbol nodes.' },
    { id: 'act-3', time: '5m ago', type: 'Simulation', message: 'Kafka Async Event Stream scenario simulation completed.' },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    const userMsg = inputQuery;
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setInputQuery('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `Analyzing "${userMsg}" against repository topology. PaymentService relies on Redis L2 cache with sub-millisecond retrieval. Launching 1-click simulation...`,
        },
      ]);
    }, 600);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs shadow-2xl shadow-cyan-950/80 font-mono transition-all transform hover:scale-105"
        >
          <div className="relative flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-cyan-200" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <span>AI Command Center</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-h-[580px] bg-slate-950/95 border border-slate-800 rounded-3xl shadow-2xl backdrop-blur-xl flex flex-col font-sans overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
      {/* Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5 shadow-md">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-tight">AI COMMAND CENTER</h4>
            <span className="text-[10px] font-mono text-cyan-400">Context: CodeAtlas/apps/backend</span>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(false)}
          className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Real-time Activity Stream */}
      <div className="p-2 border-b border-slate-900 bg-slate-950/80 font-mono text-[10px] space-y-1">
        <span className="text-slate-500 font-bold uppercase text-[9px] px-2">LIVE ENGINEERING STREAM:</span>
        {activities.slice(0, 2).map((act) => (
          <div key={act.id} className="px-2 py-1 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-slate-300">
            <span className="truncate">{act.message}</span>
            <span className="text-[9px] text-cyan-400 font-bold ml-1 shrink-0">{act.time}</span>
          </div>
        ))}
      </div>

      {/* Conversation Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs scrollbar-none">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-2xl max-w-[85%] space-y-1 ${
              m.sender === 'user'
                ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/30 ml-auto'
                : 'bg-slate-900 border border-slate-800 text-slate-200'
            }`}
          >
            <p className="font-sans text-xs leading-relaxed">{m.text}</p>
          </div>
        ))}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800/80 bg-slate-900/60 flex items-center gap-2">
        <input
          type="text"
          placeholder="Ask AI Copilot..."
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
        />
        <button
          type="submit"
          className="p-2 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
