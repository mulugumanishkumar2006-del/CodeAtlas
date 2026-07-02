'use client';

import * as React from 'react';
import {
  BarChart3,
  Database,
  FileCode,
  GitBranch,
  RefreshCw,
  Zap,
  TrendingUp,
  Cpu,
  Award
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Repository {
  id: string;
  name: string;
  full_name: string;
  clone_url: string;
  status: string;
}

interface RepositoryStatistics {
  total_files: number;
  total_lines: number;
  total_code_lines: number;
  total_comment_lines: number;
  total_blank_lines: number;
  total_size_bytes: number;
  total_complexity: number;
  average_complexity: number;
  documentation_coverage: number;
}

interface FileMetricSummary {
  file_path: string;
  complexity_total: number;
  coverage_percent: number;
  total_lines: number;
}

interface RepositoryMetrics {
  statistics: RepositoryStatistics;
  files: FileMetricSummary[];
}

export default function AnalyticsPage() {
  const { token } = useAuth();
  const [repos, setRepos] = React.useState<Repository[]>([]);
  const [selectedRepoId, setSelectedRepoId] = React.useState<string>('');
  const [metrics, setMetrics] = React.useState<RepositoryMetrics | null>(null);
  const [languages, setLanguages] = React.useState<Record<string, number>>({});
  
  const [loading, setLoading] = React.useState(true);
  const [metricsLoading, setMetricsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const selectedRepo = repos.find((r) => r.id === selectedRepoId);

  // Fetch repositories list
  const fetchRepos = React.useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/v1/repositories', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setRepos(data);
        if (data.length > 0) {
          setSelectedRepoId(data[0].id);
        }
      } else {
        setError('Failed to fetch repositories list');
      }
    } catch (e) {
      setError('Network error occurred while fetching repositories');
    } finally {
      setLoading(false);
    }
  }, [token]);

  React.useEffect(() => {
    fetchRepos();
  }, [token]);

  // Fetch metrics and languages for selected repo
  const fetchMetricsData = React.useCallback(async () => {
    if (!token || !selectedRepoId) return;
    setMetricsLoading(true);
    setMetrics(null);
    setLanguages({});
    try {
      const metricsRes = await fetch(`/api/v1/repositories/${selectedRepoId}/metrics`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const langsRes = await fetch(`/api/v1/repositories/${selectedRepoId}/languages`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (metricsRes.ok) {
        const metricsData = await metricsRes.json();
        setMetrics(metricsData);
      }
      
      if (langsRes.ok) {
        const langsData = await langsRes.json();
        setLanguages(langsData.languages || {});
      }
    } catch (e) {
      console.error('Failed to load metrics data', e);
    } finally {
      setMetricsLoading(false);
    }
  }, [token, selectedRepoId]);

  React.useEffect(() => {
    if (selectedRepoId && selectedRepo?.status === 'cloned') {
      fetchMetricsData();
    }
  }, [selectedRepoId, selectedRepo]);

  // Sort files by complexity descending
  const sortedFiles = React.useMemo(() => {
    if (!metrics?.files) return [];
    return [...metrics.files].sort((a, b) => b.complexity_total - a.complexity_total);
  }, [metrics]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            Codebase Analytics
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Evaluate code quality metrics, complexity distributions, and programming language parameters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {repos.length > 0 && (
            <select
              value={selectedRepoId}
              onChange={(e) => setSelectedRepoId(e.target.value)}
              className="rounded-lg border bg-background px-3 py-2 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
            >
              {repos.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.full_name} ({r.status})
                </option>
              ))}
            </select>
          )}
          <Button
            onClick={fetchRepos}
            variant="outline"
            size="sm"
            disabled={loading}
            className="flex items-center gap-1.5"
          >
            <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Main Panel View */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-16 border rounded-2xl bg-card shadow-sm space-y-4">
          <RefreshCw className="h-8 w-8 text-primary animate-spin" />
          <span className="text-sm text-muted-foreground">Loading repositories...</span>
        </div>
      ) : repos.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-dashed rounded-2xl p-16 text-center bg-card shadow-sm space-y-4">
          <div className="rounded-2xl p-4 bg-primary/5 text-primary">
            <GitBranch className="h-10 w-10" />
          </div>
          <div className="max-w-md space-y-2">
            <h3 className="text-xl font-bold tracking-tight">No Repository Found</h3>
            <p className="text-muted-foreground text-sm">
              Please register and parse a repository in the main dashboard view to generate metric analytics.
            </p>
          </div>
        </div>
      ) : selectedRepo?.status !== 'cloned' ? (
        <div className="flex flex-col items-center justify-center border rounded-2xl p-16 bg-card shadow-sm space-y-4">
          <div className="rounded-full p-4 bg-amber-500/10 text-amber-500">
            <Zap className="h-8 w-8" />
          </div>
          <div className="text-center space-y-1 max-w-sm">
            <h3 className="text-lg font-semibold">Repository Not Ready</h3>
            <p className="text-muted-foreground text-sm">
              This repository is currently in `{selectedRepo?.status}` status. It must be cloned and parsed from the Dashboard to retrieve code metrics.
            </p>
          </div>
        </div>
      ) : metricsLoading ? (
        <div className="flex flex-col items-center justify-center p-16 border rounded-2xl bg-card shadow-sm space-y-4">
          <RefreshCw className="h-8 w-8 text-primary animate-spin" />
          <span className="text-sm text-muted-foreground">Analyzing complexity and schemas...</span>
        </div>
      ) : !metrics ? (
        <div className="flex flex-col items-center justify-center border rounded-2xl p-16 bg-card shadow-sm space-y-4">
          <div className="rounded-full p-4 bg-primary/10 text-primary">
            <Database className="h-8 w-8" />
          </div>
          <div className="text-center space-y-1 max-w-sm">
            <h3 className="text-lg font-semibold">No Metrics Available</h3>
            <p className="text-muted-foreground text-sm">
              This repository has not been parsed by the CodeAtlas AST parsing engine yet.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Metrics summary cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="border rounded-2xl bg-card p-6 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Lines of Code</span>
                <FileCode className="h-5 w-5 text-blue-500" />
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-black tracking-tight font-mono">{metrics.statistics.total_code_lines.toLocaleString()}</h3>
                <p className="text-[10px] text-muted-foreground">Total Lines: {metrics.statistics.total_lines.toLocaleString()}</p>
              </div>
            </div>

            <div className="border rounded-2xl bg-card p-6 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Complexity</span>
                <Cpu className="h-5 w-5 text-indigo-500" />
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-black tracking-tight font-mono">{metrics.statistics.total_complexity.toLocaleString()}</h3>
                <p className="text-[10px] text-muted-foreground">Average CC: {metrics.statistics.average_complexity.toFixed(2)}</p>
              </div>
            </div>

            <div className="border rounded-2xl bg-card p-6 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Docstring Coverage</span>
                <Award className="h-5 w-5 text-emerald-500" />
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-black tracking-tight font-mono">{metrics.statistics.documentation_coverage.toFixed(1)}%</h3>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    style={{ width: `${metrics.statistics.documentation_coverage}%` }}
                    className="bg-emerald-500 h-full rounded-full"
                  />
                </div>
              </div>
            </div>

            <div className="border rounded-2xl bg-card p-6 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">File Size (Bytes)</span>
                <TrendingUp className="h-5 w-5 text-amber-500" />
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-black tracking-tight font-mono">{(metrics.statistics.total_size_bytes / 1024).toFixed(1)} KB</h3>
                <p className="text-[10px] text-muted-foreground">Across {metrics.statistics.total_files} active files</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 grid-cols-1 lg:grid-cols-12">
            {/* Language distribution panel */}
            <div className="lg:col-span-4 border rounded-2xl bg-card p-6 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold tracking-tight text-foreground uppercase tracking-wide">Language Breakdown</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Codebase language composition by file counts.</p>
              </div>

              {Object.keys(languages).length > 0 ? (
                <div className="space-y-4 my-4 flex-1 flex flex-col justify-center">
                  {Object.entries(languages).map(([lang, count]) => {
                    const total = Object.values(languages).reduce((a, b) => a + b, 0);
                    const pct = total > 0 ? (count / total) * 100 : 0;
                    return (
                      <div key={lang} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-semibold font-mono">
                          <span>{lang}</span>
                          <span className="text-muted-foreground">{count} files ({pct.toFixed(0)}%)</span>
                        </div>
                        <div className="h-2 w-full bg-accent rounded-full overflow-hidden">
                          <div
                            style={{ width: `${pct}%` }}
                            className={cn(
                              'h-full rounded-full',
                              lang === 'Python' ? 'bg-blue-500' :
                              lang === 'TypeScript' ? 'bg-indigo-500' :
                              lang === 'JavaScript' ? 'bg-amber-500' : 'bg-primary'
                            )}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center text-xs text-muted-foreground py-8 italic">
                  No language data available.
                </div>
              )}
            </div>

            {/* Top complex files list */}
            <div className="lg:col-span-8 border rounded-2xl bg-card p-6 shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-bold tracking-tight text-foreground uppercase tracking-wide">Complexity Rankings</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Source files sorted by total Cyclomatic Complexity.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b text-xs font-semibold text-muted-foreground font-mono">
                      <th className="py-2">File Path</th>
                      <th className="py-2 text-center">Lines</th>
                      <th className="py-2 text-center">Complexity</th>
                      <th className="py-2 text-right">Coverage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {sortedFiles.slice(0, 5).map((f) => (
                      <tr key={f.file_path} className="hover:bg-muted/30">
                        <td className="py-3 font-mono text-xs truncate max-w-[200px] sm:max-w-xs md:max-w-md" title={f.file_path}>
                          {f.file_path}
                        </td>
                        <td className="py-3 text-center font-mono text-xs">{f.total_lines}</td>
                        <td className="py-3 text-center font-mono text-xs font-bold text-foreground flex items-center justify-center gap-1">
                          {f.complexity_total}
                          {f.complexity_total > 15 ? (
                            <span className="h-1.5 w-1.5 rounded-full bg-destructive animate-pulse" title="High Complexity" />
                          ) : f.complexity_total > 5 ? (
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" title="Medium Complexity" />
                          ) : (
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" title="Low Complexity" />
                          )}
                        </td>
                        <td className="py-3 text-right font-mono text-xs font-semibold text-muted-foreground">
                          {f.coverage_percent.toFixed(0)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
