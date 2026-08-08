'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  MessageSquarePlus,
  Send,
  X,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Bug,
  HelpCircle,
  ThumbsUp,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BetaFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeEntityName?: string;
}

type FeedbackCategory = 'BUG' | 'INCORRECT_AI' | 'CONFUSING_UX' | 'PERFORMANCE' | 'USEFUL_FEATURE' | 'OTHER';

export function BetaFeedbackModal({ isOpen, onClose, activeEntityName }: BetaFeedbackModalProps) {
  const pathname = usePathname();

  const [category, setCategory] = useState<FeedbackCategory>('BUG');
  const [feedbackText, setFeedbackText] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    setIsSubmitting(true);

    // Simulate feedback submission with metadata logging
    setTimeout(() => {
      console.log('CodeAtlas Beta Feedback Submitted:', {
        category,
        feedbackText,
        email,
        route: pathname,
        entity: activeEntityName || 'N/A',
        appVersion: 'v2.4.0-beta',
        timestamp: new Date().toISOString(),
      });

      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 400);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFeedbackText('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 font-mono select-none">
      <div className="w-full max-w-lg bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden space-y-4 p-6 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <MessageSquarePlus className="w-5 h-5" />
            <span className="text-sm">GIVE BETA FEEDBACK</span>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-3 font-sans">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Thank You for Your Beta Feedback!</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Your insights help shape CodeAtlas into a more accurate, reliable engineering intelligence platform.
            </p>
            <Button onClick={handleReset} className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono text-xs mt-2">
              Close Window
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
            <div className="space-y-1.5 font-mono">
              <label className="text-[10px] text-slate-400 uppercase font-bold">Feedback Category</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'BUG', label: 'Bug Report', icon: Bug },
                  { id: 'INCORRECT_AI', label: 'Incorrect AI', icon: Sparkles },
                  { id: 'CONFUSING_UX', label: 'Confusing UX', icon: AlertTriangle },
                  { id: 'PERFORMANCE', label: 'Performance', icon: Clock },
                  { id: 'USEFUL_FEATURE', label: 'Useful Feature', icon: ThumbsUp },
                  { id: 'OTHER', label: 'Other', icon: HelpCircle },
                ].map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id as FeedbackCategory)}
                      className={`flex items-center gap-1.5 p-2 rounded-xl border text-[11px] font-bold transition-all ${
                        isSelected
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/40'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1 font-mono">
              <label className="text-[10px] text-slate-400 uppercase font-bold">Feedback Details</label>
              <textarea
                required
                rows={4}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Describe what you observed, what felt confusing, or how CodeAtlas can better answer your engineering question..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500/40"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 font-mono text-[10px] space-y-1 text-slate-400">
              <div className="text-slate-300 font-bold">Automatic Context Attached:</div>
              <div>• Route: <span className="text-cyan-400">{pathname}</span></div>
              <div>• Active Entity: <span className="text-cyan-400">{activeEntityName || 'Global Workspace'}</span></div>
              <div>• Build: <span className="text-slate-200">v2.4.0-beta</span></div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={onClose} className="bg-slate-950 border-slate-800 text-slate-400 hover:text-white font-mono text-xs">
                Cancel
              </Button>
              <Button type="submit" disabled={!feedbackText.trim() || isSubmitting} className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono text-xs">
                <Send className="w-3.5 h-3.5 mr-1.5" />
                Submit Feedback
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
