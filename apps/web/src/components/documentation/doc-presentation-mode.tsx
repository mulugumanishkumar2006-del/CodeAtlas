'use client';

import React, { useState, useEffect } from 'react';
import { DocPage } from './doc-types';
import { X, ChevronLeft, ChevronRight, Sparkles, BookOpen, Layers, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DocPresentationModeProps {
  isOpen: boolean;
  onClose: () => void;
  doc: DocPage;
}

export function DocPresentationMode({
  isOpen,
  onClose,
  doc,
}: DocPresentationModeProps) {
  const [slideIndex, setSlideIndex] = useState(0);

  const slides = doc.presentationSlides || [
    {
      title: doc.title,
      bulletPoints: [
        `Category: ${doc.typeId.toUpperCase()}`,
        doc.summary,
        `AI Confidence: ${doc.aiConfidence}% (Verified)`,
      ],
      visualType: 'metrics',
    },
    {
      title: 'Architectural Rationale & Purpose',
      bulletPoints: [doc.purpose, doc.technicalContext, doc.businessContext],
      visualType: 'diagram',
    },
    {
      title: 'Key Best Practices & Guidelines',
      bulletPoints: doc.bestPractices.length > 0 ? doc.bestPractices : ['Follow repository monorepo structure'],
      visualType: 'code',
    },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        setSlideIndex((prev) => Math.min(prev + 1, slides.length - 1));
      } else if (e.key === 'ArrowLeft') {
        setSlideIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, slides.length, onClose]);

  if (!isOpen) return null;

  const currentSlide = slides[slideIndex] || slides[0];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col font-sans select-none overflow-hidden">
      {/* Presentation Control Bar */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between font-mono text-xs">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-slate-200">Presentation Deck Mode: {doc.title}</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-slate-400">
            Slide <strong className="text-cyan-400">{slideIndex + 1}</strong> of {slides.length}
          </span>
          <button onClick={onClose} className="p-1.5 rounded bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Slide Screen */}
      <div className="flex-1 flex items-center justify-center p-12 relative bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950">
        <div className="w-full max-w-5xl space-y-8 animate-fadeIn">
          {/* Slide Header */}
          <div className="space-y-2 border-b border-slate-800/80 pb-6">
            <span className="px-3 py-1 rounded-md text-xs font-mono font-bold uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              CodeAtlas Architecture Review
            </span>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-indigo-200">
              {currentSlide.title}
            </h1>
          </div>

          {/* Slide Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Bullet points */}
            <div className="space-y-4 font-sans text-lg text-slate-200 leading-relaxed">
              {currentSlide.bulletPoints.map((pt, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-1" />
                  <span>{pt}</span>
                </div>
              ))}
            </div>

            {/* Visual Panel */}
            <div className="p-8 rounded-2xl bg-slate-900/80 border border-cyan-500/30 shadow-2xl flex flex-col items-center justify-center text-center space-y-4 font-mono">
              <Sparkles className="w-12 h-12 text-cyan-400 animate-pulse" />
              <div className="text-xl font-bold text-slate-100">Live AI System Intelligence</div>
              <div className="text-xs text-slate-400">
                Confidence: <strong className="text-emerald-400">{doc.aiConfidence}%</strong> • Status: Live Synced
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Navigation Footer */}
      <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between font-mono text-xs">
        <button
          onClick={() => setSlideIndex((prev) => Math.max(prev - 1, 0))}
          disabled={slideIndex === 0}
          className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white disabled:opacity-30 flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <div className="flex gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setSlideIndex(idx)}
              className={cn(
                'w-3 h-3 rounded-full transition-all',
                slideIndex === idx ? 'bg-cyan-400 scale-125' : 'bg-slate-700'
              )}
            />
          ))}
        </div>

        <button
          onClick={() => setSlideIndex((prev) => Math.min(prev + 1, slides.length - 1))}
          disabled={slideIndex === slides.length - 1}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 font-bold text-white shadow-lg shadow-cyan-950/50 disabled:opacity-30 flex items-center gap-1"
        >
          <span>Next Slide</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
