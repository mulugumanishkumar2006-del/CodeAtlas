import React from 'react';
import { UniversalProfile, AnalysisProgress } from '../types';
import { 
  Boxes, 
  Server, 
  Database, 
  FileCheck2, 
  FileText, 
  Cpu, 
  ExternalLink, 
  AlertTriangle,
  CheckCircle2,
  Package,
  KeyRound,
  Compass,
  FolderGit2
} from 'lucide-react';

interface UniversalRepositoryOverviewProps {
  profile: UniversalProfile | null;
  analysisProgress: AnalysisProgress | null;
  onNavigateToFile: (filePath: string, line?: number) => void;
}

export const UniversalRepositoryOverview: React.FC<UniversalRepositoryOverviewProps> = ({
  profile,
  analysisProgress,
  onNavigateToFile,
}) => {
  if (!profile) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>Repository profile has not been generated yet. Please analyze the repository.</p>
      </div>
    );
  }

  const {
    frameworks,
    package_managers,
    monorepo,
    entry_points,
    api_endpoints,
    databases,
    configurations,
    tests,
    documentation,
    infrastructure,
    modules,
    services,
  } = profile;

  const partialErrors = analysisProgress?.partial_errors || [];
  const isPartial = analysisProgress?.status === 'partial' || analysisProgress?.status === 'PARTIAL' || partialErrors.length > 0;

  return (
    <div className="universal-overview-container" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Partial Analysis Warning Banner */}
      {isPartial && partialErrors.length > 0 && (
        <div style={{
          background: 'rgba(245, 158, 11, 0.12)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: 8,
          padding: '14px 18px',
          display: 'flex',
          gap: 12,
          alignItems: 'flex-start',
        }}>
          <AlertTriangle size={20} style={{ color: '#f59e0b', flexShrink: 0, marginTop: 2 }} />
          <div style={{ flex: 1 }}>
            <h4 style={{ margin: '0 0 6px 0', fontSize: '0.92rem', color: '#f59e0b', fontWeight: 600 }}>
              Partial Analysis Completed ({partialErrors.length} file{partialErrors.length > 1 ? 's' : ''} had parse warnings)
            </h4>
            <p style={{ margin: '0 0 8px 0', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              All supported files were analyzed successfully. The following file(s) encountered syntax or parsing issues:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 120, overflowY: 'auto' }}>
              {partialErrors.map((err, idx) => (
                <div key={idx} style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  • <span style={{ color: 'var(--text-primary)' }}>{err.file}</span> ({err.language}): {err.error}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Grid Row 1: Technologies, Frameworks & Package Managers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        {/* Frameworks Card */}
        <div className="overview-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 10, padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Boxes size={18} style={{ color: 'var(--accent-indigo)' }} />
            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600 }}>Discovered Frameworks</h4>
            <span style={{ marginLeft: 'auto', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {frameworks.length} detected
            </span>
          </div>

          {frameworks.length === 0 ? (
            <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Not detected</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {frameworks.map((fw) => (
                <div key={fw.name} style={{ background: 'var(--bg-card-subtle, rgba(255,255,255,0.02))', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>{fw.name}</span>
                    <span style={{ 
                      fontSize: '0.7rem', 
                      fontWeight: 600, 
                      padding: '2px 6px', 
                      borderRadius: 4, 
                      backgroundColor: fw.confidence === 'HIGH' ? 'rgba(52, 211, 153, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                      color: fw.confidence === 'HIGH' ? 'var(--accent-emerald)' : 'var(--accent-cyan)'
                    }}>
                      {fw.confidence} CONFIDENCE
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 6 }}>{fw.description}</div>
                  {fw.evidence_files.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {fw.evidence_files.map((ef) => (
                        <button
                          key={ef}
                          onClick={() => onNavigateToFile(ef)}
                          style={{
                            background: 'transparent',
                            border: '1px solid var(--border-color)',
                            borderRadius: 4,
                            padding: '2px 6px',
                            fontSize: '0.75rem',
                            fontFamily: 'var(--font-mono)',
                            color: 'var(--accent-cyan)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4
                          }}
                          title={`View evidence in ${ef}`}
                        >
                          <span>{ef}</span>
                          <ExternalLink size={10} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Package Managers & Monorepo Card */}
        <div className="overview-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 10, padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Package size={18} style={{ color: 'var(--accent-cyan)' }} />
            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600 }}>Package Managers & Build</h4>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 8, fontWeight: 500 }}>Package Managers:</div>
            {package_managers.length === 0 ? (
              <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Not detected</div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {package_managers.map((pm) => (
                  <span key={pm.id} style={{
                    fontSize: '0.8rem',
                    padding: '4px 10px',
                    borderRadius: 6,
                    background: 'rgba(56, 189, 248, 0.12)',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                    color: 'var(--accent-cyan)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}>
                    <CheckCircle2 size={12} />
                    <strong>{pm.name}</strong>
                    {pm.evidence_files[0] && <span style={{ opacity: 0.7, fontSize: '0.74rem' }}>({pm.evidence_files[0]})</span>}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 6, fontWeight: 500 }}>Monorepo Architecture:</div>
            {monorepo.is_monorepo ? (
              <div style={{ background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.25)', borderRadius: 6, padding: '10px 12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#c084fc', fontWeight: 600, fontSize: '0.86rem', marginBottom: 4 }}>
                  <FolderGit2 size={14} />
                  <span>Monorepo Detected: {monorepo.workspace_type || 'Multi-Package'}</span>
                </div>
                {monorepo.evidence.length > 0 && (
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    Evidence: {monorepo.evidence.join(', ')}
                  </div>
                )}
                {monorepo.packages.length > 0 && (
                  <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {monorepo.packages.slice(0, 8).map(p => (
                      <span key={p} style={{ fontSize: '0.72rem', background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: 4, fontFamily: 'var(--font-mono)' }}>{p}</span>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Single-package repository (No monorepo manifests detected)</div>
            )}
          </div>
        </div>
      </div>

      {/* Grid Row 2: Entry Points & Discovered API Endpoints */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        {/* Entry Points Card */}
        <div className="overview-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 10, padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Compass size={18} style={{ color: 'var(--accent-emerald)' }} />
            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600 }}>Application Entry Points</h4>
            <span style={{ marginLeft: 'auto', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {entry_points.length} detected
            </span>
          </div>

          {entry_points.length === 0 ? (
            <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Not detected</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {entry_points.map((ep, idx) => (
                <div 
                  key={idx} 
                  onClick={() => onNavigateToFile(ep.file_path, ep.line)}
                  style={{ 
                    cursor: 'pointer',
                    background: 'var(--bg-card-subtle, rgba(255,255,255,0.02))', 
                    padding: '8px 12px', 
                    borderRadius: 6, 
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                      {ep.file_path}:{ep.line}
                    </span>
                    {ep.framework && (
                      <span style={{ fontSize: '0.7rem', background: 'rgba(52, 211, 153, 0.15)', color: 'var(--accent-emerald)', padding: '1px 5px', borderRadius: 4 }}>
                        {ep.framework}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{ep.reason}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* API Endpoints Card */}
        <div className="overview-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 10, padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Server size={18} style={{ color: 'var(--accent-cyan)' }} />
            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600 }}>Discovered API Routes</h4>
            <span style={{ marginLeft: 'auto', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {api_endpoints.length} detected
            </span>
          </div>

          {api_endpoints.length === 0 ? (
            <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Not detected</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 220, overflowY: 'auto' }}>
              {api_endpoints.map((api, idx) => {
                const methodColor = 
                  api.method === 'GET' ? 'var(--accent-emerald)' :
                  api.method === 'POST' ? 'var(--accent-cyan)' :
                  api.method === 'DELETE' ? 'var(--accent-rose)' : '#fbbf24';
                return (
                  <div 
                    key={idx}
                    onClick={() => onNavigateToFile(api.file_path, api.line)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '6px 10px',
                      background: 'rgba(0,0,0,0.2)',
                      borderRadius: 6,
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    <span style={{ fontWeight: 700, fontSize: '0.74rem', minWidth: 46, color: methodColor, fontFamily: 'var(--font-mono)' }}>
                      {api.method}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', flex: 1 }}>
                      {api.route}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {api.file_path}:{api.line}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Grid Row 3: Persistence, Configurations & Environment */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        {/* Persistence & Databases Card */}
        <div className="overview-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 10, padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Database size={18} style={{ color: '#fbbf24' }} />
            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600 }}>Database & Persistence</h4>
            <span style={{ marginLeft: 'auto', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {databases.length} detected
            </span>
          </div>

          {databases.length === 0 ? (
            <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Not detected</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {databases.map((db) => (
                <div key={db.name} style={{ background: 'rgba(251, 191, 36, 0.08)', border: '1px solid rgba(251, 191, 36, 0.25)', borderRadius: 6, padding: '8px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 600, color: '#fbbf24', fontSize: '0.86rem' }}>{db.name}</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{db.category}</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>{db.description}</div>
                  {db.evidence_imports.length > 0 && (
                    <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', marginTop: 4 }}>
                      Imports: {db.evidence_imports.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Configuration & Secret-Safe Env Vars */}
        <div className="overview-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 10, padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <KeyRound size={18} style={{ color: 'var(--accent-emerald)' }} />
            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600 }}>Configuration & Environment</h4>
          </div>

          {/* Secret-Safe Environment Variables */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 6, fontWeight: 500 }}>
              Environment Variables (Values Redacted):
            </div>
            {configurations.environment_variables.length === 0 ? (
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No environment variables declared</div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, maxHeight: 100, overflowY: 'auto' }}>
                {configurations.environment_variables.map((ev) => (
                  <span key={ev.name} style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.74rem',
                    padding: '2px 8px',
                    borderRadius: 4,
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-secondary)'
                  }}>
                    <strong style={{ color: 'var(--accent-cyan)' }}>{ev.name}</strong> = <span style={{ color: 'var(--accent-rose)', opacity: 0.8 }}>[REDACTED]</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Config Files */}
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 6, fontWeight: 500 }}>
              Configuration Files:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, maxHeight: 90, overflowY: 'auto' }}>
              {configurations.config_files.slice(0, 10).map((cf) => (
                <button
                  key={cf.file_path}
                  onClick={() => onNavigateToFile(cf.file_path)}
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--border-color)',
                    borderRadius: 4,
                    padding: '2px 6px',
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                  }}
                >
                  <span>{cf.filename}</span>
                  <span style={{ fontSize: '0.68rem', opacity: 0.6 }}>({cf.category})</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid Row 4: Tests, Documentation & Infrastructure */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
        {/* Tests Card */}
        <div className="overview-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 10, padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <FileCheck2 size={18} style={{ color: 'var(--accent-cyan)' }} />
            <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 600 }}>Testing Suite</h4>
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: 4 }}>
            {tests.test_file_count} Test Files
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 8 }}>
            Coverage Density: {tests.test_ratio_percent}% of source files
          </div>
          {tests.test_frameworks.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {tests.test_frameworks.map(tf => (
                <span key={tf} style={{ fontSize: '0.74rem', background: 'rgba(56, 189, 248, 0.15)', color: 'var(--accent-cyan)', padding: '2px 8px', borderRadius: 4 }}>
                  {tf}
                </span>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Not detected</div>
          )}
        </div>

        {/* Infrastructure Card */}
        <div className="overview-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 10, padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Cpu size={18} style={{ color: 'var(--accent-indigo)' }} />
            <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 600 }}>Infrastructure & CI/CD</h4>
          </div>
          {infrastructure.length === 0 ? (
            <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Not detected</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {infrastructure.map((inf, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--accent-indigo)' }}>{inf.type}</span>
                  <button 
                    onClick={() => onNavigateToFile(inf.file_path)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', cursor: 'pointer' }}
                  >
                    {inf.file_path}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Documentation Card */}
        <div className="overview-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 10, padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <FileText size={18} style={{ color: 'var(--accent-emerald)' }} />
            <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 600 }}>Documentation</h4>
          </div>
          {documentation.length === 0 ? (
            <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Not detected</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 110, overflowY: 'auto' }}>
              {documentation.map((doc, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <button 
                    onClick={() => onNavigateToFile(doc.file_path)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--accent-emerald)', cursor: 'pointer', textAlign: 'left', padding: 0 }}
                  >
                    {doc.title}
                  </button>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{doc.line_count} lines</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modules / Packages Card */}
        <div className="overview-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 10, padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Boxes size={18} style={{ color: 'var(--accent-cyan)' }} />
            <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 600 }}>Architecture Modules</h4>
          </div>
          {modules.length === 0 ? (
            <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Not detected</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 110, overflowY: 'auto' }}>
              {modules.map((mod, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{mod.name}</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{mod.file_count} files</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Services Card */}
        <div className="overview-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 10, padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Server size={18} style={{ color: 'var(--accent-indigo)' }} />
            <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 600 }}>Discovered Services</h4>
          </div>
          {services.length === 0 ? (
            <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Not detected</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 110, overflowY: 'auto' }}>
              {services.map((srv, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{srv.name}</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--accent-indigo)', fontFamily: 'var(--font-mono)' }}>{srv.type}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
