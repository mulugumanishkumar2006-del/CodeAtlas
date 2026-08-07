'use client';

import React, { useState } from 'react';
import { CodeReviewTarget, SmartReviewComment } from './review-types';
import { MOCK_REVIEW_TARGETS } from './review-mock-data';
import { ReviewScorecardDashboard } from './review-scorecard-dashboard';
import { ReviewSplitDiffViewer } from './review-split-diff-viewer';
import { ReviewPerformancePrediction } from './review-performance-prediction';
import { ReviewSecurityOwasp } from './review-security-owasp';
import { ReviewSimulationPanel } from './review-simulation-panel';
import { ReviewCollaborationBar } from './review-collaboration-bar';
import {
  GitPullRequest,
  Columns,
  Zap,
  ShieldCheck,
  Layers,
  Sparkles,
  Search,
  CheckCircle2,
  FileCode2,
  GitBranch,
  GitCommit,
  Bot,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function CodeReviewWorkspace() {
  const [currentTarget, setCurrentTarget] = useState<CodeReviewTarget>(MOCK_REVIEW_TARGETS[0]);
  const [activeTab, setActiveTab] = useState<'diff' | 'scorecard' | 'performance' | 'security' | 'simulation'>('diff');

  const handleApplyFix = (comment: SmartReviewComment) => {
    setCurrentTarget((prev) => ({
      ...prev,
      comments: prev.comments.map((c) => (c.id === comment.id ? { ...c, resolved: true } : c)),
      scorecard: {
        ...prev.scorecard,
        overallScore: Math.min(100, prev.scorecard.overallScore + 2),
        securityScore: 100,
      },
    }));
  };

  const handleToggleResolve = (commentId: string) => {
    setCurrentTarget((prev) => ({
      ...prev,
      comments: prev.comments.map((c) => (c.id === commentId ? { ...c, resolved: !c.resolved } : c)),
    }));
  };

  const handleApprove = () => {
    setCurrentTarget((prev) => ({ ...prev, status: 'APPROVED' }));
  };

  const handleRequestChanges = () => {
    setCurrentTarget((prev) => ({ ...prev, status: 'CHANGES_REQUESTED' }));
  };

  const handleExportReport = (format: 'pdf' | 'markdown') => {
    const reportText = `# AI Code Review Report: ${currentTarget.title}\n\nOverall Score: ${currentTarget.scorecard.overallScore}/100\nDeployment Readiness: ${currentTarget.scorecard.deploymentReadiness}\n\n## Smart Findings:\n${currentTarget.comments.map((c) => `- [${c.severity}] ${c.title}: ${c.problemDescription}`).join('\n')}`;
    const blob = new Blob([reportText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code-review-${currentTarget.id}.md`;
    a.click();
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Platform Header */}
      <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 shrink-0 font-mono">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-cyan-400" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-black text-slate-100 tracking-tight leading-none">
                AI Code Review Intelligence
              </h1>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                Staff Engineer Agent
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-sans mt-0.5">
              Target: <strong className="text-slate-200">{currentTarget.title}</strong>
            </p>
          </div>
        </div>

        {/* Tab Switcher Navigation */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          {[
            { id: 'diff', label: 'Split Diff & Annotations', icon: Columns },
            { id: 'scorecard', label: 'Review Scorecard', icon: Layers },
            { id: 'performance', label: 'Performance Predictions', icon: Zap },
            { id: 'security', label: 'Security & OWASP', icon: ShieldCheck },
            { id: 'simulation', label: 'Pre-Approval Simulation', icon: Sparkles },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  'px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5',
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/10 text-cyan-200 border-cyan-500/30 font-bold shadow-md'
                    : 'bg-transparent text-slate-400 border-transparent hover:text-slate-200'
                )}
              >
                <Icon className="w-3.5 h-3.5 text-cyan-400" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
        {activeTab === 'diff' && (
          <ReviewSplitDiffViewer
            files={currentTarget.files}
            comments={currentTarget.comments}
            onApplyFix={handleApplyFix}
            onToggleResolve={handleToggleResolve}
          />
        )}

        {activeTab === 'scorecard' && (
          <div className="space-y-6">
            <ReviewScorecardDashboard scorecard={currentTarget.scorecard} />
            <div className="space-y-3 font-mono">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Staff AI Review Comments ({currentTarget.comments.length})
              </h3>
              {currentTarget.comments.map((c) => (
                <div key={c.id}>
                  {/* Reuse ReviewSmartCommentCard */}
                  {/* Render smart comment */}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <ReviewPerformancePrediction predictions={currentTarget.performancePredictions} />
        )}

        {activeTab === 'security' && (
          <ReviewSecurityOwasp items={currentTarget.securityOwaspItems} />
        )}

        {activeTab === 'simulation' && (
          <ReviewSimulationPanel simulation={currentTarget.preApprovalSimulation} />
        )}
      </div>

      {/* Bottom Collaboration & Action Bar */}
      <ReviewCollaborationBar
        status={currentTarget.status}
        onApprove={handleApprove}
        onRequestChanges={handleRequestChanges}
        onExportReport={handleExportReport}
      />
    </div>
  );
}
