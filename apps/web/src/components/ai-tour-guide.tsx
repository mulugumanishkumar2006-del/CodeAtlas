'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import {
                        Compass,
                        X,
                        ChevronRight,
                        ChevronLeft,
                        FileCode,
                        Sparkles,
                        Loader2,
                        CheckCircle2,
                        Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// --- Tour Steps Definition ---
export interface TourStep {
                        title: string;
                        description: string;
                        route: string;
                        codePath?: string;
                        highlightSelector?: string; // Optional element selector to highlight
                        avatarSpeech: string;
}

const tourSteps: TourStep[] = [
                        {
                                                title: '👋 Welcome to CodeAtlas',
                                                description: "CodeAtlas builds a dynamic digital twin of your software world. Instead of static documentation, we visualize microservices, files, dependencies, and hotspots in real-time. Let's begin our walk through the code.",
                                                route: '/',
                                                avatarSpeech: "Hello! I am your AI Tour Guide. I'll walk you through the core subsystems of this application so you get onboarded in under 2 minutes!",
                        },
                        {
                                                title: '🔐 Authentication & JWTs',
                                                description: 'Security is managed via GitHub OAuth and signed JWT tokens. When a user requests authentication, they are redirected to GitHub and returned with a code. The backend exchanges it and sets active JWTs.',
                                                route: '/architecture',
                                                codePath: 'apps/backend/app/api/v1/auth.py',
                                                avatarSpeech: "First, let's examine Authentication. Look at how auth.py exposes redirect endpoints and callback token exchange protocols.",
                        },
                        {
                                                title: '💳 Payment & Billing Gateway',
                                                description: 'The Payment module is a classic legacy "God Module" that is highly coupled. It handles database transactions, sync webhooks, SMTP emails, and telemetry synchronously. It is a critical performance bottleneck.',
                                                route: '/reliability',
                                                codePath: 'apps/backend/app/services/payment_service.py',
                                                avatarSpeech: "Let's inspect Payments. The monolithic payment_service.py is a top technical debt risk and must be decomposed into event-driven libraries.",
                        },
                        {
                                                title: '📦 Orders Subsystem',
                                                description: 'Fulfillment is managed by the OrderService orchestrator. It manages product checkout states and hooks into payment processing before publishing fulfilled events to background CDN/Streaming modules.',
                                                route: '/software-city',
                                                codePath: 'apps/backend/app/services/order_service.py',
                                                avatarSpeech: 'Now for Orders. We have isolated the core transactional states in order_service.py to prepare it for microservice extraction.',
                        },
                        {
                                                title: '⚠️ Architecture Risks & Hotspots',
                                                description: 'CodeAtlas runs background static analysis to find high-complexity files, God objects, and circular dependencies. The legacy payment service is flagged with high coupling and zero test coverage.',
                                                route: '/tech-debt',
                                                avatarSpeech: 'Here is where we trace Risks. You can see file hotspots ranked by complexity. Notice payment_service.py scoring in the critical red zone.',
                        },
                        {
                                                title: '📜 Architecture Decisions (ADRs)',
                                                description: 'Instead of outdated wiki pages, we track Architectural Decision Records (ADRs) and drift. We enforce policies (e.g. "Services must not directly queries database models of other services").',
                                                route: '/architecture',
                                                avatarSpeech: "Let's look at Architecture Decisions. We document trade-offs like selecting Celery for asynchronous workers and Redis for queue locks.",
                        },
                        {
                                                title: '🚀 Recommended Refactoring Plans',
                                                description: 'The AI Architect generates actionable recipes, refactoring timelines, and migration sprints. It outlines exactly how to extract Stripe adapters and wrapper helpers to boost your health score.',
                                                route: '/architect',
                                                avatarSpeech: 'Finally, here are recommended Improvements. Our AI has generated a complete sprint layout to split the payment monolith. Onboarding complete!',
                        },
];

interface AITourGuideProps {
                        isActive: boolean;
                        onClose: () => void;
}

