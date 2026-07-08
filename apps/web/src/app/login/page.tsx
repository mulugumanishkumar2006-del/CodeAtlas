'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
                        const handleGithubLogin = () => {
                                                window.location.href = '/api/v1/auth/login/github';
                        };

                        const handleStubLogin = () => {
                                                window.location.href =
                                                                        '/login/callback?code=stub_code';
                        };

                        return (
                                                <div className="flex h-screen items-center justify-center bg-background p-6">
                                                                        <div className="w-full max-w-sm rounded-xl border bg-card p-8 shadow-sm space-y-6">
                                                                                                <div className="space-y-2 text-center">
                                                                                                                        <h2 className="text-2xl font-bold tracking-tight text-foreground">
                                                                                                                                                Welcome
                                                                                                                                                to
                                                                                                                                                CodeAtlas
                                                                                                                        </h2>
                                                                                                                        <p className="text-sm text-muted-foreground">
                                                                                                                                                Sign
                                                                                                                                                in
                                                                                                                                                using
                                                                                                                                                your
                                                                                                                                                developer
                                                                                                                                                profile
                                                                                                                                                to
                                                                                                                                                continue.
                                                                                                                        </p>
                                                                                                </div>
                                                                                                <div className="space-y-3 flex flex-col">
                                                                                                                        <Button
                                                                                                                                                onClick={
                                                                                                                                                                        handleGithubLogin
                                                                                                                                                }
                                                                                                                                                className="w-full"
                                                                                                                                                size="lg"
                                                                                                                        >
                                                                                                                                                Continue
                                                                                                                                                with
                                                                                                                                                GitHub
                                                                                                                        </Button>
                                                                                                                        <Button
                                                                                                                                                onClick={
                                                                                                                                                                        handleStubLogin
                                                                                                                                                }
                                                                                                                                                variant="outline"
                                                                                                                                                className="w-full"
                                                                                                                                                size="lg"
                                                                                                                        >
                                                                                                                                                Bypass
                                                                                                                                                with
                                                                                                                                                Local
                                                                                                                                                Stub
                                                                                                                                                (Offline)
                                                                                                                        </Button>
                                                                                                </div>
                                                                        </div>
                                                </div>
                        );
}
