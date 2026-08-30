import React, { useState } from 'react';
import { X } from 'lucide-react';
import { RepositoryCreateInput } from '../types';

interface AddRepositoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: RepositoryCreateInput) => Promise<void>;
}

export const AddRepositoryModal: React.FC<AddRepositoryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [defaultBranch, setDefaultBranch] = useState('main');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) {
      setError('Please provide both repository name and URL.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSubmit({
        name: name.trim(),
        url: url.trim(),
        default_branch: defaultBranch.trim() || 'main',
        description: description.trim() || undefined,
      });
      // reset form
      setName('');
      setUrl('');
      setDefaultBranch('main');
      setDescription('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to add repository.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Connect Repository</h2>
          <button 
            id="btn-close-modal" 
            className="btn-modal-close" 
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="form-error">{error}</div>}

            <div className="form-group">
              <label htmlFor="repo-name-input" className="form-label">
                Repository Identifier / Name
              </label>
              <input
                id="repo-name-input"
                type="text"
                className="form-input"
                placeholder="e.g. facebook/react or org/my-backend"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="repo-url-input" className="form-label">
                Repository Git / Web URL
              </label>
              <input
                id="repo-url-input"
                type="url"
                className="form-input"
                placeholder="https://github.com/org/repo.git"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="repo-branch-input" className="form-label">
                Default Branch
              </label>
              <input
                id="repo-branch-input"
                type="text"
                className="form-input"
                placeholder="main"
                value={defaultBranch}
                onChange={(e) => setDefaultBranch(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="repo-desc-input" className="form-label">
                Description (Optional)
              </label>
              <textarea
                id="repo-desc-input"
                className="form-textarea"
                placeholder="Brief summary of repository purpose..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              id="btn-submit-repository"
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registering...' : 'Add Repository'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
