'use client';

import * as React from 'react';
import { useAuth } from '@/context/auth-context';
import {
                        Play,
                        Pause,
                        SkipForward,
                        SkipBack,
                        Volume2,
                        VolumeX,
                        Tv,
                        Loader2,
                        Dna,
                        Activity,
                        CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Repository {
                        id: string;
                        name: string;
                        full_name: string;
}

interface Slide {
                        slide_number: number;
                        title: string;
                        points: string[];
                        narrative: string;
                        category: string;
}

export default function PresentationPage() {
                        const { token } = useAuth();
                        const [repos, setRepos] = React.useState<Repository[]>([]);
                        const [selectedRepoId, setSelectedRepoId] = React.useState<string>('');
                        const [slides, setSlides] = React.useState<Slide[]>([]);
                        const [loading, setLoading] = React.useState<boolean>(true);

                        // Player states
                        const [currentIndex, setCurrentIndex] = React.useState<number>(0);
                        const [isPlaying, setIsPlaying] = React.useState<boolean>(false);
                        const [narratorActive, setNarratorActive] = React.useState<boolean>(true);

                        // Load repositories
                        React.useEffect(() => {
                                                if (!token) return;
                                                fetch('/api/v1/repositories', {
                                                                        headers: {
                                                                                                Authorization: `Bearer ${token}`,
                                                                        },
                                                })
                                                                        .then((res) => res.json())
                                                                        .then((data) => {
                                                                                                setRepos(
                                                                                                                        data
                                                                                                );
                                                                                                if (
                                                                                                                        data.length >
                                                                                                                        0
                                                                                                ) {
                                                                                                                        setSelectedRepoId(
                                                                                                                                                data[0]
                                                                                                                                                                        .id
                                                                                                                        );
                                                                                                }
                                                                        })
                                                                        .catch((err) =>
                                                                                                console.error(
                                                                                                                        'Error loading repositories',
                                                                                                                        err
                                                                                                )
                                                                        );
                        }, [token]);

                        // Load slides for repo
                        const fetchPresentation = (repoId: string) => {
                                                if (!token || !repoId) return;
                                                setLoading(true);
                                                setIsPlaying(false);
                                                if (typeof window !== 'undefined') {
                                                                        window.speechSynthesis?.cancel();
                                                }

                                                fetch(
                                                                        `/api/v1/repositories/${repoId}/presentation`,
                                                                        {
                                                                                                headers: {
                                                                                                                        Authorization: `Bearer ${token}`,
                                                                                                },
                                                                        }
                                                )
                                                                        .then((res) => res.json())
                                                                        .then((data) => {
                                                                                                setSlides(
                                                                                                                        data.slides
                                                                                                );
                                                                                                setCurrentIndex(
                                                                                                                        0
                                                                                                );
                                                                                                setLoading(
                                                                                                                        false
                                                                                                );
                                                                        })
                                                                        .catch((err) => {
                                                                                                console.error(
                                                                                                                        err
                                                                                                );
                                                                                                setLoading(
                                                                                                                        false
                                                                                                );
                                                                        });
                        };

                        React.useEffect(() => {
                                                if (selectedRepoId) {
                                                                        fetchPresentation(
                                                                                                selectedRepoId
                                                                        );
                                                }
                        }, [selectedRepoId]);

                        // Cleanup speech on unmount
                        React.useEffect(() => {
                                                return () => {
                                                                        if (
                                                                                                typeof window !==
                                                                                                'undefined'
                                                                        ) {
                                                                                                window.speechSynthesis?.cancel();
                                                                        }
                                                };
                        }, []);

                        // Speech Synthesizer narrator handler
                        const speakNarrative = (text: string) => {
                                                if (
                                                                        typeof window ===
                                                                                                'undefined' ||
                                                                        !window.speechSynthesis
                                                )
                                                                        return;
                                                window.speechSynthesis.cancel(); // Stop current speech

                                                if (!narratorActive) return;

                                                const utterance = new SpeechSynthesisUtterance(
                                                                        text
                                                );
                                                // Configure standard narrator voice properties
                                                utterance.rate = 1.0;
                                                utterance.pitch = 1.0;

                                                // Auto advance slide when narration completes (if isPlaying)
                                                utterance.onend = () => {
                                                                        if (
                                                                                                isPlaying &&
                                                                                                currentIndex <
                                                                                                                        slides.length -
                                                                                                                                                1
                                                                        ) {
                                                                                                setCurrentIndex(
                                                                                                                        (
                                                                                                                                                prev
                                                                                                                        ) =>
                                                                                                                                                prev +
                                                                                                                                                1
                                                                                                );
                                                                        } else if (isPlaying) {
                                                                                                setIsPlaying(
                                                                                                                        false
                                                                                                );
                                                                        }
                                                };

                                                window.speechSynthesis.speak(utterance);
                        };

                        // Trigger voice when slide index changes
                        React.useEffect(() => {
                                                if (slides.length > 0) {
                                                                        speakNarrative(
                                                                                                slides[
                                                                                                                        currentIndex
                                                                                                ]
                                                                                                                        .narrative
                                                                        );
                                                }
                        }, [currentIndex, slides, narratorActive]);

                        // Playback state toggle handler
                        React.useEffect(() => {
                                                if (isPlaying && slides.length > 0) {
                                                                        // If synthesis is not currently speaking, trigger it
                                                                        if (
                                                                                                typeof window !==
                                                                                                                        'undefined' &&
                                                                                                !window
                                                                                                                        .speechSynthesis
                                                                                                                        ?.speaking
                                                                        ) {
                                                                                                speakNarrative(
                                                                                                                        slides[
                                                                                                                                                currentIndex
                                                                                                                        ]
                                                                                                                                                .narrative
                                                                                                );
                                                                        }
                                                } else if (
                                                                        !isPlaying &&
                                                                        typeof window !==
                                                                                                'undefined'
                                                ) {
                                                                        window.speechSynthesis?.pause();
                                                }

                                                // Resume speech if playing
                                                if (
                                                                        isPlaying &&
                                                                        typeof window !==
                                                                                                'undefined' &&
                                                                        window.speechSynthesis
                                                                                                ?.paused
                                                ) {
                                                                        window.speechSynthesis.resume();
                                                }
                        }, [isPlaying]);

                        const handlePrev = () => {
                                                if (currentIndex > 0) {
                                                                        setCurrentIndex(
                                                                                                (
                                                                                                                        prev
                                                                                                ) =>
                                                                                                                        prev -
                                                                                                                        1
                                                                        );
                                                }
                        };

                        const handleNext = () => {
                                                if (currentIndex < slides.length - 1) {
                                                                        setCurrentIndex(
                                                                                                (
                                                                                                                        prev
                                                                                                ) =>
                                                                                                                        prev +
                                                                                                                        1
                                                                        );
                                                } else {
                                                                        setIsPlaying(false);
                                                }
                        };

                        const handlePlayPause = () => {
                                                setIsPlaying(!isPlaying);
                        };

                        const currentSlide = slides[currentIndex];

                        return (
                                                <div className="min-h-screen bg-slate-950 text-slate-100 p-6 flex flex-col gap-6 font-mono">
                                                                        {/* Header selection panel */}
                                                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden">
                                                                                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-transparent pointer-events-none" />
                                                                                                <div>
                                                                                                                        <h1 className="text-xl font-bold flex items-center gap-2">
                                                                                                                                                <Tv className="h-6 w-6 text-indigo-400" />
                                                                                                                                                Immersive
                                                                                                                                                Architecture
                                                                                                                                                Presenter
                                                                                                                        </h1>
                                                                                                                        <p className="text-xs text-slate-400 mt-1">
                                                                                                                                                Run
                                                                                                                                                fully
                                                                                                                                                narrated,
                                                                                                                                                hands-free
                                                                                                                                                slide
                                                                                                                                                presentations
                                                                                                                                                for
                                                                                                                                                client
                                                                                                                                                demos,
                                                                                                                                                onboarding,
                                                                                                                                                and
                                                                                                                                                interviews.
                                                                                                                        </p>
                                                                                                </div>

                                                                                                <div className="flex items-center gap-3">
                                                                                                                        <span className="text-xs text-slate-400 uppercase font-bold">
                                                                                                                                                Select
                                                                                                                                                Twin:
                                                                                                                        </span>
                                                                                                                        <select
                                                                                                                                                value={
                                                                                                                                                                        selectedRepoId
                                                                                                                                                }
                                                                                                                                                onChange={(
                                                                                                                                                                        e
                                                                                                                                                ) =>
                                                                                                                                                                        setSelectedRepoId(
                                                                                                                                                                                                e
                                                                                                                                                                                                                        .target
                                                                                                                                                                                                                        .value
                                                                                                                                                                        )
                                                                                                                                                }
                                                                                                                                                className="bg-slate-950 border border-slate-800 text-xs rounded px-3 py-2 focus:outline-none focus:border-indigo-500 text-slate-200"
                                                                                                                        >
                                                                                                                                                {repos.map(
                                                                                                                                                                        (
                                                                                                                                                                                                r
                                                                                                                                                                        ) => (
                                                                                                                                                                                                <option
                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                r.id
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        value={
                                                                                                                                                                                                                                                r.id
                                                                                                                                                                                                                        }
                                                                                                                                                                                                >
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                r.name
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </option>
                                                                                                                                                                        )
                                                                                                                                                )}
                                                                                                                        </select>
                                                                                                </div>
                                                                        </div>

                                                                        {loading ? (
                                                                                                <div className="flex flex-col items-center justify-center flex-1 min-h-[400px]">
                                                                                                                        <Loader2 className="h-10 w-10 text-indigo-400 animate-spin mb-4" />
                                                                                                                        <span className="text-xs text-slate-400 uppercase tracking-widest">
                                                                                                                                                Building
                                                                                                                                                slide
                                                                                                                                                presentations...
                                                                                                                        </span>
                                                                                                </div>
                                                                        ) : slides.length === 0 ? (
                                                                                                <div className="flex flex-col items-center justify-center flex-1 min-h-[400px] border border-dashed border-slate-800 rounded-xl">
                                                                                                                        <span className="text-xs text-slate-500">
                                                                                                                                                No
                                                                                                                                                presentation
                                                                                                                                                deck
                                                                                                                                                generated.
                                                                                                                                                Parse
                                                                                                                                                repository
                                                                                                                                                first.
                                                                                                                        </span>
                                                                                                </div>
                                                                        ) : (
                                                                                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
                                                                                                                        {/* LEFT: Core Slide Viewport */}
                                                                                                                        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-2xl relative min-h-[450px]">
                                                                                                                                                {/* Slide category header bar */}
                                                                                                                                                <div className="bg-slate-950 px-6 py-4 border-b border-slate-800/80 flex justify-between items-center">
                                                                                                                                                                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                                                                                                                                                                                                <Dna className="h-4 w-4 animate-pulse" />
                                                                                                                                                                                                Category:{' '}
                                                                                                                                                                                                {
                                                                                                                                                                                                                        currentSlide.category
                                                                                                                                                                                                }
                                                                                                                                                                        </span>
                                                                                                                                                                        <span className="text-xs text-slate-500 font-bold">
                                                                                                                                                                                                Slide{' '}
                                                                                                                                                                                                {currentIndex +
                                                                                                                                                                                                                        1}{' '}
                                                                                                                                                                                                of{' '}
                                                                                                                                                                                                {
                                                                                                                                                                                                                        slides.length
                                                                                                                                                                                                }
                                                                                                                                                                        </span>
                                                                                                                                                </div>

                                                                                                                                                {/* Slide Viewport Body */}
                                                                                                                                                <div className="flex-1 p-8 flex flex-col justify-center gap-6 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950/40 relative">
                                                                                                                                                                        {/* Slide Title */}
                                                                                                                                                                        <h2 className="text-2xl font-extrabold text-white tracking-tight border-b border-slate-800 pb-3 flex items-center gap-3">
                                                                                                                                                                                                <Activity className="h-6 w-6 text-cyan-400" />
                                                                                                                                                                                                {
                                                                                                                                                                                                                        currentSlide.title
                                                                                                                                                                                                }
                                                                                                                                                                        </h2>

                                                                                                                                                                        {/* Bullet Points */}
                                                                                                                                                                        <ul className="flex flex-col gap-4">
                                                                                                                                                                                                {currentSlide.points.map(
                                                                                                                                                                                                                        (
                                                                                                                                                                                                                                                pt,
                                                                                                                                                                                                                                                index
                                                                                                                                                                                                                        ) => (
                                                                                                                                                                                                                                                <li
                                                                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                                                                index
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                        className="flex items-start gap-3 text-slate-300 text-xs leading-relaxed animate-slide-in"
                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                        <CheckCircle2 className="h-5 w-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                                                                                                                                                                                                                                                                        <span>
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        pt
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                </li>
                                                                                                                                                                                                                        )
                                                                                                                                                                                                )}
                                                                                                                                                                        </ul>
                                                                                                                                                </div>

                                                                                                                                                {/* Teleprompter Subtitles display */}
                                                                                                                                                <div className="bg-slate-950 border-t border-slate-850 p-5 flex items-start gap-4">
                                                                                                                                                                        <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex-shrink-0">
                                                                                                                                                                                                <Volume2 className="h-4 w-4" />
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="flex flex-col gap-0.5">
                                                                                                                                                                                                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                                                                                                                                                                                                                        Teleprompter
                                                                                                                                                                                                                        Subtitles
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <p className="text-slate-300 text-xs italic leading-relaxed font-mono">
                                                                                                                                                                                                                        "
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                currentSlide.narrative
                                                                                                                                                                                                                        }

                                                                                                                                                                                                                        "
                                                                                                                                                                                                </p>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>

                                                                                                                        {/* RIGHT: Slide Player Control Panel */}
                                                                                                                        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-6 justify-between h-full min-h-[400px]">
                                                                                                                                                <div className="flex flex-col gap-4">
                                                                                                                                                                        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-slate-850 pb-2">
                                                                                                                                                                                                Presentation
                                                                                                                                                                                                Control
                                                                                                                                                                        </h3>

                                                                                                                                                                        {/* Progress bar indicator */}
                                                                                                                                                                        <div className="flex flex-col gap-1.5 mt-2">
                                                                                                                                                                                                <div className="flex justify-between text-[9px] text-slate-500 font-bold">
                                                                                                                                                                                                                        <span>
                                                                                                                                                                                                                                                DECK
                                                                                                                                                                                                                                                PROGRESS:
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <span>
                                                                                                                                                                                                                                                {Math.round(
                                                                                                                                                                                                                                                                        ((currentIndex +
                                                                                                                                                                                                                                                                                                1) /
                                                                                                                                                                                                                                                                                                slides.length) *
                                                                                                                                                                                                                                                                                                100
                                                                                                                                                                                                                                                )}

                                                                                                                                                                                                                                                %
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden flex">
                                                                                                                                                                                                                        {slides.map(
                                                                                                                                                                                                                                                (
                                                                                                                                                                                                                                                                        _,
                                                                                                                                                                                                                                                                        idx
                                                                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                                                                        idx
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                className={`h-full flex-1 border-r border-slate-950 last:border-0 ${idx <= currentIndex ? 'bg-indigo-500' : 'bg-slate-800/40'}`}
                                                                                                                                                                                                                                                                        />
                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                        )}
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>

                                                                                                                                                                        {/* Voice Synthesizer Toggle */}
                                                                                                                                                                        <div className="bg-slate-950 p-4 border border-slate-850 rounded-lg flex items-center justify-between mt-4">
                                                                                                                                                                                                <div className="flex flex-col gap-0.5">
                                                                                                                                                                                                                        <span className="text-[10px] text-slate-200 font-bold uppercase">
                                                                                                                                                                                                                                                AI
                                                                                                                                                                                                                                                Narrator
                                                                                                                                                                                                                                                voice
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <span className="text-[9px] text-slate-500">
                                                                                                                                                                                                                                                Synthesizes
                                                                                                                                                                                                                                                spoken
                                                                                                                                                                                                                                                speech
                                                                                                                                                                                                                                                audio.
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                <Button
                                                                                                                                                                                                                        size="xs"
                                                                                                                                                                                                                        onClick={() =>
                                                                                                                                                                                                                                                setNarratorActive(
                                                                                                                                                                                                                                                                        !narratorActive
                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        className={`text-[9px] font-bold uppercase flex gap-1 ${narratorActive ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800'}`}
                                                                                                                                                                                                >
                                                                                                                                                                                                                        {narratorActive ? (
                                                                                                                                                                                                                                                <>
                                                                                                                                                                                                                                                                        On{' '}
                                                                                                                                                                                                                                                                        <Volume2 className="h-3 w-3" />
                                                                                                                                                                                                                                                </>
                                                                                                                                                                                                                        ) : (
                                                                                                                                                                                                                                                <>
                                                                                                                                                                                                                                                                        Off{' '}
                                                                                                                                                                                                                                                                        <VolumeX className="h-3 w-3" />
                                                                                                                                                                                                                                                </>
                                                                                                                                                                                                                        )}
                                                                                                                                                                                                </Button>
                                                                                                                                                                        </div>
                                                                                                                                                </div>

                                                                                                                                                {/* Control buttons */}
                                                                                                                                                <div className="flex flex-col gap-3 mt-6">
                                                                                                                                                                        <div className="flex gap-2">
                                                                                                                                                                                                <Button
                                                                                                                                                                                                                        disabled={
                                                                                                                                                                                                                                                currentIndex ===
                                                                                                                                                                                                                                                0
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        onClick={
                                                                                                                                                                                                                                                handlePrev
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        className="flex-1 bg-slate-950 hover:bg-slate-800 border border-slate-850 text-slate-300 font-bold text-xs flex gap-1"
                                                                                                                                                                                                >
                                                                                                                                                                                                                        <SkipBack className="h-4 w-4" />{' '}
                                                                                                                                                                                                                        Prev
                                                                                                                                                                                                </Button>

                                                                                                                                                                                                <Button
                                                                                                                                                                                                                        onClick={
                                                                                                                                                                                                                                                handlePlayPause
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        className={`flex-1 font-bold text-xs flex gap-1 text-white ${isPlaying ? 'bg-amber-600 hover:bg-amber-500' : 'bg-indigo-600 hover:bg-indigo-500'}`}
                                                                                                                                                                                                >
                                                                                                                                                                                                                        {isPlaying ? (
                                                                                                                                                                                                                                                <>
                                                                                                                                                                                                                                                                        <Pause className="h-4 w-4" />{' '}
                                                                                                                                                                                                                                                                        Pause
                                                                                                                                                                                                                                                </>
                                                                                                                                                                                                                        ) : (
                                                                                                                                                                                                                                                <>
                                                                                                                                                                                                                                                                        <Play className="h-4 w-4" />{' '}
                                                                                                                                                                                                                                                                        Present
                                                                                                                                                                                                                                                </>
                                                                                                                                                                                                                        )}
                                                                                                                                                                                                </Button>

                                                                                                                                                                                                <Button
                                                                                                                                                                                                                        disabled={
                                                                                                                                                                                                                                                currentIndex ===
                                                                                                                                                                                                                                                slides.length -
                                                                                                                                                                                                                                                                        1
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        onClick={
                                                                                                                                                                                                                                                handleNext
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        className="flex-1 bg-slate-950 hover:bg-slate-800 border border-slate-850 text-slate-300 font-bold text-xs flex gap-1"
                                                                                                                                                                                                >
                                                                                                                                                                                                                        Next{' '}
                                                                                                                                                                                                                        <SkipForward className="h-4 w-4" />
                                                                                                                                                                                                </Button>
                                                                                                                                                                        </div>
                                                                                                                                                                        <span className="text-[8px] text-slate-500 text-center uppercase tracking-wide leading-normal">
                                                                                                                                                                                                *
                                                                                                                                                                                                In
                                                                                                                                                                                                autoplay,
                                                                                                                                                                                                slides
                                                                                                                                                                                                automatically
                                                                                                                                                                                                advance
                                                                                                                                                                                                when
                                                                                                                                                                                                the
                                                                                                                                                                                                audio
                                                                                                                                                                                                narration
                                                                                                                                                                                                finishes.
                                                                                                                                                                        </span>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}
                                                </div>
                        );
}
