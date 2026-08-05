'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  MessageSquare,
  Plus,
  Play,
  Share2,
  Users,
  CheckCircle2,
  HelpCircle,
  AlertTriangle,
  FileText,
  User,
  Zap,
  MousePointer
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StickyNote {
  id: string;
  author: string;
  role: string;
  color: 'cyan' | 'amber' | 'emerald' | 'purple';
  text: string;
  x: number;
  y: number;
}

export function CollaborativeWhiteboard() {
  const [notes, setNotes] = useState<StickyNote[]>([
    { id: 'note-1', author: 'Sarah Jenkins (Principal)', role: 'Core Platform', color: 'cyan', text: 'Should we extract PaymentService into two sub-domain modules?', x: 120, y: 80 },
    { id: 'note-2', author: 'Marcus Vance (Tech Lead)', role: 'Payments Guild', color: 'emerald', text: 'Approved: Kafka topic payment.events.v1 eliminates 100% of gateway timeouts.', x: 420, y: 140 },
    { id: 'note-3', author: 'Elena Rostova (Security Lead)', role: 'Security Guild', color: 'purple', text: 'Verify RS256 token rotation keys in Vault before cutover.', x: 260, y: 320 }
  ]);

  const [isWalkthroughMode, setIsWalkthroughMode] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');

  const handleAddNote = () => {
    if (!newNoteText.trim()) return;
    const colors: ('cyan' | 'amber' | 'emerald' | 'purple')[] = ['cyan', 'amber', 'emerald', 'purple'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const newNote: StickyNote = {
      id: `note-${notes.length + 1}`,
      author: 'You (Enterprise Architect)',
      role: 'Architecture Board',
      color: randomColor,
      text: newNoteText,
      x: 180 + notes.length * 40,
      y: 180 + notes.length * 30,
    };
    setNotes([...notes, newNote]);
    setNewNoteText('');
  };

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden font-sans select-none">
      {/* Whiteboard Header Toolbar */}
      <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between p-3 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Collaborative Architecture Workshop Canvas</h3>
            <span className="text-[10px] font-mono text-slate-400">Live Active Session • 4 Engineers Online</span>
          </div>
        </div>

        {/* Live Active Collaborator Avatars */}
        <div className="flex items-center gap-3">
          <div className="flex items-center -space-x-2">
            <div className="w-7 h-7 rounded-full bg-cyan-500 text-slate-950 font-mono font-bold text-[10px] flex items-center justify-center border-2 border-slate-950" title="Sarah Jenkins">SJ</div>
            <div className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 font-mono font-bold text-[10px] flex items-center justify-center border-2 border-slate-950" title="Marcus Vance">MV</div>
            <div className="w-7 h-7 rounded-full bg-purple-500 text-slate-950 font-mono font-bold text-[10px] flex items-center justify-center border-2 border-slate-950" title="Elena Rostova">ER</div>
          </div>

          <Button
            onClick={() => setIsWalkthroughMode(!isWalkthroughMode)}
            className={`font-bold text-xs gap-1.5 rounded-xl h-8 font-mono ${
              isWalkthroughMode ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-800 text-slate-200'
            }`}
          >
            <Play className="w-3.5 h-3.5" /> {isWalkthroughMode ? 'Exit Walkthrough' : 'Start Presentation Walkthrough'}
          </Button>
        </div>
      </div>

      {/* Grid Canvas Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      {/* Sticky Notes Canvas */}
      <div className="relative w-full h-full p-20 overflow-auto scrollbar-none">
        {notes.map((note) => (
          <div
            key={note.id}
            style={{ top: note.y, left: note.x }}
            className={`absolute w-72 p-4 rounded-2xl border shadow-2xl backdrop-blur-xl transition-all cursor-move space-y-2 animate-in zoom-in-95 duration-150 ${
              note.color === 'cyan'
                ? 'bg-cyan-950/80 border-cyan-500/40 text-cyan-100 shadow-cyan-950/50'
                : note.color === 'emerald'
                ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-100 shadow-emerald-950/50'
                : note.color === 'amber'
                ? 'bg-amber-950/80 border-amber-500/40 text-amber-100 shadow-amber-950/50'
                : 'bg-purple-950/80 border-purple-500/40 text-purple-100 shadow-purple-950/50'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] font-mono border-b border-white/10 pb-1.5">
              <span className="font-bold">{note.author}</span>
              <span className="opacity-70">{note.role}</span>
            </div>
            <p className="text-xs font-sans leading-relaxed text-white font-medium">{note.text}</p>
          </div>
        ))}
      </div>

      {/* Bottom Sticky Note Controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 p-2 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-2xl">
        <input
          type="text"
          placeholder="Add architecture comment or design annotation..."
          value={newNoteText}
          onChange={(e) => setNewNoteText(e.target.value)}
          className="w-80 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
        />
        <Button
          onClick={handleAddNote}
          className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold text-xs gap-1 rounded-xl h-8 font-mono"
        >
          <Plus className="w-3.5 h-3.5" /> Add Note
        </Button>
      </div>
    </div>
  );
}
