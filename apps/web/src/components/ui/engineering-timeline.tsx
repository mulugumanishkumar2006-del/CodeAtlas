'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  Filter,
  ShieldCheck,
  Brain,
  Zap,
  Activity,
  Layers,
  Search,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface TimelineLogEvent {
  id: string;
  timestamp: string;
  category: 'Repository Imported' | 'Analysis Completed' | 'Simulation Started' | 'Simulation Completed' | 'Architecture Drift' | 'Dependency Change' | 'Security Event' | 'AI Investigation' | 'Recommendation Generated';
  repository: string;
  title: string;
  author: string;
  details: string;
}

const TIMELINE_EVENTS: TimelineLogEvent[] = [
  {
    id: 'tl-1',
    timestamp: '10 mins ago',
    category: 'Analysis Completed',
    repository: 'CodeAtlas Core Suite',
    title: 'Continuous AST index updated (35 files, 4,500 LOC)',
    author: 'AI Indexer Agent',
    details: 'Zero static syntax errors or broken imports discovered.'
  },
  {
    id: 'tl-2',
    timestamp: '25 mins ago',
    category: 'Architecture Drift',
    repository: 'Payment Processing Service',
    title: 'Direct REST Router SQL coupling flagged in PaymentService',
    author: 'Drift Monitor Bot',
    details: 'Layer boundary rule violation #14 triggered.'
  },
  {
    id: 'tl-3',
    timestamp: '1 hour ago',
    category: 'Security Event',
    repository: 'Auth Gateway & Identity',
    title: 'SOC2 Type II compliance posture check verified (98.4%)',
    author: 'Security Engine',
    details: 'Zero high CVE dependencies across all active pods.'
  },
  {
    id: 'tl-4',
    timestamp: '3 hours ago',
    category: 'Simulation Completed',
    repository: 'Analytics Telemetry Pipeline',
    title: 'Kafka Microservices Split Simulation completed successfully',
    author: 'Lead Architect',
    details: 'Throughput increased from 35k to 50k events/sec.'
  },
  {
    id: 'tl-5',
    timestamp: 'Yesterday',
    category: 'AI Investigation',
    repository: 'Payment Processing Service',
    title: 'AI completed root-cause analysis for database connection lock',
    author: 'AI Copilot',
    details: 'Identified missing Redis L2 cache layer.'
  }
];

export function EngineeringTimeline() {
  const [timelineFilter, setTimelineFilter] = useState<string>('ALL');
  const [isPlayingScrubber, setIsPlayingScrubber] = useState<boolean>(false);
  const [scrubberStep, setScrubberStep] = useState<number>(TIMELINE_EVENTS.length);

  const filteredTimeline = TIMELINE_EVENTS.filter((evt) => {
    if (timelineFilter === 'ALL') return true;
    return evt.category.toUpperCase().includes(timelineFilter.toUpperCase());
  }).slice(0, scrubberStep);

  const resetScrubber = () => {
    setScrubberStep(TIMELINE_EVENTS.length);
    setIsPlayingScrubber(false);
  };

  return (
    <div className="glass-card rounded-3xl p-6 border border-slate-800/80 shadow-2xl space-y-5 font-sans select-none">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4 font-mono">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-black text-white flex items-center gap-2">
              Live Engineering Timeline
            </h2>
            <p className="text-xs text-slate-400 font-sans">
              Chronological log of analyses, simulations, drift alerts, and AI investigations.
            </p>
          </div>
        </div>

        {/* Timeline Playback Scrubber Controls */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={resetScrubber}
            className="h-8 text-xs font-mono font-bold bg-slate-900 border-slate-800 text-slate-300 hover:text-white rounded-xl gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" /> Reset Timeline
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1 font-mono text-xs">
        <span className="text-slate-500 text-[10px] uppercase font-bold mr-1 flex items-center gap-1">
          <Filter className="w-3 h-3 text-cyan-400" /> FILTER:
        </span>
        {['ALL', 'Analysis', 'Drift', 'Security', 'Simulation', 'AI'].map((cat) => (
          <button
            key={cat}
            onClick={() => setTimelineFilter(cat)}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all ${
              timelineFilter === cat
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800/80'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Vertical Timeline Feed */}
      <div className="space-y-4 relative pl-4 border-l border-slate-800/80 font-mono text-xs">
        <AnimatePresence>
          {filteredTimeline.map((evt, idx) => (
            <motion.div
              key={evt.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2, delay: idx * 0.05 }}
              className="relative pl-6 space-y-1 group"
            >
              {/* Timeline Dot Indicator */}
              <span className="absolute -left-[21px] top-1 w-3.5 h-3.5 rounded-full bg-slate-950 border-2 border-cyan-400 group-hover:bg-cyan-400 transition-colors flex items-center justify-center">
                <span className="w-1 h-1 rounded-full bg-cyan-200" />
              </span>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                    {evt.category}
                  </span>
                  <span className="text-cyan-400 font-bold">{evt.repository}</span>
                </div>
                <span className="text-slate-500 text-[10px]">{evt.timestamp}</span>
              </div>

              <h4 className="font-bold text-white text-sm leading-snug">{evt.title}</h4>
              <p className="text-slate-400 font-sans text-xs">{evt.details}</p>

              <div className="text-[10px] text-slate-500 pt-1">
                Triggered by: <span className="text-slate-300 font-bold">{evt.author}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
