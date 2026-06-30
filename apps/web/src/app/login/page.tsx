'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const handleGithubLogin = () => {
    window.location.href = 'http://localhost:8000/api/v1/auth/login/github';
  };

  return (
    <div className="flex h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm rounded-xl border bg-card p-8 shadow-sm space-y-6">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Welcome to CodeAtlas
          </h2>
          <p className="text-sm text-muted-foreground">
            Sign in using your developer profile to continue.
          </p>
        </div>
        <Button onClick={handleGithubLogin} className="w-full" size="lg">
          Continue with GitHub
        </Button>
      </div>
    </div>
  );
}
