import React, { useState, useEffect, useCallback } from 'react';
import { Repository, HealthStatus, WorkspaceTab, RepositoryCreateInput } from './types';
import { api } from './services/api';
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
              <span className="repo-badge-status">
                {selectedRepo.analysis_status === 'completed'
                  ? 'ANALYZED'
                  : selectedRepo.analysis_status === 'running'
                  ? 'ANALYZING'
                  : selectedRepo.acquisition_status || selectedRepo.status}
              </span>
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
