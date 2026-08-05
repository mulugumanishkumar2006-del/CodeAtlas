'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  X,
  Zap,
  FileText,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdrGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (title: string, category: string) => void;
}

export function AdrGeneratorModal({
  isOpen,
  onClose,
  onGenerate,
}: AdrGeneratorModalProps) {
  const [title, setTitle] = useState('Introduce Redis L3 Cache for Vector Search');
  const [category, setCategory] = useState('Data Store');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(title, category);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto font-sans">
      <div className="w-full max-w-xl bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 animate-in zoom-in-95 duration-150 relative">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">Auto-Generate AI Architecture Decision</h2>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                AI will inspect code commits, repository analysis, and dependencies to synthesize a full ADR spec.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          <div>
            <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">ADR Title / Refactoring Name</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Architecture Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-500 font-mono"
            >
              <option value="Data Store">Data Store</option>
              <option value="Microservices">Microservices</option>
              <option value="Authentication">Authentication</option>
              <option value="Messaging">Messaging</option>
              <option value="Infrastructure">Infrastructure</option>
            </select>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs gap-2 rounded-xl h-10 shadow-lg shadow-cyan-950/50"
          >
            <Sparkles className="w-4 h-4 text-cyan-200" /> Synthesize Full ADR Specification
          </Button>
        </form>
      </div>
    </div>
  );
}
