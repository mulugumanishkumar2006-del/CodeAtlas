import React from 'react';
import { Compass, Plus, GitBranch, Layers, Terminal } from 'lucide-react';

interface EmptyStateProps {
  onOpenAddModal: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onOpenAddModal }) => {
  return (
    <div className="welcome-hero">
      <div className="welcome-icon-box">
        <Compass size={32} />
      </div>

      <h2 className="welcome-title">Software Repository Intelligence</h2>
      <p className="welcome-subtitle">
        CodeAtlas builds deep structural intelligence across codebases. Connect a Git repository to begin mapping architectures, symbol dependencies, and codebase insights.
      </p>

      <div className="features-grid">
        <div className="feature-card">
          <Layers size={20} className="feature-icon" />
          <h3 className="feature-title">Architecture Maps</h3>
          <p className="feature-desc">
            Visualize module boundaries, internal layers, and subsystem hierarchies accurately.
          </p>
        </div>

        <div className="feature-card">
          <GitBranch size={20} className="feature-icon" />
          <h3 className="feature-title">Dependency Graphs</h3>
          <p className="feature-desc">
            Trace import graphs, external package usage, and cross-file symbol call structures.
          </p>
        </div>

        <div className="feature-card">
          <Terminal size={20} className="feature-icon" />
          <h3 className="feature-title">Natural Querying</h3>
          <p className="feature-desc">
            Ask targeted questions about your codebase, APIs, design patterns, and implementations.
          </p>
        </div>
      </div>

      <div className="welcome-cta">
        <button 
          id="btn-empty-state-add" 
          className="btn-primary" 
          onClick={onOpenAddModal}
        >
          <Plus size={16} />
          <span>Connect Your First Repository</span>
        </button>
      </div>
    </div>
  );
};
