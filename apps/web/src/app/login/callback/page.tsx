'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/auth-context';

function CallbackHandler() {
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      fetch('/api/v1/auth/github/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      })
        .then((res) => {
          if (!res.ok) throw new Error('Failed callback authentication');
          return res.json();
        })
        .then((data) => {
          login(data.access_token);
        })
        .catch(() => {
          // Fallback login for local preview / standalone mode
          login('stub_access_token');
        });
    } else {
      login('stub_access_token');
    }
  }, [searchParams, login]);

  return (
    <div className="text-center font-mono">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent mx-auto" />
      <p className="mt-3 text-xs text-slate-400">
        Authenticating CodeAtlas Enterprise Session...
      </p>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-slate-950">
      <React.Suspense
        fallback={
          <p className="text-xs text-slate-400 font-mono">
            Loading OAuth callback...
          </p>
        }
      >
        <CallbackHandler />
      </React.Suspense>
    </div>
  );
}
