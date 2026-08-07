'use client';

import React, { useState } from 'react';
import {
  DocPage,
  GitHubAlertType,
  InterSystemLink,
  CodeExample,
} from './doc-types';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Info,
  ShieldAlert,
  Flame,
  ExternalLink,
  Copy,
  Check,
  Play,
  Share2,
  Printer,
  History,
  MessageSquare,
  Bookmark,
  Star,
  Maximize2,
  Layers,
  Network,
  Database,
  FlaskConical,
  Zap,
  ShieldCheck,
  Search,
  ArrowRight,
  GitCommit,
  UserCheck,
  RefreshCw,
  Code2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DocReaderViewProps {
  doc: DocPage;
  allDocs: DocPage[];
  onSelectDoc: (id: string) => void;
  onOpenVersionModal: () => void;
  onOpenPresentation: () => void;
  onOpenCollaboration: () => void;
  onToggleBookmark: (id: string) => void;
  onTriggerLiveUpdate: () => void;
}

export function DocReaderView({
  doc,
  allDocs,
  onSelectDoc,
  onOpenVersionModal,
  onOpenPresentation,
  onOpenCollaboration,
  onToggleBookmark,
  onTriggerLiveUpdate,
}: DocReaderViewProps) {
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [executedCodeOutput, setExecutedCodeOutput] = useState<Record<string, string>>({});

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleRunCode = (example: CodeExample) => {
    setExecutedCodeOutput((prev) => ({
      ...prev,
      [example.id]: example.outputSnippet || '✔ Executed successfully in local sandbox kernel (0.04s)',
    }));
  };

  const getSystemIcon = (sys: InterSystemLink['system']) => {
    switch (sys) {
      case 'repository_explorer':
        return Code2;
      case 'architecture_graph':
        return Network;
      case 'knowledge_graph':
        return Database;
      case 'dependency_graph':
        return Layers;
      case 'call_flow':
        return Search;
      case 'simulation':
        return Zap;
      case 'ai_investigation':
        return FlaskConical;
      case 'security':
        return ShieldCheck;
      case 'performance':
        return Flame;
      default:
        return ExternalLink;
    }
  };

  const renderAlert = (type: GitHubAlertType, title: string, content: string) => {
    let borderStyle = 'border-blue-500/40 bg-blue-950/20 text-blue-200';
    let Icon = Info;
    let badgeText = 'NOTE';

    if (type === 'tip') {
      borderStyle = 'border-emerald-500/40 bg-emerald-950/20 text-emerald-200';
      Icon = Sparkles;
      badgeText = 'TIP';
    } else if (type === 'important') {
      borderStyle = 'border-purple-500/40 bg-purple-950/20 text-purple-200';
      Icon = CheckCircle2;
      badgeText = 'IMPORTANT';
    } else if (type === 'warning') {
      borderStyle = 'border-amber-500/40 bg-amber-950/20 text-amber-200';
      Icon = AlertTriangle;
      badgeText = 'WARNING';
    } else if (type === 'caution') {
      borderStyle = 'border-rose-500/40 bg-rose-950/20 text-rose-200';
      Icon = ShieldAlert;
      badgeText = 'CAUTION';
    }

    return (
      <div className={cn('p-4 rounded-xl border font-sans my-4 backdrop-blur-sm shadow-md', borderStyle)}>
        <div className="flex items-center gap-2 font-mono font-bold text-xs mb-1">
          <Icon className="w-4 h-4 shrink-0" />
          <span className="uppercase tracking-wider font-extrabold">{badgeText}:</span>
          <span>{title}</span>
        </div>
        <p className="text-xs leading-relaxed text-slate-300 pl-6">{content}</p>
      </div>
    );
  };

  const relatedDocs = allDocs.filter((d) => doc.relatedDocIds.includes(d.id));

  return (
    <div className="flex-1 flex overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* Scrollable Main Reader Area */}
      <div className="flex-1 overflow-y-auto px-6 py-8 lg:px-12 space-y-10 scrollbar-thin scrollbar-thumb-slate-800">
        {/* Document Top Bar Controls & Metadata */}
        <div className="space-y-4 pb-6 border-b border-slate-800/80">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Category & AI Confidence Badge */}
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-extrabold uppercase tracking-wider bg-slate-900 text-cyan-400 border border-cyan-500/30">
                {doc.typeId.replace('-', ' ')}
              </span>
              <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-extrabold bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>AI Confidence {doc.aiConfidence}%</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800">
                Model: {doc.confidenceModel}
              </span>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleBookmark(doc.id)}
                className={cn(
                  'p-2 rounded-lg border transition-all text-xs flex items-center gap-1.5 font-mono',
                  doc.isBookmarked
                    ? 'bg-amber-500/10 text-amber-300 border-amber-500/40'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                )}
                title="Bookmark Page"
              >
                <Bookmark className={cn('w-3.5 h-3.5', doc.isBookmarked && 'fill-amber-300')} />
                <span className="hidden sm:inline">{doc.isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
              </button>

              <button
                onClick={onOpenVersionModal}
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors text-xs flex items-center gap-1.5 font-mono"
                title="Version History"
              >
                <History className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">v2.4 History</span>
              </button>

              <button
                onClick={onOpenPresentation}
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors text-xs flex items-center gap-1.5 font-mono"
                title="Presentation Mode"
              >
                <Maximize2 className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Present</span>
              </button>

              <button
                onClick={onOpenCollaboration}
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors text-xs flex items-center gap-1.5 font-mono relative"
                title="Comments & Feedback"
              >
                <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
                <span className="hidden sm:inline">Discuss ({doc.comments.length})</span>
                {doc.comments.length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-purple-400 absolute top-1 right-1" />
                )}
              </button>

              <button
                onClick={() => window.print()}
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                title="Print Mode"
              >
                <Printer className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Title & Subtitle */}
          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300">
              {doc.title}
            </h1>
            <p className="text-sm text-slate-400 mt-1.5 font-sans leading-relaxed">{doc.subtitle}</p>
          </div>

          {/* Live Sync Status Info */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-400 font-mono pt-1">
            <span className="flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
              <span>Last Synced: <strong className="text-slate-200">{doc.lastUpdated}</strong></span>
            </span>

            <span className="flex items-center gap-1.5">
              <GitCommit className="w-3.5 h-3.5 text-purple-400" />
              <span>Commit: <code className="text-cyan-300 bg-slate-900 px-1.5 py-0.5 rounded">{doc.lastCommitHash}</code></span>
            </span>

            <span className="flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Author: <strong className="text-slate-200">{doc.author}</strong></span>
            </span>

            <button
              onClick={onTriggerLiveUpdate}
              className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 ml-auto"
            >
              <span>Simulate Live Re-indexing</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* INTERCONNECTED SYSTEM LINKS BAR */}
        {doc.interSystemLinks.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Interconnected CodeAtlas Engines</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {doc.interSystemLinks.map((link, idx) => {
                const IconComponent = getSystemIcon(link.system);
                return (
                  <a
                    key={idx}
                    href={link.url}
                    className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900 transition-all group flex items-start justify-between"
                  >
                    <div className="space-y-1 pr-2">
                      <div className="flex items-center gap-2">
                        <IconComponent className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform shrink-0" />
                        <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 leading-tight">
                          {link.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{link.description}</p>
                    </div>
                    {link.badge && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shrink-0">
                        {link.badge}
                      </span>
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION 1: Summary & Purpose */}
        <section id="summary" className="space-y-4">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            Executive Summary & Purpose
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
              <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">Summary</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">{doc.summary}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
              <h3 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">Purpose</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">{doc.purpose}</p>
            </div>
          </div>
        </section>

        {/* SECTION 2: Business & Technical Context */}
        <section id="context" className="space-y-4">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            Business & Technical Context
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-2">
              <h3 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">Business Impact</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{doc.businessContext}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-2">
              <h3 className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider">Technical Context</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{doc.technicalContext}</p>
            </div>
          </div>
        </section>

        {/* SECTION 3: Architecture & Interactive Diagram */}
        <section id="architecture" className="space-y-4">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-2">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            Architecture & Component Topology
          </h2>

          <p className="text-xs text-slate-300 leading-relaxed">{doc.architectureSummary}</p>

          {doc.diagrams.map((diag) => (
            <div key={diag.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3 font-mono">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">{diag.title}</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {diag.type.toUpperCase()} DIAGRAM
                </span>
              </div>

              {/* Interactive Node Layout Canvas */}
              <div className="p-6 rounded-lg bg-slate-950 border border-slate-800/80 overflow-x-auto">
                <div className="flex flex-wrap items-center justify-center gap-6 min-w-[500px]">
                  {diag.nodes.map((node, nIdx) => (
                    <div key={node.id} className="flex items-center gap-4">
                      <div className="p-3.5 rounded-xl bg-slate-900 border border-cyan-500/30 shadow-lg shadow-cyan-950/50 flex flex-col items-center text-center w-36 hover:border-cyan-400 transition-colors">
                        <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">{node.type}</span>
                        <span className="text-xs font-bold text-slate-100 mt-1">{node.label}</span>
                        {node.subtext && <span className="text-[9px] text-slate-400 mt-0.5">{node.subtext}</span>}
                      </div>

                      {nIdx < diag.nodes.length - 1 && (
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-[9px] text-slate-500">
                            {diag.edges[nIdx]?.label || 'sync'}
                          </span>
                          <div className="w-8 h-0.5 bg-gradient-to-r from-cyan-500 to-indigo-500 relative">
                            <div className="absolute right-0 -top-1 w-2 h-2 border-t-2 border-r-2 border-indigo-400 rotate-45" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* SECTION 4: Dependencies */}
        {doc.dependenciesList.length > 0 && (
          <section id="dependencies" className="space-y-4">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              Dependencies & Inter-Package Graph
            </h2>

            <p className="text-xs text-slate-300">{doc.dependenciesSummary}</p>

            <div className="overflow-x-auto rounded-xl border border-slate-800 font-mono text-xs">
              <table className="w-full text-left bg-slate-900/50">
                <thead className="bg-slate-900 border-b border-slate-800 text-[10px] text-slate-400 uppercase">
                  <tr>
                    <th className="p-3">Package Name</th>
                    <th className="p-3">Version</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Rationale</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {doc.dependenciesList.map((dep, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/80">
                      <td className="p-3 font-bold text-cyan-300">{dep.name}</td>
                      <td className="p-3 text-slate-400">{dep.version}</td>
                      <td className="p-3">
                        <span className="px-1.5 py-0.5 rounded text-[9px] bg-slate-800 text-slate-300">
                          {dep.type}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400">{dep.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* SECTION 5: Interactive Code Examples */}
        {doc.codeExamples.length > 0 && (
          <section id="examples" className="space-y-4">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Interactive Code Examples
            </h2>

            {doc.codeExamples.map((example) => (
              <div key={example.id} className="rounded-xl border border-slate-800 bg-slate-900/80 overflow-hidden font-mono">
                {/* Code Header */}
                <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    <span className="text-xs font-bold text-slate-200 ml-2">{example.title}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {example.isExecutable && (
                      <button
                        onClick={() => handleRunCode(example)}
                        className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 text-[10px] font-bold flex items-center gap-1 transition-colors"
                      >
                        <Play className="w-3 h-3 fill-emerald-300" />
                        <span>Run Snippet</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleCopyCode(example.code, example.id)}
                      className="px-2 py-1 rounded bg-slate-900 text-slate-400 hover:text-white border border-slate-800 text-[10px] flex items-center gap-1"
                    >
                      {copiedCodeId === example.id ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>{copiedCodeId === example.id ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {/* Code Body */}
                <div className="p-4 bg-slate-950 text-xs overflow-x-auto text-cyan-200 leading-relaxed">
                  <pre>{example.code}</pre>
                </div>

                {/* Explanation Footer */}
                <div className="p-3 bg-slate-900/90 border-t border-slate-800/80 text-[11px] text-slate-400 font-sans">
                  <strong className="text-slate-300 font-mono uppercase text-[9px] mr-2">Explanation:</strong>
                  {example.explanation}
                </div>

                {/* Simulated Execution Output */}
                {executedCodeOutput[example.id] && (
                  <div className="p-3 bg-emerald-950/30 border-t border-emerald-500/30 font-mono text-[11px] text-emerald-300">
                    <span className="font-bold text-[9px] uppercase tracking-wider block text-emerald-400 mb-1">
                      Execution Output:
                    </span>
                    <pre className="whitespace-pre-wrap">{executedCodeOutput[example.id]}</pre>
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {/* SECTION 6: GitHub Alerts & Warnings */}
        {doc.alerts.length > 0 && (
          <section id="alerts" className="space-y-2">
            {doc.alerts.map((alt, idx) => (
              <React.Fragment key={idx}>{renderAlert(alt.type, alt.title, alt.content)}</React.Fragment>
            ))}
          </section>
        )}

        {/* SECTION 7: Best Practices & Common Mistakes */}
        <section id="best-practices" className="space-y-4">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Best Practices & Common Pitfalls
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
              <h3 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Best Practices Checklist
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {doc.bestPractices.map((bp, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{bp}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
              <h3 className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Common Mistakes to Avoid
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {doc.commonMistakes.map((cm, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">•</span>
                    <span>{cm}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION 8: Related Documentation Interlinking */}
        {relatedDocs.length > 0 && (
          <section id="related" className="space-y-3 pt-4 border-t border-slate-800">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Related Generated Documentation
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
              {relatedDocs.map((rDoc) => (
                <button
                  key={rDoc.id}
                  onClick={() => onSelectDoc(rDoc.id)}
                  className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 text-left transition-all group"
                >
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">
                    {rDoc.typeId}
                  </span>
                  <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 truncate block mt-0.5">
                    {rDoc.title}
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Sticky Table of Contents Right Outline Sidebar */}
      <div className="w-64 border-l border-slate-800/80 bg-slate-950/80 p-6 hidden xl:block shrink-0 font-mono text-xs space-y-6 select-none">
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Page Outline
          </span>
          <nav className="space-y-1 border-l border-slate-800 pl-3">
            {[
              { id: 'summary', label: 'Summary & Purpose' },
              { id: 'context', label: 'Business & Tech Context' },
              { id: 'architecture', label: 'Architecture Topology' },
              { id: 'dependencies', label: 'Dependencies' },
              { id: 'examples', label: 'Interactive Examples' },
              { id: 'best-practices', label: 'Best Practices' },
              { id: 'related', label: 'Related Docs' },
            ].map((sec) => (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                className="block text-slate-400 hover:text-cyan-400 py-1 transition-colors text-[11px]"
              >
                {sec.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Quality Card */}
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
            Quality Audit
          </span>
          <div className="space-y-1 text-[11px] text-slate-300">
            <div className="flex justify-between">
              <span>Stale Check:</span>
              <span className="text-emerald-400 font-bold">PASSED</span>
            </div>
            <div className="flex justify-between">
              <span>Drift Score:</span>
              <span className="text-cyan-400 font-bold">0.00%</span>
            </div>
            <div className="flex justify-between">
              <span>Approval:</span>
              <span className="text-purple-400 font-bold uppercase">{doc.approvalStatus}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
