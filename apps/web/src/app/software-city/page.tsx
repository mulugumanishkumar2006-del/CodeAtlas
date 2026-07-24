'use client';

import * as React from 'react';
import { useAuth } from '@/context/auth-context';
import { SoftwareCityMap } from '@/components/software-city-map';
import {
                        Building2,
                        Zap,
                        Compass,
                        AlertTriangle,
                        ShieldCheck,
                        Database,
                        RefreshCw,
                        Layers,
                        Users,
                        MapPin,
                        Play,
                        HelpCircle,
                        ChevronRight,
                        Activity,
                        Terminal,
                        Cloud,
                        RotateCw,
                        RotateCcw,
                        Search,
                        Eye,
                        Filter,
                        Coins,
                        TrendingUp,
                        BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Repository {
                        id: string;
                        name: string;
                        full_name: string;
                        status: string;
}

export default function SoftwareCityPage() {
                        const { token } = useAuth();
                        const [repos, setRepos] = React.useState<Repository[]>([]);
                        const [selectedRepoId, setSelectedRepoId] = React.useState<string>('');
                        const [cityData, setCityData] = React.useState<any>(null);
                        const [loading, setLoading] = React.useState<boolean>(false);
                        const [activeSimulation, setActiveSimulation] = React.useState<
                                                string | null
                        >(null);
                        const [selectedBuilding, setSelectedBuilding] = React.useState<any>(null);
                        const [expandedDistrict, setExpandedDistrict] = React.useState<
                                                string | null
                        >(null);

                        const [weatherState, setWeatherState] = React.useState<string>('sunny');
                        const [currentEvolutionFrame, setCurrentEvolutionFrame] =
                                                React.useState<number>(0);
                        const [isEvolutionPlaying, setIsEvolutionPlaying] =
                                                React.useState<boolean>(false);
                        const [loadUsersCount, setLoadUsersCount] = React.useState<number>(100);
                        const [timeTravelDate, setTimeTravelDate] = React.useState<string>('today');
                        const [isSatelliteView, setIsSatelliteView] =
                                                React.useState<boolean>(false);

                        // Interactive navigation states: rotation, search, layer filters
                        const [rotationAngle, setRotationAngle] = React.useState<number>(0);
                        const [searchQuery, setSearchQuery] = React.useState<string>('');
                        const [layerFilters, setLayerFilters] = React.useState({
                                                districts: true,
                                                buildings: true,
                                                roads: true,
                                                highways: true,
                                                landmarks: true,
                                                citizens: true,
                                                dangerZones: true,
                                                rivers: true,
                                                knowledge: true,
                        });

                        const [consoleLogs, setConsoleLogs] = React.useState<string[]>([
                                                '[SYSTEM] Welcome to the CodeAtlas Software Digital Twin Platform.',
                                                '[SYSTEM] Initialize Software City grid projection... OK',
                        ]);

                        const addLog = (message: string) => {
                                                setConsoleLogs((prev) => [
                                                                        ...prev.slice(-15),
                                                                        `[${new Date().toLocaleTimeString()}] ${message}`,
                                                ]);
                        };

                        // Fetch repositories
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
                                                                                                                        'Error fetching repositories',
                                                                                                                        err
                                                                                                )
                                                                        );
                        }, [token]);

                        // Fetch Software City Layout
                        const fetchCityLayout = (repoId: string) => {
                                                if (!token || !repoId) return;
                                                setLoading(true);
                                                addLog(
                                                                        `Fetching digital twin city data for repository...`
                                                );
                                                fetch(
                                                                        `/api/v1/repositories/${repoId}/digital-twin/software-city`,
                                                                        {
                                                                                                headers: {
                                                                                                                        Authorization: `Bearer ${token}`,
                                                                                                },
                                                                        }
                                                )
                                                                        .then((res) => {
                                                                                                if (
                                                                                                                        !res.ok
                                                                                                )
                                                                                                                        throw new Error(
                                                                                                                                                'API failed'
                                                                                                                        );
                                                                                                return res.json();
                                                                        })
                                                                        .then((data) => {
                                                                                                setCityData(
                                                                                                                        data
                                                                                                );
                                                                                                setLoading(
                                                                                                                        false
                                                                                                );
                                                                                                addLog(
                                                                                                                        `Mapped Software City: "${data.city_name}" successfully.`
                                                                                                );
                                                                                                addLog(
                                                                                                                        `City telemetry updated: GDP Health: ${data.overall_health}%, Traffic Congestion: ${data.congestion_index}%.`
                                                                                                );
                                                                        })
                                                                        .catch((err) => {
                                                                                                console.error(
                                                                                                                        'Error loading Software City layout',
                                                                                                                        err
                                                                                                );
                                                                                                setLoading(
                                                                                                                        false
                                                                                                );
                                                                                                addLog(
                                                                                                                        `[ERROR] Failed to map Software City layout.`
                                                                                                );
                                                                        });
                        };

                        React.useEffect(() => {
                                                if (selectedRepoId) {
                                                                        fetchCityLayout(
                                                                                                selectedRepoId
                                                                        );
                                                }
                        }, [selectedRepoId, token]);

                        // Compute weather State from repository health metrics (Feature 7)
                        React.useEffect(() => {
                                                if (!cityData) return;
                                                const health = cityData.overall_health || 100;
                                                const debt = cityData.congestion_index || 0;

                                                // Choose weather dynamically
                                                if (
                                                                        activeSimulation ===
                                                                                                'blackout' ||
                                                                        activeSimulation ===
                                                                                                'danger_zone' ||
                                                                        activeSimulation ===
                                                                                                'ai_auth_slow' ||
                                                                        activeSimulation ===
                                                                                                'db_fail'
                                                ) {
                                                                        setWeatherState(
                                                                                                'lightning'
                                                                        );
                                                                        addLog(
                                                                                                `[WEATHER] Severe architectural alerts. Environmental forecast: Lightning Storm.`
                                                                        );
                                                } else if (debt > 65) {
                                                                        setWeatherState('storm');
                                                                        addLog(
                                                                                                `[WEATHER] Heavy technical debt detected. Environmental forecast: Rain Storm.`
                                                                        );
                                                } else if (debt > 35) {
                                                                        setWeatherState('cloudy');
                                                                        addLog(
                                                                                                `[WEATHER] Technical debt growing. Environmental forecast: Cloudy.`
                                                                        );
                                                } else if (health < 60) {
                                                                        setWeatherState('fog');
                                                                        addLog(
                                                                                                `[WEATHER] Low documentation clarity visibility. Environmental forecast: Foggy.`
                                                                        );
                                                } else {
                                                                        setWeatherState('sunny');
                                                                        addLog(
                                                                                                `[WEATHER] Code base health stable. Environmental forecast: Sunny.`
                                                                        );
                                                }
                        }, [cityData, activeSimulation]);

                        // Evolution Time-lapse Movie Interval Loop (Feature 11)
                        React.useEffect(() => {
                                                if (!isEvolutionPlaying) {
                                                                        setCurrentEvolutionFrame(0);
                                                                        return;
                                                }

                                                addLog(
                                                                        '🎬 [EVOLUTION] Starting time-lapse evolution movie of code repository...'
                                                );
                                                setCurrentEvolutionFrame(1);
                                                addLog(
                                                                        '🎬 [EVOLUTION] Frame 1/8: Repository Born. Initial commit containing core workspace configuration.'
                                                );

                                                let frame = 1;
                                                const interval = setInterval(() => {
                                                                        frame++;
                                                                        if (frame > 8) {
                                                                                                clearInterval(
                                                                                                                        interval
                                                                                                );
                                                                                                setIsEvolutionPlaying(
                                                                                                                        false
                                                                                                );
                                                                                                setCurrentEvolutionFrame(
                                                                                                                        0
                                                                                                );
                                                                                                addLog(
                                                                                                                        '🎬 [EVOLUTION] Repository evolution movie completed.'
                                                                                                );
                                                                        } else {
                                                                                                setCurrentEvolutionFrame(
                                                                                                                        frame
                                                                                                );
                                                                                                switch (
                                                                                                                        frame
                                                                                                ) {
                                                                                                                        case 2:
                                                                                                                                                addLog(
                                                                                                                                                                        '🎬 [EVOLUTION] Frame 2/8: Packages Added. Directory structure mapped.'
                                                                                                                                                );
                                                                                                                                                break;
                                                                                                                        case 3:
                                                                                                                                                addLog(
                                                                                                                                                                        '🎬 [EVOLUTION] Frame 3/8: Services Split. Monolithic files decoupled into isolated services.'
                                                                                                                                                );
                                                                                                                                                break;
                                                                                                                        case 4:
                                                                                                                                                addLog(
                                                                                                                                                                        '🎬 [EVOLUTION] Frame 4/8: Microservices. Databases, queue nodes and caching layers active.'
                                                                                                                                                );
                                                                                                                                                break;
                                                                                                                        case 5:
                                                                                                                                                addLog(
                                                                                                                                                                        '🎬 [EVOLUTION] Frame 5/8: New APIs. Controller routes mapped, rivers of data flow.'
                                                                                                                                                );
                                                                                                                                                break;
                                                                                                                        case 6:
                                                                                                                                                addLog(
                                                                                                                                                                        '🎬 [EVOLUTION] Frame 6/8: Technical Debt. Overcrowded lanes, complexity alerts, red warning zones.'
                                                                                                                                                );
                                                                                                                                                break;
                                                                                                                        case 7:
                                                                                                                                                addLog(
                                                                                                                                                                        '🎬 [EVOLUTION] Frame 7/8: Refactoring. High debt code files refactored, performance flows restabilized.'
                                                                                                                                                );
                                                                                                                                                break;
                                                                                                                        case 8:
                                                                                                                                                addLog(
                                                                                                                                                                        '🎬 [EVOLUTION] Frame 8/8: Modern Architecture. Digital Twin optimized, glowing documentation beacons.'
                                                                                                                                                );
                                                                                                                                                break;
                                                                                                }
                                                                        }
                                                }, 2500);

                                                return () => clearInterval(interval);
                        }, [isEvolutionPlaying]);

                        // Database Failure Incident Cascade Log Logger (Feature 12)
                        React.useEffect(() => {
                                                if (activeSimulation !== 'db_fail') return;

                                                addLog(
                                                                        '🚨 [INCIDENT] Database Postgres Station connection pool lost!'
                                                );
                                                addLog(
                                                                        '🚨 [INCIDENT] CASCADE WARNING: Propagating failure downstream...'
                                                );

                                                const timers = [
                                                                        setTimeout(() => {
                                                                                                addLog(
                                                                                                                        '🔴 [INCIDENT] Orders Service connection timed out (Stage 1/5)'
                                                                                                );
                                                                        }, 1200),
                                                                        setTimeout(() => {
                                                                                                addLog(
                                                                                                                        '🔴 [INCIDENT] Payment Service unable to save charge records (Stage 2/5)'
                                                                                                );
                                                                        }, 2400),
                                                                        setTimeout(() => {
                                                                                                addLog(
                                                                                                                        '🔴 [INCIDENT] Invoices Service checkout generation blocked (Stage 3/5)'
                                                                                                );
                                                                        }, 3600),
                                                                        setTimeout(() => {
                                                                                                addLog(
                                                                                                                        '🔴 [INCIDENT] Notification Queue pool exhausted (Stage 4/5)'
                                                                                                );
                                                                        }, 4800),
                                                                        setTimeout(() => {
                                                                                                addLog(
                                                                                                                        '🔴 [INCIDENT] Users Auth Token verification failed (Stage 5/5)'
                                                                                                );
                                                                                                addLog(
                                                                                                                        '💀 [INCIDENT] Complete Grid Shutdown.'
                                                                                                );
                                                                        }, 6000),
                                                ];

                                                return () => {
                                                                        timers.forEach((t) =>
                                                                                                clearTimeout(
                                                                                                                        t
                                                                                                )
                                                                        );
                                                };
                        }, [activeSimulation]);

                        // Scalability Load Logger (Feature 13)
                        React.useEffect(() => {
                                                const formatted =
                                                                        loadUsersCount >= 1000000
                                                                                                ? `${loadUsersCount / 1000000}M`
                                                                                                : loadUsersCount >=
                                                                                                    1000
                                                                                                  ? `${loadUsersCount / 1000}K`
                                                                                                  : loadUsersCount;
                                                addLog(
                                                                        `[SCALABILITY] Load simulator scaled to: ${formatted} concurrent users.`
                                                );

                                                if (loadUsersCount >= 100000000) {
                                                                        addLog(
                                                                                                `[ALERT] 100M load: Database CPU at 99%. Cache hit ratio dropped to 12%. connection pool exhausted!`
                                                                        );
                                                } else if (loadUsersCount >= 10000000) {
                                                                        addLog(
                                                                                                `[WARNING] 10M heavy load: Cache hit ratio at 35%. API latency degraded to 1420ms.`
                                                                        );
                                                } else if (loadUsersCount >= 1000000) {
                                                                        addLog(
                                                                                                `[TELEMETRY] 1M load: Thread pools filling. Message queues queuing delayed items.`
                                                                        );
                                                } else {
                                                                        addLog(
                                                                                                `[TELEMETRY] Load stable. System health normal.`
                                                                        );
                                                }
                        }, [loadUsersCount]);

                        // Timeline selection logs (Feature 15)
                        React.useEffect(() => {
                                                if (timeTravelDate === 'historical') {
                                                                        addLog(
                                                                                                '🕰️ [TIME TRAVEL] Projected historical codebase twin: March 2024.'
                                                                        );
                                                                        addLog(
                                                                                                '🕰️ [TIME TRAVEL] Monolithic architecture profile loaded. GDP Health: 42% | Congestion technical debt: 76%.'
                                                                        );
                                                                        if (cityData) {
                                                                                                setCityData(
                                                                                                                        (
                                                                                                                                                prev: any
                                                                                                                        ) => ({
                                                                                                                                                ...prev,
                                                                                                                                                overall_health: 42,
                                                                                                                                                congestion_index: 76,
                                                                                                                        })
                                                                                                );
                                                                        }
                                                } else {
                                                                        addLog(
                                                                                                '🕰️ [TIME TRAVEL] Returned to Live Digital Twin today.'
                                                                        );
                                                                        if (selectedRepoId)
                                                                                                fetchCityLayout(
                                                                                                                        selectedRepoId
                                                                                                );
                                                }
                        }, [timeTravelDate]);

                        // Satellite view teleportation callback (Feature 16)
                        const handleSelectRepository = (repoId: string) => {
                                                addLog(
                                                                        `📡 [SATELLITE] Teleporting street view to repository: ${repoId.toUpperCase()}`
                                                );
                                                setIsSatelliteView(false);
                                                if (repoId === 'billing') {
                                                                        setTimeTravelDate(
                                                                                                'historical'
                                                                        );
                                                } else {
                                                                        setTimeTravelDate('today');
                                                                        if (selectedRepoId)
                                                                                                fetchCityLayout(
                                                                                                                        selectedRepoId
                                                                                                );
                                                }
                        };

                        const handleGitPushSimulation = () => {
                                                if (!token || !selectedRepoId) return;
                                                addLog(
                                                                        `[GIT] Webhook received: Push event on branch 'main' by 'Alice Mercer'`
                                                );
                                                addLog(
                                                                        `[GIT] Running repository code analytics...`
                                                );

                                                fetch(
                                                                        `/api/v1/repositories/${selectedRepoId}/digital-twin/git-push`,
                                                                        {
                                                                                                method: 'POST',
                                                                                                headers: {
                                                                                                                        Authorization: `Bearer ${token}`,
                                                                                                },
                                                                        }
                                                )
                                                                        .then((res) => res.json())
                                                                        .then((data) => {
                                                                                                addLog(
                                                                                                                        `[GIT] Knowledge graph updated. Digital twin regenerated!`
                                                                                                );
                                                                                                fetchCityLayout(
                                                                                                                        selectedRepoId
                                                                                                );
                                                                        })
                                                                        .catch((err) => {
                                                                                                console.error(
                                                                                                                        'Error triggering git-push webhook',
                                                                                                                        err
                                                                                                );
                                                                                                addLog(
                                                                                                                        `[ERROR] Failed to process git push event.`
                                                                                                );
                                                                        });
                        };

                        const handleResetSimulation = () => {
                                                if (!token || !selectedRepoId) return;
                                                setActiveSimulation(null);
                                                addLog(
                                                                        `[SYSTEM] Resetting all active digital twin simulations and virtual nodes...`
                                                );

                                                fetch(
                                                                        `/api/v1/repositories/${selectedRepoId}/digital-twin/reset-simulation`,
                                                                        {
                                                                                                method: 'POST',
                                                                                                headers: {
                                                                                                                        Authorization: `Bearer ${token}`,
                                                                                                },
                                                                        }
                                                )
                                                                        .then((res) => res.json())
                                                                        .then((data) => {
                                                                                                addLog(
                                                                                                                        `[SYSTEM] City grid reset. Database synchronized.`
                                                                                                );
                                                                                                fetchCityLayout(
                                                                                                                        selectedRepoId
                                                                                                );
                                                                                                setSelectedBuilding(
                                                                                                                        null
                                                                                                );
                                                                        })
                                                                        .catch((err) => {
                                                                                                console.error(
                                                                                                                        'Error resetting simulation',
                                                                                                                        err
                                                                                                );
                                                                                                addLog(
                                                                                                                        `[ERROR] Failed to reset simulation layout.`
                                                                                                );
                                                                        });
                        };

                        const handleTriggerSimulation = (simType: string | null) => {
                                                if (activeSimulation === simType) {
                                                                        setActiveSimulation(null);
                                                                        addLog(
                                                                                                `Simulation shutdown: grid returning to normal status.`
                                                                        );
                                                } else {
                                                                        setActiveSimulation(
                                                                                                simType
                                                                        );
                                                                        if (
                                                                                                simType ===
                                                                                                'blackout'
                                                                        ) {
                                                                                                addLog(
                                                                                                                        `🚨 WARNING: Shutting down main PostgreSQL Power Grid...`
                                                                                                );
                                                                                                addLog(
                                                                                                                        `🚨 WARNING: All repository-linked code buildings have lost direct data connection!`
                                                                                                );
                                                                        } else if (
                                                                                                simType ===
                                                                                                'traffic'
                                                                        ) {
                                                                                                addLog(
                                                                                                                        `🚨 WARNING: Heavy technical debt traffic congestion initiated.`
                                                                                                );
                                                                                                addLog(
                                                                                                                        `🚨 WARNING: Highway speeds degraded. API latency spikes observed.`
                                                                                                );
                                                                        } else if (
                                                                                                simType ===
                                                                                                'danger_zone'
                                                                        ) {
                                                                                                addLog(
                                                                                                                        `🚨 WARNING: Bug sirens activated. Flashing danger boundaries on complex file models.`
                                                                                                );
                                                                        } else if (
                                                                                                simType ===
                                                                                                'airport_fail'
                                                                        ) {
                                                                                                addLog(
                                                                                                                        `🚨 WARNING: CI/CD Airport Grounding initiated. Actions pipeline is blocking new deployments.`
                                                                                                );
                                                                        } else if (
                                                                                                simType ===
                                                                                                'ai_auth_slow'
                                                                        ) {
                                                                                                addLog(
                                                                                                                        `🤖 AI SIMULATOR: What-If Scenario: "If Authentication becomes slow..."`
                                                                                                );
                                                                                                addLog(
                                                                                                                        `[AI SIMULATOR] Cascade Level 1: Authentication API latency spiked to 2800ms (+450% degradation).`
                                                                                                );
                                                                        }
                                                }
                        };

                        // AI Traffic cascade logging simulator interval
                        React.useEffect(() => {
                                                if (activeSimulation !== 'ai_auth_slow') return;

                                                let step = 0;
                                                const interval = setInterval(() => {
                                                                        step++;
                                                                        if (step === 1) {
                                                                                                addLog(
                                                                                                                        `[AI SIMULATOR] Cascade Level 2: Auth bottlenecks propagating down to Payment Service API.`
                                                                                                );
                                                                        } else if (step === 2) {
                                                                                                addLog(
                                                                                                                        `[AI SIMULATOR] Cascade Level 3: Payment delays backing up Orders database transactions.`
                                                                                                );
                                                                        } else if (step === 3) {
                                                                                                addLog(
                                                                                                                        `[AI SIMULATOR] Cascade Level 4: Orders queue overload choking Mail Notification dispatchers.`
                                                                                                );
                                                                        } else if (step === 4) {
                                                                                                addLog(
                                                                                                                        `[AI SIMULATOR] Cascade Level 5: System lock! Checkout endpoints report 504 Gateway Timeout errors.`
                                                                                                );
                                                                        } else if (step >= 5) {
                                                                                                addLog(
                                                                                                                        `[AI SIMULATOR] Cascade gridlock stable. Restarting scenario simulation loop...`
                                                                                                );
                                                                                                step = 0;
                                                                        }
                                                }, 3500);

                                                return () => clearInterval(interval);
                        }, [activeSimulation]);

                        const toggleLayer = (layerKey: keyof typeof layerFilters) => {
                                                setLayerFilters((prev) => {
                                                                        const next = {
                                                                                                ...prev,
                                                                                                [layerKey]: !prev[
                                                                                                                        layerKey
                                                                                                ],
                                                                        };
                                                                        addLog(
                                                                                                `Toggle layer: ${layerKey} is now ${next[layerKey] ? 'VISIBLE' : 'HIDDEN'}.`
                                                                        );
                                                                        return next;
                                                });
                        };

                        return (
                                                <div className="flex flex-col gap-6 p-6 min-h-screen bg-slate-950 text-white font-sans">
                                                                        {/* Page Header */}
                                                                        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-slate-900 pb-4">
                                                                                                <div>
                                                                                                                        <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500">
                                                                                                                                                🏙️
                                                                                                                                                Software
                                                                                                                                                Digital
                                                                                                                                                Twin
                                                                                                                                                &
                                                                                                                                                City
                                                                                                                        </h1>
                                                                                                                        <p className="text-slate-400 text-sm mt-1">
                                                                                                                                                Analyze
                                                                                                                                                code
                                                                                                                                                architectures
                                                                                                                                                mapped
                                                                                                                                                into
                                                                                                                                                living
                                                                                                                                                virtual
                                                                                                                                                cities.
                                                                                                                                                Pan,
                                                                                                                                                zoom,
                                                                                                                                                rotate,
                                                                                                                                                search
                                                                                                                                                buildings,
                                                                                                                                                filter
                                                                                                                                                layers,
                                                                                                                                                and
                                                                                                                                                simulate
                                                                                                                                                system
                                                                                                                                                failures.
                                                                                                                        </p>
                                                                                                </div>

                                                                                                {/* Environment Control deck */}
                                                                                                <div className="flex flex-wrap items-center gap-3 bg-slate-900 border border-slate-800 p-2 rounded-md">
                                                                                                                        {/* Satellite view trigger */}
                                                                                                                        <Button
                                                                                                                                                size="sm"
                                                                                                                                                variant={
                                                                                                                                                                        isSatelliteView
                                                                                                                                                                                                ? 'destructive'
                                                                                                                                                                                                : 'outline'
                                                                                                                                                }
                                                                                                                                                onClick={() => {
                                                                                                                                                                        setIsSatelliteView(
                                                                                                                                                                                                !isSatelliteView
                                                                                                                                                                        );
                                                                                                                                                                        addLog(
                                                                                                                                                                                                `📡 [SATELLITE] Toggled enterprise satellite view ${!isSatelliteView ? 'ON' : 'OFF'}.`
                                                                                                                                                                        );
                                                                                                                                                }}
                                                                                                                                                className="text-xs font-mono border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                                                                                                                        >
                                                                                                                                                <Layers className="mr-1.5 h-3.5 w-3.5 text-emerald-400" />
                                                                                                                                                {isSatelliteView
                                                                                                                                                                        ? '🗺️ Street View'
                                                                                                                                                                        : '📡 Satellite View'}
                                                                                                                        </Button>

                                                                                                                        {/* Time Travel Selector */}
                                                                                                                        {!isSatelliteView && (
                                                                                                                                                <div className="flex items-center gap-2 border-l border-slate-800 pl-3">
                                                                                                                                                                        <span className="text-xs uppercase tracking-wider text-slate-400 font-mono">
                                                                                                                                                                                                🕰️
                                                                                                                                                                                                Timeline:
                                                                                                                                                                        </span>
                                                                                                                                                                        <select
                                                                                                                                                                                                value={
                                                                                                                                                                                                                        timeTravelDate
                                                                                                                                                                                                }
                                                                                                                                                                                                onChange={(
                                                                                                                                                                                                                        e
                                                                                                                                                                                                ) =>
                                                                                                                                                                                                                        setTimeTravelDate(
                                                                                                                                                                                                                                                e
                                                                                                                                                                                                                                                                        .target
                                                                                                                                                                                                                                                                        .value
                                                                                                                                                                                                                        )
                                                                                                                                                                                                }
                                                                                                                                                                                                className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-cyan-400 font-mono outline-none cursor-pointer focus:border-cyan-500"
                                                                                                                                                                        >
                                                                                                                                                                                                <option value="today">
                                                                                                                                                                                                                        Today
                                                                                                                                                                                                                        (Microservices)
                                                                                                                                                                                                </option>
                                                                                                                                                                                                <option value="historical">
                                                                                                                                                                                                                        March
                                                                                                                                                                                                                        2024
                                                                                                                                                                                                                        (Monolith)
                                                                                                                                                                                                </option>
                                                                                                                                                                        </select>
                                                                                                                                                </div>
                                                                                                                        )}

                                                                                                                        <div className="flex items-center gap-2 border-l border-slate-800 pl-3">
                                                                                                                                                <span className="text-xs uppercase tracking-wider text-slate-400 font-mono">
                                                                                                                                                                        Repository:
                                                                                                                                                </span>
                                                                                                                                                <select
                                                                                                                                                                        value={
                                                                                                                                                                                                selectedRepoId
                                                                                                                                                                        }
                                                                                                                                                                        disabled={
                                                                                                                                                                                                isSatelliteView
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
                                                                                                                                                                        className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-cyan-400 font-mono outline-none focus:border-cyan-500 cursor-pointer disabled:opacity-50"
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
                                                                                                                                                <Button
                                                                                                                                                                        size="icon"
                                                                                                                                                                        variant="ghost"
                                                                                                                                                                        disabled={
                                                                                                                                                                                                isSatelliteView
                                                                                                                                                                        }
                                                                                                                                                                        onClick={() =>
                                                                                                                                                                                                fetchCityLayout(
                                                                                                                                                                                                                        selectedRepoId
                                                                                                                                                                                                )
                                                                                                                                                                        }
                                                                                                                                                                        className="h-8 w-8 text-cyan-400 hover:text-cyan-300 disabled:opacity-50"
                                                                                                                                                >
                                                                                                                                                                        <RefreshCw
                                                                                                                                                                                                className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
                                                                                                                                                                        />
                                                                                                                                                </Button>
                                                                                                                        </div>
                                                                                                </div>
                                                                        </div>

                                                                        {/* Grid Dashboard HUD */}
                                                                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                                                                                <div className="bg-slate-900/60 border border-slate-900 p-4 rounded-lg flex items-center gap-3">
                                                                                                                        <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-md">
                                                                                                                                                <ShieldCheck className="h-6 w-6" />
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                                                <div className="text-xs text-slate-400 uppercase tracking-wider">
                                                                                                                                                                        City
                                                                                                                                                                        GDP
                                                                                                                                                                        (Health)
                                                                                                                                                </div>
                                                                                                                                                <div className="text-xl font-bold font-mono text-emerald-400">
                                                                                                                                                                        {cityData
                                                                                                                                                                                                ? `${cityData.overall_health}%`
                                                                                                                                                                                                : 'N/A'}
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>

                                                                                                <div className="bg-slate-900/60 border border-slate-900 p-4 rounded-lg flex items-center gap-3">
                                                                                                                        <div className="p-3 bg-red-500/10 text-red-400 rounded-md">
                                                                                                                                                <AlertTriangle className="h-6 w-6" />
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                                                <div className="text-xs text-slate-400 uppercase tracking-wider">
                                                                                                                                                                        Congestion
                                                                                                                                                                        (Tech
                                                                                                                                                                        Debt)
                                                                                                                                                </div>
                                                                                                                                                <div className="text-xl font-bold font-mono text-red-400">
                                                                                                                                                                        {cityData
                                                                                                                                                                                                ? `${cityData.congestion_index}%`
                                                                                                                                                                                                : 'N/A'}
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>

                                                                                                <div className="bg-slate-900/60 border border-slate-900 p-4 rounded-lg flex items-center gap-3">
                                                                                                                        <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-md">
                                                                                                                                                <Database className="h-6 w-6" />
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                                                <div className="text-xs text-slate-400 uppercase tracking-wider">
                                                                                                                                                                        Power
                                                                                                                                                                        Grids
                                                                                                                                                                        (DB)
                                                                                                                                                </div>
                                                                                                                                                <div className="text-xl font-bold font-mono text-indigo-400">
                                                                                                                                                                        {cityData
                                                                                                                                                                                                ? `${cityData.power_stations?.length} Active`
                                                                                                                                                                                                : 'N/A'}
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>

                                                                                                <div className="bg-slate-900/60 border border-slate-900 p-4 rounded-lg flex items-center gap-3">
                                                                                                                        <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-md">
                                                                                                                                                <Users className="h-6 w-6" />
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                                                <div className="text-xs text-slate-400 uppercase tracking-wider">
                                                                                                                                                                        Citizens
                                                                                                                                                                        (Developers)
                                                                                                                                                </div>
                                                                                                                                                <div className="text-xl font-bold font-mono text-cyan-400">
                                                                                                                                                                        {cityData
                                                                                                                                                                                                ? cityData
                                                                                                                                                                                                                          .citizens
                                                                                                                                                                                                                          ?.length
                                                                                                                                                                                                : 'N/A'}
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>

                                                                                                <div className="bg-slate-900/60 border border-slate-900 p-4 rounded-lg flex items-center gap-3">
                                                                                                                        <div className="p-3 bg-yellow-500/10 text-yellow-400 rounded-md">
                                                                                                                                                <Compass className="h-6 w-6" />
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                                                <div className="text-xs text-slate-400 uppercase tracking-wider">
                                                                                                                                                                        Control
                                                                                                                                                                        Watchtowers
                                                                                                                                                </div>
                                                                                                                                                <div className="text-xl font-bold font-mono text-yellow-400">
                                                                                                                                                                        {cityData
                                                                                                                                                                                                ? cityData
                                                                                                                                                                                                                          .control_towers
                                                                                                                                                                                                                          ?.length
                                                                                                                                                                                                : 'N/A'}
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        </div>

                                                                        {/* Interactive Controls Bar: Search & Rotate */}
                                                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-lg backdrop-blur-sm">
                                                                                                {/* Search */}
                                                                                                <div className="flex flex-col gap-1.5 justify-center">
                                                                                                                        <label className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                                                                                                                                <Search className="h-3.5 w-3.5 text-cyan-400" />
                                                                                                                                                Search
                                                                                                                                                Code
                                                                                                                                                Building
                                                                                                                        </label>
                                                                                                                        <div className="relative">
                                                                                                                                                <input
                                                                                                                                                                        type="text"
                                                                                                                                                                        placeholder="Type class or file name..."
                                                                                                                                                                        value={
                                                                                                                                                                                                searchQuery
                                                                                                                                                                        }
                                                                                                                                                                        onChange={(
                                                                                                                                                                                                e
                                                                                                                                                                        ) => {
                                                                                                                                                                                                setSearchQuery(
                                                                                                                                                                                                                        e
                                                                                                                                                                                                                                                .target
                                                                                                                                                                                                                                                .value
                                                                                                                                                                                                );
                                                                                                                                                                                                if (
                                                                                                                                                                                                                        e
                                                                                                                                                                                                                                                .target
                                                                                                                                                                                                                                                .value
                                                                                                                                                                                                ) {
                                                                                                                                                                                                                        addLog(
                                                                                                                                                                                                                                                `Searching city for "${e.target.value}"...`
                                                                                                                                                                                                                        );
                                                                                                                                                                                                }
                                                                                                                                                                        }}
                                                                                                                                                                        className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 pl-9 text-sm text-white font-mono outline-none focus:border-cyan-500"
                                                                                                                                                />
                                                                                                                                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-600" />
                                                                                                                        </div>
                                                                                                </div>

                                                                                                {/* Rotate */}
                                                                                                <div className="flex flex-col gap-1.5 justify-center">
                                                                                                                        <label className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                                                                                                                                <RotateCw className="h-3.5 w-3.5 text-cyan-400" />
                                                                                                                                                Rotate
                                                                                                                                                City
                                                                                                                                                Grid
                                                                                                                                                (
                                                                                                                                                {
                                                                                                                                                                        rotationAngle
                                                                                                                                                }
                                                                                                                                                °)
                                                                                                                        </label>
                                                                                                                        <div className="flex items-center gap-3">
                                                                                                                                                <Button
                                                                                                                                                                        variant="outline"
                                                                                                                                                                        size="icon"
                                                                                                                                                                        className="h-8 w-8 text-cyan-400 hover:text-cyan-300"
                                                                                                                                                                        onClick={() => {
                                                                                                                                                                                                const next =
                                                                                                                                                                                                                        (rotationAngle -
                                                                                                                                                                                                                                                45 +
                                                                                                                                                                                                                                                360) %
                                                                                                                                                                                                                        360;
                                                                                                                                                                                                setRotationAngle(
                                                                                                                                                                                                                        next
                                                                                                                                                                                                );
                                                                                                                                                                                                addLog(
                                                                                                                                                                                                                        `Rotated city camera index: -45° (now ${next}°).`
                                                                                                                                                                                                );
                                                                                                                                                                        }}
                                                                                                                                                >
                                                                                                                                                                        <RotateCcw className="h-4 w-4" />
                                                                                                                                                </Button>
                                                                                                                                                <input
                                                                                                                                                                        type="range"
                                                                                                                                                                        min="0"
                                                                                                                                                                        max="360"
                                                                                                                                                                        step="5"
                                                                                                                                                                        value={
                                                                                                                                                                                                rotationAngle
                                                                                                                                                                        }
                                                                                                                                                                        onChange={(
                                                                                                                                                                                                e
                                                                                                                                                                        ) => {
                                                                                                                                                                                                const angle =
                                                                                                                                                                                                                        parseInt(
                                                                                                                                                                                                                                                e
                                                                                                                                                                                                                                                                        .target
                                                                                                                                                                                                                                                                        .value
                                                                                                                                                                                                                        );
                                                                                                                                                                                                setRotationAngle(
                                                                                                                                                                                                                        angle
                                                                                                                                                                                                );
                                                                                                                                                                        }}
                                                                                                                                                                        className="flex-1 accent-cyan-500 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
                                                                                                                                                />
                                                                                                                                                <Button
                                                                                                                                                                        variant="outline"
                                                                                                                                                                        size="icon"
                                                                                                                                                                        className="h-8 w-8 text-cyan-400 hover:text-cyan-300"
                                                                                                                                                                        onClick={() => {
                                                                                                                                                                                                const next =
                                                                                                                                                                                                                        (rotationAngle +
                                                                                                                                                                                                                                                45) %
                                                                                                                                                                                                                        360;
                                                                                                                                                                                                setRotationAngle(
                                                                                                                                                                                                                        next
                                                                                                                                                                                                );
                                                                                                                                                                                                addLog(
                                                                                                                                                                                                                        `Rotated city camera index: +45° (now ${next}°).`
                                                                                                                                                                                                );
                                                                                                                                                                        }}
                                                                                                                                                >
                                                                                                                                                                        <RotateCw className="h-4 w-4" />
                                                                                                                                                </Button>
                                                                                                                        </div>
                                                                                                </div>

                                                                                                {/* Weather Selector (Feature 7) */}
                                                                                                <div className="flex flex-col gap-1.5 justify-center">
                                                                                                                        <label className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                                                                                                                                <Cloud className="h-3.5 w-3.5 text-cyan-400" />
                                                                                                                                                Repository
                                                                                                                                                Weather
                                                                                                                        </label>
                                                                                                                        <select
                                                                                                                                                value={
                                                                                                                                                                        weatherState
                                                                                                                                                }
                                                                                                                                                onChange={(
                                                                                                                                                                        e
                                                                                                                                                ) => {
                                                                                                                                                                        setWeatherState(
                                                                                                                                                                                                e
                                                                                                                                                                                                                        .target
                                                                                                                                                                                                                        .value
                                                                                                                                                                        );
                                                                                                                                                                        addLog(
                                                                                                                                                                                                `[WEATHER] Manual override: ${e.target.value.toUpperCase()}`
                                                                                                                                                                        );
                                                                                                                                                }}
                                                                                                                                                className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-cyan-400 font-mono outline-none cursor-pointer focus:border-cyan-500"
                                                                                                                        >
                                                                                                                                                <option value="sunny">
                                                                                                                                                                        ☀️
                                                                                                                                                                        Sunny
                                                                                                                                                                        (Healthy)
                                                                                                                                                </option>
                                                                                                                                                <option value="cloudy">
                                                                                                                                                                        ☁️
                                                                                                                                                                        Cloudy
                                                                                                                                                                        (Moderate
                                                                                                                                                                        Risk)
                                                                                                                                                </option>
                                                                                                                                                <option value="storm">
                                                                                                                                                                        ⛈️
                                                                                                                                                                        Storm
                                                                                                                                                                        (High
                                                                                                                                                                        Tech
                                                                                                                                                                        Debt)
                                                                                                                                                </option>
                                                                                                                                                <option value="lightning">
                                                                                                                                                                        ⚡
                                                                                                                                                                        Lightning
                                                                                                                                                                        (Failure)
                                                                                                                                                </option>
                                                                                                                                                <option value="fog">
                                                                                                                                                                        🌫️
                                                                                                                                                                        Fog
                                                                                                                                                                        (Low
                                                                                                                                                                        Documentation)
                                                                                                                                                </option>
                                                                                                                        </select>
                                                                                                </div>

                                                                                                {/* Layer Filters */}
                                                                                                <div className="flex flex-col gap-1.5 justify-center">
                                                                                                                        <label className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                                                                                                                                <Filter className="h-3.5 w-3.5 text-cyan-400" />
                                                                                                                                                Filter
                                                                                                                                                Blueprint
                                                                                                                                                Layers
                                                                                                                        </label>
                                                                                                                        <div className="flex flex-wrap gap-2 text-[10px] font-mono">
                                                                                                                                                {Object.keys(
                                                                                                                                                                        layerFilters
                                                                                                                                                ).map(
                                                                                                                                                                        (
                                                                                                                                                                                                key
                                                                                                                                                                        ) => {
                                                                                                                                                                                                const filterKey =
                                                                                                                                                                                                                        key as keyof typeof layerFilters;
                                                                                                                                                                                                const isChecked =
                                                                                                                                                                                                                        layerFilters[
                                                                                                                                                                                                                                                filterKey
                                                                                                                                                                                                                        ];
                                                                                                                                                                                                return (
                                                                                                                                                                                                                        <button
                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                        key
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                onClick={() =>
                                                                                                                                                                                                                                                                        toggleLayer(
                                                                                                                                                                                                                                                                                                filterKey
                                                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                className={`px-2 py-1 rounded border transition-all cursor-pointer ${
                                                                                                                                                                                                                                                                        isChecked
                                                                                                                                                                                                                                                                                                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                                                                                                                                                                                                                                                                                                : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
                                                                                                                                                                                                                                                }`}
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                {key.toUpperCase()}
                                                                                                                                                                                                                        </button>
                                                                                                                                                                                                );
                                                                                                                                                                        }
                                                                                                                                                )}
                                                                                                                        </div>
                                                                                                </div>
                                                                        </div>

                                                                        {/* Main Map View & Inspection Panels */}
                                                                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                                                                                                {/* Left Side simulation panel */}
                                                                                                <div className="lg:col-span-1 flex flex-col gap-6">
                                                                                                                        {/* Simulation console controller */}
                                                                                                                        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col gap-4">
                                                                                                                                                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2 flex items-center justify-between">
                                                                                                                                                                        <span>
                                                                                                                                                                                                🚨
                                                                                                                                                                                                Crisis
                                                                                                                                                                                                Control
                                                                                                                                                                                                Cockpit
                                                                                                                                                                        </span>
                                                                                                                                                                        <Activity className="h-4 w-4 text-red-500" />
                                                                                                                                                </h2>
                                                                                                                                                <div className="flex flex-col gap-2">
                                                                                                                                                                        {/* Scalability load slider (Feature 13) */}
                                                                                                                                                                        <div className="flex flex-col gap-1.5 border-b border-slate-800 pb-3 mb-2">
                                                                                                                                                                                                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
                                                                                                                                                                                                                        <span>
                                                                                                                                                                                                                                                Concurrency
                                                                                                                                                                                                                                                load
                                                                                                                                                                                                                                                simulator
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <span className="text-cyan-400 font-bold">
                                                                                                                                                                                                                                                {loadUsersCount >=
                                                                                                                                                                                                                                                1000000
                                                                                                                                                                                                                                                                        ? `${loadUsersCount / 1000000}M`
                                                                                                                                                                                                                                                                        : loadUsersCount >=
                                                                                                                                                                                                                                                                            1000
                                                                                                                                                                                                                                                                          ? `${loadUsersCount / 1000}K`
                                                                                                                                                                                                                                                                          : loadUsersCount}{' '}
                                                                                                                                                                                                                                                Users
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </label>
                                                                                                                                                                                                <input
                                                                                                                                                                                                                        type="range"
                                                                                                                                                                                                                        min="0"
                                                                                                                                                                                                                        max="5"
                                                                                                                                                                                                                        step="1"
                                                                                                                                                                                                                        value={
                                                                                                                                                                                                                                                loadUsersCount ===
                                                                                                                                                                                                                                                100
                                                                                                                                                                                                                                                                        ? 0
                                                                                                                                                                                                                                                                        : loadUsersCount ===
                                                                                                                                                                                                                                                                            10000
                                                                                                                                                                                                                                                                          ? 1
                                                                                                                                                                                                                                                                          : loadUsersCount ===
                                                                                                                                                                                                                                                                              100000
                                                                                                                                                                                                                                                                            ? 2
                                                                                                                                                                                                                                                                            : loadUsersCount ===
                                                                                                                                                                                                                                                                                1000000
                                                                                                                                                                                                                                                                              ? 3
                                                                                                                                                                                                                                                                              : loadUsersCount ===
                                                                                                                                                                                                                                                                                  10000000
                                                                                                                                                                                                                                                                                ? 4
                                                                                                                                                                                                                                                                                : 5
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        onChange={(
                                                                                                                                                                                                                                                e
                                                                                                                                                                                                                        ) => {
                                                                                                                                                                                                                                                const val =
                                                                                                                                                                                                                                                                        parseInt(
                                                                                                                                                                                                                                                                                                e
                                                                                                                                                                                                                                                                                                                        .target
                                                                                                                                                                                                                                                                                                                        .value
                                                                                                                                                                                                                                                                        );
                                                                                                                                                                                                                                                const users =
                                                                                                                                                                                                                                                                        val ===
                                                                                                                                                                                                                                                                        0
                                                                                                                                                                                                                                                                                                ? 100
                                                                                                                                                                                                                                                                                                : val ===
                                                                                                                                                                                                                                                                                                    1
                                                                                                                                                                                                                                                                                                  ? 10000
                                                                                                                                                                                                                                                                                                  : val ===
                                                                                                                                                                                                                                                                                                      2
                                                                                                                                                                                                                                                                                                    ? 100000
                                                                                                                                                                                                                                                                                                    : val ===
                                                                                                                                                                                                                                                                                                        3
                                                                                                                                                                                                                                                                                                      ? 1000000
                                                                                                                                                                                                                                                                                                      : val ===
                                                                                                                                                                                                                                                                                                          4
                                                                                                                                                                                                                                                                                                        ? 10000000
                                                                                                                                                                                                                                                                                                        : 100000000;
                                                                                                                                                                                                                                                setLoadUsersCount(
                                                                                                                                                                                                                                                                        users
                                                                                                                                                                                                                                                );
                                                                                                                                                                                                                        }}
                                                                                                                                                                                                                        className="w-full accent-cyan-500 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
                                                                                                                                                                                                />
                                                                                                                                                                                                <div className="flex justify-between text-[8px] font-mono text-slate-500">
                                                                                                                                                                                                                        <span>
                                                                                                                                                                                                                                                100
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <span>
                                                                                                                                                                                                                                                10K
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <span>
                                                                                                                                                                                                                                                100K
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <span>
                                                                                                                                                                                                                                                1M
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <span>
                                                                                                                                                                                                                                                10M
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <span>
                                                                                                                                                                                                                                                100M
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>

                                                                                                                                                                        <Button
                                                                                                                                                                                                onClick={() =>
                                                                                                                                                                                                                        handleTriggerSimulation(
                                                                                                                                                                                                                                                'blackout'
                                                                                                                                                                                                                        )
                                                                                                                                                                                                }
                                                                                                                                                                                                variant={
                                                                                                                                                                                                                        activeSimulation ===
                                                                                                                                                                                                                        'blackout'
                                                                                                                                                                                                                                                ? 'destructive'
                                                                                                                                                                                                                                                : 'outline'
                                                                                                                                                                                                }
                                                                                                                                                                                                className="w-full justify-start text-xs font-mono"
                                                                                                                                                                        >
                                                                                                                                                                                                <Zap className="mr-2 h-4 w-4" />
                                                                                                                                                                                                Blackout
                                                                                                                                                                                                (DB
                                                                                                                                                                                                Power
                                                                                                                                                                                                Failure)
                                                                                                                                                                        </Button>
                                                                                                                                                                        <Button
                                                                                                                                                                                                onClick={() =>
                                                                                                                                                                                                                        handleTriggerSimulation(
                                                                                                                                                                                                                                                'traffic'
                                                                                                                                                                                                                        )
                                                                                                                                                                                                }
                                                                                                                                                                                                variant={
                                                                                                                                                                                                                        activeSimulation ===
                                                                                                                                                                                                                        'traffic'
                                                                                                                                                                                                                                                ? 'destructive'
                                                                                                                                                                                                                                                : 'outline'
                                                                                                                                                                                                }
                                                                                                                                                                                                className="w-full justify-start text-xs font-mono"
                                                                                                                                                                        >
                                                                                                                                                                                                <Activity className="mr-2 h-4 w-4" />
                                                                                                                                                                                                Rush
                                                                                                                                                                                                Hour
                                                                                                                                                                                                (Tech
                                                                                                                                                                                                Debt
                                                                                                                                                                                                Congestion)
                                                                                                                                                                        </Button>
                                                                                                                                                                        <Button
                                                                                                                                                                                                onClick={() =>
                                                                                                                                                                                                                        handleTriggerSimulation(
                                                                                                                                                                                                                                                'danger_zone'
                                                                                                                                                                                                                        )
                                                                                                                                                                                                }
                                                                                                                                                                                                variant={
                                                                                                                                                                                                                        activeSimulation ===
                                                                                                                                                                                                                        'danger_zone'
                                                                                                                                                                                                                                                ? 'destructive'
                                                                                                                                                                                                                                                : 'outline'
                                                                                                                                                                                                }
                                                                                                                                                                                                className="w-full justify-start text-xs font-mono"
                                                                                                                                                                        >
                                                                                                                                                                                                <AlertTriangle className="mr-2 h-4 w-4" />
                                                                                                                                                                                                Bug
                                                                                                                                                                                                Siren
                                                                                                                                                                                                Danger
                                                                                                                                                                                                Alerts
                                                                                                                                                                        </Button>
                                                                                                                                                                        <Button
                                                                                                                                                                                                onClick={() =>
                                                                                                                                                                                                                        handleTriggerSimulation(
                                                                                                                                                                                                                                                'airport_fail'
                                                                                                                                                                                                                        )
                                                                                                                                                                                                }
                                                                                                                                                                                                variant={
                                                                                                                                                                                                                        activeSimulation ===
                                                                                                                                                                                                                        'airport_fail'
                                                                                                                                                                                                                                                ? 'destructive'
                                                                                                                                                                                                                                                : 'outline'
                                                                                                                                                                                                }
                                                                                                                                                                                                className="w-full justify-start text-xs font-mono"
                                                                                                                                                                        >
                                                                                                                                                                                                <Cloud className="mr-2 h-4 w-4" />
                                                                                                                                                                                                Ground
                                                                                                                                                                                                Airport
                                                                                                                                                                                                (CI/CD
                                                                                                                                                                                                Blockage)
                                                                                                                                                                        </Button>
                                                                                                                                                                        <Button
                                                                                                                                                                                                onClick={() =>
                                                                                                                                                                                                                        handleTriggerSimulation(
                                                                                                                                                                                                                                                'ai_auth_slow'
                                                                                                                                                                                                                        )
                                                                                                                                                                                                }
                                                                                                                                                                                                variant={
                                                                                                                                                                                                                        activeSimulation ===
                                                                                                                                                                                                                        'ai_auth_slow'
                                                                                                                                                                                                                                                ? 'destructive'
                                                                                                                                                                                                                                                : 'outline'
                                                                                                                                                                                                }
                                                                                                                                                                                                className="w-full justify-start text-xs font-mono border-rose-500/30 text-rose-400 hover:bg-rose-500/10"
                                                                                                                                                                        >
                                                                                                                                                                                                <Compass className="mr-2 h-4 w-4 text-rose-400" />
                                                                                                                                                                                                AI
                                                                                                                                                                                                Cascade:
                                                                                                                                                                                                If
                                                                                                                                                                                                Auth
                                                                                                                                                                                                is
                                                                                                                                                                                                slow
                                                                                                                                                                        </Button>

                                                                                                                                                                        <div className="border-t border-slate-800 my-2 pt-2 flex flex-col gap-2">
                                                                                                                                                                                                <Button
                                                                                                                                                                                                                        onClick={() =>
                                                                                                                                                                                                                                                setIsEvolutionPlaying(
                                                                                                                                                                                                                                                                        !isEvolutionPlaying
                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        variant={
                                                                                                                                                                                                                                                isEvolutionPlaying
                                                                                                                                                                                                                                                                        ? 'destructive'
                                                                                                                                                                                                                                                                        : 'outline'
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        className="w-full justify-start text-xs font-mono border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                                                                                                                                                                                                >
                                                                                                                                                                                                                        <Play
                                                                                                                                                                                                                                                className={`mr-2 h-4 w-4 ${isEvolutionPlaying ? 'animate-pulse text-red-500' : 'text-emerald-400'}`}
                                                                                                                                                                                                                        />
                                                                                                                                                                                                                        {isEvolutionPlaying
                                                                                                                                                                                                                                                ? '⏹️ Stop Evolution Movie'
                                                                                                                                                                                                                                                : '▶️ Play Evolution Movie'}
                                                                                                                                                                                                </Button>
                                                                                                                                                                                                <Button
                                                                                                                                                                                                                        onClick={
                                                                                                                                                                                                                                                handleGitPushSimulation
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        variant="outline"
                                                                                                                                                                                                                        className="w-full justify-start text-xs font-mono border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                                                                                                                                                                                                >
                                                                                                                                                                                                                        <Play className="mr-2 h-4 w-4 text-cyan-400" />
                                                                                                                                                                                                                        Simulate
                                                                                                                                                                                                                        GitHub
                                                                                                                                                                                                                        Push
                                                                                                                                                                                                </Button>
                                                                                                                                                                                                <Button
                                                                                                                                                                                                                        onClick={
                                                                                                                                                                                                                                                handleResetSimulation
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        variant="outline"
                                                                                                                                                                                                                        className="w-full justify-start text-xs font-mono border-slate-700 text-slate-400 hover:bg-slate-800"
                                                                                                                                                                                                >
                                                                                                                                                                                                                        <RefreshCw className="mr-2 h-4 w-4 text-slate-400" />
                                                                                                                                                                                                                        Reset
                                                                                                                                                                                                                        Simulation
                                                                                                                                                                                                                        Grid
                                                                                                                                                                                                </Button>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>

                                                                                                                        {/* AI City Planner Recommendations (Feature 14) */}
                                                                                                                        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col gap-4">
                                                                                                                                                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2 flex items-center justify-between font-mono">
                                                                                                                                                                        <span>
                                                                                                                                                                                                🧠
                                                                                                                                                                                                AI
                                                                                                                                                                                                Architect
                                                                                                                                                                                                Planner
                                                                                                                                                                        </span>
                                                                                                                                                                        <Layers className="h-4 w-4 text-emerald-400" />
                                                                                                                                                </h2>

                                                                                                                                                <div className="text-xs font-mono text-slate-300 flex flex-col gap-2">
                                                                                                                                                                        <div>
                                                                                                                                                                                                <span className="text-[10px] text-slate-500 uppercase block">
                                                                                                                                                                                                                        Current
                                                                                                                                                                                                                        Target
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <span className="text-red-400 font-bold">
                                                                                                                                                                                                                        Monolithic
                                                                                                                                                                                                                        checkout
                                                                                                                                                                                                                        bottlenecks
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div>
                                                                                                                                                                                                <span className="text-[10px] text-slate-500 uppercase block">
                                                                                                                                                                                                                        AI
                                                                                                                                                                                                                        Recommendations
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <div className="flex flex-col gap-1 mt-1 text-[10px]">
                                                                                                                                                                                                                        <div className="flex items-center gap-1 text-slate-400">
                                                                                                                                                                                                                                                ✂️{' '}
                                                                                                                                                                                                                                                <span>
                                                                                                                                                                                                                                                                        Split
                                                                                                                                                                                                                                                                        Monolith
                                                                                                                                                                                                                                                                        (Checkout)
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <div className="flex items-center gap-1 text-slate-400">
                                                                                                                                                                                                                                                ✂️{' '}
                                                                                                                                                                                                                                                <span>
                                                                                                                                                                                                                                                                        Split
                                                                                                                                                                                                                                                                        Payments
                                                                                                                                                                                                                                                                        (Vault
                                                                                                                                                                                                                                                                        microservice)
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <div className="flex items-center gap-1 text-slate-400">
                                                                                                                                                                                                                                                ⚡{' '}
                                                                                                                                                                                                                                                <span>
                                                                                                                                                                                                                                                                        Introduce
                                                                                                                                                                                                                                                                        MQ
                                                                                                                                                                                                                                                                        checkout
                                                                                                                                                                                                                                                                        queues
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <div className="flex items-center gap-1 text-slate-400">
                                                                                                                                                                                                                                                💾{' '}
                                                                                                                                                                                                                                                <span>
                                                                                                                                                                                                                                                                        Add
                                                                                                                                                                                                                                                                        Orders
                                                                                                                                                                                                                                                                        cache
                                                                                                                                                                                                                                                                        layers
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                </div>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="bg-slate-950 p-2 border border-slate-800 rounded flex justify-between items-center text-xs font-bold text-emerald-400">
                                                                                                                                                                                                <span>
                                                                                                                                                                                                                        Expected
                                                                                                                                                                                                                        System
                                                                                                                                                                                                                        Gain:
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <span>
                                                                                                                                                                                                                        +28%
                                                                                                                                                                                                                        speed
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                </div>

                                                                                                                                                <div className="flex flex-col gap-2">
                                                                                                                                                                        <Button
                                                                                                                                                                                                onClick={() => {
                                                                                                                                                                                                                        if (
                                                                                                                                                                                                                                                activeSimulation ===
                                                                                                                                                                                                                                                'ai_planner'
                                                                                                                                                                                                                        ) {
                                                                                                                                                                                                                                                handleTriggerSimulation(
                                                                                                                                                                                                                                                                        null
                                                                                                                                                                                                                                                );
                                                                                                                                                                                                                                                addLog(
                                                                                                                                                                                                                                                                        '[AI PLANNER] Deactivated recommendations visual blueprints.'
                                                                                                                                                                                                                                                );
                                                                                                                                                                                                                        } else {
                                                                                                                                                                                                                                                handleTriggerSimulation(
                                                                                                                                                                                                                                                                        'ai_planner'
                                                                                                                                                                                                                                                );
                                                                                                                                                                                                                                                addLog(
                                                                                                                                                                                                                                                                        '[AI PLANNER] Visualizing proposed splits: Split Monolith -> Split Orders -> Split Payments -> Introduce Queues.'
                                                                                                                                                                                                                                                );
                                                                                                                                                                                                                        }
                                                                                                                                                                                                }}
                                                                                                                                                                                                variant={
                                                                                                                                                                                                                        activeSimulation ===
                                                                                                                                                                                                                        'ai_planner'
                                                                                                                                                                                                                                                ? 'destructive'
                                                                                                                                                                                                                                                : 'outline'
                                                                                                                                                                                                }
                                                                                                                                                                                                className="w-full justify-start text-xs font-mono border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10"
                                                                                                                                                                        >
                                                                                                                                                                                                <Compass className="mr-2 h-4 w-4 text-emerald-400" />
                                                                                                                                                                                                {activeSimulation ===
                                                                                                                                                                                                'ai_planner'
                                                                                                                                                                                                                        ? 'Hide AI Blueprint'
                                                                                                                                                                                                                        : 'Generate AI Blueprint'}
                                                                                                                                                                        </Button>

                                                                                                                                                                        {activeSimulation ===
                                                                                                                                                                                                'ai_planner' && (
                                                                                                                                                                                                <Button
                                                                                                                                                                                                                        onClick={() => {
                                                                                                                                                                                                                                                handleTriggerSimulation(
                                                                                                                                                                                                                                                                        null
                                                                                                                                                                                                                                                );
                                                                                                                                                                                                                                                setLoadUsersCount(
                                                                                                                                                                                                                                                                        100
                                                                                                                                                                                                                                                );
                                                                                                                                                                                                                                                addLog(
                                                                                                                                                                                                                                                                        '[AI PLANNER] Applied AI architectural blueprint splits! Checkout, Orders and Payments decoupled successfully.'
                                                                                                                                                                                                                                                );
                                                                                                                                                                                                                                                addLog(
                                                                                                                                                                                                                                                                        '[AI PLANNER] Performance optimized: Expected latency gain: +28% (System latency stabilized at 42ms).'
                                                                                                                                                                                                                                                );
                                                                                                                                                                                                                        }}
                                                                                                                                                                                                                        variant="outline"
                                                                                                                                                                                                                        className="w-full justify-start text-xs font-mono border-cyan-500 text-cyan-400 hover:bg-cyan-500/10"
                                                                                                                                                                                                >
                                                                                                                                                                                                                        <ShieldCheck className="mr-2 h-4 w-4 text-cyan-400" />
                                                                                                                                                                                                                        Apply
                                                                                                                                                                                                                        Recommendations
                                                                                                                                                                                                                        (+28%)
                                                                                                                                                                                                </Button>
                                                                                                                                                                        )}
                                                                                                                                                </div>
                                                                                                                        </div>

                                                                                                                        {/* Dictionary mapping guide */}
                                                                                                                        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col gap-3">
                                                                                                                                                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2 flex items-center justify-between">
                                                                                                                                                                        📖
                                                                                                                                                                        Metaphor
                                                                                                                                                                        Registry
                                                                                                                                                                        <HelpCircle className="h-4 w-4 text-slate-500" />
                                                                                                                                                </h2>
                                                                                                                                                <div className="flex flex-col gap-2 text-xs font-mono max-h-[220px] overflow-y-auto pr-1">
                                                                                                                                                                        <div className="flex justify-between border-b border-slate-800/40 py-1">
                                                                                                                                                                                                <span className="text-slate-400">
                                                                                                                                                                                                                        Services
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <span className="text-cyan-400 font-semibold">
                                                                                                                                                                                                                        Districts
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="flex justify-between border-b border-slate-800/40 py-1">
                                                                                                                                                                                                <span className="text-slate-400">
                                                                                                                                                                                                                        Packages/Folders
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <span className="text-cyan-400 font-semibold">
                                                                                                                                                                                                                        Neighborhoods
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="flex justify-between border-b border-slate-800/40 py-1">
                                                                                                                                                                                                <span className="text-slate-400">
                                                                                                                                                                                                                        Classes/Interfaces
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <span className="text-cyan-400 font-semibold">
                                                                                                                                                                                                                        Buildings
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="flex justify-between border-b border-slate-800/40 py-1">
                                                                                                                                                                                                <span className="text-slate-400">
                                                                                                                                                                                                                        Functions
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <span className="text-cyan-400 font-semibold">
                                                                                                                                                                                                                        Rooms
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="flex justify-between border-b border-slate-800/40 py-1">
                                                                                                                                                                                                <span className="text-slate-400">
                                                                                                                                                                                                                        APIs
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <span className="text-cyan-400 font-semibold">
                                                                                                                                                                                                                        Roads
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="flex justify-between border-b border-slate-800/40 py-1">
                                                                                                                                                                                                <span className="text-slate-400">
                                                                                                                                                                                                                        Dependencies
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <span className="text-cyan-400 font-semibold">
                                                                                                                                                                                                                        Highways
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="flex justify-between border-b border-slate-800/40 py-1">
                                                                                                                                                                                                <span className="text-slate-400">
                                                                                                                                                                                                                        Databases
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <span className="text-indigo-400 font-semibold">
                                                                                                                                                                                                                        Power
                                                                                                                                                                                                                        Stations
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="flex justify-between border-b border-slate-800/40 py-1">
                                                                                                                                                                                                <span className="text-slate-400">
                                                                                                                                                                                                                        Message
                                                                                                                                                                                                                        Queues
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <span className="text-pink-400 font-semibold">
                                                                                                                                                                                                                        Railway
                                                                                                                                                                                                                        Stations
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="flex justify-between border-b border-slate-800/40 py-1">
                                                                                                                                                                                                <span className="text-slate-400">
                                                                                                                                                                                                                        Caches
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <span className="text-emerald-400 font-semibold">
                                                                                                                                                                                                                        Warehouses
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="flex justify-between border-b border-slate-800/40 py-1">
                                                                                                                                                                                                <span className="text-slate-400">
                                                                                                                                                                                                                        Developers
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <span className="text-teal-400 font-semibold">
                                                                                                                                                                                                                        Citizens
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="flex justify-between border-b border-slate-800/40 py-1">
                                                                                                                                                                                                <span className="text-slate-400">
                                                                                                                                                                                                                        Technical
                                                                                                                                                                                                                        Debt
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <span className="text-red-400 font-semibold">
                                                                                                                                                                                                                        Traffic
                                                                                                                                                                                                                        Jams
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="flex justify-between border-b border-slate-800/40 py-1">
                                                                                                                                                                                                <span className="text-slate-400">
                                                                                                                                                                                                                        CI/CD
                                                                                                                                                                                                                        Runways
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <span className="text-amber-400 font-semibold">
                                                                                                                                                                                                                        Airports
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>

                                                                                                {/* Center Interactive Map */}
                                                                                                <div className="lg:col-span-2 flex flex-col gap-4">
                                                                                                                        <div className="flex-1 min-h-[480px]">
                                                                                                                                                {loading ? (
                                                                                                                                                                        <div className="w-full h-full bg-slate-900 border border-slate-800 rounded-lg flex flex-col items-center justify-center gap-3">
                                                                                                                                                                                                <RefreshCw className="h-8 w-8 text-cyan-400 animate-spin" />
                                                                                                                                                                                                <span className="text-sm font-mono text-slate-400">
                                                                                                                                                                                                                        Compiling
                                                                                                                                                                                                                        Software
                                                                                                                                                                                                                        Twin
                                                                                                                                                                                                                        projections...
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                ) : (
                                                                                                                                                                        <SoftwareCityMap
                                                                                                                                                                                                cityData={
                                                                                                                                                                                                                        cityData
                                                                                                                                                                                                }
                                                                                                                                                                                                activeSimulation={
                                                                                                                                                                                                                        activeSimulation
                                                                                                                                                                                                }
                                                                                                                                                                                                onSelectBuilding={(
                                                                                                                                                                                                                        b
                                                                                                                                                                                                ) => {
                                                                                                                                                                                                                        setSelectedBuilding(
                                                                                                                                                                                                                                                b
                                                                                                                                                                                                                        );
                                                                                                                                                                                                                        addLog(
                                                                                                                                                                                                                                                `Selected building: "${b.name}" inside district.`
                                                                                                                                                                                                                        );
                                                                                                                                                                                                }}
                                                                                                                                                                                                rotationAngle={
                                                                                                                                                                                                                        rotationAngle
                                                                                                                                                                                                }
                                                                                                                                                                                                searchQuery={
                                                                                                                                                                                                                        searchQuery
                                                                                                                                                                                                }
                                                                                                                                                                                                weatherState={
                                                                                                                                                                                                                        weatherState
                                                                                                                                                                                                }
                                                                                                                                                                                                currentEvolutionFrame={
                                                                                                                                                                                                                        currentEvolutionFrame
                                                                                                                                                                                                }
                                                                                                                                                                                                loadUsersCount={
                                                                                                                                                                                                                        loadUsersCount
                                                                                                                                                                                                }
                                                                                                                                                                                                timeTravelDate={
                                                                                                                                                                                                                        timeTravelDate
                                                                                                                                                                                                }
                                                                                                                                                                                                isSatelliteView={
                                                                                                                                                                                                                        isSatelliteView
                                                                                                                                                                                                }
                                                                                                                                                                                                onSelectRepository={
                                                                                                                                                                                                                        handleSelectRepository
                                                                                                                                                                                                }
                                                                                                                                                                                                layerFilters={
                                                                                                                                                                                                                        layerFilters
                                                                                                                                                                                                }
                                                                                                                                                                        />
                                                                                                                                                )}
                                                                                                                        </div>

                                                                                                                        {/* Console / Terminal logs */}
                                                                                                                        <div className="bg-slate-950 border border-slate-900 rounded-lg p-3 h-[120px] font-mono text-xs flex flex-col gap-1 overflow-y-auto">
                                                                                                                                                <div className="flex items-center gap-1.5 text-slate-400 font-bold border-b border-slate-900 pb-1 mb-1">
                                                                                                                                                                        <Terminal className="h-3.5 w-3.5 text-cyan-400" />
                                                                                                                                                                        <span>
                                                                                                                                                                                                LOG
                                                                                                                                                                                                CONSOLE
                                                                                                                                                                                                MONITOR
                                                                                                                                                                        </span>
                                                                                                                                                </div>
                                                                                                                                                {consoleLogs.map(
                                                                                                                                                                        (
                                                                                                                                                                                                log,
                                                                                                                                                                                                idx
                                                                                                                                                                        ) => (
                                                                                                                                                                                                <div
                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                idx
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        className="text-slate-300 leading-relaxed truncate"
                                                                                                                                                                                                >
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                log
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </div>
                                                                                                                                                                        )
                                                                                                                                                )}
                                                                                                                        </div>
                                                                                                </div>

                                                                                                {/* Right Side Building inspector */}
                                                                                                <div className="lg:col-span-1 flex flex-col gap-6">
                                                                                                                        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col gap-4 flex-1">
                                                                                                                                                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">
                                                                                                                                                                        🔍
                                                                                                                                                                        Building
                                                                                                                                                                        Inspector
                                                                                                                                                </h2>
                                                                                                                                                {selectedBuilding ? (
                                                                                                                                                                        selectedBuilding.type ===
                                                                                                                                                                        'power_station' ? (
                                                                                                                                                                                                <div className="flex flex-col gap-4 animate-fade-in">
                                                                                                                                                                                                                        <div>
                                                                                                                                                                                                                                                <div className="text-[10px] text-slate-400 font-mono uppercase">
                                                                                                                                                                                                                                                                        Landmark
                                                                                                                                                                                                                                                                        Power
                                                                                                                                                                                                                                                                        Station
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <h3 className="text-md font-bold text-indigo-400 flex items-center gap-1.5 mt-0.5 font-mono">
                                                                                                                                                                                                                                                                        <Database className="h-4 w-4 text-indigo-400" />
                                                                                                                                                                                                                                                                        {selectedBuilding.name ||
                                                                                                                                                                                                                                                                                                'PostgreSQL DB Station'}
                                                                                                                                                                                                                                                </h3>
                                                                                                                                                                                                                        </div>

                                                                                                                                                                                                                        <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                                                                                                                                                                                                                                                <div className="bg-slate-950 p-2 border border-slate-800 rounded">
                                                                                                                                                                                                                                                                        <div className="text-slate-400 text-[9px] uppercase">
                                                                                                                                                                                                                                                                                                Power
                                                                                                                                                                                                                                                                                                Grid
                                                                                                                                                                                                                                                                                                Status
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                        <span
                                                                                                                                                                                                                                                                                                className={`font-bold ${activeSimulation === 'db_fail' ? 'text-red-400 animate-pulse' : 'text-indigo-400'}`}
                                                                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                                                                {activeSimulation ===
                                                                                                                                                                                                                                                                                                'db_fail'
                                                                                                                                                                                                                                                                                                                        ? 'OFFLINE'
                                                                                                                                                                                                                                                                                                                        : 'ONLINE'}
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <div className="bg-slate-950 p-2 border border-slate-800 rounded">
                                                                                                                                                                                                                                                                        <div className="text-slate-400 text-[9px] uppercase">
                                                                                                                                                                                                                                                                                                Database
                                                                                                                                                                                                                                                                                                Type
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                        <span className="text-white font-bold">
                                                                                                                                                                                                                                                                                                SQL
                                                                                                                                                                                                                                                                                                Database
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                        </div>

                                                                                                                                                                                                                        <div className="bg-slate-950 p-3 border border-slate-800 rounded flex flex-col gap-2">
                                                                                                                                                                                                                                                <div className="text-xs text-slate-400 font-mono uppercase border-b border-slate-800 pb-1 mb-1">
                                                                                                                                                                                                                                                                        Incident
                                                                                                                                                                                                                                                                        Controls
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <Button
                                                                                                                                                                                                                                                                        onClick={() =>
                                                                                                                                                                                                                                                                                                handleTriggerSimulation(
                                                                                                                                                                                                                                                                                                                        'db_fail'
                                                                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                        variant={
                                                                                                                                                                                                                                                                                                activeSimulation ===
                                                                                                                                                                                                                                                                                                'db_fail'
                                                                                                                                                                                                                                                                                                                        ? 'destructive'
                                                                                                                                                                                                                                                                                                                        : 'outline'
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                        className="w-full justify-center text-xs font-mono"
                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                        {activeSimulation ===
                                                                                                                                                                                                                                                                        'db_fail'
                                                                                                                                                                                                                                                                                                ? '⚡ Restore Database Power'
                                                                                                                                                                                                                                                                                                : '🚨 Simulate Failure Cascade'}
                                                                                                                                                                                                                                                </Button>
                                                                                                                                                                                                                        </div>

                                                                                                                                                                                                                        <div className="text-xs text-slate-400 leading-relaxed font-mono">
                                                                                                                                                                                                                                                💡
                                                                                                                                                                                                                                                Power
                                                                                                                                                                                                                                                Stations
                                                                                                                                                                                                                                                feed
                                                                                                                                                                                                                                                request
                                                                                                                                                                                                                                                channels.
                                                                                                                                                                                                                                                Simulating
                                                                                                                                                                                                                                                failure
                                                                                                                                                                                                                                                propagates
                                                                                                                                                                                                                                                a
                                                                                                                                                                                                                                                severe
                                                                                                                                                                                                                                                connection
                                                                                                                                                                                                                                                pool
                                                                                                                                                                                                                                                breakdown
                                                                                                                                                                                                                                                across
                                                                                                                                                                                                                                                dependent
                                                                                                                                                                                                                                                entities
                                                                                                                                                                                                                                                (Orders{' '}
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        '->'
                                                                                                                                                                                                                                                }{' '}
                                                                                                                                                                                                                                                Payment{' '}
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        '->'
                                                                                                                                                                                                                                                }{' '}
                                                                                                                                                                                                                                                Invoices{' '}
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        '->'
                                                                                                                                                                                                                                                }{' '}
                                                                                                                                                                                                                                                Notification{' '}
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        '->'
                                                                                                                                                                                                                                                }{' '}
                                                                                                                                                                                                                                                Users).
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                </div>
                                                                                                                                                                        ) : (
                                                                                                                                                                                                <div className="flex flex-col gap-4">
                                                                                                                                                                                                                        <div>
                                                                                                                                                                                                                                                <div className="text-[10px] text-slate-400 font-mono uppercase">
                                                                                                                                                                                                                                                                        Entity
                                                                                                                                                                                                                                                                        Blueprint
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <h3 className="text-md font-bold text-cyan-400 flex items-center gap-1.5 mt-0.5">
                                                                                                                                                                                                                                                                        <Building2 className="h-4 w-4" />
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                selectedBuilding.name
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </h3>
                                                                                                                                                                                                                        </div>

                                                                                                                                                                                                                        <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                                                                                                                                                                                                                                                <div className="bg-slate-950 p-2 border border-slate-800 rounded">
                                                                                                                                                                                                                                                                        <div className="text-slate-400 text-[9px] uppercase">
                                                                                                                                                                                                                                                                                                Tower
                                                                                                                                                                                                                                                                                                Height
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                        <span className="text-white font-bold">
                                                                                                                                                                                                                                                                                                {Math.round(
                                                                                                                                                                                                                                                                                                                        selectedBuilding.height_meters ||
                                                                                                                                                                                                                                                                                                                                                selectedBuilding.height ||
                                                                                                                                                                                                                                                                                                                                                0
                                                                                                                                                                                                                                                                                                )}{' '}
                                                                                                                                                                                                                                                                                                meters
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <div className="bg-slate-950 p-2 border border-slate-800 rounded">
                                                                                                                                                                                                                                                                        <div className="text-slate-400 text-[9px] uppercase">
                                                                                                                                                                                                                                                                                                Traffic
                                                                                                                                                                                                                                                                                                Debt
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                        <span
                                                                                                                                                                                                                                                                                                className={`font-bold ${
                                                                                                                                                                                                                                                                                                                        selectedBuilding.technical_debt_traffic_level ===
                                                                                                                                                                                                                                                                                                                        'CRITICAL'
                                                                                                                                                                                                                                                                                                                                                ? 'text-red-400'
                                                                                                                                                                                                                                                                                                                                                : selectedBuilding.technical_debt_traffic_level ===
                                                                                                                                                                                                                                                                                                                                                    'HIGH'
                                                                                                                                                                                                                                                                                                                                                  ? 'text-yellow-400'
                                                                                                                                                                                                                                                                                                                                                  : 'text-emerald-400'
                                                                                                                                                                                                                                                                                                }`}
                                                                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                                                                {selectedBuilding.technical_debt_traffic_level ||
                                                                                                                                                                                                                                                                                                                        'LOW'}
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                        </div>

                                                                                                                                                                                                                        <div className="bg-slate-950 p-3 border border-slate-800 rounded flex flex-col gap-2">
                                                                                                                                                                                                                                                <div className="text-xs text-slate-400 font-mono uppercase border-b border-slate-800 pb-1 mb-1">
                                                                                                                                                                                                                                                                        Rooms
                                                                                                                                                                                                                                                                        Inside
                                                                                                                                                                                                                                                                        (
                                                                                                                                                                                                                                                                        {selectedBuilding
                                                                                                                                                                                                                                                                                                .rooms
                                                                                                                                                                                                                                                                                                ?.length ||
                                                                                                                                                                                                                                                                                                0}

                                                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <div className="flex flex-col gap-1.5 max-h-[180px] overflow-y-auto text-[10px] font-mono">
                                                                                                                                                                                                                                                                        {selectedBuilding.rooms &&
                                                                                                                                                                                                                                                                        selectedBuilding
                                                                                                                                                                                                                                                                                                .rooms
                                                                                                                                                                                                                                                                                                .length >
                                                                                                                                                                                                                                                                                                0 ? (
                                                                                                                                                                                                                                                                                                selectedBuilding.rooms.map(
                                                                                                                                                                                                                                                                                                                        (
                                                                                                                                                                                                                                                                                                                                                room: any
                                                                                                                                                                                                                                                                                                                        ) => (
                                                                                                                                                                                                                                                                                                                                                <div
                                                                                                                                                                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                                                                                                                                                                room.id
                                                                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                                                                                        className="flex justify-between items-center text-slate-300"
                                                                                                                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                                                                                                                        <span className="truncate pr-2">
                                                                                                                                                                                                                                                                                                                                                                                                🚪{' '}
                                                                                                                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                                                                                                                        room.name
                                                                                                                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                                                                                                                ()
                                                                                                                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                                                                                                                        {room.is_async && (
                                                                                                                                                                                                                                                                                                                                                                                                <span className="px-1 py-0.5 text-[8px] bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded uppercase font-semibold">
                                                                                                                                                                                                                                                                                                                                                                                                                        async
                                                                                                                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                                                                                                                        )}
                                                                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                                                                        ) : (
                                                                                                                                                                                                                                                                                                <span className="text-slate-500">
                                                                                                                                                                                                                                                                                                                        No
                                                                                                                                                                                                                                                                                                                        rooms
                                                                                                                                                                                                                                                                                                                        mapped
                                                                                                                                                                                                                                                                                                                        inside
                                                                                                                                                                                                                                                                                                                        this
                                                                                                                                                                                                                                                                                                                        tower.
                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                        )}
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                        </div>

                                                                                                                                                                                                                        <div className="text-xs text-slate-400 leading-relaxed font-mono">
                                                                                                                                                                                                                                                💡
                                                                                                                                                                                                                                                This
                                                                                                                                                                                                                                                building
                                                                                                                                                                                                                                                represents
                                                                                                                                                                                                                                                a
                                                                                                                                                                                                                                                core
                                                                                                                                                                                                                                                schema,
                                                                                                                                                                                                                                                service
                                                                                                                                                                                                                                                component
                                                                                                                                                                                                                                                or
                                                                                                                                                                                                                                                file
                                                                                                                                                                                                                                                mapping.
                                                                                                                                                                                                                                                Complex
                                                                                                                                                                                                                                                classes
                                                                                                                                                                                                                                                manifest
                                                                                                                                                                                                                                                as
                                                                                                                                                                                                                                                higher
                                                                                                                                                                                                                                                skyscrapers.
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                </div>
                                                                                                                                                                        )
                                                                                                                                                ) : (
                                                                                                                                                                        <div className="flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-800 rounded-md flex-1">
                                                                                                                                                                                                <Compass className="h-8 w-8 text-slate-600 mb-2 animate-pulse" />
                                                                                                                                                                                                <span className="text-xs font-mono text-slate-400">
                                                                                                                                                                                                                        Click
                                                                                                                                                                                                                        on
                                                                                                                                                                                                                        any
                                                                                                                                                                                                                        building
                                                                                                                                                                                                                        tower
                                                                                                                                                                                                                        on
                                                                                                                                                                                                                        the
                                                                                                                                                                                                                        map
                                                                                                                                                                                                                        grid
                                                                                                                                                                                                                        to
                                                                                                                                                                                                                        inspect
                                                                                                                                                                                                                        its
                                                                                                                                                                                                                        room
                                                                                                                                                                                                                        layout.
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                )}
                                                                                                                        </div>

                                                                                                                        {/* Right Side District Economy Board (Feature 19) */}
                                                                                                                        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col gap-4">
                                                                                                                                                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2 flex items-center gap-1.5 font-mono">
                                                                                                                                                                        <Coins className="h-4 w-4 text-amber-500 animate-pulse" />
                                                                                                                                                                        District
                                                                                                                                                                        Economy
                                                                                                                                                                        Board
                                                                                                                                                </h2>
                                                                                                                                                {cityData?.districts &&
                                                                                                                                                cityData
                                                                                                                                                                        .districts
                                                                                                                                                                        .length >
                                                                                                                                                                        0 ? (
                                                                                                                                                                        <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto pr-1">
                                                                                                                                                                                                {cityData.districts.map(
                                                                                                                                                                                                                        (
                                                                                                                                                                                                                                                d: any
                                                                                                                                                                                                                        ) => {
                                                                                                                                                                                                                                                const totalCost =
                                                                                                                                                                                                                                                                        (d.engineering_cost ||
                                                                                                                                                                                                                                                                                                0) +
                                                                                                                                                                                                                                                                        (d.maintenance_cost ||
                                                                                                                                                                                                                                                                                                0) +
                                                                                                                                                                                                                                                                        (d.performance_cost ||
                                                                                                                                                                                                                                                                                                0) +
                                                                                                                                                                                                                                                                        (d.cloud_cost ||
                                                                                                                                                                                                                                                                                                0) +
                                                                                                                                                                                                                                                                        (d.knowledge_cost ||
                                                                                                                                                                                                                                                                                                0);
                                                                                                                                                                                                                                                const isExpanded =
                                                                                                                                                                                                                                                                        expandedDistrict ===
                                                                                                                                                                                                                                                                        d.id;

                                                                                                                                                                                                                                                // Pct calculations for visual breakdown
                                                                                                                                                                                                                                                const engPct =
                                                                                                                                                                                                                                                                        totalCost >
                                                                                                                                                                                                                                                                        0
                                                                                                                                                                                                                                                                                                ? ((d.engineering_cost ||
                                                                                                                                                                                                                                                                                                                          0) /
                                                                                                                                                                                                                                                                                                                          totalCost) *
                                                                                                                                                                                                                                                                                                  100
                                                                                                                                                                                                                                                                                                : 0;
                                                                                                                                                                                                                                                const maintPct =
                                                                                                                                                                                                                                                                        totalCost >
                                                                                                                                                                                                                                                                        0
                                                                                                                                                                                                                                                                                                ? ((d.maintenance_cost ||
                                                                                                                                                                                                                                                                                                                          0) /
                                                                                                                                                                                                                                                                                                                          totalCost) *
                                                                                                                                                                                                                                                                                                  100
                                                                                                                                                                                                                                                                                                : 0;
                                                                                                                                                                                                                                                const perfPct =
                                                                                                                                                                                                                                                                        totalCost >
                                                                                                                                                                                                                                                                        0
                                                                                                                                                                                                                                                                                                ? ((d.performance_cost ||
                                                                                                                                                                                                                                                                                                                          0) /
                                                                                                                                                                                                                                                                                                                          totalCost) *
                                                                                                                                                                                                                                                                                                  100
                                                                                                                                                                                                                                                                                                : 0;
                                                                                                                                                                                                                                                const cloudPct =
                                                                                                                                                                                                                                                                        totalCost >
                                                                                                                                                                                                                                                                        0
                                                                                                                                                                                                                                                                                                ? ((d.cloud_cost ||
                                                                                                                                                                                                                                                                                                                          0) /
                                                                                                                                                                                                                                                                                                                          totalCost) *
                                                                                                                                                                                                                                                                                                  100
                                                                                                                                                                                                                                                                                                : 0;
                                                                                                                                                                                                                                                const knowPct =
                                                                                                                                                                                                                                                                        totalCost >
                                                                                                                                                                                                                                                                        0
                                                                                                                                                                                                                                                                                                ? ((d.knowledge_cost ||
                                                                                                                                                                                                                                                                                                                          0) /
                                                                                                                                                                                                                                                                                                                          totalCost) *
                                                                                                                                                                                                                                                                                                  100
                                                                                                                                                                                                                                                                                                : 0;

                                                                                                                                                                                                                                                return (
                                                                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                                                                        d.id
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                className="bg-slate-950/60 hover:bg-slate-950 border border-slate-800/80 hover:border-slate-700/60 rounded-md p-3 transition-all flex flex-col gap-2 cursor-pointer"
                                                                                                                                                                                                                                                                                                onClick={() =>
                                                                                                                                                                                                                                                                                                                        setExpandedDistrict(
                                                                                                                                                                                                                                                                                                                                                isExpanded
                                                                                                                                                                                                                                                                                                                                                                        ? null
                                                                                                                                                                                                                                                                                                                                                                        : d.id
                                                                                                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                                                                <div className="flex justify-between items-center">
                                                                                                                                                                                                                                                                                                                        <span className="text-xs font-bold text-slate-200 hover:text-white font-mono flex items-center gap-1">
                                                                                                                                                                                                                                                                                                                                                <span>
                                                                                                                                                                                                                                                                                                                                                                        🏢
                                                                                                                                                                                                                                                                                                                                                </span>{' '}
                                                                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                                                                        d.name
                                                                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                                                                        <span className="text-xs font-mono font-bold text-amber-400">
                                                                                                                                                                                                                                                                                                                                                $
                                                                                                                                                                                                                                                                                                                                                {totalCost.toLocaleString(
                                                                                                                                                                                                                                                                                                                                                                        undefined,
                                                                                                                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                                                                                                                minimumFractionDigits: 0,
                                                                                                                                                                                                                                                                                                                                                                                                maximumFractionDigits: 0,
                                                                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                                                                )}
                                                                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                                                </div>

                                                                                                                                                                                                                                                                                                {/* Horizontal Stacked Bar representing budget split */}
                                                                                                                                                                                                                                                                                                <div className="h-2 w-full rounded-full overflow-hidden flex bg-slate-900 border border-slate-800/50">
                                                                                                                                                                                                                                                                                                                        {engPct >
                                                                                                                                                                                                                                                                                                                                                0 && (
                                                                                                                                                                                                                                                                                                                                                <div
                                                                                                                                                                                                                                                                                                                                                                        style={{
                                                                                                                                                                                                                                                                                                                                                                                                width: `${engPct}%`,
                                                                                                                                                                                                                                                                                                                                                                        }}
                                                                                                                                                                                                                                                                                                                                                                        className="bg-[#06b6d4]"
                                                                                                                                                                                                                                                                                                                                                                        title={`Engineering: ${engPct.toFixed(0)}%`}
                                                                                                                                                                                                                                                                                                                                                />
                                                                                                                                                                                                                                                                                                                        )}
                                                                                                                                                                                                                                                                                                                        {maintPct >
                                                                                                                                                                                                                                                                                                                                                0 && (
                                                                                                                                                                                                                                                                                                                                                <div
                                                                                                                                                                                                                                                                                                                                                                        style={{
                                                                                                                                                                                                                                                                                                                                                                                                width: `${maintPct}%`,
                                                                                                                                                                                                                                                                                                                                                                        }}
                                                                                                                                                                                                                                                                                                                                                                        className="bg-[#f59e0b]"
                                                                                                                                                                                                                                                                                                                                                                        title={`Maintenance: ${maintPct.toFixed(0)}%`}
                                                                                                                                                                                                                                                                                                                                                />
                                                                                                                                                                                                                                                                                                                        )}
                                                                                                                                                                                                                                                                                                                        {perfPct >
                                                                                                                                                                                                                                                                                                                                                0 && (
                                                                                                                                                                                                                                                                                                                                                <div
                                                                                                                                                                                                                                                                                                                                                                        style={{
                                                                                                                                                                                                                                                                                                                                                                                                width: `${perfPct}%`,
                                                                                                                                                                                                                                                                                                                                                                        }}
                                                                                                                                                                                                                                                                                                                                                                        className="bg-[#10b981]"
                                                                                                                                                                                                                                                                                                                                                                        title={`Performance: ${perfPct.toFixed(0)}%`}
                                                                                                                                                                                                                                                                                                                                                />
                                                                                                                                                                                                                                                                                                                        )}
                                                                                                                                                                                                                                                                                                                        {cloudPct >
                                                                                                                                                                                                                                                                                                                                                0 && (
                                                                                                                                                                                                                                                                                                                                                <div
                                                                                                                                                                                                                                                                                                                                                                        style={{
                                                                                                                                                                                                                                                                                                                                                                                                width: `${cloudPct}%`,
                                                                                                                                                                                                                                                                                                                                                                        }}
                                                                                                                                                                                                                                                                                                                                                                        className="bg-[#6366f1]"
                                                                                                                                                                                                                                                                                                                                                                        title={`Cloud: ${cloudPct.toFixed(0)}%`}
                                                                                                                                                                                                                                                                                                                                                />
                                                                                                                                                                                                                                                                                                                        )}
                                                                                                                                                                                                                                                                                                                        {knowPct >
                                                                                                                                                                                                                                                                                                                                                0 && (
                                                                                                                                                                                                                                                                                                                                                <div
                                                                                                                                                                                                                                                                                                                                                                        style={{
                                                                                                                                                                                                                                                                                                                                                                                                width: `${knowPct}%`,
                                                                                                                                                                                                                                                                                                                                                                        }}
                                                                                                                                                                                                                                                                                                                                                                        className="bg-[#ec4899]"
                                                                                                                                                                                                                                                                                                                                                                        title={`Knowledge: ${knowPct.toFixed(0)}%`}
                                                                                                                                                                                                                                                                                                                                                />
                                                                                                                                                                                                                                                                                                                        )}
                                                                                                                                                                                                                                                                                                </div>

                                                                                                                                                                                                                                                                                                {/* Accordion Detail Breakdown Drawer */}
                                                                                                                                                                                                                                                                                                {isExpanded && (
                                                                                                                                                                                                                                                                                                                        <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-slate-800/80 text-[10px] font-mono animate-fade-in">
                                                                                                                                                                                                                                                                                                                                                <div className="flex justify-between items-center text-slate-400">
                                                                                                                                                                                                                                                                                                                                                                        <div className="flex items-center gap-1.5">
                                                                                                                                                                                                                                                                                                                                                                                                <span className="w-2 h-2 rounded-full bg-[#06b6d4]" />
                                                                                                                                                                                                                                                                                                                                                                                                <span>
                                                                                                                                                                                                                                                                                                                                                                                                                        Engineering
                                                                                                                                                                                                                                                                                                                                                                                                                        Cost
                                                                                                                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                                                                                                        <span className="text-white font-semibold">
                                                                                                                                                                                                                                                                                                                                                                                                $
                                                                                                                                                                                                                                                                                                                                                                                                {d.engineering_cost.toLocaleString()}{' '}
                                                                                                                                                                                                                                                                                                                                                                                                (
                                                                                                                                                                                                                                                                                                                                                                                                {engPct.toFixed(
                                                                                                                                                                                                                                                                                                                                                                                                                        0
                                                                                                                                                                                                                                                                                                                                                                                                )}
                                                                                                                                                                                                                                                                                                                                                                                                %)
                                                                                                                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                                                                <div className="flex justify-between items-center text-slate-400">
                                                                                                                                                                                                                                                                                                                                                                        <div className="flex items-center gap-1.5">
                                                                                                                                                                                                                                                                                                                                                                                                <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                                                                                                                                                                                                                                                                                                                                                                                                <span>
                                                                                                                                                                                                                                                                                                                                                                                                                        Maintenance
                                                                                                                                                                                                                                                                                                                                                                                                                        Cost
                                                                                                                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                                                                                                        <span className="text-white font-semibold">
                                                                                                                                                                                                                                                                                                                                                                                                $
                                                                                                                                                                                                                                                                                                                                                                                                {d.maintenance_cost.toLocaleString()}{' '}
                                                                                                                                                                                                                                                                                                                                                                                                (
                                                                                                                                                                                                                                                                                                                                                                                                {maintPct.toFixed(
                                                                                                                                                                                                                                                                                                                                                                                                                        0
                                                                                                                                                                                                                                                                                                                                                                                                )}
                                                                                                                                                                                                                                                                                                                                                                                                %)
                                                                                                                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                                                                <div className="flex justify-between items-center text-slate-400">
                                                                                                                                                                                                                                                                                                                                                                        <div className="flex items-center gap-1.5">
                                                                                                                                                                                                                                                                                                                                                                                                <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                                                                                                                                                                                                                                                                                                                                                                                                <span>
                                                                                                                                                                                                                                                                                                                                                                                                                        Performance
                                                                                                                                                                                                                                                                                                                                                                                                                        Cost
                                                                                                                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                                                                                                        <span className="text-white font-semibold">
                                                                                                                                                                                                                                                                                                                                                                                                $
                                                                                                                                                                                                                                                                                                                                                                                                {d.performance_cost.toLocaleString()}{' '}
                                                                                                                                                                                                                                                                                                                                                                                                (
                                                                                                                                                                                                                                                                                                                                                                                                {perfPct.toFixed(
                                                                                                                                                                                                                                                                                                                                                                                                                        0
                                                                                                                                                                                                                                                                                                                                                                                                )}
                                                                                                                                                                                                                                                                                                                                                                                                %)
                                                                                                                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                                                                <div className="flex justify-between items-center text-slate-400">
                                                                                                                                                                                                                                                                                                                                                                        <div className="flex items-center gap-1.5">
                                                                                                                                                                                                                                                                                                                                                                                                <span className="w-2 h-2 rounded-full bg-[#6366f1]" />
                                                                                                                                                                                                                                                                                                                                                                                                <span>
                                                                                                                                                                                                                                                                                                                                                                                                                        Cloud
                                                                                                                                                                                                                                                                                                                                                                                                                        Cost
                                                                                                                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                                                                                                        <span className="text-white font-semibold">
                                                                                                                                                                                                                                                                                                                                                                                                $
                                                                                                                                                                                                                                                                                                                                                                                                {d.cloud_cost.toLocaleString()}{' '}
                                                                                                                                                                                                                                                                                                                                                                                                (
                                                                                                                                                                                                                                                                                                                                                                                                {cloudPct.toFixed(
                                                                                                                                                                                                                                                                                                                                                                                                                        0
                                                                                                                                                                                                                                                                                                                                                                                                )}
                                                                                                                                                                                                                                                                                                                                                                                                %)
                                                                                                                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                                                                <div className="flex justify-between items-center text-slate-400">
                                                                                                                                                                                                                                                                                                                                                                        <div className="flex items-center gap-1.5">
                                                                                                                                                                                                                                                                                                                                                                                                <span className="w-2 h-2 rounded-full bg-[#ec4899]" />
                                                                                                                                                                                                                                                                                                                                                                                                <span>
                                                                                                                                                                                                                                                                                                                                                                                                                        Knowledge
                                                                                                                                                                                                                                                                                                                                                                                                                        Cost
                                                                                                                                                                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                                                                                                        <span className="text-white font-semibold">
                                                                                                                                                                                                                                                                                                                                                                                                $
                                                                                                                                                                                                                                                                                                                                                                                                {d.knowledge_cost.toLocaleString()}{' '}
                                                                                                                                                                                                                                                                                                                                                                                                (
                                                                                                                                                                                                                                                                                                                                                                                                {knowPct.toFixed(
                                                                                                                                                                                                                                                                                                                                                                                                                        0
                                                                                                                                                                                                                                                                                                                                                                                                )}
                                                                                                                                                                                                                                                                                                                                                                                                %)
                                                                                                                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                                                                <div className="text-[9px] text-slate-500 italic mt-1 leading-relaxed">
                                                                                                                                                                                                                                                                                                                                                                        *
                                                                                                                                                                                                                                                                                                                                                                        Calculated
                                                                                                                                                                                                                                                                                                                                                                        dynamically
                                                                                                                                                                                                                                                                                                                                                                        based
                                                                                                                                                                                                                                                                                                                                                                        on
                                                                                                                                                                                                                                                                                                                                                                        LOC
                                                                                                                                                                                                                                                                                                                                                                        complexity
                                                                                                                                                                                                                                                                                                                                                                        (Eng),
                                                                                                                                                                                                                                                                                                                                                                        tech
                                                                                                                                                                                                                                                                                                                                                                        debt
                                                                                                                                                                                                                                                                                                                                                                        &
                                                                                                                                                                                                                                                                                                                                                                        bug
                                                                                                                                                                                                                                                                                                                                                                        density
                                                                                                                                                                                                                                                                                                                                                                        (Maint),
                                                                                                                                                                                                                                                                                                                                                                        rooms/methods
                                                                                                                                                                                                                                                                                                                                                                        API
                                                                                                                                                                                                                                                                                                                                                                        count
                                                                                                                                                                                                                                                                                                                                                                        (Perf),
                                                                                                                                                                                                                                                                                                                                                                        height
                                                                                                                                                                                                                                                                                                                                                                        (Cloud),
                                                                                                                                                                                                                                                                                                                                                                        and
                                                                                                                                                                                                                                                                                                                                                                        doc
                                                                                                                                                                                                                                                                                                                                                                        quality
                                                                                                                                                                                                                                                                                                                                                                        (Knowledge).
                                                                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                                )}
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                );
                                                                                                                                                                                                                        }
                                                                                                                                                                                                )}
                                                                                                                                                                        </div>
                                                                                                                                                ) : (
                                                                                                                                                                        <div className="flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-800 rounded-md">
                                                                                                                                                                                                <BarChart3 className="h-6 w-6 text-slate-600 mb-1 animate-pulse" />
                                                                                                                                                                                                <span className="text-[11px] font-mono text-slate-400">
                                                                                                                                                                                                                        Select
                                                                                                                                                                                                                        a
                                                                                                                                                                                                                        repository
                                                                                                                                                                                                                        to
                                                                                                                                                                                                                        display
                                                                                                                                                                                                                        software
                                                                                                                                                                                                                        economy
                                                                                                                                                                                                                        metrics.
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                )}
                                                                                                                        </div>
                                                                                                </div>
                                                                        </div>
                                                </div>
                        );
}
