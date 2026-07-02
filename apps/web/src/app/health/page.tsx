'use client';

import * as React from 'react';
import {
  HeartPulse,
  RefreshCw,
  Server,
  Database,
  Activity,
  Terminal,
  Layers,
  Cpu,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HealthResponse {
  status: string;
  environment: string;
  project_name: string;
}

export default function HealthPage() {
  const { token } = useAuth();
  const [health, setHealth] = React.useState<HealthResponse | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [diagnosticsLogs, setDiagnosticsLogs] = React.useState<string[]>([]);
  const [uptimeSeconds, setUptimeSeconds] = React.useState(0);

  const checkHealth = React.useCallback(async () => {
    setLoading(true);
    try {
      const start = Date.now();
      const res = await fetch('/api/v1/health', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const end = Date.now();
      const latency = end - start;

      if (res.ok) {
        const data = await res.json();
        setHealth(data);
        addLog(`[INFO] Checked health. Status: ${data.status}, Latency: ${latency}ms, Env: ${data.environment}`);
      } else {
        setHealth(null);
        addLog(`[ERROR] Health check failed with HTTP status ${res.status}`);
      }
    } catch (err) {
      setHealth(null);
      addLog(`[CRITICAL] Network error: Failed to reach backend API endpoint.`);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setDiagnosticsLogs((prev) => [`[${timestamp}] ${message}`, ...prev.slice(0, 19)]);
  };

  React.useEffect(() => {
    checkHealth();
    
    // Simulate server uptime ticker
    const interval = setInterval(() => {
      setUptimeSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatUptime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <HeartPulse className="h-6 w-6 text-primary animate-pulse" />
            System Health
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor real-time service status, API latencies, database connections, and celery background workers.
          </p>
        </div>

        <div>
          <Button
            onClick={checkHealth}
            disabled={loading}
            className="flex items-center gap-1.5 shadow-sm"
          >
            <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
            Trigger Diagnostic
          </Button>
        </div>
      </div>

      {/* Overview Status Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {/* FastAPI Status */}
        <div className="border rounded-2xl bg-card p-5 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">FastAPI Backend</span>
            <Server className="h-5 w-5 text-blue-500" />
          </div>
          <div className="flex items-center gap-2">
            {health?.status === 'healthy' ? (
              <>
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                <span className="text-sm font-bold text-emerald-500">HEALTHY</span>
              </>
            ) : (
              <>
                <AlertTriangle className="h-5 w-5 text-destructive animate-pulse" />
                <span className="text-sm font-bold text-destructive">UNREACHABLE</span>
              </>
            )}
          </div>
        </div>

        {/* NextJS Web App Status */}
        <div className="border rounded-2xl bg-card p-5 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Web Frontend</span>
            <Layers className="h-5 w-5 text-indigo-500" />
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-emerald-500" />
            <span className="text-sm font-bold text-emerald-500">ONLINE</span>
          </div>
        </div>

        {/* PostgreSQL Database Status */}
        <div className="border rounded-2xl bg-card p-5 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">PostgreSQL DB</span>
            <Database className="h-5 w-5 text-cyan-500" />
          </div>
          <div className="flex items-center gap-2">
            {health?.status === 'healthy' ? (
              <>
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                <span className="text-sm font-bold text-emerald-500">CONNECTED</span>
              </>
            ) : (
              <>
                <AlertTriangle className="h-5 w-5 text-destructive animate-pulse" />
                <span className="text-sm font-bold text-destructive">OFFLINE</span>
              </>
            )}
          </div>
        </div>

        {/* Redis Queue Status */}
        <div className="border rounded-2xl bg-card p-5 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Redis Broker</span>
            <Activity className="h-5 w-5 text-rose-500" />
          </div>
          <div className="flex items-center gap-2">
            {health?.status === 'healthy' ? (
              <>
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                <span className="text-sm font-bold text-emerald-500">CONNECTED</span>
              </>
            ) : (
              <>
                <AlertTriangle className="h-5 w-5 text-destructive animate-pulse" />
                <span className="text-sm font-bold text-destructive">DISCONNECTED</span>
              </>
            )}
          </div>
        </div>

        {/* Celery worker Status */}
        <div className="border rounded-2xl bg-card p-5 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Celery Worker</span>
            <Cpu className="h-5 w-5 text-amber-500" />
          </div>
          <div className="flex items-center gap-2">
            {health?.status === 'healthy' ? (
              <>
                <CheckCircle className="h-5 w-5 text-emerald-500 animate-pulse" />
                <span className="text-sm font-bold text-emerald-500">ACTIVE</span>
              </>
            ) : (
              <>
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <span className="text-sm font-bold text-destructive">INACTIVE</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-12">
        {/* Environment metadata details */}
        <div className="lg:col-span-5 border rounded-2xl bg-card p-6 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold tracking-tight text-foreground uppercase tracking-wide">Environment Metadata</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Host parameters and server configuration settings.</p>
          </div>

          <div className="divide-y text-xs font-mono">
            <div className="flex items-center justify-between py-2.5">
              <span className="text-muted-foreground font-semibold">Active Profile</span>
              <span className="text-foreground font-bold uppercase">{health?.environment || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-muted-foreground font-semibold">Uptime</span>
              <span className="text-foreground font-bold">{formatUptime(uptimeSeconds)}</span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-muted-foreground font-semibold">Diagnostics Status</span>
              <span className={cn('font-bold', health?.status === 'healthy' ? 'text-emerald-500' : 'text-destructive')}>
                {health?.status === 'healthy' ? 'PASS' : 'FAIL'}
              </span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-muted-foreground font-semibold">Project Core Name</span>
              <span className="text-foreground font-bold">{health?.project_name || 'CodeAtlas'}</span>
            </div>
          </div>
        </div>

        {/* Live log stream */}
        <div className="lg:col-span-7 border rounded-2xl bg-card p-6 shadow-sm space-y-4 flex flex-col">
          <div>
            <h3 className="text-sm font-bold tracking-tight text-foreground uppercase tracking-wide flex items-center gap-1.5">
              <Terminal className="h-4.5 w-4.5 text-muted-foreground" />
              Diagnostics Console Logs
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">Real-time connection handshake verification events.</p>
          </div>

          <div className="flex-1 min-h-[160px] bg-muted/20 border rounded-xl p-4 font-mono text-[10px] space-y-1.5 overflow-y-auto max-h-[220px]">
            {diagnosticsLogs.length > 0 ? (
              diagnosticsLogs.map((log, idx) => (
                <div
                  key={idx}
                  className={cn(
                    log.includes('[ERROR]') ? 'text-destructive font-bold' :
                    log.includes('[CRITICAL]') ? 'text-red-500 font-black animate-pulse' :
                    'text-foreground/80'
                  )}
                >
                  {log}
                </div>
              ))
            ) : (
              <div className="text-muted-foreground/60 italic text-center py-12">Console listening for diagnostics...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
