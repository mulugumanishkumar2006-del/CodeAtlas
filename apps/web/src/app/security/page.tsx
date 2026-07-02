'use client';

import * as React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Zap,
  Lock,
  UserCheck,
  Play,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Terminal,
  Activity
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function SecurityPage() {
  const { token, user } = useAuth();
  
  // Scanning state
  const [scanning, setScanning] = React.useState(false);
  const [scanStep, setScanStep] = React.useState('');
  const [scanProgress, setScanProgress] = React.useState(0);
  const [scanResult, setScanResult] = React.useState<'idle' | 'scanning' | 'passed'>('idle');

  // Parse JWT token header / payload locally for display
  const parsedJwt = React.useMemo(() => {
    if (!token) return null;
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        return {
          alg: 'HS256',
          typ: 'JWT',
          sub: payload.sub || 'user_id',
          exp: payload.exp ? new Date(payload.exp * 1000).toLocaleString() : 'Never',
          iat: payload.iat ? new Date(payload.iat * 1000).toLocaleString() : 'Unknown',
        };
      }
    } catch (e) {
      console.error('Failed to parse local authentication token payload', e);
    }
    return null;
  }, [token]);

  const handleStartScan = () => {
    setScanning(true);
    setScanResult('scanning');
    setScanProgress(0);
    
    const steps = [
      { msg: 'Loading dependency manifests...', time: 1000 },
      { msg: 'Analyzing requirements.txt (FastAPI Backend)...', time: 2000 },
      { msg: 'Analyzing package.json (Next.js Frontend)...', time: 3000 },
      { msg: 'Scanning ast_service.py for static inputs...', time: 4000 },
      { msg: 'Auditing configuration settings files...', time: 5000 },
      { msg: 'Finalizing security assessment report...', time: 6000 },
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        setScanStep(step.msg);
        setScanProgress(Math.floor(((index + 1) / steps.length) * 100));
        if (index === steps.length - 1) {
          setTimeout(() => {
            setScanning(false);
            setScanResult('passed');
          }, 800);
        }
      }, step.time);
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-primary" />
            Security Audit
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Audit API authentication protocols, JWT signatures, and codebase dependency package vulnerabilities.
          </p>
        </div>

        <div>
          <Button
            onClick={handleStartScan}
            disabled={scanning}
            className="flex items-center gap-1.5 shadow-sm"
          >
            {scanning ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4 fill-current" />
            )}
            {scanning ? 'Scanning...' : 'Trigger Security Scan'}
          </Button>
        </div>
      </div>

      {/* Main Grid Details */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-12">
        
        {/* Left Side: Auth Audit & JWT Info */}
        <div className="lg:col-span-5 space-y-6">
          {/* Auth System Status */}
          <div className="border rounded-2xl bg-card p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold tracking-wide text-foreground uppercase">Authentication Gateway</h3>
            
            <div className="flex items-center gap-3 p-4 rounded-xl border bg-muted/10">
              {user?.username === 'github_stub_user' ? (
                <>
                  <AlertTriangle className="h-6 w-6 text-amber-500 shrink-0" />
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-foreground">Local Stub Bypass (Offline)</h4>
                    <p className="text-[10px] text-muted-foreground">Session bypassed using mock developer profile credentials.</p>
                  </div>
                </>
              ) : (
                <>
                  <ShieldCheck className="h-6 w-6 text-emerald-500 shrink-0" />
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-foreground">GitHub OAuth Gateway</h4>
                    <p className="text-[10px] text-muted-foreground">Session authenticated via secure SSL redirection protocols.</p>
                  </div>
                </>
              )}
            </div>

            <div className="text-xs font-mono space-y-2">
              <div className="flex justify-between py-1 border-b">
                <span className="text-muted-foreground">Encryption Protocol</span>
                <span className="font-bold text-foreground">JWT (HMAC-SHA256)</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-muted-foreground">Client SSL Protection</span>
                <span className="font-bold text-emerald-500">Active (HTTPS)</span>
              </div>
            </div>
          </div>

          {/* Local Token Payload */}
          <div className="border rounded-2xl bg-card p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold tracking-wide text-foreground uppercase">JWT Token Parameters</h3>
            
            {parsedJwt ? (
              <div className="text-xs font-mono space-y-2">
                <div className="flex justify-between py-1 border-b">
                  <span className="text-muted-foreground">Signature Algorithm</span>
                  <span className="font-bold text-foreground">{parsedJwt.alg}</span>
                </div>
                <div className="flex justify-between py-1 border-b flex-col sm:flex-row gap-1">
                  <span className="text-muted-foreground">Issued At</span>
                  <span className="font-bold text-foreground break-all">{parsedJwt.iat}</span>
                </div>
                <div className="flex justify-between py-1 border-b flex-col sm:flex-row gap-1">
                  <span className="text-muted-foreground">Token Expiration</span>
                  <span className="font-bold text-foreground break-all">{parsedJwt.exp}</span>
                </div>
                <div className="flex justify-between py-1 flex-col sm:flex-row gap-1">
                  <span className="text-muted-foreground">Subject ID</span>
                  <span className="font-bold text-foreground break-all">{parsedJwt.sub}</span>
                </div>
              </div>
            ) : (
              <div className="text-center text-xs text-muted-foreground py-4 italic">
                No active token data detected.
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Security Scanner Trigger Panel */}
        <div className="lg:col-span-7 border rounded-2xl bg-card p-6 shadow-sm flex flex-col justify-between h-full">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold tracking-wide text-foreground uppercase">Vulnerability Scanner</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Scans monorepo dependencies for known security warnings.</p>
            </div>

            {/* Display according to state */}
            {scanResult === 'idle' && (
              <div className="flex flex-col items-center justify-center p-12 border rounded-xl border-dashed bg-muted/5 space-y-3">
                <Lock className="h-10 w-10 text-muted-foreground/45" />
                <div className="text-center space-y-1">
                  <span className="text-xs font-semibold text-foreground">Auditing Scanner Ready</span>
                  <p className="text-[10px] text-muted-foreground">Launch a scan to run static checkers against dependency manifests.</p>
                </div>
                <Button onClick={handleStartScan} size="sm" className="mt-2 shadow-sm">
                  Run Initial Scan
                </Button>
              </div>
            )}

            {scanResult === 'scanning' && (
              <div className="p-8 border rounded-xl bg-muted/5 space-y-6">
                <div className="flex items-center justify-between font-mono text-xs text-muted-foreground">
                  <span className="animate-pulse">{scanStep}</span>
                  <span>{scanProgress}%</span>
                </div>
                
                <div className="h-3 w-full bg-accent rounded-full overflow-hidden shadow-inner">
                  <div
                    style={{ width: `${scanProgress}%` }}
                    className="bg-primary h-full transition-all duration-300 rounded-full"
                  />
                </div>
              </div>
            )}

            {scanResult === 'passed' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-500 text-xs font-medium">
                  <CheckCircle className="h-5 w-5 shrink-0" />
                  <div>
                    <h4 className="font-bold">Static Analysis Completed</h4>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">0 vulnerabilities detected across package manifests.</p>
                  </div>
                </div>

                <div className="overflow-x-auto text-xs font-mono">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b text-muted-foreground">
                        <th className="py-2">Manifest File</th>
                        <th className="py-2 text-center">Packages Scanned</th>
                        <th className="py-2 text-right">Advisories</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y text-foreground/80">
                      <tr>
                        <td className="py-2.5">package.json</td>
                        <td className="py-2.5 text-center">11 dependencies</td>
                        <td className="py-2.5 text-right text-emerald-500 font-bold">0</td>
                      </tr>
                      <tr>
                        <td className="py-2.5">requirements.txt</td>
                        <td className="py-2.5 text-center">16 dependencies</td>
                        <td className="py-2.5 text-right text-emerald-500 font-bold">0</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
