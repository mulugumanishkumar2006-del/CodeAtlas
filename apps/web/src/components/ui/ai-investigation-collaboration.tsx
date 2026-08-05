'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  MessageSquare,
  Share2,
  Bookmark,
  CheckCircle2,
  UserPlus,
  Plus,
  Send,
  Download,
  Copy,
  Check,
  X,
  Sparkles,
  Sliders
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface CommentItem {
  id: string;
  author: string;
  avatar: string;
  timestamp: string;
  text: string;
}

export function AiInvestigationCollaboration() {
  const [status, setStatus] = useState<'PENDING' | 'IN_PROGRESS' | 'RESOLVED'>('IN_PROGRESS');
  const [assignee, setAssignee] = useState<string>('Alex Mercer');
  const [isSaved, setIsSaved] = useState<boolean>(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [isTaskCreated, setIsTaskCreated] = useState<boolean>(false);

  const [comments, setComments] = useState<CommentItem[]>([
    {
      id: 'c-1',
      author: 'Sarah Chen',
      avatar: 'SC',
      timestamp: '1 hour ago',
      text: '@Alex Mercer I confirmed the DB lock contention spike during the 50k QPS load test. The DAL repository extraction plan looks solid.'
    },
    {
      id: 'c-2',
      author: 'Alex Mercer',
      avatar: 'AM',
      timestamp: '30 mins ago',
      text: 'Thanks @Sarah Chen! Running the Redis write-through cache simulation scenario now before deploying the refactoring patch.'
    }
  ]);
  const [newComment, setNewComment] = useState<string>('');

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const item: CommentItem = {
      id: `c-${Date.now()}`,
      author: 'Alex Mercer',
      avatar: 'AM',
      timestamp: 'Just now',
      text: newComment
    };

    setComments((prev) => [...prev, item]);
    setNewComment('');
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText('https://codeatlas.internal/investigate/report-89241');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="glass-card rounded-3xl p-6 border border-slate-800/80 shadow-2xl space-y-5 font-sans select-none relative">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4 font-mono">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              Team Collaboration & Action Center
            </h3>
            <p className="text-xs text-slate-400 font-sans">
              Assign owner, track status, add team discussion notes, and push 1-click follow-up tasks.
            </p>
          </div>
        </div>

        {/* Status Transition & Save Bar */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={() => setIsSaved((p) => !p)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isSaved
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-400 text-amber-400' : ''}`} />
            {isSaved ? 'Saved to Workspace' : 'Save Investigation'}
          </button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsShareModalOpen(true)}
            className="h-8 text-xs font-mono font-bold bg-slate-900 border-slate-800 text-slate-300 hover:text-white rounded-xl gap-1 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-cyan-400" /> Share Report
          </Button>
        </div>
      </div>

      {/* Control Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
        {/* Status Dropdown / Pills */}
        <div className="p-3 bg-slate-950 rounded-2xl border border-slate-900 space-y-1">
          <span className="text-[10px] text-slate-500 font-bold uppercase block">INVESTIGATION STATUS:</span>
          <div className="flex items-center gap-1">
            {(['PENDING', 'IN_PROGRESS', 'RESOLVED'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatus(st)}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                  status === st
                    ? st === 'RESOLVED'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Assignee */}
        <div className="p-3 bg-slate-950 rounded-2xl border border-slate-900 space-y-1">
          <span className="text-[10px] text-slate-500 font-bold uppercase block">ASSIGNED OWNER:</span>
          <div className="flex items-center justify-between text-slate-200">
            <span className="font-bold text-cyan-300">{assignee}</span>
            <button
              onClick={() => setAssignee(assignee === 'Alex Mercer' ? 'Sarah Chen' : 'Alex Mercer')}
              className="text-[10px] text-slate-400 hover:text-white underline"
            >
              Change
            </button>
          </div>
        </div>

        {/* 1-Click Task Export Push */}
        <div className="p-3 bg-slate-950 rounded-2xl border border-slate-900 space-y-1 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase block">FOLLOW-UP TASK:</span>
            <span className="text-slate-300 text-[11px] font-bold">{isTaskCreated ? 'Task Pushed to Backlog' : 'Push to Task List'}</span>
          </div>

          <Button
            size="sm"
            disabled={isTaskCreated}
            onClick={() => setIsTaskCreated(true)}
            className={`h-8 px-3 text-xs font-bold rounded-xl gap-1 cursor-pointer ${
              isTaskCreated
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-cyan-600 hover:bg-cyan-500 text-white'
            }`}
          >
            {isTaskCreated ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Plus className="w-3.5 h-3.5" />}
            {isTaskCreated ? 'Task Created' : 'Create Task'}
          </Button>
        </div>
      </div>

      {/* Team Notes & Comments Thread */}
      <div className="space-y-3 font-sans">
        <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
          Team Notes & Discussion (@engineer)
        </span>

        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {comments.map((c) => (
            <div key={c.id} className="p-3 bg-slate-950 rounded-2xl border border-slate-900 space-y-1 font-mono text-xs">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-md bg-cyan-500/20 text-cyan-400 font-black text-[10px] flex items-center justify-center">
                    {c.avatar}
                  </span>
                  {c.author}
                </span>
                <span className="text-slate-500 text-[10px]">{c.timestamp}</span>
              </div>
              <p className="text-slate-300 font-sans text-xs pl-6">{c.text}</p>
            </div>
          ))}
        </div>

        {/* Comment Input */}
        <form onSubmit={handleAddComment} className="flex items-center gap-2 font-mono">
          <input
            type="text"
            placeholder="Add investigation note or mention team member (@engineer)..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
          />
          <Button type="submit" size="sm" className="h-9 px-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl cursor-pointer">
            <Send className="w-3.5 h-3.5" />
          </Button>
        </form>
      </div>

      {/* Share Report Modal */}
      <AnimatePresence>
        {isShareModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 font-mono">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-cyan-400" /> Share Investigation Report
                </h3>
                <button onClick={() => setIsShareModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-300 font-sans">
                Share this interactive AI investigation report with team members or attach to incident tickets.
              </p>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-cyan-300">
                <span className="truncate">https://codeatlas.internal/investigate/report-89241</span>
                <Button
                  size="sm"
                  onClick={handleCopyShareLink}
                  className="h-7 text-[11px] font-bold bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg gap-1 cursor-pointer shrink-0"
                >
                  {copiedLink ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                  {copiedLink ? 'Copied!' : 'Copy Link'}
                </Button>
              </div>

              <div className="flex justify-end pt-2">
                <Button variant="outline" onClick={() => setIsShareModalOpen(false)} className="text-xs font-mono font-bold bg-slate-950 border-slate-800 text-slate-300">
                  Close
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
