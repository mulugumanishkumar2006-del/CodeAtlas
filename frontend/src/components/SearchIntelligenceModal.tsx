import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  RepositorySearchResponse, 
  SymbolSearchMatch, 
  FileSearchMatch, 
  CodeSearchMatch, 
  DependencySearchMatch, 
  DirectorySearchMatch 
} from '../types';
import { api } from '../services/api';
import { 
  Search, 
  X, 
  Code2, 
  FileCode2, 
  FileText, 
  ArrowRightLeft, 
  FolderTree, 
  Activity, 
  Clock, 
  Sparkles, 
  ArrowRight,
  ChevronRight,
  CornerDownLeft
} from 'lucide-react';

interface SearchIntelligenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  repositoryId: string;
  repositoryName: string;
  onNavigateToSource: (fileId: string, line?: number) => void;
}

type TabCategory = 'all' | 'symbol' | 'file' | 'code' | 'dependency' | 'architecture' | 'directory';

const RECENT_SEARCHES_KEY = 'codeatlas_recent_searches';

export const SearchIntelligenceModal: React.FC<SearchIntelligenceModalProps> = ({
  isOpen,
  onClose,
  repositoryId,
  repositoryName,
  onNavigateToSource,
}) => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabCategory>('all');
  const [results, setResults] = useState<RepositorySearchResponse | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement | null>(null);

  // Load recent searches from sessionStorage
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Save recent search
  const saveRecentSearch = (term: string) => {
    if (!term || term.trim().length < 2) return;
    const clean = term.trim();
    const updated = [clean, ...recentSearches.filter(s => s.toLowerCase() !== clean.toLowerCase())].slice(0, 6);
    setRecentSearches(updated);
    try {
      sessionStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  // Perform search
  const executeSearch = useCallback(async (searchQuery: string, category: TabCategory = 'all') => {
    if (!searchQuery || searchQuery.trim().length === 0) {
      setResults(null);
      return;
    }

    setIsSearching(true);
    try {
      const typeParam = category === 'all' ? 'all' : category;
      const res: RepositorySearchResponse = await api.searchRepository(
        repositoryId,
        searchQuery.trim(),
        { type: typeParam as any, limit: 40 }
      );
      setResults(res);
      saveRecentSearch(searchQuery);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setIsSearching(false);
    }
  }, [repositoryId]);

  // Debounced auto-search when query changes
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults(null);
      return;
    }

    const timer = setTimeout(() => {
      executeSearch(query, activeTab);
    }, 280);

    return () => clearTimeout(timer);
  }, [query, activeTab, executeSearch]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
      setResults(null);
    }
  }, [isOpen]);

  // Keyboard navigation & Shortcuts (Escape to close, Enter to search/open)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const totalMatches = results?.total_matches || 0;
  const symbolCount = results?.symbols?.length || 0;
  const fileCount = results?.files?.length || 0;
  const codeCount = results?.code_matches?.length || 0;
  const depCount = results?.dependencies?.length || 0;
  const dirCount = results?.directories?.length || 0;
  const archCount = (results?.architecture || results?.architecture_matches || []).length;

  return (
    <div className="search-intel-overlay" onClick={onClose}>
      <div className="search-intel-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Main Search Input Bar */}
        <div className="search-intel-header">
          <div className="search-intel-input-box">
            <Search size={18} style={{ color: 'var(--accent-cyan)' }} />
            <input
              ref={inputRef}
              type="text"
              placeholder={`Search or ask about ${repositoryName}... (e.g. 'authenticate', 'what depends on auth.py?')`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  executeSearch(query, activeTab);
                }
              }}
              className="search-intel-input"
            />
            {query && (
              <button className="search-clear-btn" onClick={() => setQuery('')}>
                <X size={15} />
              </button>
            )}
          </div>
          <button className="search-modal-close" onClick={onClose} title="Close (Esc)">
            <X size={18} />
          </button>
        </div>

        {/* Query Intent & Explanation Banner */}
        {results && results.intent && results.intent !== 'KEYWORD_SEARCH' && (
          <div className="search-intent-banner">
            <Sparkles size={14} style={{ color: 'var(--accent-cyan)' }} />
            <span className="intent-badge">{results.intent.replace('_', ' ')}</span>
            <span className="intent-explanation">{results.explanation}</span>
          </div>
        )}

        {/* Filter Category Pills */}
        <div className="search-categories-bar">
          <button 
            className={`cat-pill ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => { setActiveTab('all'); executeSearch(query, 'all'); }}
          >
            All Results ({totalMatches})
          </button>
          <button 
            className={`cat-pill ${activeTab === 'symbol' ? 'active' : ''}`}
            onClick={() => { setActiveTab('symbol'); executeSearch(query, 'symbol'); }}
          >
            Symbols ({symbolCount})
          </button>
          <button 
            className={`cat-pill ${activeTab === 'file' ? 'active' : ''}`}
            onClick={() => { setActiveTab('file'); executeSearch(query, 'file'); }}
          >
            Files ({fileCount})
          </button>
          <button 
            className={`cat-pill ${activeTab === 'code' ? 'active' : ''}`}
            onClick={() => { setActiveTab('code'); executeSearch(query, 'code'); }}
          >
            Code Lines ({codeCount})
          </button>
          <button 
            className={`cat-pill ${activeTab === 'dependency' ? 'active' : ''}`}
            onClick={() => { setActiveTab('dependency'); executeSearch(query, 'dependency'); }}
          >
            Dependencies ({depCount})
          </button>
          {archCount > 0 && (
            <button 
              className={`cat-pill ${activeTab === 'architecture' ? 'active' : ''}`}
              onClick={() => { setActiveTab('architecture'); executeSearch(query, 'architecture'); }}
            >
              Architecture ({archCount})
            </button>
          )}
          {dirCount > 0 && (
            <button 
              className={`cat-pill ${activeTab === 'directory' ? 'active' : ''}`}
              onClick={() => { setActiveTab('directory'); executeSearch(query, 'directory'); }}
            >
              Directories ({dirCount})
            </button>
          )}
        </div>

        {/* Results Body / Container */}
        <div className="search-intel-body">
          {isSearching ? (
            <div className="search-status-box">
              <Activity size={20} className="spin-animation" style={{ color: 'var(--accent-cyan)' }} />
              <span>Searching repository intelligence...</span>
            </div>
          ) : !query ? (
            /* Empty state & Recent Searches */
            <div className="search-empty-state">
              {recentSearches.length > 0 && (
                <div className="recent-searches-section">
                  <div className="recent-header">
                    <Clock size={13} style={{ color: 'var(--text-muted)' }} />
                    <span>Recent Searches</span>
                  </div>
                  <div className="recent-tags-row">
                    {recentSearches.map((term, i) => (
                      <button 
                        key={i} 
                        className="recent-tag-btn"
                        onClick={() => {
                          setQuery(term);
                          executeSearch(term, activeTab);
                        }}
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="search-hint-box">
                <h5>Structured Code Queries You Can Try:</h5>
                <ul>
                  <li><code>Where is authentication implemented?</code></li>
                  <li><code>What depends on auth.py?</code></li>
                  <li><code>What does api.py import?</code></li>
                  <li><code>Who calls login?</code></li>
                  <li><code>directory services</code></li>
                  <li><code>UserService</code> or <code>JWT</code></li>
                </ul>
              </div>
            </div>
          ) : totalMatches === 0 ? (
            /* No Results Found */
            <div className="search-no-results">
              <h4>No results found for "{query}"</h4>
              <p>Try searching for a symbol name, exact file path, or ask a dependency question like "What depends on [filename]?".</p>
            </div>
          ) : (
            /* Result Groups */
            <div className="search-results-groups">
              {/* 1. SYMBOLS GROUP */}
              {(activeTab === 'all' || activeTab === 'symbol') && results && results.symbols.length > 0 && (
                <div className="result-group-block">
                  <div className="group-heading">
                    <Code2 size={14} style={{ color: 'var(--accent-cyan)' }} />
                    <span>Symbols ({results.symbols.length})</span>
                  </div>
                  <div className="group-items-list">
                    {results.symbols.map((sym: SymbolSearchMatch) => (
                      <div 
                        key={sym.id}
                        className="search-item-card symbol-card"
                        onClick={() => {
                          onNavigateToSource(sym.file_id, sym.start_line);
                          onClose();
                        }}
                      >
                        <div className="card-top-row">
                          <span className="match-name">{sym.name}</span>
                          <span className="match-badge type">{sym.symbol_type}</span>
                          <span className="match-path-tag">{sym.file_path}:{sym.start_line}</span>
                        </div>
                        <div className="card-sub-info">
                          <span className="match-qname">{sym.qualified_name}</span>
                          <span className="match-range">Lines {sym.start_line}–{sym.end_line}</span>
                        </div>
                        {sym.docstring && (
                          <div className="match-doc-snippet">{sym.docstring}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. FILES GROUP */}
              {(activeTab === 'all' || activeTab === 'file') && results && results.files.length > 0 && (
                <div className="result-group-block">
                  <div className="group-heading">
                    <FileCode2 size={14} style={{ color: 'var(--accent-indigo)' }} />
                    <span>Files ({results.files.length})</span>
                  </div>
                  <div className="group-items-list">
                    {results.files.map((f: FileSearchMatch) => (
                      <div 
                        key={f.id}
                        className="search-item-card file-card"
                        onClick={() => {
                          onNavigateToSource(f.id);
                          onClose();
                        }}
                      >
                        <div className="card-top-row">
                          <span className="match-name">{f.path}</span>
                          <span className="match-badge lang">{f.language || 'Plain Text'}</span>
                        </div>
                        <div className="card-sub-info">
                          <span>{f.line_count} lines</span>
                          <span>{((f.size_bytes || 0) / 1024).toFixed(1)} KB</span>
                          <span className="item-action-hint">Open file <ChevronRight size={12} /></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. CODE MATCHES GROUP (with 3-line snippet context) */}
              {(activeTab === 'all' || activeTab === 'code') && results && results.code_matches.length > 0 && (
                <div className="result-group-block">
                  <div className="group-heading">
                    <FileText size={14} style={{ color: 'var(--accent-emerald)' }} />
                    <span>Code Lines ({results.code_matches.length})</span>
                  </div>
                  <div className="group-items-list">
                    {results.code_matches.map((cm: CodeSearchMatch, i: number) => (
                      <div 
                        key={i}
                        className="search-item-card code-card"
                        onClick={() => {
                          onNavigateToSource(cm.file_id, cm.line_number);
                          onClose();
                        }}
                      >
                        <div className="card-top-row">
                          <span className="match-path-tag">{cm.file_path}:{cm.line_number}</span>
                          <span className="item-action-hint">Jump to line <CornerDownLeft size={12} /></span>
                        </div>
                        {cm.context_snippet && cm.context_snippet.length > 0 ? (
                          <div className="context-snippet-box">
                            {cm.context_snippet.map((line, idx) => (
                              <div key={idx} className={`snippet-line ${line.is_target ? 'target-line' : ''}`}>
                                <span className="snippet-gutter">{line.line_number}</span>
                                <span className="snippet-content">{line.content || ' '}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="single-line-snippet">{cm.line_content}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. DEPENDENCIES GROUP */}
              {(activeTab === 'all' || activeTab === 'dependency') && results && results.dependencies.length > 0 && (
                <div className="result-group-block">
                  <div className="group-heading">
                    <ArrowRightLeft size={14} style={{ color: '#fbbf24' }} />
                    <span>Dependencies ({results.dependencies.length})</span>
                  </div>
                  <div className="group-items-list">
                    {results.dependencies.map((dep: DependencySearchMatch, i: number) => (
                      <div 
                        key={i}
                        className="search-item-card dep-card"
                        onClick={() => {
                          if (dep.source_file_id) {
                            onNavigateToSource(dep.source_file_id, dep.line || undefined);
                            onClose();
                          }
                        }}
                      >
                        <div className="dep-flow-row">
                          <span className="dep-endpoint">{dep.source_path || 'Unknown'}</span>
                          <ArrowRight size={13} style={{ color: 'var(--accent-cyan)' }} />
                          <span className="dep-endpoint target">{dep.target_path || dep.name}</span>
                          <span className="match-badge type">{dep.dependency_type}</span>
                        </div>
                        <div className="card-sub-info">
                          <span>{dep.relationship_type === 'incoming' ? 'Depended on by file' : 'Outgoing import'}</span>
                          {dep.line && <span>Line {dep.line}</span>}
                          {dep.resolved ? (
                            <span style={{ color: 'var(--accent-emerald)' }}>Internal</span>
                          ) : (
                            <span style={{ color: 'var(--text-muted)' }}>External</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. ARCHITECTURE GROUP */}
              {(activeTab === 'all' || activeTab === 'architecture') && results && (results.architecture || results.architecture_matches || []).length > 0 && (
                <div className="result-group-block">
                  <div className="group-heading">
                    <FolderTree size={14} style={{ color: '#c084fc' }} />
                    <span>Architecture ({(results.architecture || results.architecture_matches || []).length})</span>
                  </div>
                  <div className="group-items-list">
                    {(results.architecture || results.architecture_matches || []).map((arch, i) => (
                      <div key={i} className="search-item-card arch-card">
                        <div className="card-top-row">
                          <span className="match-name">{arch.name}</span>
                          <span className="match-badge type" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' }}>{arch.node_type}</span>
                        </div>
                        {arch.description && (
                          <div className="card-sub-info">
                            <span>{arch.description}</span>
                          </div>
                        )}
                        {arch.match_reason && (
                          <div className="match-doc-snippet" style={{ color: 'var(--text-muted)' }}>
                            {arch.match_reason}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. DIRECTORIES GROUP */}
              {(activeTab === 'all' || activeTab === 'directory') && results && results.directories.length > 0 && (
                <div className="result-group-block">
                  <div className="group-heading">
                    <FolderTree size={14} style={{ color: 'var(--accent-cyan)' }} />
                    <span>Directories ({results.directories.length})</span>
                  </div>
                  <div className="group-items-list">
                    {results.directories.map((dir: DirectorySearchMatch, i: number) => (
                      <div key={i} className="search-item-card dir-card">
                        <div className="card-top-row">
                          <span className="match-name">{dir.directory}/</span>
                        </div>
                        <div className="card-sub-info">
                          <span>{dir.file_count} files</span>
                          <span>{dir.line_count.toLocaleString()} lines</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="search-intel-footer">
          <div className="footer-keys">
            <span><kbd>Esc</kbd> to close</span>
            <span><kbd>Enter</kbd> to jump</span>
          </div>
          <div className="footer-repo-label">
            Repository: <strong>{repositoryName}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
