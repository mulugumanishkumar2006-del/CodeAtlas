import React from 'react';
import { WorkspaceTab, Repository } from '../types';
import { LayoutGrid, MessageSquareCode, Network, PlayCircle, Compass, ShieldAlert, ShieldCheck, History, FolderTree, Blocks, Settings2, GitPullRequest, LucideIcon } from 'lucide-react';

interface WorkspaceNavProps {
  currentTab: WorkspaceTab;
  onTabChange: (tab: WorkspaceTab) => void;
  selectedRepo: Repository | null;
}

export const WorkspaceNav: React.FC<WorkspaceNavProps> = ({
  currentTab,
  onTabChange,
  selectedRepo,
}) => {
  const tabs: { id: WorkspaceTab; label: string; icon: LucideIcon }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutGrid },
    { id: 'reviews', label: 'PR Reviewer', icon: GitPullRequest },
    { id: 'chat', label: 'Assistant / Q&A', icon: MessageSquareCode },
    { id: 'architecture', label: 'Architecture', icon: Network },
    { id: 'simulation', label: 'Future Simulator', icon: PlayCircle },
    { id: 'engineering', label: 'AI CTO / Planning', icon: Compass },
    { id: 'quality', label: 'Quality & Debt', icon: ShieldAlert },
    { id: 'security', label: 'Security & Reliability', icon: ShieldCheck },
    { id: 'history', label: 'History & Evolution', icon: History },
    { id: 'files', label: 'Files & AST', icon: FolderTree },
    { id: 'dependencies', label: 'Dependencies', icon: Blocks },
    { id: 'settings', label: 'Settings', icon: Settings2 },
  ];

  return (
    <nav className="workspace-tabs" aria-label="Repository workspace navigation">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;
        // In the foundation stage, non-overview tabs are disabled when no repo is selected
        const isDisabled = !selectedRepo && tab.id !== 'overview';

        return (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            className={`tab-button ${isActive ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
            disabled={isDisabled}
            title={isDisabled ? 'Select a repository to unlock workspace tabs' : tab.label}
          >
            <Icon size={14} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
