'use client';

import React, { useState } from 'react';
import { DocPage, DocComment, ApprovalStatus } from './doc-types';
import { MessageSquare, X, Send, CheckCircle2, UserCheck, ShieldCheck, Clock, ThumbsUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DocCollaborationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  doc: DocPage;
  onAddComment: (docId: string, text: string) => void;
  onUpdateApproval: (docId: string, status: ApprovalStatus) => void;
}

export function DocCollaborationPanel({
  isOpen,
  onClose,
  doc,
  onAddComment,
  onUpdateApproval,
}: DocCollaborationPanelProps) {
  const [newCommentText, setNewCommentText] = useState('');

  if (!isOpen) return null;

  const handleSend = () => {
    if (!newCommentText.trim()) return;
    onAddComment(doc.id, newCommentText);
    setNewCommentText('');
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-slate-950/95 border-l border-slate-800 shadow-2xl backdrop-blur-xl flex flex-col font-sans select-none">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-purple-400" />
          <div>
            <h3 className="text-sm font-bold text-slate-100 leading-none">Collaboration & Approval Workflow</h3>
            <p className="text-[10px] font-mono text-slate-400 mt-0.5">{doc.title}</p>
          </div>
        </div>

        <button onClick={onClose} className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Approval Workflow State Manager */}
      <div className="p-4 bg-slate-900/40 border-b border-slate-800 space-y-2 font-mono text-xs">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          Document Approval Status
        </span>

        <div className="grid grid-cols-4 gap-1.5 text-[10px]">
          {(['draft', 'in_review', 'approved', 'live'] as ApprovalStatus[]).map((st) => (
            <button
              key={st}
              onClick={() => onUpdateApproval(doc.id, st)}
              className={cn(
                'p-2 rounded-lg border font-bold uppercase transition-all text-center',
                doc.approvalStatus === st
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-sm'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              )}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Comment Thread List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-xs scrollbar-thin scrollbar-thumb-slate-800">
        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
          Discussion Threads ({doc.comments.length})
        </span>

        {doc.comments.length === 0 ? (
          <div className="p-6 text-center text-slate-500 font-mono text-xs space-y-2">
            <p>No comments yet on this document page.</p>
            <p className="text-[10px] text-slate-400">Start a discussion thread below to review or suggest changes!</p>
          </div>
        ) : (
          doc.comments.map((c) => (
            <div key={c.id} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between font-mono">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center justify-center text-[10px] font-bold">
                    {c.author.name.charAt(0)}
                  </div>
                  <span className="font-bold text-slate-200 text-[11px]">{c.author.name}</span>
                </div>
                <span className="text-[10px] text-slate-500">{c.timestamp}</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">{c.content}</p>
            </div>
          ))
        )}
      </div>

      {/* Add Comment Input */}
      <div className="p-4 border-t border-slate-800 bg-slate-950 flex gap-2 font-mono">
        <input
          type="text"
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
          placeholder="Add comment or mention @team..."
          className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-950/50 flex items-center justify-center"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
