import React, { useState, useEffect, useCallback } from 'react';
import {
  GitPullRequest,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldAlert,
  Layers,
  Clock,
  FileCode,
  RefreshCw,
  PlusCircle,
  ExternalLink,
  TrendingUp,
  Sparkles,
  Zap,
  Info,
  CheckSquare,
  Square,
  Filter,
} from 'lucide-react';
import { api } from '../services/api';
import {
  PullRequestReviewSummary,
  PullRequestReviewDetail,
  PullRequestReviewCreateInput,
} from '../types';

interface PullRequestReviewViewProps {
  repositoryId: string;
  onOpenFile?: (filePath: string, line?: number) => void;
  onOpenImpact?: (targetId: string) => void;
}

type DetailTab = 'summary' | 'gates' | 'diff' | 'breaking' | 'architecture' | 'risk_debt' | 'history_unknowns' | 'validation';

export const PullRequestReviewView: React.FC<PullRequestReviewViewProps> = ({
  repositoryId,
  onOpenFile,
  onOpenImpact,
}) => {
  const [reviews, setReviews] = useState<PullRequestReviewSummary[]>([]);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [reviewDetail, setReviewDetail] = useState<PullRequestReviewDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<DetailTab>('summary');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');

  // Trigger modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newBaseSha, setNewBaseSha] = useState('HEAD~1');
  const [newHeadSha, setNewHeadSha] = useState('HEAD');
  const [newTitle, setNewTitle] = useState('Automated Pull Request Review');
  const [newPrNumber, setNewPrNumber] = useState('101');
  const [newCustomDiff, setNewCustomDiff] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation checklist local check state
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  // Fetch reviews list
  const loadReviews = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await api.getPullRequestReviews(repositoryId);
      setReviews(res.reviews);
      if (res.reviews.length > 0 && !selectedReviewId) {
        setSelectedReviewId(res.reviews[0].id);
      }
    } catch (err) {
      console.error('Error loading reviews:', err);
    } finally {
      setIsLoading(false);
    }
  }, [repositoryId, selectedReviewId]);

  // Fetch review detail
  const loadReviewDetail = useCallback(async (reviewId: string) => {
    try {
      setIsDetailLoading(true);
      const res = await api.getPullRequestReview(repositoryId, reviewId);
      setReviewDetail(res);
      setCheckedItems({});
    } catch (err) {
      console.error('Error loading review detail:', err);
    } finally {
      setIsDetailLoading(false);
    }
  }, [repositoryId]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  useEffect(() => {
    if (selectedReviewId) {
      loadReviewDetail(selectedReviewId);
    } else {
      setReviewDetail(null);
    }
  }, [selectedReviewId, loadReviewDetail]);

  const handleCreateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBaseSha.trim() || !newHeadSha.trim()) return;

    try {
      setIsSubmitting(true);
      const input: PullRequestReviewCreateInput = {
        base_commit_sha: newBaseSha.trim(),
        head_commit_sha: newHeadSha.trim(),
        title: newTitle.trim(),
        pr_number: newPrNumber.trim() || undefined,
        provider: 'local',
        custom_diff: newCustomDiff.trim() || undefined,
      };

      const created = await api.createPullRequestReview(repositoryId, input);
      await loadReviews();
      setSelectedReviewId(created.id);
      setIsCreateModalOpen(false);
      setNewCustomDiff('');
    } catch (err) {
      console.error('Failed to trigger review:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleCheckItem = (idx: number) => {
    setCheckedItems(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const getGateBadge = (status: string) => {
    if (status === 'PASSED') {
      return (
        <span className="gate-badge-passed" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 6, background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontWeight: 600, fontSize: '0.8rem' }}>
          <CheckCircle2 size={14} /> PASSED
        </span>
      );
    }
    if (status === 'WARNING') {
      return (
        <span className="gate-badge-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 6, background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', fontWeight: 600, fontSize: '0.8rem' }}>
          <AlertTriangle size={14} /> WARNING
        </span>
      );
    }
    return (
      <span className="gate-badge-blocked" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 6, background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', fontWeight: 600, fontSize: '0.8rem' }}>
        <XCircle size={14} /> BLOCKED
      </span>
    );
  };

  const getSeverityBadge = (sev: string) => {
    const s = sev.toUpperCase();
    if (s === 'BLOCKING') return <span style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.12)', padding: '2px 8px', borderRadius: 4, fontSize: '0.75rem', fontWeight: 600 }}>BLOCKING</span>;
    if (s === 'HIGH') return <span style={{ color: '#f97316', background: 'rgba(249, 115, 22, 0.12)', padding: '2px 8px', borderRadius: 4, fontSize: '0.75rem', fontWeight: 600 }}>HIGH</span>;
    if (s === 'MEDIUM') return <span style={{ color: '#f59e0b', background: 'rgba(245, 158, 11, 0.12)', padding: '2px 8px', borderRadius: 4, fontSize: '0.75rem', fontWeight: 600 }}>MEDIUM</span>;
    if (s === 'LOW') return <span style={{ color: '#06b6d4', background: 'rgba(6, 182, 212, 0.12)', padding: '2px 8px', borderRadius: 4, fontSize: '0.75rem', fontWeight: 600 }}>LOW</span>;
    return <span style={{ color: 'var(--text-muted)', background: 'rgba(255, 255, 255, 0.06)', padding: '2px 8px', borderRadius: 4, fontSize: '0.75rem' }}>INFO</span>;
  };

  // Filtered comments
  const filteredComments = (reviewDetail?.review_comments || []).filter(c => {
    if (severityFilter === 'ALL') return true;
    return c.severity.toUpperCase() === severityFilter.toUpperCase();
  });

  return (
    <div className="pr-reviewer-container" style={{ display: 'flex', height: '100%', width: '100%', background: 'var(--bg-app)', overflow: 'hidden' }}>
      {/* Left Review History Bar */}
      <div className="pr-reviewer-sidebar" style={{ width: 320, borderRight: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', background: 'var(--bg-card)' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <GitPullRequest size={18} style={{ color: 'var(--accent-cyan)' }} />
            <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Pull Requests</span>
            <span style={{ fontSize: '0.75rem', background: 'var(--bg-app)', padding: '2px 6px', borderRadius: 10, color: 'var(--text-muted)' }}>
              {reviews.length}
            </span>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'var(--accent-gradient, linear-gradient(135deg, #6366f1, #06b6d4))',
              color: '#fff',
              border: 'none',
              padding: '6px 12px',
              borderRadius: 6,
              fontSize: '0.8rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            <PlusCircle size={14} /> Review PR
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
          {isLoading ? (
            <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Loading reviews...
            </div>
          ) : reviews.length === 0 ? (
            <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <GitPullRequest size={32} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
              <p style={{ fontSize: '0.9rem', marginBottom: 8, fontWeight: 500 }}>No Pull Request Reviews</p>
              <p style={{ fontSize: '0.8rem', marginBottom: 16 }}>Trigger an automated evidence-backed review between commits.</p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                style={{
                  background: 'var(--bg-app)',
                  border: '1px solid var(--border-subtle)',
                  padding: '6px 14px',
                  borderRadius: 6,
                  fontSize: '0.8rem',
                  color: 'var(--accent-cyan)',
                  cursor: 'pointer',
                }}
              >
                + Analyze First PR
              </button>
            </div>
          ) : (
            reviews.map(r => {
              const isSelected = r.id === selectedReviewId;
              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedReviewId(r.id)}
                  style={{
                    padding: '12px',
                    borderRadius: 8,
                    marginBottom: 6,
                    cursor: 'pointer',
                    background: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
                    border: isSelected ? '1px solid var(--accent-indigo)' : '1px solid transparent',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, fontSize: '0.85rem', color: isSelected ? '#fff' : 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 180 }}>
                      {r.pr_number ? `#${r.pr_number} ` : ''}{r.title}
                    </span>
                    {getGateBadge(r.review_gate_status)}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span>{r.author || 'Author'}</span>
                    <span>
                      {r.base_commit_sha.slice(0, 6)}..{r.head_commit_sha.slice(0, 6)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 6, fontSize: '0.75rem' }}>
                    <span style={{ color: 'var(--accent-cyan)' }}>{r.changed_files_count} files</span>
                    <span style={{ color: r.risk_delta > 0 ? '#f59e0b' : '#10b981' }}>
                      Risk: {r.risk_delta > 0 ? `+${r.risk_delta.toFixed(1)}` : `${r.risk_delta.toFixed(1)}`}
                    </span>
                    {r.breaking_changes_count > 0 && (
                      <span style={{ color: '#ef4444', fontWeight: 600 }}>{r.breaking_changes_count} breaking</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main Review Detail Panel */}
      <div className="pr-reviewer-main" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {isDetailLoading ? (
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--text-muted)' }}>
            <RefreshCw size={24} className="spin" style={{ marginRight: 12 }} />
            Analyzing repository intelligence for PR...
          </div>
        ) : !reviewDetail ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'var(--text-muted)' }}>
            <GitPullRequest size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
            <h3>Select a Pull Request Review</h3>
            <p style={{ fontSize: '0.85rem' }}>Choose an existing review from the list or trigger a new analysis.</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-card)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <span style={{ color: 'var(--accent-cyan)', fontWeight: 600, fontSize: '1rem' }}>
                      {reviewDetail.pr_number ? `#${reviewDetail.pr_number}` : 'REVIEW'}
                    </span>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
                      {reviewDetail.title}
                    </h2>
                    {getGateBadge(reviewDetail.review_gate_status)}
                  </div>
                  <div style={{ display: 'flex', gap: 16, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span>Author: <b>{reviewDetail.author || 'Unknown'}</b></span>
                    <span>Branches: <code>{reviewDetail.source_branch || 'feature'}</code> → <code>{reviewDetail.target_branch || 'main'}</code></span>
                    <span>Commit Range: <code>{reviewDetail.base_commit_sha.slice(0, 8)}</code>..<code>{reviewDetail.head_commit_sha.slice(0, 8)}</code></span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => loadReviewDetail(reviewDetail.id)}
                    title="Refresh Review"
                    style={{ background: 'var(--bg-app)', border: '1px solid var(--border-subtle)', padding: '6px 10px', borderRadius: 6, color: 'var(--text-muted)', cursor: 'pointer' }}
                  >
                    <RefreshCw size={14} />
                  </button>
                </div>
              </div>

              {/* Top Quick-Metric Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
                <div style={{ background: 'var(--bg-app)', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Changed Files</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginTop: 2 }}>
                    {reviewDetail.changed_files_count}{' '}
                    <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#10b981' }}>+{reviewDetail.insertions}</span>
                    {' '}
                    <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#ef4444' }}>-{reviewDetail.deletions}</span>
                  </div>
                </div>

                <div style={{ background: 'var(--bg-app)', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AST Symbols</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-cyan)', marginTop: 2 }}>
                    {reviewDetail.changed_symbols_count} <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--text-muted)' }}>mapped</span>
                  </div>
                </div>

                <div style={{ background: 'var(--bg-app)', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Risk Delta</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: reviewDetail.risk_delta > 0 ? '#f59e0b' : '#10b981', marginTop: 2 }}>
                    {reviewDetail.risk_delta > 0 ? `+${reviewDetail.risk_delta.toFixed(1)}` : `${reviewDetail.risk_delta.toFixed(1)}`}
                  </div>
                </div>

                <div style={{ background: 'var(--bg-app)', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Breaking Changes</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: reviewDetail.breaking_changes_count > 0 ? '#ef4444' : '#10b981', marginTop: 2 }}>
                    {reviewDetail.breaking_changes_count}
                  </div>
                </div>

                <div style={{ background: 'var(--bg-app)', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Arch Violations</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: reviewDetail.architecture_violations_count > 0 ? '#f59e0b' : '#10b981', marginTop: 2 }}>
                    {reviewDetail.architecture_violations_count}
                  </div>
                </div>

                <div style={{ background: 'var(--bg-app)', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Test Gaps</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: reviewDetail.test_gaps_count > 0 ? '#f59e0b' : '#10b981', marginTop: 2 }}>
                    {reviewDetail.test_gaps_count}
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-Navigation Tabs */}
            <div style={{ display: 'flex', gap: 2, padding: '0 24px', background: 'var(--bg-card)', borderBottom: '1px solid var(--border-subtle)' }}>
              {[
                { id: 'summary', label: 'Executive Summary', icon: Sparkles },
                { id: 'gates', label: `Gates & Findings (${reviewDetail.review_comments.length})`, icon: ShieldAlert },
                { id: 'diff', label: `Files & Symbols (${reviewDetail.changed_files_count})`, icon: FileCode },
                { id: 'breaking', label: `Breaking & Blast (${reviewDetail.breaking_changes_count})`, icon: Zap },
                { id: 'architecture', label: 'Architecture Drift', icon: Layers },
                { id: 'risk_debt', label: 'Risk & Debt Delta', icon: TrendingUp },
                { id: 'history_unknowns', label: 'History & Unknowns', icon: Clock },
                { id: 'validation', label: 'Validation Checklist', icon: CheckSquare },
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as DetailTab)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '12px 14px',
                      background: 'none',
                      border: 'none',
                      borderBottom: isActive ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                      color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                      fontWeight: isActive ? 600 : 500,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                    }}
                  >
                    <Icon size={14} style={{ color: isActive ? 'var(--accent-cyan)' : 'inherit' }} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Contents Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
              {/* TAB 1: EXECUTIVE SUMMARY */}
              {activeTab === 'summary' && (
                <div style={{ maxWidth: 900 }}>
                  <div style={{ background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.25)', borderRadius: 10, padding: '20px', marginBottom: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--accent-cyan)', fontWeight: 600, fontSize: '0.95rem', marginBottom: 8 }}>
                      <Sparkles size={18} />
                      AI CTO Intelligence Review
                    </div>
                    <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--text-main)', margin: '0 0 16px' }}>
                      {reviewDetail.summary}
                    </p>
                    {reviewDetail.ai_review?.key_takeaways && reviewDetail.ai_review.key_takeaways.length > 0 && (
                      <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>KEY OBSERVATIONS:</div>
                        <ul style={{ margin: 0, paddingLeft: 20, fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                          {reviewDetail.ai_review.key_takeaways.map((point, idx) => (
                            <li key={idx}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>Review Gates Status</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 24 }}>
                    {Object.entries(reviewDetail.review_gates || {}).map(([gName, gInfo]) => (
                      <div key={gName} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                          <span style={{ fontWeight: 600, fontSize: '0.85rem', textTransform: 'capitalize' }}>
                            {gName.replace('_', ' ')}
                          </span>
                          {getGateBadge(gInfo.status)}
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                          {gInfo.message}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: GATES & INLINE FINDINGS */}
              {activeTab === 'gates' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>
                      Evidence-Backed Findings ({filteredComments.length})
                    </h3>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <Filter size={14} style={{ color: 'var(--text-muted)' }} />
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Severity:</span>
                      {['ALL', 'BLOCKING', 'HIGH', 'MEDIUM', 'LOW'].map(sev => (
                        <button
                          key={sev}
                          onClick={() => setSeverityFilter(sev)}
                          style={{
                            background: severityFilter === sev ? 'var(--accent-indigo)' : 'var(--bg-card)',
                            color: severityFilter === sev ? '#fff' : 'var(--text-muted)',
                            border: '1px solid var(--border-subtle)',
                            padding: '4px 10px',
                            borderRadius: 6,
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                          }}
                        >
                          {sev}
                        </button>
                      ))}
                    </div>
                  </div>

                  {filteredComments.length === 0 ? (
                    <div style={{ padding: 40, textAlign: 'center', background: 'var(--bg-card)', borderRadius: 8, border: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                      <CheckCircle2 size={32} style={{ color: '#10b981', margin: '0 auto 12px' }} />
                      <p style={{ fontSize: '0.9rem', margin: 0 }}>No findings matching the selected filter.</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {filteredComments.map(c => (
                        <div key={c.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 16 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              {getSeverityBadge(c.severity)}
                              <span
                                onClick={() => onOpenFile && onOpenFile(c.file_path, c.line || 1)}
                                style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--accent-cyan)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                              >
                                {c.file_path}{c.line ? `:${c.line}` : ''}
                                <ExternalLink size={12} />
                              </span>
                              {c.symbol_name && (
                                <span style={{ background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: 4, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                  symbol: {c.symbol_name}
                                </span>
                              )}
                            </div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                              {c.category}
                            </span>
                          </div>

                          <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 8, color: 'var(--text-main)' }}>
                            {c.finding}
                          </div>

                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'grid', gridTemplateColumns: '120px 1fr', gap: '6px 12px', background: 'var(--bg-app)', padding: 12, borderRadius: 6 }}>
                            <span style={{ fontWeight: 500 }}>Evidence:</span>
                            <span style={{ color: 'var(--text-main)' }}><code>{c.evidence}</code></span>

                            <span style={{ fontWeight: 500 }}>Potential Impact:</span>
                            <span style={{ color: 'var(--text-main)' }}>{c.potential_impact}</span>

                            <span style={{ fontWeight: 500 }}>Suggested Action:</span>
                            <span style={{ color: '#10b981' }}>{c.suggested_action}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: DIFF & CHANGED SYMBOLS */}
              {activeTab === 'diff' && (
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>
                    Changed Files ({reviewDetail.changed_files_count}) & AST Symbols ({reviewDetail.changed_symbols_count})
                  </h3>

                  {/* AST Symbols list */}
                  {reviewDetail.symbol_changes && reviewDetail.symbol_changes.length > 0 && (
                    <div style={{ marginBottom: 24 }}>
                      <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>
                        AST Mapped Symbols
                      </h4>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 8 }}>
                        {reviewDetail.symbol_changes.map((sym, i) => (
                          <div
                            key={i}
                            onClick={() => onOpenFile && onOpenFile(sym.file_path, sym.new_start_line || sym.old_start_line || 1)}
                            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 6, padding: '10px 12px', cursor: 'pointer' }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                              <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-main)' }}>
                                {sym.symbol_name}
                              </span>
                              <span style={{
                                fontSize: '0.7rem',
                                padding: '2px 6px',
                                borderRadius: 4,
                                color: sym.change_type === 'SIGNATURE_CHANGED' ? '#f59e0b' : (sym.change_type === 'DELETED' ? '#ef4444' : '#10b981'),
                                background: 'rgba(255,255,255,0.05)',
                                fontWeight: 600,
                              }}>
                                {sym.change_type}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {sym.file_path}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Files & Unified diff hunks */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {(reviewDetail.diff_summary?.files || []).map((f, fi) => (
                      <div key={fi} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 8, overflow: 'hidden' }}>
                        <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span
                            onClick={() => onOpenFile && onOpenFile(f.new_path || f.old_path, 1)}
                            style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--accent-cyan)', cursor: 'pointer' }}
                          >
                            {f.new_path || f.old_path}
                          </span>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: 8 }}>
                            <span style={{ color: '#10b981' }}>+{f.additions}</span>
                            <span style={{ color: '#ef4444' }}>-{f.deletions}</span>
                            <span style={{ textTransform: 'uppercase' }}>{f.change_type}</span>
                          </div>
                        </div>

                        {f.hunks && f.hunks.length > 0 && (
                          <div style={{ padding: '8px 14px', fontFamily: 'monospace', fontSize: '0.8rem', background: '#0a0d14', overflowX: 'auto' }}>
                            {f.hunks.map((h: any, hi: number) => (
                              <div key={hi} style={{ marginBottom: 8 }}>
                                <div style={{ color: '#6366f1', opacity: 0.8, marginBottom: 4 }}>
                                  @@ -{h.old_start},{h.old_lines} +{h.new_start},{h.new_lines} @@ {h.heading || ''}
                                </div>
                                {(h.lines || []).slice(0, 30).map((l: string, li: number) => {
                                  const isAdd = l.startsWith('+') && !l.startsWith('+++');
                                  const isDel = l.startsWith('-') && !l.startsWith('---');
                                  return (
                                    <div
                                      key={li}
                                      style={{
                                        color: isAdd ? '#10b981' : (isDel ? '#ef4444' : 'var(--text-muted)'),
                                        background: isAdd ? 'rgba(16, 185, 129, 0.08)' : (isDel ? 'rgba(239, 68, 68, 0.08)' : 'transparent'),
                                        padding: '1px 4px',
                                        whiteSpace: 'pre',
                                      }}
                                    >
                                      {l}
                                    </div>
                                  );
                                })}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: BREAKING CHANGES & BLAST RADIUS */}
              {activeTab === 'breaking' && (
                <div style={{ maxWidth: 900 }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>
                    Breaking Change Detection & Blast Radius
                  </h3>

                  {/* Detected Breaking Changes */}
                  <div style={{ marginBottom: 24 }}>
                    <h4 style={{ fontSize: '0.85rem', color: '#ef4444', textTransform: 'uppercase', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <AlertTriangle size={14} /> Detected Breaking Changes ({reviewDetail.breaking_changes?.detected?.length || 0})
                    </h4>
                    {(!reviewDetail.breaking_changes?.detected || reviewDetail.breaking_changes.detected.length === 0) ? (
                      <div style={{ padding: 14, background: 'var(--bg-card)', borderRadius: 6, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        No verified breaking changes detected.
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {reviewDetail.breaking_changes.detected.map((bc: any, i: number) => (
                          <div key={i} style={{ background: 'rgba(239, 68, 68, 0.06)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: 6, padding: 12 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                              <span style={{ fontWeight: 600, color: '#ef4444', fontSize: '0.85rem' }}>
                                {bc.entity} ({bc.category})
                              </span>
                              {onOpenImpact && (
                                <button
                                  onClick={() => onOpenImpact(bc.entity)}
                                  style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                                >
                                  Blast Radius <ExternalLink size={12} />
                                </button>
                              )}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-main)', marginBottom: 4 }}>{bc.reason}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Evidence: <code>{bc.evidence}</code></div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Potential Breaking Changes */}
                  <div>
                    <h4 style={{ fontSize: '0.85rem', color: '#f59e0b', textTransform: 'uppercase', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Info size={14} /> Potential Breaking Changes ({reviewDetail.breaking_changes?.potential?.length || 0})
                    </h4>
                    {(!reviewDetail.breaking_changes?.potential || reviewDetail.breaking_changes.potential.length === 0) ? (
                      <div style={{ padding: 14, background: 'var(--bg-card)', borderRadius: 6, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        No potential breaking changes flagged.
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {reviewDetail.breaking_changes.potential.map((pb: any, i: number) => (
                          <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 6, padding: 12 }}>
                            <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#f59e0b', marginBottom: 2 }}>
                              {pb.entity} ({pb.category})
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{pb.reason}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 5: ARCHITECTURE DRIFT */}
              {activeTab === 'architecture' && (
                <div style={{ maxWidth: 900 }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>
                    Architecture Drift & Boundary Violations
                  </h3>

                  {/* Violations */}
                  <div style={{ marginBottom: 24 }}>
                    <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>
                      Boundary Violations ({reviewDetail.architecture_review?.violations_count || 0})
                    </h4>
                    {(!reviewDetail.architecture_review?.boundary_violations || reviewDetail.architecture_review.boundary_violations.length === 0) ? (
                      <div style={{ padding: 16, background: 'var(--bg-card)', borderRadius: 8, border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        ✅ No architectural boundary violations detected in this pull request.
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {reviewDetail.architecture_review.boundary_violations.map((v: any, i: number) => (
                          <div key={i} style={{ background: 'rgba(239, 68, 68, 0.06)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: 6, padding: 12 }}>
                            <div style={{ fontWeight: 600, color: '#ef4444', fontSize: '0.85rem', marginBottom: 4 }}>
                              {v.violation_type}: {v.source_file}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-main)', marginBottom: 4 }}>{v.rule}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Evidence: <code>{v.evidence}</code></div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Layer shifts */}
                  <div>
                    <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>
                      Modified Architecture Layers ({reviewDetail.architecture_review?.layer_shifts?.length || 0})
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 8 }}>
                      {(reviewDetail.architecture_review?.layer_shifts || []).map((ls: any, i: number) => (
                        <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 6, padding: '10px 12px' }}>
                          <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--accent-cyan)' }}>
                            {ls.layer}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ls.file_path}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: RISK & TECH DEBT DELTA */}
              {activeTab === 'risk_debt' && (
                <div style={{ maxWidth: 800 }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 16 }}>
                    Quantitative Risk & Technical Debt Impact
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 24 }}>
                    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 16 }}>
                      <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', margin: '0 0 12px' }}>
                        Repository Risk Score
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                        <span style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-main)' }}>
                          {reviewDetail.risk_score_after.toFixed(1)}
                        </span>
                        <span style={{ fontSize: '0.9rem', color: reviewDetail.risk_delta > 0 ? '#f59e0b' : '#10b981', fontWeight: 600 }}>
                          {reviewDetail.risk_delta > 0 ? `+${reviewDetail.risk_delta.toFixed(1)}` : `${reviewDetail.risk_delta.toFixed(1)}`} delta
                        </span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 8 }}>
                        Base score: {reviewDetail.risk_score_before.toFixed(1)}
                      </div>
                    </div>

                    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 16 }}>
                      <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', margin: '0 0 12px' }}>
                        Technical Debt Remediation
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                        <span style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-main)' }}>
                          {reviewDetail.debt_hours_delta.toFixed(1)} hrs
                        </span>
                        <span style={{ fontSize: '0.9rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                          ${reviewDetail.debt_cost_delta.toFixed(0)} est.
                        </span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 8 }}>
                        Calculated from new smell density & boundary drift
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 7: HISTORICAL CONTEXT & UNKNOWNS */}
              {activeTab === 'history_unknowns' && (
                <div style={{ maxWidth: 900 }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>
                    Historical Churn & Epistemic Unknowns
                  </h3>

                  {/* Hotspots */}
                  <div style={{ marginBottom: 24 }}>
                    <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>
                      Git Evolution Hotspots
                    </h4>
                    {(!reviewDetail.historical_context?.recent_churn || reviewDetail.historical_context.recent_churn.length === 0) ? (
                      <div style={{ padding: 14, background: 'var(--bg-card)', borderRadius: 6, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        No historical hotspots detected for changed files.
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {reviewDetail.historical_context.recent_churn.map((h: any, i: number) => (
                          <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 6, padding: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>{h.file_path}</span>
                            <span style={{ fontSize: '0.75rem', color: h.is_hotspot ? '#f59e0b' : 'var(--text-muted)', fontWeight: 600 }}>
                              {h.historical_commit_count} commits in history
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Unknowns */}
                  <div>
                    <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>
                      Epistemic Unknowns (Static Limitations)
                    </h4>
                    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 16 }}>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 12 }}>
                        Static analysis cannot guarantee runtime behavior for the following areas without test execution:
                      </p>
                      <ul style={{ margin: 0, paddingLeft: 20, fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
                        {(reviewDetail.unknowns || []).map((u: any, i: number) => (
                          <li key={i}>{u.item || u.reason || JSON.stringify(u)}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 8: VALIDATION CHECKLIST */}
              {activeTab === 'validation' && (
                <div style={{ maxWidth: 800 }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>
                    Pre-Merge Validation Checklist
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 16 }}>
                    Follow this checklist to ensure stability before merging this pull request into production.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {(reviewDetail.validation_checklist || []).map((item, idx) => {
                      const isChecked = !!checkedItems[idx];
                      const text = typeof item === 'string' ? item : item.task;
                      return (
                        <div
                          key={idx}
                          onClick={() => toggleCheckItem(idx)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            padding: '12px 16px',
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: 6,
                            cursor: 'pointer',
                          }}
                        >
                          {isChecked ? (
                            <CheckSquare size={18} style={{ color: '#10b981' }} />
                          ) : (
                            <Square size={18} style={{ color: 'var(--text-muted)' }} />
                          )}
                          <span style={{ fontSize: '0.85rem', color: isChecked ? 'var(--text-muted)' : 'var(--text-main)', textDecoration: isChecked ? 'line-through' : 'none' }}>
                            {text}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Trigger New Review Modal */}
      {isCreateModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 10, width: 500, padding: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '1.1rem', fontWeight: 700 }}>Trigger Automated Pull Request Review</h3>
            <form onSubmit={handleCreateReview}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>PR / Review Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', background: 'var(--bg-app)', border: '1px solid var(--border-subtle)', borderRadius: 6, color: '#fff', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>Base Commit / Ref</label>
                  <input
                    type="text"
                    value={newBaseSha}
                    onChange={e => setNewBaseSha(e.target.value)}
                    placeholder="HEAD~1 or main"
                    style={{ width: '100%', padding: '8px 12px', background: 'var(--bg-app)', border: '1px solid var(--border-subtle)', borderRadius: 6, color: '#fff', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>Head Commit / Ref</label>
                  <input
                    type="text"
                    value={newHeadSha}
                    onChange={e => setNewHeadSha(e.target.value)}
                    placeholder="HEAD or branch"
                    style={{ width: '100%', padding: '8px 12px', background: 'var(--bg-app)', border: '1px solid var(--border-subtle)', borderRadius: 6, color: '#fff', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>PR Number (Optional)</label>
                <input
                  type="text"
                  value={newPrNumber}
                  onChange={e => setNewPrNumber(e.target.value)}
                  placeholder="e.g. 101"
                  style={{ width: '100%', padding: '8px 12px', background: 'var(--bg-app)', border: '1px solid var(--border-subtle)', borderRadius: 6, color: '#fff', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>Custom Unified Diff (Optional for offline testing)</label>
                <textarea
                  value={newCustomDiff}
                  onChange={e => setNewCustomDiff(e.target.value)}
                  placeholder="Paste git diff here if offline..."
                  rows={4}
                  style={{ width: '100%', padding: '8px 12px', background: 'var(--bg-app)', border: '1px solid var(--border-subtle)', borderRadius: 6, color: '#fff', fontSize: '0.8rem', fontFamily: 'monospace' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  style={{ background: 'transparent', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', padding: '8px 14px', borderRadius: 6, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ background: 'var(--accent-gradient, linear-gradient(135deg, #6366f1, #06b6d4))', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}
                >
                  {isSubmitting ? 'Analyzing...' : 'Run Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
