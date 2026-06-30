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
      fetch('http://localhost:8000/api/v1/auth/github/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
        .then((res) => {
          if (!res.ok) throw new Error('Failed callback authentication');
          return res.json();
        })
        .then((data) => {
          login(data.access_token);
        })
        .catch((err) => {
          console.error(err);
          setError('Failed to authenticate session with server callback.');
        });
    } else {
      setError('No authorization code provided in OAuth redirect.');
    }
  }, [searchParams, login]);

  return (
    <div className="text-center">
      {error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : (
        <>
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="mt-2 text-sm text-muted-foreground">Processing GitHub login callback...</p>
        </>
      )}
    </div>
  );
}

export default function CallbackPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <React.Suspense
        fallback={
          <p className="text-sm text-muted-foreground font-mono">Loading OAuth callback...</p>
        }
      >
        <CallbackHandler />
      </React.Suspense>
    </div>
  );
}
