import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  FileItem, 
  FileDetail, 
  SymbolItem, 
} from '../types';
import { api } from '../services/api';
import { SearchIntelligenceModal } from './SearchIntelligenceModal';
import { ImpactIntelligenceModal } from './ImpactIntelligenceModal';
import { 
  Folder, 
  FolderOpen, 
  FileCode2, 
  ChevronRight, 
  ChevronDown, 
  Search, 
  Copy, 
  Check, 
  ArrowRight, 
  Code2, 
  AlertTriangle, 
  Activity, 
  X, 
  FileQuestion,
  Zap 
} from 'lucide-react';

interface CodeExplorerProps {
  repositoryId: string;
  repositoryName: string;
  initialFileId?: string | null;
  initialLine?: number | null;
  onNavigateToFile?: (fileId: string, line?: number) => void;
}

interface TreeNode {
  name: string;
  path: string;
  isFolder: boolean;
  fileItem?: FileItem;
  children: Record<string, TreeNode>;
}

export const CodeExplorer: React.FC<CodeExplorerProps> = ({
  repositoryId,
  repositoryName,
  initialFileId,
  initialLine,
}) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(initialFileId || null);
  const [fileDetail, setFileDetail] = useState<FileDetail | null>(null);
  
  // Tree expansion state
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [selectedDirectory, setSelectedDirectory] = useState<string | null>(null);
  
  // Navigation & selection states
  const [activeLine, setActiveLine] = useState<number | null>(initialLine || null);
  const [activeSymbol, setActiveSymbol] = useState<SymbolItem | null>(null);
  
  // In-file search
  const [fileSearchQuery, setFileSearchQuery] = useState('');
  
  // Global repository search intelligence modal
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const [impactTargetId, setImpactTargetId] = useState<string | null>(null);

  const [isLoadingFiles, setIsLoadingFiles] = useState(true);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const codeContainerRef = useRef<HTMLDivElement | null>(null);

  // 1. Fetch file list on repository change
  useEffect(() => {
    let isMounted = true;
    setIsLoadingFiles(true);
    setError(null);
    setFiles([]);
    setFileDetail(null);
    setActiveSymbol(null);
    setActiveLine(null);
    setSelectedDirectory(null);

    const loadFiles = async () => {
      try {
        const fileList = await api.getRepositoryFiles(repositoryId);
        if (isMounted) {
          setFiles(fileList);
          // Automatically expand top-level folders
          const initialExpanded = new Set<string>();
          fileList.forEach(f => {
            const parts = f.path.split('/');
            if (parts.length > 1) {
              initialExpanded.add(parts[0]);
              if (parts.length > 2) initialExpanded.add(`${parts[0]}/${parts[1]}`);
            }
          });
          setExpandedFolders(initialExpanded);

          // If initialFileId is provided or files exist, select one
          if (initialFileId) {
            setSelectedFileId(initialFileId);
          } else if (fileList.length > 0) {
            setSelectedFileId(fileList[0].id);
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Failed to load repository files.');
        }
      } finally {
        if (isMounted) {
          setIsLoadingFiles(false);
        }
      }
    };

    loadFiles();

    return () => {
      isMounted = false;
    };
  }, [repositoryId, initialFileId]);

  // 2. Fetch FileDetail when selectedFileId changes
  useEffect(() => {
    if (!selectedFileId) return;

    let isMounted = true;
    setIsLoadingDetail(true);
    setActiveSymbol(null);

    const loadDetail = async () => {
      try {
        const detail = await api.getFileDetail(repositoryId, selectedFileId);
        if (isMounted) {
          setFileDetail(detail);
          if (initialLine) {
            setActiveLine(initialLine);
          }
        }
      } catch (err: any) {
        if (isMounted) {
          console.error('Failed to load file detail:', err);
        }
      } finally {
        if (isMounted) {
          setIsLoadingDetail(false);
        }
      }
    };

    loadDetail();

    return () => {
      isMounted = false;
    };
  }, [repositoryId, selectedFileId]);

  // 3. Scroll to activeLine
  useEffect(() => {
    if (activeLine && codeContainerRef.current) {
      const lineElem = codeContainerRef.current.querySelector(`[data-line="${activeLine}"]`);
      if (lineElem) {
        lineElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [activeLine, fileDetail]);

  // 4. Build File Tree Structure
  const fileTree = useMemo(() => {
    const root: TreeNode = { name: '', path: '', isFolder: true, children: {} };

    files.forEach(f => {
      const parts = f.path.split('/');
      let current = root;
      let currentPath = '';

      parts.forEach((part, index) => {
        currentPath = currentPath ? `${currentPath}/${part}` : part;
        const isFile = index === parts.length - 1;

        if (!current.children[part]) {
          current.children[part] = {
            name: part,
            path: currentPath,
            isFolder: !isFile,
            fileItem: isFile ? f : undefined,
            children: {},
          };
        }
        current = current.children[part];
      });
    });

    return root;
  }, [files]);

  // Toggle folder expansion
  const toggleFolder = (path: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
    setSelectedDirectory(path);
  };

  // Copy code to clipboard
  const handleCopy = () => {
    if (fileDetail?.source) {
      navigator.clipboard.writeText(fileDetail.source);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Directory Aggregated Metrics
  const directoryMetrics = useMemo(() => {
    if (!selectedDirectory) return null;
    const dirFiles = files.filter(f => f.path.startsWith(`${selectedDirectory}/`));
    const totalLines = dirFiles.reduce((acc, f) => acc + (f.line_count || 0), 0);
    const totalSymbols = dirFiles.reduce((acc, f) => acc + (f.symbol_count || 0), 0);
    return {
      name: selectedDirectory,
      fileCount: dirFiles.length,
      lineCount: totalLines,
      symbolCount: totalSymbols,
    };
  }, [selectedDirectory, files]);

  // Recursively Render Tree Nodes
  const renderTree = (node: TreeNode, depth: number = 0) => {
    const sortedKeys = Object.keys(node.children).sort((a, b) => {
      const nodeA = node.children[a];
      const nodeB = node.children[b];
      if (nodeA.isFolder && !nodeB.isFolder) return -1;
      if (!nodeA.isFolder && nodeB.isFolder) return 1;
      return a.localeCompare(b);
    });

    return sortedKeys.map(key => {
      const child = node.children[key];
      if (child.isFolder) {
        const isExpanded = expandedFolders.has(child.path);
        const isSelectedDir = selectedDirectory === child.path;
        return (
          <div key={child.path} className="tree-group">
            <div 
              className={`tree-node folder-node ${isSelectedDir ? 'selected-dir' : ''}`}
              style={{ paddingLeft: `${depth * 14 + 10}px` }}
              onClick={(e) => toggleFolder(child.path, e)}
            >
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              {isExpanded ? (
                <FolderOpen size={15} style={{ color: 'var(--accent-cyan)' }} />
              ) : (
                <Folder size={15} style={{ color: 'var(--accent-indigo)' }} />
              )}
              <span className="node-label" title={child.name}>{child.name}</span>
            </div>
            {isExpanded && renderTree(child, depth + 1)}
          </div>
        );
      } else {
        const isSelected = selectedFileId === child.fileItem?.id;
        return (
          <div 
            key={child.path}
            className={`tree-node file-node ${isSelected ? 'selected' : ''}`}
            style={{ paddingLeft: `${depth * 14 + 24}px` }}
            onClick={() => {
              if (child.fileItem) {
                setSelectedFileId(child.fileItem.id);
                setActiveLine(null);
                setActiveSymbol(null);
                setSelectedDirectory(null);
              }
            }}
          >
            <FileCode2 size={14} style={{ color: isSelected ? 'var(--accent-cyan)' : 'var(--text-secondary)' }} />
            <span className="node-label" title={child.name}>{child.name}</span>
            {child.fileItem?.line_count ? (
              <span className="tree-line-badge">{child.fileItem.line_count}L</span>
            ) : null}
          </div>
        );
      }
    });
  };

  // Breadcrumbs parts
  const breadcrumbParts = useMemo(() => {
    if (!fileDetail) return [repositoryName];
    const pathParts = fileDetail.path.split('/');
    return [repositoryName, ...pathParts];
  }, [repositoryName, fileDetail]);

  // Code lines split
  const sourceLines = useMemo(() => {
    if (!fileDetail?.source) return [];
    return fileDetail.source.split(/\r?\n/);
  }, [fileDetail?.source]);

  if (isLoadingFiles) {
    return (
      <div className="architecture-loading-box">
        <Activity size={24} className="spin-animation" style={{ color: 'var(--accent-cyan)' }} />
        <span>Loading repository file explorer...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="binary-file-warning">
        <AlertTriangle size={32} style={{ color: 'var(--accent-rose)', marginBottom: 12 }} />
        <h4>Failed to load file explorer</h4>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="code-explorer-container">
      {/* Top Header & Breadcrumbs Toolbar */}
      <div className="explorer-topbar">
        <div className="breadcrumbs-row">
          {breadcrumbParts.map((part, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span className="breadcrumb-sep">/</span>}
              <span className={`breadcrumb-item ${i === breadcrumbParts.length - 1 ? 'active' : ''}`}>
                {part}
              </span>
            </React.Fragment>
          ))}
          {activeSymbol && (
            <>
              <span className="breadcrumb-sep">:</span>
              <span className="breadcrumb-item symbol-crumb">
                {activeSymbol.qualified_name || activeSymbol.name}
              </span>
            </>
          )}
        </div>

        {/* Global Search & Quick Actions */}
        <div className="explorer-top-actions">
          <button 
            className="global-search-btn"
            onClick={() => setGlobalSearchOpen(true)}
            title="Search code & symbols across repository"
          >
            <Search size={14} />
            <span>Search Code & Symbols...</span>
            <span className="kbd-shortcut">Ctrl+K</span>
          </button>
        </div>
      </div>

      {/* Global Repository Search Intelligence Modal */}
      <SearchIntelligenceModal
        isOpen={globalSearchOpen}
        onClose={() => setGlobalSearchOpen(false)}
        repositoryId={repositoryId}
        repositoryName={repositoryName}
        onNavigateToSource={(fileId, line) => {
          setSelectedFileId(fileId);
          if (line) setActiveLine(line);
          setGlobalSearchOpen(false);
        }}
      />

      {/* Main 3-Column Code Workspace */}
      <div className="explorer-workspace-grid">
        {/* Left Column: Repository File Tree */}
        <div className="explorer-tree-sidebar">
          <div className="sidebar-section-header">
            <span className="section-title">Files ({files.length})</span>
          </div>

          <div className="file-tree-container">
            {files.length === 0 ? (
              <div className="empty-list-note">No source files indexed</div>
            ) : (
              renderTree(fileTree)
            )}
          </div>

          {/* Directory Aggregated Info Banner (when folder selected) */}
          {directoryMetrics && (
            <div className="dir-metrics-card">
              <div className="dir-metrics-title">
                <Folder size={14} style={{ color: 'var(--accent-cyan)' }} />
                <span>{directoryMetrics.name}</span>
              </div>
              <div className="dir-metrics-grid">
                <div><span>Files:</span> {directoryMetrics.fileCount}</div>
                <div><span>Lines:</span> {directoryMetrics.lineCount.toLocaleString()}</div>
                <div><span>Symbols:</span> {directoryMetrics.symbolCount}</div>
              </div>
            </div>
          )}
        </div>

        {/* Center Column: Source Code Viewer */}
        <div className="explorer-code-pane">
          {/* File Header Bar */}
          {fileDetail && (
            <div className="code-viewer-header">
              <div className="file-meta-left">
                <FileCode2 size={16} style={{ color: 'var(--accent-cyan)' }} />
                <span className="file-header-path">{fileDetail.path}</span>
                <span className="file-header-badge lang">{fileDetail.language || 'Plain Text'}</span>
                <span className="file-header-badge">{fileDetail.line_count} lines</span>
                <span className="file-header-badge">{fileDetail.symbols.length} symbols</span>
              </div>

              <div className="file-meta-right">
                {/* In-file search input */}
                <div className="in-file-search-box">
                  <Search size={12} style={{ color: 'var(--text-muted)' }} />
                  <input 
                    type="text"
                    placeholder="Find in file..."
                    value={fileSearchQuery}
                    onChange={(e) => setFileSearchQuery(e.target.value)}
                    className="in-file-search-input"
                  />
                  {fileSearchQuery && (
                    <button className="clear-search-btn" onClick={() => setFileSearchQuery('')}>
                      <X size={12} />
                    </button>
                  )}
                </div>

                <button 
                  id="btn-file-analyze-impact"
                  className="code-action-btn impact-action-btn" 
                  onClick={() => setImpactTargetId(fileDetail.id)} 
                  title="Analyze dependency and blast radius impact for this file"
                >
                  <Zap size={13} style={{ color: '#f43f5e' }} />
                  <span>Analyze Impact</span>
                </button>

                <button className="code-action-btn" onClick={handleCopy} title="Copy file source code">
                  {copied ? <Check size={14} style={{ color: 'var(--accent-emerald)' }} /> : <Copy size={14} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Code Viewer Body */}
          <div className="code-viewer-body" ref={codeContainerRef}>
            {isLoadingDetail ? (
              <div className="code-loading-box">
                <Activity size={20} className="spin-animation" style={{ color: 'var(--accent-cyan)' }} />
                <span>Fetching file source...</span>
              </div>
            ) : fileDetail?.is_binary ? (
              <div className="binary-file-warning">
                <AlertTriangle size={32} style={{ color: 'var(--accent-rose)', marginBottom: 12 }} />
                <h4>Binary or Non-Text File</h4>
                <p>Source preview is unavailable for binary files ({((fileDetail.size_bytes || 0) / 1024).toFixed(1)} KB).</p>
              </div>
            ) : fileDetail?.is_missing ? (
              <div className="binary-file-warning">
                <FileQuestion size={32} style={{ color: 'var(--accent-rose)', marginBottom: 12 }} />
                <h4>File Missing from Checkout</h4>
                <p>This file was registered during ingestion but is no longer present in the local repository workspace.</p>
              </div>
            ) : sourceLines.length > 0 ? (
              <div className="code-editor-layout">
                {/* Line Gutter + Code Lines */}
                <table className="code-table">
                  <tbody>
                    {sourceLines.map((lineText, idx) => {
                      const lineNum = idx + 1;
                      const isLineActive = activeLine === lineNum;
                      const isSymbolRange = activeSymbol && lineNum >= activeSymbol.start_line && lineNum <= activeSymbol.end_line;
                      const isMatchingSearch = fileSearchQuery && lineText.toLowerCase().includes(fileSearchQuery.toLowerCase());

                      return (
                        <tr 
                          key={lineNum} 
                          data-line={lineNum}
                          className={`code-line-tr ${isLineActive ? 'active-line' : ''} ${isSymbolRange ? 'symbol-range-line' : ''}`}
                          onClick={() => setActiveLine(lineNum)}
                        >
                          <td className="line-num-gutter">{lineNum}</td>
                          <td className="line-code-content">
                            <pre className="code-pre">
                              {isMatchingSearch ? (
                                <span className="search-highlighted-line">{lineText || ' '}</span>
                              ) : (
                                <code>{lineText || ' '}</code>
                              )}
                            </pre>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-file-note">Select a file from the tree to view its source code.</div>
            )}
          </div>
        </div>

        {/* Right Column: Symbol Outline & File Inspector */}
        <div className="explorer-inspector-sidebar">
          {/* Active Symbol Inspector Card */}
          {activeSymbol ? (
            <div className="symbol-detail-card">
              <div className="symbol-detail-header">
                <Code2 size={16} style={{ color: 'var(--accent-cyan)' }} />
                <span className="symbol-detail-title">{activeSymbol.name}</span>
                <span className="symbol-type-pill">{activeSymbol.symbol_type}</span>
              </div>
              <div className="symbol-meta-grid">
                <div><span className="meta-label">Range:</span> Lines {activeSymbol.start_line}–{activeSymbol.end_line}</div>
                <div><span className="meta-label">Qualified:</span> {activeSymbol.qualified_name || activeSymbol.name}</div>
              </div>
              {activeSymbol.docstring && (
                <div className="symbol-docstring-box">
                  <span className="doc-label">Docstring:</span>
                  <p>{activeSymbol.docstring}</p>
                </div>
              )}
              <div style={{ marginTop: 8 }}>
                <button
                  id="btn-symbol-analyze-impact"
                  className="symbol-impact-btn"
                  onClick={() => setImpactTargetId(activeSymbol.id)}
                  title="Analyze blast radius and downstream callers of this symbol"
                >
                  <Zap size={12} style={{ color: '#f43f5e' }} />
                  <span>Analyze Impact</span>
                </button>
              </div>
            </div>
          ) : null}

          {/* Symbol Outline Tree */}
          <div className="outline-section">
            <div className="sidebar-section-header">
              <span className="section-title">Symbol Outline ({fileDetail?.symbols?.length || 0})</span>
            </div>

            <div className="symbol-outline-list">
              {!fileDetail?.symbols || fileDetail.symbols.length === 0 ? (
                <div className="empty-outline-note">No symbols extracted in this file</div>
              ) : (
                fileDetail.symbols.map(sym => {
                  const isSelected = activeSymbol?.id === sym.id;
                  return (
                    <div 
                      key={sym.id}
                      className={`symbol-outline-row ${isSelected ? 'active' : ''}`}
                      onClick={() => {
                        setActiveSymbol(sym);
                        setActiveLine(sym.start_line);
                      }}
                    >
                      <Code2 size={13} style={{ color: 'var(--accent-cyan)' }} />
                      <span className="symbol-name" title={sym.name}>{sym.name}</span>
                      <span className="symbol-line-badge">L{sym.start_line}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* File Dependencies Panel */}
          {fileDetail && (
            <div className="file-deps-section">
              <div className="sidebar-section-header">
                <span className="section-title">Imports & Dependencies</span>
              </div>

              {/* Outgoing Imports */}
              <div className="deps-subhead">Imports ({fileDetail.dependencies.length})</div>
              <div className="deps-sublist">
                {fileDetail.dependencies.length === 0 ? (
                  <div className="empty-deps-note">None</div>
                ) : (
                  fileDetail.dependencies.map((dep, idx) => (
                    <div 
                      key={idx} 
                      className="dep-item-row"
                      onClick={() => {
                        if (dep.target_file_id) {
                          setSelectedFileId(dep.target_file_id);
                          setActiveLine(dep.line || null);
                        }
                      }}
                      style={{ cursor: dep.target_file_id ? 'pointer' : 'default' }}
                    >
                      <ArrowRight size={12} style={{ color: 'var(--accent-cyan)' }} />
                      <span className="dep-name" title={dep.target_path || dep.name}>
                        {dep.target_path || dep.name}
                      </span>
                      {dep.line && <span className="item-meta">L{dep.line}</span>}
                    </div>
                  ))
                )}
              </div>

              {/* Incoming Dependents */}
              <div className="deps-subhead" style={{ marginTop: 10 }}>Imported By ({fileDetail.dependents.length})</div>
              <div className="deps-sublist">
                {fileDetail.dependents.length === 0 ? (
                  <div className="empty-deps-note">None</div>
                ) : (
                  fileDetail.dependents.map((dep, idx) => (
                    <div 
                      key={idx} 
                      className="dep-item-row"
                      onClick={() => {
                        if (dep.source_file_id) {
                          setSelectedFileId(dep.source_file_id);
                          setActiveLine(dep.line || null);
                        }
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <ArrowRight size={12} style={{ color: 'var(--accent-indigo)' }} />
                      <span className="dep-name" title={dep.source_path || dep.name}>
                        {dep.source_path || dep.name}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Phase 10 Impact Intelligence Modal */}
      <ImpactIntelligenceModal
        isOpen={!!impactTargetId}
        onClose={() => setImpactTargetId(null)}
        repositoryId={repositoryId}
        repositoryName={repositoryName}
        targetId={impactTargetId}
        onNavigateToSource={(filePathOrId, line) => {
          const matched = files.find(f => f.path === filePathOrId || f.id === filePathOrId);
          if (matched) {
            setSelectedFileId(matched.id);
            setActiveLine(line || null);
          }
        }}
      />
    </div>
  );
};
