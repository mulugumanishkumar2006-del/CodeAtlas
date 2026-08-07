'use client';

import React, { useState } from 'react';
import { Sparkles, X, Send, Bot, BookOpen, Layers, Terminal, ArrowRight, CheckCircle2, Zap } from 'lucide-react';
import { ExplanationLevel, AIExplanation } from './doc-types';
import { cn } from '@/lib/utils';

interface DocAIExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDocTitle: string;
}

const PRESET_TOPICS = [
  { label: 'Explain this repository', targetType: 'repository' },
  { label: 'Explain this service', targetType: 'service' },
  { label: 'Explain this API', targetType: 'api' },
  { label: 'Explain this database', targetType: 'database' },
  { label: 'Explain authentication', targetType: 'auth' },
  { label: 'Explain architecture', targetType: 'architecture' },
  { label: 'Explain deployment', targetType: 'deployment' },
  { label: 'Explain dependencies', targetType: 'dependency' },
  { label: 'Explain this class', targetType: 'class' },
  { label: 'Explain this function', targetType: 'function' },
  { label: 'Explain this workflow', targetType: 'workflow' },
  { label: 'Explain this business domain', targetType: 'domain' },
  { label: 'Explain this diagram', targetType: 'diagram' },
];

export function DocAIExplainerModal({
  isOpen,
  onClose,
  currentDocTitle,
}: DocAIExplainerModalProps) {
  const [selectedTopic, setSelectedTopic] = useState('Explain architecture');
  const [level, setLevel] = useState<ExplanationLevel>('intermediate');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [explanationResult, setExplanationResult] = useState<AIExplanation | null>({
    topic: 'Explain architecture',
    targetId: 'codeatlas-core-arch',
    targetType: 'architecture',
    level: 'intermediate',
    content:
      'CodeAtlas uses a hybrid architecture combining a high-speed Next.js frontend with a Python FastAPI microservice kernel. Code changes trigger Tree-Sitter AST parsers, emitting event streams to update both PostgreSQL transactional data and Neo4j AST Knowledge Graph nodes concurrently. The AI Documentation Engineer continuously watches graph deltas to synthesize updated documentation without manual intervention.',
    keyTakeaways: [
      'Sub-second AST parsing via Tree-Sitter',
      'Dual-write hybrid storage (PostgreSQL RDBMS + Neo4j Cypher Graph)',
      'Continuous automatic documentation synthesis on git push',
    ],
    suggestedQuestions: [
      'How does Neo4j handle multi-hop dependency queries?',
      'What happens if a database migration causes architecture drift?',
      'How are JWT tokens validated across backend microservice routers?',
    ],
  });

  if (!isOpen) return null;

  const handleGenerate = (topicToUse?: string) => {
    const topic = topicToUse || customPrompt || selectedTopic;
    setIsGenerating(true);
    setTimeout(() => {
      let contentText = '';
      let takeaways: string[] = [];

      if (level === 'beginner') {
        contentText = `Imagine CodeAtlas as an automated GPS navigation system for a massive software city. Instead of developers manually writing maps and road signs (documentation), an AI satellite continuously scans every building (class/function) and road (dependency) in real time. Whenever a new road is built or updated, the map updates automatically so no developer ever gets lost!`;
        takeaways = [
          'No manual doc writing required',
          'Map updates automatically whenever code changes',
          'Prevents new team members from getting lost in big projects',
        ];
      } else if (level === 'intermediate') {
        contentText = `CodeAtlas implements an event-driven AST vector graph pipeline. When a developer pushes commits to Git, a background job invokes Tree-Sitter parsers to extract symbols, classes, routes, and call edges. These symbols are written into a Neo4j Graph DB. The AI Documentation Engineer calculates semantic deltas and regenerates stale documentation pages with 99%+ AI confidence.`;
        takeaways = [
          'Event-driven AST parsing on Git commit hooks',
          'Neo4j Knowledge Graph tracks class & API call graphs',
          'Incremental doc generation targeting only modified AST nodes',
        ];
      } else {
        contentText = `At the lowest level, CodeAtlas leverages asynchronous python worker pools backed by Redis pub/sub channels. Cypher queries perform indexed graph traversals over SymbolNode and DEPENDS_ON edges with O(K) complexity where K is path depth. Thread-safe SQLAlchemy session pools handle Postgres transactions while AST embeddings are synthesized via vector similarity search. Locking is managed via distributed Redis mutexes to prevent concurrent re-indexing race conditions.`;
        takeaways = [
          'Async IO event loops with Redis distributed mutex locking',
          'O(K) Cypher graph path traversals over indexed symbol nodes',
          'Zero race conditions across parallel re-indexing workers',
        ];
      }

      setExplanationResult({
        topic,
        targetId: 'generated-explanation',
        targetType: 'architecture',
        level,
        content: contentText,
        keyTakeaways: takeaways,
        suggestedQuestions: [
          'Show code implementation for this explanation',
          'Trace call flow in Analysis Engine',
          'View corresponding ADR decision record',
        ],
      });
      setIsGenerating(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md font-sans">
      <div className="w-full max-w-3xl rounded-2xl bg-slate-950 border border-cyan-500/30 shadow-2xl shadow-cyan-950/80 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                AI Explanation Engine
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  3 Depth Levels
                </span>
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">
                Context: <strong className="text-slate-200">{currentDocTitle}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-800 font-sans">
          {/* Level Switcher (Beginner, Intermediate, Expert) */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
              Select Target Depth Level
            </label>
            <div className="grid grid-cols-3 gap-2 font-mono text-xs">
              {[
                { id: 'beginner', label: 'Beginner (ELI5)', desc: 'Simplified mental model & analogies' },
                { id: 'intermediate', label: 'Intermediate', desc: 'Implementation & architecture patterns' },
                { id: 'expert', label: 'Expert Deep-Dive', desc: 'Memory, concurrency & low-level mechanics' },
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  onClick={() => {
                    setLevel(lvl.id as ExplanationLevel);
                    handleGenerate();
                  }}
                  className={cn(
                    'p-3 rounded-xl border text-left transition-all',
                    level === lvl.id
                      ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-200 shadow-md shadow-cyan-950/40 font-bold'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  )}
                >
                  <div className="text-xs font-bold">{lvl.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">{lvl.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Preset Questions */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
              Ask AI Explanation Prompt
            </label>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_TOPICS.map((pt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedTopic(pt.label);
                    setCustomPrompt('');
                    handleGenerate(pt.label);
                  }}
                  className={cn(
                    'px-2.5 py-1 rounded-lg text-xs font-mono transition-all border',
                    selectedTopic === pt.label && !customPrompt
                      ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 font-bold'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  )}
                >
                  {pt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Prompt Input */}
          <div className="flex gap-2 font-mono">
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Or type custom question (e.g., 'Explain payment workflow retry mechanism')..."
              className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            />
            <button
              onClick={() => handleGenerate()}
              disabled={isGenerating}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 font-bold text-xs text-white shadow-lg shadow-cyan-950/50 flex items-center gap-1.5 hover:opacity-90 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isGenerating ? 'Generating...' : 'Explain'}</span>
            </button>
          </div>

          {/* Explanation Output Container */}
          {explanationResult && (
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>AI Explanation Response ({explanationResult.level.toUpperCase()} LEVEL)</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Generated in 0.08s
                </span>
              </div>

              {/* Main Content Text */}
              <p className="text-xs text-slate-200 leading-relaxed font-sans">
                {explanationResult.content}
              </p>

              {/* Key Takeaways */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider block">
                  Key Takeaways:
                </span>
                <ul className="space-y-1 text-xs text-slate-300">
                  {explanationResult.keyTakeaways.map((kt, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{kt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Suggested Follow-up Questions */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  Suggested Follow-up Questions:
                </span>
                <div className="space-y-1 font-mono text-xs">
                  {explanationResult.suggestedQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setCustomPrompt(q);
                        handleGenerate(q);
                      }}
                      className="w-full text-left p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 flex items-center justify-between group transition-all"
                    >
                      <span>{q}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
