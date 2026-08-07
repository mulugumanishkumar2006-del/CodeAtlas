'use client';

import React, { useState } from 'react';
import { DocPage, LiveTriggerType, ApprovalStatus } from './doc-types';
import { MOCK_DOC_PAGES } from './doc-mock-data';
import { DocSidebar } from './doc-sidebar';
import { DocReaderView } from './doc-reader-view';
import { DocAIExplainerModal } from './doc-ai-explainer-modal';
import { DocLiveSyncPanel } from './doc-live-sync-panel';
import { DocSearchModal } from './doc-search-modal';
import { DocPresentationMode } from './doc-presentation-mode';
import { DocDiffVersionModal } from './doc-diff-version-modal';
import { DocCollaborationPanel } from './doc-collaboration-panel';

export function DocumentationWorkspace() {
  const [docs, setDocs] = useState<DocPage[]>(MOCK_DOC_PAGES);
  const [activeDocId, setActiveDocId] = useState<string>('doc-repo-overview');
  
  // Modals & Panels state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLiveSyncOpen, setIsLiveSyncOpen] = useState(false);
  const [isExplainerOpen, setIsExplainerOpen] = useState(false);
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
  const [isCollaborationOpen, setIsCollaborationOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const activeDoc = docs.find((d) => d.id === activeDocId) || docs[0];

  const handleToggleBookmark = (id: string) => {
    setDocs((prev) =>
      prev.map((d) => (d.id === id ? { ...d, isBookmarked: !d.isBookmarked } : d))
    );
  };

  const handleTriggerLiveUpdate = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setDocs((prev) =>
        prev.map((d) =>
          d.id === activeDocId
            ? {
                ...d,
                lastUpdated: 'Just now (Live Re-indexed)',
                aiConfidence: Math.min(99.9, +(d.aiConfidence + 0.1).toFixed(1)),
              }
            : d
        )
      );
      setIsSyncing(false);
    }, 800);
  };

  const handleAddComment = (docId: string, text: string) => {
    setDocs((prev) =>
      prev.map((d) => {
        if (d.id === docId) {
          const newComment = {
            id: `c-${Date.now()}`,
            author: {
              name: 'Current User',
              avatar: '',
              role: 'Staff Engineer',
            },
            timestamp: 'Just now',
            content: text,
            resolved: false,
          };
          return { ...d, comments: [...d.comments, newComment] };
        }
        return d;
      })
    );
  };

  const handleUpdateApproval = (docId: string, status: ApprovalStatus) => {
    setDocs((prev) =>
      prev.map((d) => (d.id === docId ? { ...d, approvalStatus: status } : d))
    );
  };

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Left Notion/GitBook Sidebar */}
      <DocSidebar
        docs={docs}
        activeDocId={activeDocId}
        onSelectDoc={setActiveDocId}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenLiveSync={() => setIsLiveSyncOpen(true)}
        onOpenExplainer={() => setIsExplainerOpen(true)}
        isSyncing={isSyncing}
      />

      {/* Main Enterprise Reader Area */}
      <DocReaderView
        doc={activeDoc}
        allDocs={docs}
        onSelectDoc={setActiveDocId}
        onOpenVersionModal={() => setIsVersionModalOpen(true)}
        onOpenPresentation={() => setIsPresentationOpen(true)}
        onOpenCollaboration={() => setIsCollaborationOpen(true)}
        onToggleBookmark={handleToggleBookmark}
        onTriggerLiveUpdate={handleTriggerLiveUpdate}
      />

      {/* AI Explainer Modal */}
      <DocAIExplainerModal
        isOpen={isExplainerOpen}
        onClose={() => setIsExplainerOpen(false)}
        currentDocTitle={activeDoc.title}
      />

      {/* Live Auto-Sync Status & Simulation Drawer */}
      <DocLiveSyncPanel
        isOpen={isLiveSyncOpen}
        onClose={() => setIsLiveSyncOpen(false)}
        onTriggerEvent={() => handleTriggerLiveUpdate()}
      />

      {/* Semantic Search Modal (Cmd+K) */}
      <DocSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        docs={docs}
        onSelectDoc={setActiveDocId}
      />

      {/* Fullscreen Slide Presentation Mode */}
      <DocPresentationMode
        isOpen={isPresentationOpen}
        onClose={() => setIsPresentationOpen(false)}
        doc={activeDoc}
      />

      {/* Version History & Diff Viewer */}
      <DocDiffVersionModal
        isOpen={isVersionModalOpen}
        onClose={() => setIsVersionModalOpen(false)}
        doc={activeDoc}
      />

      {/* Collaboration Drawer (Comments & Approval Workflow) */}
      <DocCollaborationPanel
        isOpen={isCollaborationOpen}
        onClose={() => setIsCollaborationOpen(false)}
        doc={activeDoc}
        onAddComment={handleAddComment}
        onUpdateApproval={handleUpdateApproval}
      />
    </div>
  );
}
