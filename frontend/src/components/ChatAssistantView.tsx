import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  User, 
  Send, 
  Sparkles, 
  FileCode, 
  ExternalLink, 
  RefreshCw, 
  Plus, 
  ChevronDown, 
  ChevronRight, 
  ShieldCheck, 
  AlertCircle,
  Layers,
  Terminal
} from 'lucide-react';
import { Repository, ChatMessage } from '../types';
import { api } from '../services/api';
import { collaborationWs } from '../services/collaborationWs';

interface ChatAssistantViewProps {
  repository: Repository;
  onNavigateToFile?: (path: string, startLine?: number, endLine?: number) => void;
  initialQuestion?: string | null;
  onClearInitialQuestion?: () => void;
}

export const ChatAssistantView: React.FC<ChatAssistantViewProps> = ({
  repository,
  onNavigateToFile,
  initialQuestion,
  onClearInitialQuestion,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState<string>('Analyzing repository...');
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [expandedSources, setExpandedSources] = useState<Record<number, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Load conversations on repo change
  useEffect(() => {
    let isMounted = true;
    const loadConversations = async () => {
      try {
        setError(null);
        const res = await api.getConversations(repository.id);
        if (!isMounted) return;
        if (res.conversations && res.conversations.length > 0) {
          const latest = res.conversations[0];
          setActiveConversationId(latest.id);
          setMessages(latest.messages || []);
        } else {
          setActiveConversationId(null);
          setMessages([]);
        }
      } catch (err: any) {
        if (isMounted) {
          console.error('Error loading conversations:', err);
        }
      }
    };

    loadConversations();
    return () => {
      isMounted = false;
    };
  }, [repository.id]);

  // Handle initial question submitted from bottom dock
  useEffect(() => {
    if (initialQuestion && initialQuestion.trim() && !isLoading) {
      handleSendMessage(initialQuestion.trim());
      onClearInitialQuestion?.();
    }
  }, [initialQuestion]);

  const handleNewChat = async () => {
    try {
      setError(null);
      const newConv = await api.createConversation(repository.id, `Chat ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
      setActiveConversationId(newConv.id);
      setMessages([]);
      setTimeout(() => inputRef.current?.focus(), 100);
    } catch (err: any) {
      console.error('Failed to create new conversation:', err);
      // Local fallback reset
      setActiveConversationId(null);
      setMessages([]);
    }
  };

  const handleSendMessage = async (queryText?: string) => {
    const q = (queryText || inputQuery).trim();
    if (!q || isLoading) return;

    setInputQuery('');
    setError(null);

    // Optimistic user message
    const userMsg: ChatMessage = {
      role: 'user',
      content: q,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setLoadingStage('Analyzing query intent & keywords...');

    // Try real-time streaming via WebSocket
    let streamedAnyToken = false;
    let unsubToken: (() => void) | null = null;
    let unsubComplete: (() => void) | null = null;
    let unsubError: (() => void) | null = null;

    const cleanupWsListeners = () => {
      if (unsubToken) unsubToken();
      if (unsubComplete) unsubComplete();
      if (unsubError) unsubError();
    };

    const runRestFallback = async () => {
      cleanupWsListeners();
      try {
        const response = await api.queryRepository(
          repository.id,
          q,
          activeConversationId,
        );

        const assistantMsg: ChatMessage = {
          role: 'assistant',
          content: response.answer,
          intent: response.intent,
          evidence: response.evidence || response.sources || [],
          sources: response.sources || response.evidence || [],
          related_symbols: response.related_symbols,
          related_files: response.related_files,
          related_dependencies: response.related_dependencies,
          created_at: new Date().toISOString(),
        };

        setMessages((prev) => {
          // Replace empty streaming placeholder if present, else append
          const last = prev[prev.length - 1];
          if (last && last.role === 'assistant' && !last.content) {
            return [...prev.slice(0, -1), assistantMsg];
          }
          return [...prev, assistantMsg];
        });

        if (response.conversation_id && !activeConversationId) {
          setActiveConversationId(response.conversation_id);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to query repository intelligence.');
        const errorMsg: ChatMessage = {
          role: 'assistant',
          content: `Error: ${err.message || 'Unable to complete repository analysis. Please verify the repository has been indexed.'}`,
          sources: [],
          created_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsLoading(false);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    };

    try {
      // Add empty assistant message placeholder ready to receive tokens
      const placeholderMsg: ChatMessage = {
        role: 'assistant',
        content: '',
        sources: [],
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, placeholderMsg]);

      // Set up streaming token listeners
      unsubToken = collaborationWs.on('ai.token', (ev) => {
        const tok = ev.payload?.token;
        if (tok) {
          streamedAnyToken = true;
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last && last.role === 'assistant') {
              updated[updated.length - 1] = {
                ...last,
                content: last.content + tok,
              };
            }
            return updated;
          });
        }
      });

      unsubComplete = collaborationWs.on('ai.response.completed', (ev) => {
        cleanupWsListeners();
        const payload = ev.payload?.payload || ev.payload;
        if (payload) {
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last && last.role === 'assistant') {
              updated[updated.length - 1] = {
                role: 'assistant',
                content: payload.answer || last.content,
                intent: payload.intent,
                evidence: payload.evidence || payload.sources || [],
                sources: payload.sources || payload.evidence || [],
                related_symbols: payload.related_symbols,
                related_files: payload.related_files,
                related_dependencies: payload.related_dependencies,
                created_at: new Date().toISOString(),
              };
            }
            return updated;
          });
          if (payload.conversation_id && !activeConversationId) {
            setActiveConversationId(payload.conversation_id);
          }
        }
        setIsLoading(false);
      });

      unsubError = collaborationWs.on('ai.response.error', () => {
        cleanupWsListeners();
        if (!streamedAnyToken) {
          runRestFallback();
        } else {
          setIsLoading(false);
        }
      });

      // Send streaming query through WebSocket
      collaborationWs.send({
        type: 'ai.query',
        question: q,
        conversation_id: activeConversationId,
      });

      // Safety timeout: if no token arrives in 4 seconds, fallback to REST
      setTimeout(() => {
        if (!streamedAnyToken && isLoading) {
          runRestFallback();
        }
      }, 4000);

    } catch (wsErr) {
      console.warn('[ChatAssistantView] WS query failed, using REST fallback:', wsErr);
      runRestFallback();
    }
  };

  const toggleSourceExpand = (index: number) => {
    setExpandedSources((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Render markdown with clickable citation chips
  const renderMessageContent = (content: string) => {
    // Regex matching citations like [src/auth/service.py:25–48] or [src/auth/service.py:25-48]
    const citationRegex = /\[([a-zA-Z0-9_\-\.\/\\]+\.[a-zA-Z0-9]+):(\d+)[–\-](\d+)\]/g;

    const parts: (string | React.ReactNode)[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = citationRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(content.substring(lastIndex, match.index));
      }

      const filePath = match[1];
      const startLine = parseInt(match[2], 10);
      const endLine = parseInt(match[3], 10);

      parts.push(
        <button
          key={`cite-${match.index}`}
          className="citation-badge-btn"
          onClick={() => onNavigateToFile?.(filePath, startLine, endLine)}
          title={`Open ${filePath} (Lines ${startLine}–${endLine}) in Code Explorer`}
        >
          <FileCode size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
          <span>{filePath}:{startLine}–{endLine}</span>
          <ExternalLink size={10} style={{ marginLeft: 4, verticalAlign: 'middle', opacity: 0.7 }} />
        </button>
      );

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }

    return (
      <div className="chat-markdown-body">
        {parts.map((part, idx) => {
          if (typeof part !== 'string') return part;

          const lines = part.split('\n');
          return (
            <React.Fragment key={idx}>
              {lines.map((line, lIdx) => {
                if (line.startsWith('### ')) {
                  return <h4 key={lIdx} className="chat-md-h3">{line.replace('### ', '')}</h4>;
                }
                if (line.startsWith('## ')) {
                  return <h3 key={lIdx} className="chat-md-h2">{line.replace('## ', '')}</h3>;
                }
                if (line.startsWith('- ') || line.startsWith('* ')) {
                  return (
                    <div key={lIdx} className="chat-md-bullet">
                      <span className="bullet-dot">•</span>
                      <span>{line.substring(2)}</span>
                    </div>
                  );
                }
                if (line.trim() === '') {
                  return <div key={lIdx} style={{ height: '6px' }} />;
                }
                return <p key={lIdx} className="chat-md-p">{line}</p>;
              })}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  const sampleQueries = [
    'Where is authentication implemented?',
    'What is the high-level architecture and structure?',
    'What dependencies does this project have?',
    'Where are errors handled in this codebase?',
    'What calls the main login function?',
  ];

  return (
    <div className="chat-assistant-container">
      {/* Header bar */}
      <div className="chat-assistant-header">
        <div className="chat-header-meta">
          <div className="chat-avatar-assistant">
            <Bot size={18} />
          </div>
          <div>
            <div className="chat-header-title">
              Repository Intelligence — <span className="highlight-repo">{repository.name}</span>
            </div>
            <div className="chat-header-subtitle">
              <ShieldCheck size={12} style={{ display: 'inline', marginRight: 4, color: 'var(--accent-green)' }} />
              Grounded strictly in indexed AST symbols, files, and dependencies
            </div>
          </div>
        </div>

        <div className="chat-header-actions">
          <button
            id="btn-new-chat"
            className="btn-new-chat"
            onClick={handleNewChat}
            title="Start a new clean chat thread for this repository"
          >
            <Plus size={14} />
            <span>New Chat</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="chat-messages-scroll-area">
        {messages.length === 0 ? (
          <div className="chat-empty-assistant-state">
            <div className="empty-sparkle-icon">
              <Sparkles size={36} />
            </div>
            <h3>Ask CodeAtlas about {repository.name}</h3>
            <p>
              Ask structural, architectural, flow, or implementation questions. Every claim is cited with exact repository file and line ranges.
            </p>

            <div className="suggested-queries-grid">
              {sampleQueries.map((sq, i) => (
                <button
                  key={i}
                  className="suggested-query-card"
                  onClick={() => handleSendMessage(sq)}
                  disabled={isLoading}
                >
                  <Sparkles size={14} style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} />
                  <span>{sq}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="chat-messages-thread">
            {messages.map((msg, idx) => {
              const isUser = msg.role === 'user';
              const sourcesList = msg.evidence || msg.sources || [];
              const hasSources = sourcesList.length > 0;
              const isSourcesExpanded = expandedSources[idx] ?? true;

              return (
                <div
                  key={idx}
                  className={`chat-message-row ${isUser ? 'user-row' : 'assistant-row'}`}
                >
                  <div className={`chat-message-avatar ${isUser ? 'user-avatar' : 'assistant-avatar'}`}>
                    {isUser ? <User size={16} /> : <Bot size={16} />}
                  </div>

                  <div className="chat-message-bubble-wrapper">
                    <div className="chat-message-author-tag">
                      <span>{isUser ? 'You' : 'CodeAtlas Intelligence'}</span>
                      {msg.intent && (
                        <span className="intent-badge-chip" style={{ marginLeft: 8, fontSize: '0.7rem', padding: '2px 6px', borderRadius: 4, background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
                          {msg.intent}
                        </span>
                      )}
                      {msg.created_at && (
                        <span className="chat-message-timestamp">
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>

                    <div className={`chat-message-bubble ${isUser ? 'user-bubble' : 'assistant-bubble'}`}>
                      {renderMessageContent(msg.content)}
                    </div>

                    {/* Related Entities */}
                    {!isUser && ((msg.related_files && msg.related_files.length > 0) || (msg.related_symbols && msg.related_symbols.length > 0)) && (
                      <div className="chat-related-chips-panel" style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {msg.related_files?.slice(0, 3).map((rf, rIdx) => (
                          <button
                            key={`rf-${rIdx}`}
                            className="related-chip-btn"
                            onClick={() => onNavigateToFile?.(rf)}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', padding: '3px 8px', borderRadius: 4, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', color: '#cbd5e1', cursor: 'pointer' }}
                          >
                            <FileCode size={11} />
                            <span>{rf}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Grounded Evidence Source Cards */}
                    {!isUser && hasSources && (
                      <div className="chat-sources-panel">
                        <button
                          className="sources-toggle-btn"
                          onClick={() => toggleSourceExpand(idx)}
                          aria-expanded={isSourcesExpanded}
                        >
                          {isSourcesExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                          <Layers size={13} style={{ marginLeft: 4, marginRight: 4 }} />
                          <span className="sources-count-label">
                            {sourcesList.length} Grounded Repository {sourcesList.length === 1 ? 'Evidence Source' : 'Evidence Sources'}
                          </span>
                        </button>

                        {isSourcesExpanded && (
                          <div className="sources-list-expanded">
                            {sourcesList.map((src, sIdx) => (
                              <div
                                key={sIdx}
                                className="source-item-card"
                                onClick={() => onNavigateToFile?.(src.path, src.start_line, src.end_line)}
                                title="Click to view file and line range in Code Explorer"
                              >
                                <div className="source-item-header">
                                  <FileCode size={14} style={{ color: 'var(--accent-cyan)' }} />
                                  <span className="source-item-path">{src.path}</span>
                                  <span className="source-line-badge">
                                    Lines {src.start_line}–{src.end_line}
                                  </span>
                                  {src.relevance !== undefined && (
                                    <span style={{ fontSize: '0.7rem', color: '#94a3b8', marginLeft: 'auto', marginRight: 6 }}>
                                      {Math.round(src.relevance * 100)}% match
                                    </span>
                                  )}
                                  <ExternalLink size={12} className="source-item-ext" />
                                </div>
                                {src.symbol && (
                                  <div className="source-symbol-info">
                                    <Terminal size={12} style={{ display: 'inline', marginRight: 4 }} />
                                    Symbol: <code>{src.symbol}</code>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Real-time Loading State */}
            {isLoading && (
              <div className="chat-message-row assistant-row">
                <div className="chat-message-avatar assistant-avatar">
                  <Bot size={16} />
                </div>
                <div className="chat-message-bubble-wrapper">
                  <div className="chat-loading-container">
                    <RefreshCw size={16} className="spinner-icon" />
                    <span>{loadingStage}</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Error Banner */}
      {error && (
        <div className="chat-error-banner">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}

      {/* Chat Input Bar */}
      <div className="chat-input-container">
        <form
          className="chat-input-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
        >
          <Sparkles size={18} className="chat-sparkle-prefix" />
          <input
            ref={inputRef}
            id="chat-assistant-input"
            type="text"
            className="chat-assistant-input-field"
            placeholder={`Ask about ${repository.name}... (e.g., 'How does authentication work?')`}
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            disabled={isLoading}
          />
          <button
            id="btn-chat-assistant-submit"
            type="submit"
            className="btn-chat-assistant-send"
            disabled={!inputQuery.trim() || isLoading}
            aria-label="Send Query"
          >
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  );
};
