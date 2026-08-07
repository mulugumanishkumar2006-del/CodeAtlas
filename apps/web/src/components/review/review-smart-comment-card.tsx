'use client';

import React, { useState } from 'react';
import { SmartReviewComment, InterEngineLink } from './review-types';
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Info,
  Sparkles,
  ExternalLink,
  Check,
  Copy,
  Layers,
  FlaskConical,
  Zap,
  BookOpen,
  Pin,
  ChevronDown,
  ChevronUp,
  FileCode2,
  Code2,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReviewSmartCommentCardProps {
  comment: SmartReviewComment;
  onApplyFix?: (comment: SmartReviewComment) => void;
  onToggleResolve?: (commentId: string) => void;
}

export function ReviewSmartCommentCard({
  comment,
  onApplyFix,
  onToggleResolve,
}: ReviewSmartCommentCardProps) {
  const [copied, setCopied] = useState(false);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [applied, setApplied] = useState(false);

  const getSeverityBadge = () => {
    switch (comment.severity) {
      case 'CRITICAL':
        return 'bg-rose-500/10 text-rose-300 border-rose-500/30';
      case 'HIGH':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      case 'MEDIUM':
        return 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getEngineIcon = (engine: InterEngineLink['engine']) => {
    switch (engine) {
      case 'doc_engineer':
        return BookOpen;
      case 'architecture_intelligence':
        return Layers;
      case 'ai_investigation':
        return FlaskConical;
      case 'simulation_studio':
        return Zap;
      default:
        return ExternalLink;
    }
  };

  const handleCopyFix = () => {
    if (comment.suggestedFix) {
      navigator.clipboard.writeText(comment.suggestedFix.fixedCodeSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleApply = () => {
    setApplied(true);
    if (onApplyFix) onApplyFix(comment);
  };

  return (
    <div
      className={cn(
        'p-5 rounded-2xl border bg-slate-900/90 font-sans shadow-xl transition-all space-y-4',
        comment.severity === 'CRITICAL' ? 'border-rose-500/40' : 'border-slate-800',
        comment.resolved && 'opacity-60 bg-slate-950/60'
      )}
    >
      {/* Top Bar: Title, Severity, AI Confidence & Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className={cn('px-2.5 py-1 rounded-md text-[10px] font-mono font-extrabold uppercase border', getSeverityBadge())}>
            {comment.severity}
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>AI Confidence {comment.aiConfidence}%</span>
          </span>
          <span className="text-xs font-mono text-slate-400">
            {comment.filePath}:{comment.lineStart}
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          {comment.pinned && (
            <span className="px-2 py-0.5 rounded text-[9px] bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1">
              <Pin className="w-3 h-3 fill-amber-300" /> Pinned
            </span>
          )}
          {onToggleResolve && (
            <button
              onClick={() => onToggleResolve(comment.id)}
              className={cn(
                'px-2.5 py-1 rounded-lg border text-[11px] transition-colors',
                comment.resolved
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              )}
            >
              {comment.resolved ? 'Resolved' : 'Mark Resolved'}
            </button>
          )}
        </div>
      </div>

      {/* Title & Problem Description */}
      <div className="space-y-1.5">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          {comment.title}
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed font-sans">{comment.problemDescription}</p>
      </div>

      {/* Evidence Snippet */}
      {comment.evidenceSnippet && (
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-rose-300">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Evidence Code Snippet:</span>
          <code className="whitespace-pre-wrap">{comment.evidenceSnippet}</code>
        </div>
      )}

      {/* Architecture, Business & Engineering Context */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-sans text-xs">
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
          <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-wider block">
            Architecture Context
          </span>
          <p className="text-slate-300 text-[11px] leading-relaxed">{comment.architectureContext}</p>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
          <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider block">
            Business Impact
          </span>
          <p className="text-slate-300 text-[11px] leading-relaxed">{comment.businessImpact}</p>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
          <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider block">
            Engineering Impact
          </span>
          <p className="text-slate-300 text-[11px] leading-relaxed">{comment.engineeringImpact}</p>
        </div>
      </div>

      {/* SUGGESTED FIX BOX */}
      {comment.suggestedFix && (
        <div className="rounded-xl border border-emerald-500/40 bg-slate-950 overflow-hidden font-mono text-xs">
          <div className="px-4 py-2 bg-emerald-950/30 border-b border-emerald-500/30 flex items-center justify-between">
            <span className="font-bold text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>AI Staff Engineer Suggested Fix</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyFix}
                className="px-2 py-1 rounded bg-slate-900 text-slate-300 hover:text-white border border-slate-800 text-[10px] flex items-center gap-1"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
              {comment.suggestedFix.applyable && (
                <button
                  onClick={handleApply}
                  disabled={applied}
                  className="px-3 py-1 rounded bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 text-[10px] flex items-center gap-1 transition-colors disabled:opacity-50"
                >
                  <Check className="w-3 h-3" />
                  <span>{applied ? 'Applied to Branch' : 'Apply Fix to PR'}</span>
                </button>
              )}
            </div>
          </div>

          <div className="p-3 bg-slate-950 text-emerald-200 text-xs overflow-x-auto">
            <pre>{comment.suggestedFix.fixedCodeSnippet}</pre>
          </div>
        </div>
      )}

      {/* Alternative Design Solutions Toggle */}
      {comment.alternativeSolutions && comment.alternativeSolutions.length > 0 && (
        <div className="space-y-2">
          <button
            onClick={() => setShowAlternatives(!showAlternatives)}
            className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 hover:underline"
          >
            {showAlternatives ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            <span>View {comment.alternativeSolutions.length} Alternative Solutions</span>
          </button>

          {showAlternatives && (
            <div className="space-y-3 pt-2">
              {comment.alternativeSolutions.map((alt, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-sans text-xs">
                  <div className="flex items-center justify-between font-mono">
                    <span className="font-bold text-slate-100">{alt.title}</span>
                    <span className="text-[10px] text-slate-400">Effort: {alt.effortHours}h</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">{alt.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* INTER-ENGINE DEEP LINKS */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80 font-mono text-[11px]">
        <span className="text-slate-500 font-bold uppercase text-[9px] mr-1">Inter-System Context:</span>
        {[
          comment.relatedDocLink,
          comment.relatedAdrLink,
          comment.relatedInvestigationLink,
          comment.relatedSimulationLink,
        ]
          .filter(Boolean)
          .map((link, idx) => {
            const Icon = getEngineIcon(link!.engine);
            return (
              <a
                key={idx}
                href={link!.url}
                className="px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 transition-colors flex items-center gap-1.5"
              >
                <Icon className="w-3 h-3 text-cyan-400" />
                <span>{link!.label}</span>
              </a>
            );
          })}
      </div>
    </div>
  );
}