export function AITourGuide({ isActive, onClose }: AITourGuideProps) {
                        const router = useRouter();
                        const pathname = usePathname();
                        const { token } = useAuth();

                        const [currentStep, setCurrentStep] = React.useState<number>(0);
                        const [showCode, setShowCode] = React.useState<boolean>(false);
                        const [codeContent, setCodeContent] = React.useState<string>('');
                        const [loadingCode, setLoadingCode] = React.useState<boolean>(false);
                        const [errorMsg, setErrorMsg] = React.useState<string>('');

                        // Start tour reset
                        React.useEffect(() => {
                                                if (isActive) {
                                                                        setCurrentStep(0);
                                                                        setShowCode(false);
                                                }
                        }, [isActive]);

                        // Handle Page Transition on step change
                        const navigateToStep = React.useCallback(
                                                (stepIdx: number) => {
                                                                        const step =
                                                                                                tourSteps[
                                                                                                                        stepIdx
                                                                                                ];

                                                                        // Push the route
                                                                        router.push(step.route);
                                                                        setCurrentStep(stepIdx);
                                                                        setShowCode(false);
                                                                        setCodeContent('');
                                                                        setErrorMsg('');
                                                },
                                                [router]
                        );

                        const handleNext = () => {
                                                if (currentStep < tourSteps.length - 1) {
                                                                        navigateToStep(
                                                                                                currentStep +
                                                                                                                        1
                                                                        );
                                                } else {
                                                                        onClose();
                                                }
                        };

                        const handlePrev = () => {
                                                if (currentStep > 0) {
                                                                        navigateToStep(
                                                                                                currentStep -
                                                                                                                        1
                                                                        );
                                                }
                        };

                        // Load file contents
                        const fetchCodeFile = (path: string) => {
                                                if (!token) return;
                                                setLoadingCode(true);
                                                setErrorMsg('');

                                                fetch(`/api/v1/files/content?path=${path}`, {
                                                                        headers: {
                                                                                                Authorization: `Bearer ${token}`,
                                                                        },
                                                })
                                                                        .then((res) => {
                                                                                                if (
                                                                                                                        !res.ok
                                                                                                )
                                                                                                                        throw new Error(
                                                                                                                                                'Failed to load file content'
                                                                                                                        );
                                                                                                return res.json();
                                                                        })
                                                                        .then((data) => {
                                                                                                setCodeContent(
                                                                                                                        data.content
                                                                                                );
                                                                                                setLoadingCode(
                                                                                                                        false
                                                                                                );
                                                                                                setShowCode(
                                                                                                                        true
                                                                                                );
                                                                        })
                                                                        .catch((err) => {
                                                                                                console.error(
                                                                                                                        'Error fetching file content',
                                                                                                                        err
                                                                                                );
                                                                                                setErrorMsg(
                                                                                                                        'Unable to retrieve file source.'
                                                                                                );
                                                                                                setLoadingCode(
                                                                                                                        false
                                                                                                );
                                                                        });
                        };

                        if (!isActive) return null;

                        const step = tourSteps[currentStep];

                        return (
                                                <>
                                                                        {/* Main AI Tour Guide Widget (Floating card) */}
                                                                        <div className="fixed bottom-6 right-6 z-[60] w-96 bg-zinc-950/90 border border-zinc-800 rounded-2xl shadow-2xl backdrop-blur-md flex flex-col overflow-hidden text-foreground animate-in slide-in-from-bottom-5 duration-300">
                                                                                                <div className="bg-gradient-to-r from-primary/20 via-transparent to-transparent px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
                                                                                                                        <div className="flex items-center gap-1.5 text-xs font-bold text-primary tracking-wide uppercase">
                                                                                                                                                <Sparkles className="h-4 w-4 animate-pulse" />
                                                                                                                                                AI
                                                                                                                                                Onboarding
                                                                                                                                                Companion
                                                                                                                        </div>
                                                                                                                        <Button
                                                                                                                                                variant="ghost"
                                                                                                                                                size="icon"
                                                                                                                                                onClick={
                                                                                                                                                                        onClose
                                                                                                                                                }
                                                                                                                                                className="h-6 w-6 text-muted-foreground hover:text-foreground hover:bg-zinc-900 rounded-lg"
                                                                                                                        >
                                                                                                                                                <X className="h-4 w-4" />
                                                                                                                        </Button>
                                                                                                </div>

                                                                                                <div className="p-5 space-y-4">
                                                                                                                        {/* Character avatar speech bubble */}
                                                                                                                        <div className="flex gap-3 bg-zinc-900/50 p-3 rounded-xl border border-zinc-800/80">
                                                                                                                                                <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-sm shrink-0 border border-primary-foreground/10">
                                                                                                                                                                        🤖
                                                                                                                                                </div>
                                                                                                                                                <div className="space-y-1 text-xs leading-relaxed">
                                                                                                                                                                        <span className="font-bold text-primary block">
                                                                                                                                                                                                Atlas
                                                                                                                                                                                                AI
                                                                                                                                                                                                Guide
                                                                                                                                                                        </span>
                                                                                                                                                                        <p className="text-zinc-200">
                                                                                                                                                                                                {
                                                                                                                                                                                                                        step.avatarSpeech
                                                                                                                                                                                                }
                                                                                                                                                                        </p>
                                                                                                                                                </div>
                                                                                                                        </div>

                                                                                                                        {/* Step Content */}
                                                                                                                        <div className="space-y-2">
                                                                                                                                                <div className="flex items-center justify-between">
                                                                                                                                                                        <h4 className="text-sm font-bold text-foreground">
                                                                                                                                                                                                {
                                                                                                                                                                                                                        step.title
                                                                                                                                                                                                }
                                                                                                                                                                        </h4>
                                                                                                                                                                        <span className="text-[10px] text-muted-foreground font-mono">
                                                                                                                                                                                                Step{' '}
                                                                                                                                                                                                {currentStep +
                                                                                                                                                                                                                        1}{' '}
                                                                                                                                                                                                of{' '}
                                                                                                                                                                                                {
                                                                                                                                                                                                                        tourSteps.length
                                                                                                                                                                                                }
                                                                                                                                                                        </span>
                                                                                                                                                </div>
                                                                                                                                                <p className="text-xs text-muted-foreground leading-relaxed">
                                                                                                                                                                        {
                                                                                                                                                                                                step.description
                                                                                                                                                                        }
                                                                                                                                                </p>
                                                                                                                        </div>

                                                                                                                        {/* Action buttons like Show Code */}
                                                                                                                        {step.codePath && (
                                                                                                                                                <div className="flex items-center justify-between border-t border-zinc-900 pt-3">
                                                                                                                                                                        <span className="text-[10px] text-muted-foreground font-mono truncate max-w-[180px]">
                                                                                                                                                                                                📄{' '}
                                                                                                                                                                                                {step.codePath
                                                                                                                                                                                                                        .split(
                                                                                                                                                                                                                                                '/'
                                                                                                                                                                                                                        )
                                                                                                                                                                                                                        .pop()}
                                                                                                                                                                        </span>

                                                                                                                                                                        <Button
                                                                                                                                                                                                size="xs"
                                                                                                                                                                                                variant="outline"
                                                                                                                                                                                                className="text-xs px-2.5"
                                                                                                                                                                                                disabled={
                                                                                                                                                                                                                        loadingCode
                                                                                                                                                                                                }
                                                                                                                                                                                                onClick={() => {
                                                                                                                                                                                                                        if (
                                                                                                                                                                                                                                                showCode
                                                                                                                                                                                                                        ) {
                                                                                                                                                                                                                                                setShowCode(
                                                                                                                                                                                                                                                                        false
                                                                                                                                                                                                                                                );
                                                                                                                                                                                                                        } else {
                                                                                                                                                                                                                                                fetchCodeFile(
                                                                                                                                                                                                                                                                        step.codePath!
                                                                                                                                                                                                                                                );
                                                                                                                                                                                                                        }
                                                                                                                                                                                                }}
                                                                                                                                                                        >
                                                                                                                                                                                                {loadingCode ? (
                                                                                                                                                                                                                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                                                                                                                                                                                ) : (
                                                                                                                                                                                                                        <FileCode className="h-3.5 w-3.5 mr-1" />
                                                                                                                                                                                                )}
                                                                                                                                                                                                {showCode
                                                                                                                                                                                                                        ? 'Hide Code'
                                                                                                                                                                                                                        : 'Show Code File'}
                                                                                                                                                                        </Button>
                                                                                                                                                </div>
                                                                                                                        )}

                                                                                                                        {errorMsg && (
                                                                                                                                                <p className="text-red-400 text-[10px] text-right font-semibold">
                                                                                                                                                                        {
                                                                                                                                                                                                errorMsg
                                                                                                                                                                        }
                                                                                                                                                </p>
                                                                                                                        )}
                                                                                                </div>

                                                                                                {/* Footer Navigation */}
                                                                                                <div className="px-5 py-3.5 bg-zinc-950/60 border-t border-zinc-900 flex items-center justify-between">
                                                                                                                        <Button
                                                                                                                                                variant="ghost"
                                                                                                                                                size="sm"
                                                                                                                                                disabled={
                                                                                                                                                                        currentStep ===
                                                                                                                                                                        0
                                                                                                                                                }
                                                                                                                                                onClick={
                                                                                                                                                                        handlePrev
                                                                                                                                                }
                                                                                                                                                className="text-xs text-muted-foreground hover:text-foreground"
                                                                                                                        >
                                                                                                                                                <ChevronLeft className="h-4 w-4 mr-0.5" />
                                                                                                                                                Back
                                                                                                                        </Button>

                                                                                                                        {/* Progress Dots */}
                                                                                                                        <div className="flex gap-1">
                                                                                                                                                {tourSteps.map(
                                                                                                                                                                        (
                                                                                                                                                                                                _,
                                                                                                                                                                                                idx
                                                                                                                                                                        ) => (
                                                                                                                                                                                                <div
                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                idx
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                                                                                                                                                                                                                                                idx ===
                                                                                                                                                                                                                                                currentStep
                                                                                                                                                                                                                                                                        ? 'bg-primary w-3'
                                                                                                                                                                                                                                                                        : 'bg-zinc-800'
                                                                                                                                                                                                                        }`}
                                                                                                                                                                                                />
                                                                                                                                                                        )
                                                                                                                                                )}
                                                                                                                        </div>

                                                                                                                        <Button
                                                                                                                                                size="sm"
                                                                                                                                                onClick={
                                                                                                                                                                        handleNext
                                                                                                                                                }
                                                                                                                                                className="text-xs font-semibold px-4"
                                                                                                                        >
                                                                                                                                                {currentStep ===
                                                                                                                                                tourSteps.length -
                                                                                                                                                                        1 ? (
                                                                                                                                                                        <>
                                                                                                                                                                                                <CheckCircle2 className="h-4 w-4 mr-1 text-primary-foreground" />
                                                                                                                                                                                                Finish
                                                                                                                                                                        </>
                                                                                                                                                ) : (
                                                                                                                                                                        <>
                                                                                                                                                                                                Next
                                                                                                                                                                                                <ChevronRight className="h-4 w-4 ml-0.5" />
                                                                                                                                                                        </>
                                                                                                                                                )}
                                                                                                                        </Button>
                                                                                                </div>
                                                                        </div>

                                                                        {/* Sliding Code Viewer Drawer */}
                                                                        {showCode &&
                                                                                                step.codePath && (
                                                                                                                        <div className="fixed top-20 bottom-24 right-104 z-50 w-[550px] bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right-5 duration-300">
                                                                                                                                                <div className="px-4 py-3 bg-zinc-900/60 border-b border-zinc-800 flex items-center justify-between shrink-0">
                                                                                                                                                                        <div className="flex items-center gap-1.5 text-xs font-bold text-foreground font-mono">
                                                                                                                                                                                                <FileCode className="h-4 w-4 text-primary" />
                                                                                                                                                                                                {
                                                                                                                                                                                                                        step.codePath
                                                                                                                                                                                                }
                                                                                                                                                                        </div>
                                                                                                                                                                        <Button
                                                                                                                                                                                                variant="ghost"
                                                                                                                                                                                                size="icon"
                                                                                                                                                                                                onClick={() =>
                                                                                                                                                                                                                        setShowCode(
                                                                                                                                                                                                                                                false
                                                                                                                                                                                                                        )
                                                                                                                                                                                                }
                                                                                                                                                                                                className="h-6 w-6 text-muted-foreground hover:text-foreground"
                                                                                                                                                                        >
                                                                                                                                                                                                <X className="h-4 w-4" />
                                                                                                                                                                        </Button>
                                                                                                                                                </div>

                                                                                                                                                {/* Pre-formatted code content with scroll */}
                                                                                                                                                <div className="flex-1 overflow-auto p-4 font-mono text-[11px] leading-relaxed text-zinc-300 bg-zinc-950/60">
                                                                                                                                                                        <pre className="whitespace-pre">
                                                                                                                                                                                                {codeContent
                                                                                                                                                                                                                        .split(
                                                                                                                                                                                                                                                '\n'
                                                                                                                                                                                                                        )
                                                                                                                                                                                                                        .map(
                                                                                                                                                                                                                                                (
                                                                                                                                                                                                                                                                        line,
                                                                                                                                                                                                                                                                        idx
                                                                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                                                                        idx
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                className="flex hover:bg-zinc-900/40 rounded px-1 group"
                                                                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                                                                <span className="w-8 text-zinc-600 text-right pr-3 select-none border-r border-zinc-900 mr-3 group-hover:text-zinc-500 font-semibold">
                                                                                                                                                                                                                                                                                                                        {idx +
                                                                                                                                                                                                                                                                                                                                                1}
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                                                <span>
                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                line
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                        )}
                                                                                                                                                                        </pre>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                )}
                                                </>
                        );
}
