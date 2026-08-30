import React from 'react';
import { Repository, HealthStatus } from '../types';
import { 
  Compass, 
  Plus, 
  FolderGit2, 
  Server, 
  Database,
  Radio,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Circle
} from 'lucide-react';

interface SidebarProps {
  repositories: Repository[];
  selectedRepo: Repository | null;
  onSelectRepo: (repo: Repository | null) => void;
  onOpenAddModal: () => void;
  health: HealthStatus | null;
  isLoading: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  repositories,
  selectedRepo,
  onSelectRepo,
  onOpenAddModal,
  health,
  isLoading,
}) => {
  const getStatusClass = () => {
    if (!health) return '';
    return health.status; // 'healthy', 'degraded', 'unhealthy'
  };

  const renderRepoStatusBadge = (repo: Repository) => {
    const status = repo.acquisition_status || 'NOT_CLONED';
    
    if (status === 'READY') {
      return (
        <span className="sidebar-repo-status ready" title="Source code ready in workspace">
          <CheckCircle2 size={11} style={{ color: 'var(--accent-emerald)' }} />
          <span>Ready</span>
        </span>
      );
    }
    if (status === 'CLONING') {
      return (
        <span className="sidebar-repo-status active" title="Cloning source code">
          <Loader2 size={11} className="spin-animation" style={{ color: 'var(--accent-cyan)' }} />
          <span>Cloning...</span>
        </span>
      );
    }
    if (status === 'SYNCING') {
      return (
        <span className="sidebar-repo-status active" title="Synchronizing latest commit">
          <Loader2 size={11} className="spin-animation" style={{ color: 'var(--accent-cyan)' }} />
          <span>Syncing...</span>
        </span>
      );
    }
    if (status === 'ERROR') {
      const isAuth = repo.acquisition_error?.toLowerCase().includes('authentication');
      return (
        <span className="sidebar-repo-status error" title={repo.acquisition_error || 'Error'}>
          <AlertTriangle size={11} style={{ color: 'var(--accent-rose)' }} />
          <span>{isAuth ? 'Auth required' : 'Error'}</span>
        </span>
      );
    }
    return (
      <span className="sidebar-repo-status unacquired" title="Connected, not yet cloned">
        <Circle size={9} style={{ color: 'var(--text-muted)' }} />
        <span>Connected</span>
      </span>
    );
  };

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="brand-icon">
          <Compass size={18} />
        </div>
        <div>
          <h1 className="brand-title">CodeAtlas</h1>
        </div>
        <span className="brand-badge">Phase 4</span>
      </div>

      {/* Primary Action */}
      <div className="sidebar-actions">
        <button 
          id="btn-add-repository" 
          className="btn-add-repo"
          onClick={onOpenAddModal}
        >
          <Plus size={16} />
          <span>Add Repository</span>
        </button>
      </div>

      {/* Repositories Section */}
      <div className="sidebar-section-title">
        Repositories ({repositories.length})
      </div>

      <div className="repo-list">
        {isLoading && repositories.length === 0 ? (
          <div className="sidebar-empty-repos">Loading repositories...</div>
        ) : repositories.length === 0 ? (
          <div className="sidebar-empty-repos">
            <FolderGit2 size={24} style={{ opacity: 0.4 }} />
            <span>No repositories connected</span>
          </div>
        ) : (
          repositories.map((repo) => {
            const isActive = selectedRepo?.id === repo.id;
            return (
              <button
                key={repo.id}
                id={`repo-item-${repo.id}`}
                className={`repo-item ${isActive ? 'active' : ''}`}
                onClick={() => onSelectRepo(repo)}
              >
                <FolderGit2 size={16} className="repo-item-icon" />
                <div className="repo-item-info">
                  <div className="repo-item-name" title={repo.name}>
                    {repo.name}
                  </div>
                  <div className="repo-item-meta">
                    {renderRepoStatusBadge(repo)}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* System Status Footer */}
      <div className="sidebar-footer">
        <div className="system-status-indicator">
          <span className={`status-dot ${getStatusClass()}`} />
          <span>
            {health ? (
              health.status === 'healthy' ? 'Engine Ready' : 'Service Alert'
            ) : (
              'Connecting...'
            )}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 6, color: 'var(--text-muted)' }}>
          <span title={`DB: ${health?.database || 'checking'}`} style={{ display: 'inline-flex' }}>
            <Database size={13} />
          </span>
          <span title={`Redis: ${health?.redis || 'checking'}`} style={{ display: 'inline-flex' }}>
            <Radio size={13} />
          </span>
          <span title={`Env: ${health?.environment || 'development'}`} style={{ display: 'inline-flex' }}>
            <Server size={13} />
          </span>
        </div>
      </div>
    </aside>
  );
};
