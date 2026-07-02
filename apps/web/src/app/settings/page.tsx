'use client';

import * as React from 'react';
import {
  Settings,
  User,
  Sun,
  Moon,
  Monitor,
  FolderSync,
  Trash2,
  Lock,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();

  // Settings State
  const [stubLogin, setStubLogin] = React.useState(true);
  const [celerySyncLimit, setCelerySyncLimit] = React.useState('5');
  const [autoPurgeOnDelete, setAutoPurgeOnDelete] = React.useState(true);
  
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Header */}
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Settings className="h-6 w-6 text-primary" />
          Settings Configuration
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Customize application themes, database sync thresholds, and profile preference parameters.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        
        {/* Save feedback banner */}
        {saveSuccess && (
          <div className="flex items-center gap-2 p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-500 text-sm font-semibold transition-all duration-300 animate-in fade-in zoom-in-95">
            <CheckCircle className="h-5 w-5" />
            <span>Preferences saved successfully!</span>
          </div>
        )}

        {/* 1. Account Details */}
        <div className="border rounded-2xl bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-foreground font-semibold text-sm border-b pb-2">
            <User className="h-4.5 w-4.5 text-muted-foreground" />
            <span>Developer Profile</span>
          </div>

          {user ? (
            <div className="flex flex-col sm:flex-row items-center gap-4 py-2">
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.username}
                  className="h-16 w-16 rounded-full border bg-muted"
                />
              ) : (
                <div className="h-16 w-16 rounded-full border bg-muted flex items-center justify-center">
                  <User className="h-8 w-8 text-muted-foreground/60" />
                </div>
              )}

              <div className="space-y-0.5 text-center sm:text-left flex-1">
                <h4 className="font-bold text-base text-foreground">{user.name || user.username}</h4>
                <p className="text-xs text-muted-foreground font-mono">@{user.username}</p>
                {user.email && <p className="text-xs text-muted-foreground">{user.email}</p>}
              </div>

              <div className="text-xs bg-muted px-2.5 py-1 rounded-full text-muted-foreground font-mono uppercase font-semibold">
                GitHub Session
              </div>
            </div>
          ) : (
            <div className="text-xs text-muted-foreground py-2">No user profile detected.</div>
          )}
        </div>

        {/* 2. Visual Preferences */}
        <div className="border rounded-2xl bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-foreground font-semibold text-sm border-b pb-2">
            <Sun className="h-4.5 w-4.5 text-muted-foreground" />
            <span>Interface Theme</span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={cn(
                'flex flex-col items-center justify-center p-4 border rounded-xl bg-muted/10 hover:bg-muted/20 text-xs font-semibold gap-2 border-dashed transition-colors',
                theme === 'light' ? 'border-primary border-solid bg-primary/5 text-primary' : 'text-muted-foreground'
              )}
            >
              <Sun className="h-5 w-5" />
              Light Theme
            </button>

            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={cn(
                'flex flex-col items-center justify-center p-4 border rounded-xl bg-muted/10 hover:bg-muted/20 text-xs font-semibold gap-2 border-dashed transition-colors',
                theme === 'dark' ? 'border-primary border-solid bg-primary/5 text-primary' : 'text-muted-foreground'
              )}
            >
              <Moon className="h-5 w-5" />
              Dark Theme
            </button>

            <button
              type="button"
              onClick={() => setTheme('system')}
              className={cn(
                'flex flex-col items-center justify-center p-4 border rounded-xl bg-muted/10 hover:bg-muted/20 text-xs font-semibold gap-2 border-dashed transition-colors',
                theme === 'system' ? 'border-primary border-solid bg-primary/5 text-primary' : 'text-muted-foreground'
              )}
            >
              <Monitor className="h-5 w-5" />
              System Preference
            </button>
          </div>
        </div>

        {/* 3. Sync Settings */}
        <div className="border rounded-2xl bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-foreground font-semibold text-sm border-b pb-2">
            <FolderSync className="h-4.5 w-4.5 text-muted-foreground" />
            <span>Git background sync options</span>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-0.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                  Local offline stub login bypass
                  <span title="Bypasses GitHub authentication using mock profiles.">
                    <HelpCircle className="h-3 w-3 text-muted-foreground" />
                  </span>
                </label>
                <p className="text-[10px] text-muted-foreground">Allows stub authorization bypass screen for local verification tests.</p>
              </div>
              <input
                type="checkbox"
                checked={stubLogin}
                onChange={(e) => setStubLogin(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-0.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                  Clean clone storage on deletion
                </label>
                <p className="text-[10px] text-muted-foreground">Deletes the cloned directory folders from local worker disk on repository purge.</p>
              </div>
              <input
                type="checkbox"
                checked={autoPurgeOnDelete}
                onChange={(e) => setAutoPurgeOnDelete(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t pt-4">
              <div className="space-y-0.5">
                <label className="text-xs font-semibold text-foreground">
                  Celery background queue limits
                </label>
                <p className="text-[10px] text-muted-foreground">Maximum simultaneous background Git clones queued at the same time.</p>
              </div>
              <select
                value={celerySyncLimit}
                onChange={(e) => setCelerySyncLimit(e.target.value)}
                className="rounded-lg border bg-background px-3 py-1.5 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              >
                <option value="2">2 concurrent jobs</option>
                <option value="5">5 concurrent jobs</option>
                <option value="10">10 concurrent jobs</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit button */}
        <div className="flex items-center justify-end">
          <Button type="submit" size="sm" className="shadow-md">
            Save Preferences
          </Button>
        </div>
      </form>
    </div>
  );
}
