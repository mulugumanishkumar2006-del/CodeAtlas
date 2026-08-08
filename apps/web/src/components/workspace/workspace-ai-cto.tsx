'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  ShieldCheck,
  Zap,
  GitBranch,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  evidenceNodes?: string[];
}

export function WorkspaceAiCto() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: "Hello! I am your Multi-Repository Workspace AI CTO Assistant. I have indexed your connected repositories, microservices, gRPC/HTTP APIs, and cross-repo dependencies. Ask me anything about your software ecosystem!",
      evidenceNodes: ['AuthGatewayService', 'PaymentProcessingEngine', 'BillingInvoiceEngine'],
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isQuerying, setIsQuerying] = useState(false);

  const suggestedQuestions = [
    'Which repositories are most important?',
    'What services depend on payments?',
    'Show the biggest architecture risks.',
    'What would break if /v1/charge API changes?',
    'Compare payment-processing-core and billing-engine.',
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputPrompt;
    if (!query) return;

    const userMsg: Message = { id: `u-${Date.now()}`, sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsQuerying(true);

    setTimeout(() => {
      let aiText = '';
      const qLower = query.toLowerCase();

      if (qLower.includes('important') || qLower.includes('critical')) {
        aiText =
          'Based on graph centrality scores and consumer node count, **AuthGatewayService** (auth-gateway-service) and **PaymentProcessingEngine** (payment-processing-core) are the most systemically important repositories. AuthGateway validates OAuth2 tokens for 11 microservices, while PaymentProcessingEngine manages transactional ledger locks.';
      } else if (qLower.includes('depend') || qLower.includes('payment')) {
        aiText =
          'The **Payments Platform** has 4 direct consumer microservices: CheckoutService (checkout-service), BillingEngine (billing-invoice-engine), MobileBackendBFF (mobile-bff-repo), and SubscriptionManager. Indirectly, the Analytics Pipeline consumes payment event topics.';
      } else if (qLower.includes('risk') || qLower.includes('security')) {
        aiText =
          'The highest cross-repository security risk detected is an outdated `@acme/sec-vault` dependency across 4 repositories (CVE-2026-4491 JWT signature forgery vulnerability). Additionally, Payment processing has a tight architectural coupling directly to the Analytics Postgres replica.';
      } else if (qLower.includes('break') || qLower.includes('change')) {
        aiText =
          'Modifying the `/v1/payments/charge` API contract will directly impact CheckoutService and BillingEngine, and indirectly impact MobileBackendBFF. High risk of breaking 18 integration tests if backwards compatibility is broken.';
      } else {
        aiText =
          `Workspace AI graph inspection complete for: "${query}". Analysis shows 12 connected microservices, 8 repositories, and an overall workspace health score of 93.4/100.`;
      }

      const aiMsg: Message = {
        id: `a-${Date.now()}`,
        sender: 'ai',
        text: aiText,
        evidenceNodes: ['AuthGatewayService', 'PaymentProcessingEngine', 'CheckoutService'],
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsQuerying(false);
    }, 400);
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 font-sans p-6 overflow-hidden">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800/80 shrink-0 font-mono text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <h2 className="text-base font-black text-white tracking-tight">WORKSPACE AI CTO ASSISTANT</h2>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold text-[10px]">
          Grounded Graph Reasoning
        </span>
      </div>

      {/* Suggested Quick Questions */}
      <div className="py-3 flex items-center gap-2 overflow-x-auto scrollbar-none font-mono text-[11px] shrink-0">
        <span className="text-slate-500 shrink-0">Quick Prompts:</span>
        {suggestedQuestions.map((q) => (
          <button
            key={q}
            onClick={() => handleSend(q)}
            className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white transition-all shrink-0"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 font-mono text-xs scrollbar-none py-2">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-3 p-4 rounded-2xl border ${
              m.sender === 'ai'
                ? 'bg-slate-900/80 border-slate-800 text-slate-200'
                : 'bg-cyan-500/10 border-cyan-500/30 text-white ml-12'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                m.sender === 'ai' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-indigo-500/20 text-indigo-400'
              }`}
            >
              {m.sender === 'ai' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>

            <div className="space-y-2 flex-1">
              <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>

              {m.evidenceNodes && (
                <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-slate-800/80 text-[10px]">
                  <span className="text-slate-500">Grounded Graph Nodes:</span>
                  {m.evidenceNodes.map((n) => (
                    <span key={n} className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-cyan-300 font-bold">
                      {n}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isQuerying && (
          <div className="flex items-center gap-2 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-cyan-400 font-mono text-xs">
            <Bot className="w-4 h-4 animate-spin" />
            <span>AI CTO inspecting multi-repository AST and dependency graph...</span>
          </div>
        )}
      </div>

      {/* Prompt Input Box */}
      <div className="pt-3 border-t border-slate-800/80 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask AI about repositories, dependencies, risks, or API impact..."
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/40 font-mono"
          />
          <Button
            type="submit"
            disabled={!inputPrompt || isQuerying}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs"
          >
            <Send className="w-4 h-4 mr-1" /> Ask AI
          </Button>
        </form>
      </div>
    </div>
  );
}
