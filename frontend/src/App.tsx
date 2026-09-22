import React, { useState, useEffect, useCallback } from 'react';
import { Repository, HealthStatus, WorkspaceTab, RepositoryCreateInput, PresenceUser } from './types';
import { api } from './services/api';
import { collaborationWs } from './services/collaborationWs';
import { Sidebar } from './components/Sidebar';
import { WorkspaceNav } from './components/WorkspaceNav';
import { EmptyState } from './components/EmptyState';
import { RepositoryDetail } from './components/RepositoryDetail';
import { ChatInput } from './components/ChatInput';
import { AddRepositoryModal } from './components/AddRepositoryModal';

export const App: React.FC = () => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('overview');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [initialChatQuestion, setInitialChatQuestion] = useState<string | null>(null);
  const [activeUsers, setActiveUsers] = useState<PresenceUser[]>([]);
  const [liveAnalysis, setLiveAnalysis] = useState<{ stage: string; progress_percent: number } | null>(null);

  // Fetch health and repository list from backend
  const loadInitialData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [healthData, reposData] = await Promise.allSettled([
        api.getHealth(),
        api.getRepositories(),
      ]);

      if (healthData.status === 'fulfilled') {
        setHealth(healthData.value);
      }
      if (reposData.status === 'fulfilled') {
        const repos = reposData.value;
        setRepositories(repos);
        if (repos.length > 0) {
          setSelectedRepo((prev) => {
            if (!prev) return repos[0];
            const updated = repos.find((r) => r.id === prev.id);
            return updated || repos[0];
          });
        } else {
          setSelectedRepo(null);
        }
      }
    } catch (err) {
      console.error('Error loading initial data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Reload single repository from backend
  const refreshRepository = useCallback(async (id: string) => {
    try {
      const updatedRepo = await api.getRepository(id);
      setRepositories((prev) =>
        prev.map((r) => (r.id === id ? updatedRepo : r))
      );
      setSelectedRepo((prev) => (prev?.id === id ? updatedRepo : prev));
      return updatedRepo;
    } catch (err) {
      console.error(`Error refreshing repository ${id}:`, err);
    }
  }, []);

  useEffect(() => {
    loadInitialData();

    // Poll health check and repo status every 15s
    const interval = setInterval(async () => {
      try {
        const healthData = await api.getHealth();
        setHealth(healthData);
      } catch {
        setHealth((prev) => (prev ? { ...prev, status: 'unhealthy' } : null));
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [loadInitialData]);

  // Real-Time Collaboration: WebSocket lifecycle & live events
  useEffect(() => {
    if (!selectedRepo) {
      collaborationWs.disconnect();
      setActiveUsers([]);
      return;
    }

    collaborationWs.connect(selectedRepo.id, activeTab);

    // Initial presence fetch
    api.getPresence(selectedRepo.id).then((users) => {
      if (users && users.length > 0) setActiveUsers(users);
    }).catch(() => {});

    const unsubPresence = collaborationWs.on('presence.update', (ev) => {
      if (ev.payload?.users) {
        setActiveUsers(ev.payload.users);
      }
    });

    const unsubAnalysisProg = collaborationWs.on('analysis.progress', (ev) => {
      setLiveAnalysis({
        stage: ev.payload.stage || ev.payload.current_stage || 'analyzing',
        progress_percent: ev.payload.progress_percent || ev.payload.progress || 0,
      });
      setSelectedRepo((prev) => (prev ? { ...prev, analysis_status: 'running' } : null));
    });

    const unsubAnalysisDone = collaborationWs.on('analysis.completed', () => {
      setLiveAnalysis(null);
      refreshRepository(selectedRepo.id);
    });

    const unsubAnalysisFail = collaborationWs.on('analysis.failed', () => {
      setLiveAnalysis(null);
      refreshRepository(selectedRepo.id);
    });

    return () => {
      unsubPresence();
      unsubAnalysisProg();
      unsubAnalysisDone();
      unsubAnalysisFail();
    };
  }, [selectedRepo?.id, refreshRepository]);

  // Tab change heartbeat
  useEffect(() => {
    if (selectedRepo) {
      collaborationWs.sendHeartbeat(activeTab);
    }
  }, [activeTab, selectedRepo]);

  // Handle adding repository
  const handleAddRepository = async (input: RepositoryCreateInput) => {
    const newRepo = await api.createRepository(input);
    setRepositories((prev) => [newRepo, ...prev]);
    setSelectedRepo(newRepo);
    setActiveTab('overview');
  };

  // Handle deleting repository
  const handleDeleteRepository = async (id: string) => {
    await api.deleteRepository(id);
    setRepositories((prev) => prev.filter((r) => r.id !== id));
    if (selectedRepo?.id === id) {
      setSelectedRepo(null);
    }
  };

  // Handle Git Acquisition (Clone)
  const handleCloneRepository = async (id: string) => {
    setRepositories((prev) =>
      prev.map((r) => (r.id === id ? { ...r, acquisition_status: 'CLONING' } : r))
    );
    setSelectedRepo((prev) =>
      prev?.id === id ? { ...prev, acquisition_status: 'CLONING' } : prev
    );

    try {
      await api.cloneRepository(id);
    } catch (err) {
      console.error('Error triggering clone:', err);
    } finally {
      await refreshRepository(id);
    }
  };

  // Handle Git Synchronization (Sync)
  const handleSyncRepository = async (id: string) => {
    setRepositories((prev) =>
      prev.map((r) => (r.id === id ? { ...r, acquisition_status: 'SYNCING' } : r))
    );
    setSelectedRepo((prev) =>
      prev?.id === id ? { ...prev, acquisition_status: 'SYNCING' } : prev
    );

    try {
      await api.syncRepository(id);
    } catch (err) {
      console.error('Error triggering sync:', err);
    } finally {
      await refreshRepository(id);
    }
  };

  // Handle Indexing & AST Analysis
  const handleIndexRepository = async (id: string) => {
    setRepositories((prev) =>
      prev.map((r) => (r.id === id ? { ...r, analysis_status: 'running' } : r))
    );
    setSelectedRepo((prev) =>
      prev?.id === id ? { ...prev, analysis_status: 'running' } : prev
    );

    try {
      await api.indexRepository(id);
    } catch (err) {
      console.error('Error triggering indexing:', err);
    } finally {
      setTimeout(() => refreshRepository(id), 1500);
    }
  };

  // Handle dock query submission
  const handleDockQuerySubmit = (question: string) => {
    if (!question.trim()) return;
    setInitialChatQuestion(question.trim());
    setActiveTab('chat');
  };

  return (
    <div className="app-container">
      {/* Left Sidebar */}
      <Sidebar
        repositories={repositories}
        selectedRepo={selectedRepo}
        onSelectRepo={(repo) => {
          setSelectedRepo(repo);
          setActiveTab('overview');
        }}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        health={health}
        isLoading={isLoading}
      />

      {/* Main Workspace */}
      <main className="main-workspace">
        {/* Workspace Header */}
        <header className="workspace-header">
          <div className="repo-header-info">
            <h2 className="repo-header-title">
              {selectedRepo ? selectedRepo.name : 'Workspace'}
            </h2>
            {selectedRepo && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="repo-badge-status">
                  {selectedRepo.analysis_status === 'completed'
                    ? 'ANALYZED'
                    : selectedRepo.analysis_status === 'running'
                    ? 'ANALYZING'
                    : selectedRepo.acquisition_status || selectedRepo.status}
                </span>

                {/* Live Analysis Progress */}
                {liveAnalysis && (
                  <span
                    style={{
                      fontSize: '11px',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      background: 'rgba(99, 102, 241, 0.15)',
                      color: '#818cf8',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#6366f1', animation: 'pulse 1.5s infinite' }}></span>
                    {liveAnalysis.stage} ({liveAnalysis.progress_percent}%)
                  </span>
                )}

                {/* Real-Time Collaborators Presence Avatars */}
                {activeUsers.length > 0 && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginLeft: '12px',
                      paddingLeft: '12px',
                      borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
                      gap: '4px',
                    }}
                    title={`${activeUsers.length} collaborator(s) online`}
                  >
                    <span style={{ fontSize: '11px', color: '#94a3b8', marginRight: '4px' }}>Online:</span>
                    {activeUsers.map((u) => (
                      <div
                        key={u.user_id}
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          backgroundColor: u.color || '#6366f1',
                          color: '#fff',
                          fontSize: '10px',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '2px solid #0f172a',
                          boxShadow: '0 0 6px rgba(0,0,0,0.3)',
                          cursor: 'pointer',
                        }}
                        title={`${u.username} (${u.current_tab || 'overview'})`}
                      >
                        {u.username.substring(0, 2).toUpperCase()}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <WorkspaceNav
            currentTab={activeTab}
            onTabChange={setActiveTab}
            selectedRepo={selectedRepo}
          />
        </header>

        {/* Workspace Content */}
        <div className="workspace-content">
          {selectedRepo ? (
            <RepositoryDetail
              repository={selectedRepo}
              onDelete={handleDeleteRepository}
              onClone={handleCloneRepository}
              onSync={handleSyncRepository}
              onIndex={handleIndexRepository}
              currentTab={activeTab}
              onTabChange={setActiveTab}
              initialQuestion={initialChatQuestion}
              onClearInitialQuestion={() => setInitialChatQuestion(null)}
            />
          ) : (
            <EmptyState onOpenAddModal={() => setIsAddModalOpen(true)} />
          )}
        </div>

        {/* Natural Chat-style Query Dock */}
        <ChatInput 
          selectedRepoName={selectedRepo?.name} 
          onSubmitQuery={handleDockQuerySubmit}
        />
      </main>

      {/* Add Repository Modal */}
      <AddRepositoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddRepository}
      />
    </div>
  );
};

export default App;
