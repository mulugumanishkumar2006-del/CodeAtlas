'use client';

import React, { useState } from 'react';
import { CodeDiffFile, SmartReviewComment } from './review-types';
import { ReviewSmartCommentCard } from './review-smart-comment-card';
import { FileCode2, Columns, AlignLeft, Check, Sparkles, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReviewSplitDiffViewerProps {
  files: CodeDiffFile[];
  comments: SmartReviewComment[];
  onApplyFix?: (comment: SmartReviewComment) => void;
  onToggleResolve?: (commentId: string) => void;
}

export function ReviewSplitDiffViewer({
  files,
  comments,
  onApplyFix,
  onToggleResolve,
}: ReviewSplitDiffViewerProps) {
  const [activeFileId, setActiveFileId] = useState<string>(files[0]?.id || '');
  const [viewMode, setViewMode] = useState<'unified' | 'split'>('unified');

  const activeFile = files.find((f) => f.id === activeFileId) || files[0];
  const fileComments = comments.filter((c) => c.filePath === activeFile?.newPath);

  if (!activeFile) return null;

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 font-mono select-none overflow-hidden border border-slate-800 rounded-2xl shadow-2xl">
      {/* Diff Top Bar */}
      <div className="p-3 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* File Switcher Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          {files.map((file) => (
            <button
              key={file.id}
              onClick={() => setActiveFileId(file.id)}
              className={cn(
                'px-3 py-1.5 rounded-lg border transition-all flex items-center gap-2 shrink-0',
                activeFileId === file.id
                  ? 'bg-cyan-500/20 text-cyan-200 border-cyan-500/40 font-bold'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              )}
            >
              <FileCode2 className="w-3.5 h-3.5 text-cyan-400" />
              <span className="truncate max-w-[200px]">{file.newPath.split('/').pop()}</span>
              <span className="text-[10px] text-emerald-400 font-bold">+{file.additions}</span>
              <span className="text-[10px] text-rose-400 font-bold">-{file.deletions}</span>
            </button>
          ))}
        </div>

        {/* Layout Toggle (Unified vs Split) */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setViewMode('unified')}
            className={cn(
              'px-2.5 py-1 rounded text-[11px] flex items-center gap-1 transition-colors',
              viewMode === 'unified' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
            )}
          >
            <AlignLeft className="w-3.5 h-3.5" />
            <span>Unified</span>
          </button>
          <button
            onClick={() => setViewMode('split')}
            className={cn(
              'px-2.5 py-1 rounded text-[11px] flex items-center gap-1 transition-colors',
              viewMode === 'split' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
            )}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Split</span>
          </button>
        </div>
      </div>

      {/* Main Diff Code Display */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
        {activeFile.diffHunks.map((hunk, hIdx) => (
          <div key={hIdx} className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden text-xs">
            {/* Hunk Header */}
            <div className="px-4 py-1.5 bg-slate-900/90 text-slate-400 border-b border-slate-800 text-[11px] font-bold">
              {hunk.header}
            </div>

            {/* Lines List */}
            <div className="divide-y divide-slate-900/50">
              {hunk.lines.map((line, lIdx) => {
                const lineComment = fileComments.find((c) => c.lineStart === line.newLineNumber);

                return (
                  <React.Fragment key={lIdx}>
                    <div
                      className={cn(
                        'flex items-center px-2 py-1 font-mono leading-relaxed transition-colors',
                        line.type === 'add' && 'bg-emerald-950/20 text-emerald-200',
                        line.type === 'delete' && 'bg-rose-950/20 text-rose-300 opacity-80',
                        line.type === 'context' && 'text-slate-300'
                      )}
                    >
                      {/* Old Line Number */}
                      <span className="w-10 text-right text-slate-600 select-none pr-3 text-[11px]">
                        {line.oldLineNumber || ''}
                      </span>
                      {/* New Line Number */}
                      <span className="w-10 text-right text-slate-600 select-none pr-3 text-[11px] border-r border-slate-800/80">
                        {line.newLineNumber || ''}
                      </span>

                      {/* Diff Sign Marker */}
                      <span className="w-6 text-center select-none font-bold">
                        {line.type === 'add' ? '+' : line.type === 'delete' ? '-' : ' '}
                      </span>

                      {/* Line Content */}
                      <span className="flex-1 whitespace-pre pl-2">{line.content}</span>
                    </div>

                    {/* Inline Smart Review Comment Card Annotation */}
                    {lineComment && (
                      <div className="p-4 bg-slate-950 border-y-2 border-cyan-500/50">
                        <ReviewSmartCommentCard
                          comment={lineComment}
                          onApplyFix={onApplyFix}
                          onToggleResolve={onToggleResolve}
                        />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
