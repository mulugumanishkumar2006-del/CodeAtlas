import React, { useState } from 'react';
import { ArrowUp, Sparkles, Command } from 'lucide-react';

interface ChatInputProps {
  selectedRepoName?: string;
  onSubmitQuery?: (query: string) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ selectedRepoName, onSubmitQuery }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const q = query.trim();
    setQuery('');
    onSubmitQuery?.(q);
  };

  const placeholderText = selectedRepoName 
    ? `Ask anything about ${selectedRepoName}... (e.g., 'Explain authentication flow', 'Where is database session created?')` 
    : "Connect a repository to ask structural & architectural questions...";

  return (
    <div className="chat-dock-container">
      <form className="chat-input-box" onSubmit={handleSubmit}>
        <Sparkles size={18} style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} />
        <input
          id="chat-query-input"
          type="text"
          className="chat-input-field"
          placeholder={placeholderText}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="chat-actions">
          <span className="chat-badge" title="Shortcut">
            <Command size={11} style={{ verticalAlign: 'middle' }} /> K
          </span>
          <button
            id="btn-chat-submit"
            type="submit"
            className="btn-chat-send"
            disabled={!query.trim()}
            style={{ opacity: query.trim() ? 1 : 0.5 }}
            aria-label="Send Query"
          >
            <ArrowUp size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};
