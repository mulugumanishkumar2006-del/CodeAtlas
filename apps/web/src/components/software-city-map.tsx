'use client';

import * as React from 'react';
import {
                        Play,
                        ShieldAlert,
                        Zap,
                        AlertTriangle,
                        Cloud,
                        Database,
                        Server,
                        ShieldCheck,
                        HelpCircle,
                        Activity,
} from 'lucide-react';

interface SoftwareCityMapProps {
                        cityData: any;
                        activeSimulation: string | null;
                        onSelectBuilding: (building: any) => void;
                        rotationAngle: number;
                        searchQuery: string;
                        weatherState: string;
                        currentEvolutionFrame: number;
                        loadUsersCount: number;
                        timeTravelDate: string;
                        isSatelliteView: boolean;
                        onSelectRepository?: (repoId: string) => void;
                        layerFilters: {
                                                districts: boolean;
                                                buildings: boolean;
                                                roads: boolean;
                                                highways: boolean;
                                                landmarks: boolean;
                                                citizens: boolean;
                                                dangerZones: boolean;
                                                rivers: boolean;
                                                knowledge: boolean;
                        };
}

export function SoftwareCityMap({
                        cityData,
                        activeSimulation,
                        onSelectBuilding,
                        rotationAngle,
                        searchQuery,
                        weatherState,
                        currentEvolutionFrame,
                        loadUsersCount,
                        timeTravelDate,
                        isSatelliteView,
                        onSelectRepository,
                        layerFilters,
}: SoftwareCityMapProps) {
                        const canvasRef = React.useRef<HTMLCanvasElement>(null);
                        const containerRef = React.useRef<HTMLDivElement>(null);

                        // Canvas interaction states
                        const [pan, setPan] = React.useState({ x: 0, y: 100 });
                        const [zoom, setZoom] = React.useState(0.9);
                        const [hoveredEntity, setHoveredEntity] = React.useState<any>(null);
                        const [isDragging, setIsDragging] = React.useState(false);
                        const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });

                        // Animation frame ticks
                        const [animationTick, setAnimationTick] = React.useState(0);

                        // Position layouts cache
                        const layoutCacheRef = React.useRef<any>({});

                        const districts = cityData?.districts || [];
                        const powerStations = cityData?.power_stations || [];
                        const railwayStations = cityData?.railway_stations || [];
                        const warehouses = cityData?.warehouses || [];
                        const airports = cityData?.airports || [];
                        const controlTowers = cityData?.control_towers || [];
                        const utilityPlants = cityData?.utility_plants || [];

                        React.useEffect(() => {
                                                let animFrame: number;
                                                const tick = () => {
                                                                        setAnimationTick(
                                                                                                (
                                                                                                                        t
                                                                                                ) =>
                                                                                                                        (t +
                                                                                                                                                1) %
                                                                                                                        10000
                                                                        );
                                                                        animFrame =
                                                                                                requestAnimationFrame(
                                                                                                                        tick
                                                                                                );
                                                };
                                                animFrame = requestAnimationFrame(tick);
                                                return () => cancelAnimationFrame(animFrame);
                        }, []);

                        // Set initial pan based on container size
                        React.useEffect(() => {
                                                if (containerRef.current && canvasRef.current) {
                                                                        const rect =
                                                                                                containerRef.current.getBoundingClientRect();
                                                                        canvasRef.current.width =
                                                                                                rect.width;
                                                                        canvasRef.current.height =
                                                                                                rect.height;
                                                                        setPan({
                                                                                                x:
                                                                                                                        rect.width /
                                                                                                                        2,
                                                                                                y:
                                                                                                                        rect.height /
                                                                                                                        3,
                                                                        });
                                                }
                        }, [cityData]);

                        // Handle Resize
                        React.useEffect(() => {
                                                const handleResize = () => {
                                                                        if (
                                                                                                containerRef.current &&
                                                                                                canvasRef.current
                                                                        ) {
                                                                                                const rect =
                                                                                                                        containerRef.current.getBoundingClientRect();
                                                                                                canvasRef.current.width =
                                                                                                                        rect.width;
                                                                                                canvasRef.current.height =
                                                                                                                        rect.height;
                                                                        }
                                                };
                                                window.addEventListener('resize', handleResize);
                                                return () =>
                                                                        window.removeEventListener(
                                                                                                'resize',
                                                                                                handleResize
                                                                        );
                        }, []);

                        // Compute Layout Positions (Isometric coordinates)
                        const computeLayouts = () => {
                                                const layouts: any = {
                                                                        buildings: {},
                                                                        districts: {},
                                                                        landmarks: {},
                                                };

                                                // Assign districts to grid quadrants
                                                const quadrantCoords = [
                                                                        { cx: -150, cy: -150 }, // Q1 North
                                                                        { cx: 150, cy: -150 }, // Q2 East
                                                                        { cx: 150, cy: 150 }, // Q3 South
                                                                        { cx: -150, cy: 150 }, // Q4 West
                                                ];

                                                const isEvolution = currentEvolutionFrame > 0;
                                                const isHistorical =
                                                                        timeTravelDate ===
                                                                        'historical';

                                                districts.forEach((d: any, dIdx: number) => {
                                                                        // Don't draw extra districts in early time-lapse stages or March 2024 monolith stage
                                                                        if (
                                                                                                isHistorical &&
                                                                                                (dIdx ===
                                                                                                                        1 ||
                                                                                                                        dIdx ===
                                                                                                                                                2)
                                                                        )
                                                                                                return;
                                                                        if (
                                                                                                isEvolution &&
                                                                                                currentEvolutionFrame <
                                                                                                                        3 &&
                                                                                                dIdx >
                                                                                                                        0
                                                                        )
                                                                                                return;

                                                                        const quad =
                                                                                                quadrantCoords[
                                                                                                                        dIdx %
                                                                                                                                                quadrantCoords.length
                                                                                                ];
                                                                        layouts.districts[d.id] = {
                                                                                                ...quad,
                                                                                                radius: 120,
                                                                        };

                                                                        let bCount = 0;
                                                                        d.neighborhoods?.forEach(
                                                                                                (
                                                                                                                        nh: any,
                                                                                                                        nhIdx: number
                                                                                                ) => {
                                                                                                                        nh.buildings?.forEach(
                                                                                                                                                (
                                                                                                                                                                        b: any,
                                                                                                                                                                        bIdx: number
                                                                                                                                                ) => {
                                                                                                                                                                        // Time-lapse frame element filter logic
                                                                                                                                                                        if (
                                                                                                                                                                                                isEvolution &&
                                                                                                                                                                                                currentEvolutionFrame ===
                                                                                                                                                                                                                        1 &&
                                                                                                                                                                                                (dIdx >
                                                                                                                                                                                                                        0 ||
                                                                                                                                                                                                                        bCount >
                                                                                                                                                                                                                                                0)
                                                                                                                                                                        )
                                                                                                                                                                                                return;
                                                                                                                                                                        if (
                                                                                                                                                                                                isEvolution &&
                                                                                                                                                                                                currentEvolutionFrame ===
                                                                                                                                                                                                                        2 &&
                                                                                                                                                                                                (dIdx >
                                                                                                                                                                                                                        0 ||
                                                                                                                                                                                                                        bCount >
                                                                                                                                                                                                                                                3)
                                                                                                                                                                        )
                                                                                                                                                                                                return;

                                                                                                                                                                        const angle =
                                                                                                                                                                                                bCount *
                                                                                                                                                                                                                        0.7 +
                                                                                                                                                                                                nhIdx *
                                                                                                                                                                                                                        0.4;
                                                                                                                                                                        const radius =
                                                                                                                                                                                                45 +
                                                                                                                                                                                                bIdx *
                                                                                                                                                                                                                        25;
                                                                                                                                                                        const bx =
                                                                                                                                                                                                quad.cx +
                                                                                                                                                                                                Math.cos(
                                                                                                                                                                                                                        angle
                                                                                                                                                                                                ) *
                                                                                                                                                                                                                        radius;
                                                                                                                                                                        const by =
                                                                                                                                                                                                quad.cy +
                                                                                                                                                                                                Math.sin(
                                                                                                                                                                                                                        angle
                                                                                                                                                                                                ) *
                                                                                                                                                                                                                        radius;

                                                                                                                                                                        // Override colors on Frame 6 (technical debt jam), 7 (refactoring), and March 2024 (high monolith debt)
                                                                                                                                                                        let overrideColor =
                                                                                                                                                                                                undefined;
                                                                                                                                                                        if (
                                                                                                                                                                                                isHistorical
                                                                                                                                                                        ) {
                                                                                                                                                                                                overrideColor =
                                                                                                                                                                                                                        b.name
                                                                                                                                                                                                                                                .toLowerCase()
                                                                                                                                                                                                                                                .includes(
                                                                                                                                                                                                                                                                        'controller'
                                                                                                                                                                                                                                                ) ||
                                                                                                                                                                                                                        b.name
                                                                                                                                                                                                                                                .toLowerCase()
                                                                                                                                                                                                                                                .includes(
                                                                                                                                                                                                                                                                        'service'
                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                                                ? '#EF4444'
                                                                                                                                                                                                                                                : '#F97316';
                                                                                                                                                                        } else if (
                                                                                                                                                                                                isEvolution &&
                                                                                                                                                                                                currentEvolutionFrame ===
                                                                                                                                                                                                                        6
                                                                                                                                                                        ) {
                                                                                                                                                                                                overrideColor =
                                                                                                                                                                                                                        '#EF4444'; // Extreme tech debt
                                                                                                                                                                        } else if (
                                                                                                                                                                                                isEvolution &&
                                                                                                                                                                                                currentEvolutionFrame ===
                                                                                                                                                                                                                        7
                                                                                                                                                                        ) {
                                                                                                                                                                                                overrideColor =
                                                                                                                                                                                                                        b.name
                                                                                                                                                                                                                                                .toLowerCase()
                                                                                                                                                                                                                                                .includes(
                                                                                                                                                                                                                                                                        'test'
                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                                                ? '#3B82F6'
                                                                                                                                                                                                                                                : '#10B981'; // Resolved
                                                                                                                                                                        }

                                                                                                                                                                        layouts.buildings[
                                                                                                                                                                                                b.id
                                                                                                                                                                        ] =
                                                                                                                                                                                                {
                                                                                                                                                                                                                        x: bx,
                                                                                                                                                                                                                        y: by,
                                                                                                                                                                                                                        districtId: d.id,
                                                                                                                                                                                                                        color:
                                                                                                                                                                                                                                                overrideColor ||
                                                                                                                                                                                                                                                getBuildingColor(
                                                                                                                                                                                                                                                                        b,
                                                                                                                                                                                                                                                                        activeSimulation
                                                                                                                                                                                                                                                ),
                                                                                                                                                                                                                        name: b.name,
                                                                                                                                                                                                                        height: b.height_meters,
                                                                                                                                                                                                                        entity: b,
                                                                                                                                                                                                };
                                                                                                                                                                        bCount++;
                                                                                                                                                }
                                                                                                                        );
                                                                                                }
                                                                        );
                                                });

                                                // Landmarks added in Frame 4 (Microservices) or later, hidden in March 2024 monolith
                                                if (
                                                                        (!isEvolution ||
                                                                                                currentEvolutionFrame >=
                                                                                                                        4) &&
                                                                        !isHistorical
                                                ) {
                                                                        // Databases (Power Stations)
                                                                        powerStations.forEach(
                                                                                                (
                                                                                                                        ps: any,
                                                                                                                        idx: number
                                                                                                ) => {
                                                                                                                        layouts.landmarks[
                                                                                                                                                ps.id
                                                                                                                        ] =
                                                                                                                                                {
                                                                                                                                                                        x: 0,
                                                                                                                                                                        y:
                                                                                                                                                                                                280 +
                                                                                                                                                                                                idx *
                                                                                                                                                                                                                        40,
                                                                                                                                                                        type: 'power_station',
                                                                                                                                                                        color: '#818CF8', // Indigo
                                                                                                                                                                        entity: ps,
                                                                                                                                                };
                                                                                                }
                                                                        );

                                                                        // Railway Stations (Queues)
                                                                        railwayStations.forEach(
                                                                                                (
                                                                                                                        rs: any,
                                                                                                                        idx: number
                                                                                                ) => {
                                                                                                                        layouts.landmarks[
                                                                                                                                                rs.id
                                                                                                                        ] =
                                                                                                                                                {
                                                                                                                                                                        x: 300,
                                                                                                                                                                        y:
                                                                                                                                                                                                0 +
                                                                                                                                                                                                idx *
                                                                                                                                                                                                                        40,
                                                                                                                                                                        type: 'railway_station',
                                                                                                                                                                        color: '#F472B6', // Pink
                                                                                                                                                                        entity: rs,
                                                                                                                                                };
                                                                                                }
                                                                        );

                                                                        // Warehouses (Caches)
                                                                        warehouses.forEach(
                                                                                                (
                                                                                                                        w: any,
                                                                                                                        idx: number
                                                                                                ) => {
                                                                                                                        layouts.landmarks[
                                                                                                                                                w.id
                                                                                                                        ] =
                                                                                                                                                {
                                                                                                                                                                        x: -300,
                                                                                                                                                                        y:
                                                                                                                                                                                                0 +
                                                                                                                                                                                                idx *
                                                                                                                                                                                                                        40,
                                                                                                                                                                        type: 'warehouse',
                                                                                                                                                                        color: '#34D399', // Emerald
                                                                                                                                                                        entity: w,
                                                                                                                                                };
                                                                                                }
                                                                        );

                                                                        // Airports (CI/CD)
                                                                        airports.forEach(
                                                                                                (
                                                                                                                        ap: any,
                                                                                                                        idx: number
                                                                                                ) => {
                                                                                                                        layouts.landmarks[
                                                                                                                                                ap.id
                                                                                                                        ] =
                                                                                                                                                {
                                                                                                                                                                        x: 0,
                                                                                                                                                                        y:
                                                                                                                                                                                                -300 -
                                                                                                                                                                                                idx *
                                                                                                                                                                                                                        40,
                                                                                                                                                                        type: 'airport',
                                                                                                                                                                        color: '#FBBF24', // Amber
                                                                                                                                                                        entity: ap,
                                                                                                                                                };
                                                                                                }
                                                                        );

                                                                        // Control Towers (Monitoring)
                                                                        controlTowers.forEach(
                                                                                                (
                                                                                                                        ct: any,
                                                                                                                        idx: number
                                                                                                ) => {
                                                                                                                        layouts.landmarks[
                                                                                                                                                ct.id
                                                                                                                        ] =
                                                                                                                                                {
                                                                                                                                                                        x:
                                                                                                                                                                                                -40 +
                                                                                                                                                                                                idx *
                                                                                                                                                                                                                        80,
                                                                                                                                                                        y: -40,
                                                                                                                                                                        type: 'control_tower',
                                                                                                                                                                        color: '#94A3B8', // Slate
                                                                                                                                                                        entity: ct,
                                                                                                                                                };
                                                                                                }
                                                                        );

                                                                        // Utility Plants (Cloud)
                                                                        utilityPlants.forEach(
                                                                                                (
                                                                                                                        up: any,
                                                                                                                        idx: number
                                                                                                ) => {
                                                                                                                        layouts.landmarks[
                                                                                                                                                up.id
                                                                                                                        ] =
                                                                                                                                                {
                                                                                                                                                                        x: 280,
                                                                                                                                                                        y:
                                                                                                                                                                                                280 +
                                                                                                                                                                                                idx *
                                                                                                                                                                                                                        40,
                                                                                                                                                                        type: 'utility_plant',
                                                                                                                                                                        color: '#38BDF8', // Sky Blue
                                                                                                                                                                        entity: up,
                                                                                                                                                };
                                                                                                }
                                                                        );
                                                }

                                                layoutCacheRef.current = layouts;
                                                return layouts;
                        };

                        // Helper to map building names to cascade steps
                        const getBuildingCascadeTier = (name: string) => {
                                                const n = name.toLowerCase();
                                                if (n.includes('auth') || n.includes('session'))
                                                                        return 0;
                                                if (n.includes('pay') || n.includes('bill'))
                                                                        return 1;
                                                if (n.includes('order')) return 2;
                                                if (
                                                                        n.includes('notify') ||
                                                                        n.includes('queue') ||
                                                                        n.includes('mail')
                                                )
                                                                        return 3;
                                                if (
                                                                        n.includes('check') ||
                                                                        n.includes('cart') ||
                                                                        n.includes('api')
                                                )
                                                                        return 4;
                                                return -1;
                        };

                        const getTrafficColor = (level: string) => {
                                                switch (level) {
                                                                        case 'CRITICAL':
                                                                                                return '#EF4444'; // Red -> Traffic Jam
                                                                        case 'HIGH':
                                                                                                return '#F97316'; // Orange -> Critical
                                                                        case 'MEDIUM':
                                                                                                return '#EAB308'; // Yellow -> Growing
                                                                        case 'LOW':
                                                                                                return '#10B981'; // Green -> Healthy
                                                                        case 'UNUSED':
                                                                        default:
                                                                                                return '#475569'; // Faded gray -> Abandoned
                                                }
                        };

                        // DB failure cascade order: Orders (1) -> Payment (2) -> Invoices/Checkout (3) -> Notification (4) -> Users/Auth (5)
                        const getDBFailureCascadeStage = (name: string) => {
                                                const n = name.toLowerCase();
                                                if (n.includes('order')) return 1;
                                                if (n.includes('pay') || n.includes('bill'))
                                                                        return 2;
                                                if (
                                                                        n.includes('check') ||
                                                                        n.includes('cart') ||
                                                                        n.includes('invoice') ||
                                                                        n.includes('api')
                                                )
                                                                        return 3;
                                                if (
                                                                        n.includes('notify') ||
                                                                        n.includes('queue') ||
                                                                        n.includes('mail')
                                                )
                                                                        return 4;
                                                if (
                                                                        n.includes('auth') ||
                                                                        n.includes('session') ||
                                                                        n.includes('user')
                                                )
                                                                        return 5;
                                                return -1;
                        };

                        // Color Mapping Engine representing rules
                        const getBuildingColor = (b: any, sim: string | null) => {
                                                if (sim === 'blackout') {
                                                                        const isDbLinked =
                                                                                                b.name
                                                                                                                        .toLowerCase()
                                                                                                                        .includes(
                                                                                                                                                'repo'
                                                                                                                        ) ||
                                                                                                b.name
                                                                                                                        .toLowerCase()
                                                                                                                        .includes(
                                                                                                                                                'db'
                                                                                                                        ) ||
                                                                                                b.name
                                                                                                                        .toLowerCase()
                                                                                                                        .includes(
                                                                                                                                                'model'
                                                                                                                        );
                                                                        if (isDbLinked)
                                                                                                return '#1E293B'; // dead building color
                                                }

                                                // AI Traffic simulation override: cascade red colors
                                                if (sim === 'ai_auth_slow') {
                                                                        const aiStage = Math.floor(
                                                                                                (animationTick %
                                                                                                                        600) /
                                                                                                                        100
                                                                        );
                                                                        const tier =
                                                                                                getBuildingCascadeTier(
                                                                                                                        b.name
                                                                                                );
                                                                        if (
                                                                                                tier >=
                                                                                                                        0 &&
                                                                                                aiStage >=
                                                                                                                        tier
                                                                        ) {
                                                                                                return '#EF4444'; // Turns Red as cascade hits
                                                                        }
                                                }

                                                // DB Failure simulation override: cascade red colors
                                                if (sim === 'db_fail') {
                                                                        const dbStage = Math.floor(
                                                                                                (animationTick %
                                                                                                                        700) /
                                                                                                                        100
                                                                        );
                                                                        const stage =
                                                                                                getDBFailureCascadeStage(
                                                                                                                        b.name
                                                                                                );
                                                                        if (
                                                                                                stage >=
                                                                                                                        1 &&
                                                                                                dbStage >=
                                                                                                                        stage
                                                                        ) {
                                                                                                return '#EF4444'; // Turns Red as cascade hits
                                                                        }
                                                }

                                                // Scalability Load simulation override (Feature 13)
                                                if (loadUsersCount >= 100000000) {
                                                                        const isCore =
                                                                                                b.name
                                                                                                                        .toLowerCase()
                                                                                                                        .includes(
                                                                                                                                                'api'
                                                                                                                        ) ||
                                                                                                b.name
                                                                                                                        .toLowerCase()
                                                                                                                        .includes(
                                                                                                                                                'order'
                                                                                                                        ) ||
                                                                                                b.name
                                                                                                                        .toLowerCase()
                                                                                                                        .includes(
                                                                                                                                                'pay'
                                                                                                                        ) ||
                                                                                                b.name
                                                                                                                        .toLowerCase()
                                                                                                                        .includes(
                                                                                                                                                'db'
                                                                                                                        ) ||
                                                                                                b.name
                                                                                                                        .toLowerCase()
                                                                                                                        .includes(
                                                                                                                                                'repo'
                                                                                                                        );
                                                                        if (isCore)
                                                                                                return '#EF4444'; // Red grid lock
                                                } else if (loadUsersCount >= 10000000) {
                                                                        const isCore =
                                                                                                b.name
                                                                                                                        .toLowerCase()
                                                                                                                        .includes(
                                                                                                                                                'api'
                                                                                                                        ) ||
                                                                                                b.name
                                                                                                                        .toLowerCase()
                                                                                                                        .includes(
                                                                                                                                                'order'
                                                                                                                        ) ||
                                                                                                b.name
                                                                                                                        .toLowerCase()
                                                                                                                        .includes(
                                                                                                                                                'pay'
                                                                                                                        );
                                                                        if (isCore)
                                                                                                return '#F97316'; // Orange heavy load
                                                } else if (loadUsersCount >= 1000000) {
                                                                        const isCore =
                                                                                                b.name
                                                                                                                        .toLowerCase()
                                                                                                                        .includes(
                                                                                                                                                'api'
                                                                                                                        ) ||
                                                                                                b.name
                                                                                                                        .toLowerCase()
                                                                                                                        .includes(
                                                                                                                                                'order'
                                                                                                                        );
                                                                        if (isCore)
                                                                                                return '#EAB308'; // Yellow moderate load
                                                }

                                                // Red Building -> High Technical Debt or Bugs danger zone
                                                if (
                                                                        b.danger_zone_bugs_count >
                                                                                                0 ||
                                                                        b.technical_debt_traffic_level ===
                                                                                                'CRITICAL' ||
                                                                        b.technical_debt_traffic_level ===
                                                                                                'HIGH'
                                                ) {
                                                                        return '#EF4444';
                                                }
                                                // Blue Building -> Well Tested
                                                if (
                                                                        b.name
                                                                                                .toLowerCase()
                                                                                                .includes(
                                                                                                                        'test'
                                                                                                ) ||
                                                                        b.name
                                                                                                .toLowerCase()
                                                                                                .includes(
                                                                                                                        'spec'
                                                                                                ) ||
                                                                        b.name
                                                                                                .toLowerCase()
                                                                                                .includes(
                                                                                                                        'mock'
                                                                                                ) ||
                                                                        b.documentation_quality >
                                                                                                85.0
                                                ) {
                                                                        return '#3B82F6';
                                                }
                                                // Green Building -> Healthy
                                                if (
                                                                        b.technical_debt_traffic_level ===
                                                                                                'LOW' &&
                                                                        b.documentation_quality > 50
                                                ) {
                                                                        return '#10B981';
                                                }
                                                // Default Yellow/Orange for moderate technical debt
                                                return '#EAB308';
                        };

                        // Rotation implementation
                        const rotatePoint = (x: number, y: number, angleDegrees: number) => {
                                                const rad = (angleDegrees * Math.PI) / 180;
                                                const rx = x * Math.cos(rad) - y * Math.sin(rad);
                                                const ry = x * Math.sin(rad) + y * Math.cos(rad);
                                                return { x: rx, y: ry };
                        };

                        // Projection formula including rotation
                        const project = (x: number, y: number, z: number = 0) => {
                                                const rotated = rotatePoint(x, y, rotationAngle);
                                                // Isometric angle project
                                                const isoX = (rotated.x - rotated.y) * 0.866;
                                                const isoY = (rotated.x + rotated.y) * 0.5 - z;
                                                return {
                                                                        x: pan.x + isoX * zoom,
                                                                        y: pan.y + isoY * zoom,
                                                };
                        };

                        // Helper function to change color brightness
                        const adjustBrightness = (hex: string, percent: number) => {
                                                let R = parseInt(hex.substring(1, 3), 16);
                                                let G = parseInt(hex.substring(3, 5), 16);
                                                let B = parseInt(hex.substring(5, 7), 16);

                                                R = parseInt(
                                                                        (
                                                                                                (R *
                                                                                                                        (100 +
                                                                                                                                                percent)) /
                                                                                                100
                                                                        ).toString()
                                                );
                                                G = parseInt(
                                                                        (
                                                                                                (G *
                                                                                                                        (100 +
                                                                                                                                                percent)) /
                                                                                                100
                                                                        ).toString()
                                                );
                                                B = parseInt(
                                                                        (
                                                                                                (B *
                                                                                                                        (100 +
                                                                                                                                                percent)) /
                                                                                                100
                                                                        ).toString()
                                                );

                                                R = R < 255 ? R : 255;
                                                G = G < 255 ? G : 255;
                                                B = B < 255 ? B : 255;

                                                R = R > 0 ? R : 0;
                                                G = G > 0 ? G : 0;
                                                B = B > 0 ? B : 0;

                                                const rHex = R.toString(16).padStart(2, '0');
                                                const gHex = G.toString(16).padStart(2, '0');
                                                const bHex = B.toString(16).padStart(2, '0');

                                                return `#${rHex}${gHex}${bHex}`;
                        };

                        // Main Render loop triggered on state updates
                        React.useLayoutEffect(() => {
                                                const canvas = canvasRef.current;
                                                if (!canvas) return;
                                                const ctx = canvas.getContext('2d');
                                                if (!ctx) return;

                                                const { width, height } = canvas;
                                                ctx.clearRect(0, 0, width, height);

                                                if (isSatelliteView) {
                                                                        drawSatelliteView(
                                                                                                ctx,
                                                                                                width,
                                                                                                height
                                                                        );
                                                                        return;
                                                }

                                                // Dynamic layout generator
                                                const layouts = computeLayouts();

                                                const isEvolution = currentEvolutionFrame > 0;

                                                // 1. Draw Districts boundaries
                                                if (layerFilters.districts) {
                                                                        drawDistrictBounds(
                                                                                                ctx,
                                                                                                layouts
                                                                        );
                                                }

                                                // 1b. Draw Bug Danger Zones Heatmap Overlay directly on the city base
                                                if (
                                                                        layerFilters.dangerZones &&
                                                                        (!isEvolution ||
                                                                                                currentEvolutionFrame >=
                                                                                                                        6)
                                                ) {
                                                                        drawBugDangerZonesHeatmap(
                                                                                                ctx,
                                                                                                layouts
                                                                        );
                                                }

                                                // 1c. Draw Performance Rivers (Feature 9)
                                                if (
                                                                        layerFilters.rivers &&
                                                                        (!isEvolution ||
                                                                                                currentEvolutionFrame >=
                                                                                                                        5)
                                                ) {
                                                                        drawPerformanceRivers(
                                                                                                ctx,
                                                                                                layouts
                                                                        );
                                                }

                                                // 2. Draw Roads and Highways network
                                                if (
                                                                        (layerFilters.roads ||
                                                                                                layerFilters.highways) &&
                                                                        (!isEvolution ||
                                                                                                currentEvolutionFrame >=
                                                                                                                        5)
                                                ) {
                                                                        drawInfrastructureNetworks(
                                                                                                ctx,
                                                                                                layouts
                                                                        );
                                                }

                                                // 3. Draw Landmarks
                                                if (
                                                                        layerFilters.landmarks &&
                                                                        (!isEvolution ||
                                                                                                currentEvolutionFrame >=
                                                                                                                        4)
                                                ) {
                                                                        drawLandmarks(ctx, layouts);
                                                }

                                                // 4. Draw Buildings
                                                if (layerFilters.buildings) {
                                                                        drawBuildings(ctx, layouts);
                                                }

                                                // 4b. Draw AI City Planner holographic recommendations (Feature 14)
                                                if (activeSimulation === 'ai_planner') {
                                                                        drawAIPlannerBlueprints(
                                                                                                ctx
                                                                        );
                                                }

                                                // 5. Draw citizens
                                                if (
                                                                        layerFilters.citizens &&
                                                                        (!isEvolution ||
                                                                                                currentEvolutionFrame >=
                                                                                                                        8)
                                                ) {
                                                                        drawCitizens(ctx, layouts);
                                                }

                                                // 5b. Draw Knowledge Flow (Feature 10)
                                                if (
                                                                        layerFilters.knowledge &&
                                                                        (!isEvolution ||
                                                                                                currentEvolutionFrame >=
                                                                                                                        8)
                                                ) {
                                                                        drawKnowledgeFlow(
                                                                                                ctx,
                                                                                                layouts
                                                                        );
                                                }

                                                // 6. Draw alarm hazard overlays
                                                if (!isEvolution || currentEvolutionFrame === 6) {
                                                                        drawDangerZoneSirens(
                                                                                                ctx,
                                                                                                layouts
                                                                        );
                                                }

                                                // 6b. Draw Weather overlays (Sunny, Cloudy, Storm, Lightning, Fog)
                                                if (!isEvolution || currentEvolutionFrame >= 5) {
                                                                        drawWeatherOverlay(
                                                                                                ctx,
                                                                                                width,
                                                                                                height,
                                                                                                layouts
                                                                        );
                                                }

                                                // 7. Draw HUD Overlay
                                                drawOverlayHUD(ctx, width, height);
                        }, [
                                                pan,
                                                zoom,
                                                hoveredEntity,
                                                animationTick,
                                                activeSimulation,
                                                cityData,
                                                rotationAngle,
                                                searchQuery,
                                                weatherState,
                                                currentEvolutionFrame,
                                                loadUsersCount,
                                                layerFilters,
                        ]);

                        // District rendering
                        const drawDistrictBounds = (
                                                ctx: CanvasRenderingContext2D,
                                                layouts: any
                        ) => {
                                                Object.keys(layouts.districts).forEach(
                                                                        (dId: string) => {
                                                                                                const dist =
                                                                                                                        layouts
                                                                                                                                                .districts[
                                                                                                                                                dId
                                                                                                                        ];
                                                                                                const name =
                                                                                                                        districts.find(
                                                                                                                                                (
                                                                                                                                                                        d: any
                                                                                                                                                ) =>
                                                                                                                                                                        d.id ===
                                                                                                                                                                        dId
                                                                                                                        )
                                                                                                                                                ?.name ||
                                                                                                                        'District';
                                                                                                const center =
                                                                                                                        project(
                                                                                                                                                dist.cx,
                                                                                                                                                dist.cy
                                                                                                                        );

                                                                                                ctx.beginPath();
                                                                                                ctx.arc(
                                                                                                                        center.x,
                                                                                                                        center.y,
                                                                                                                        dist.radius *
                                                                                                                                                zoom,
                                                                                                                        0,
                                                                                                                        Math.PI *
                                                                                                                                                2
                                                                                                );
                                                                                                ctx.fillStyle =
                                                                                                                        'rgba(30, 41, 59, 0.15)';
                                                                                                ctx.fill();
                                                                                                ctx.strokeStyle =
                                                                                                                        hoveredEntity?.districtId ===
                                                                                                                        dId
                                                                                                                                                ? 'rgba(56, 189, 248, 0.5)'
                                                                                                                                                : 'rgba(148, 163, 184, 0.15)';
                                                                                                ctx.lineWidth = 1.5;
                                                                                                ctx.stroke();

                                                                                                ctx.fillStyle =
                                                                                                                        'rgba(148, 163, 184, 0.7)';
                                                                                                ctx.font =
                                                                                                                        'bold 9px monospace';
                                                                                                ctx.textAlign =
                                                                                                                        'center';
                                                                                                ctx.fillText(
                                                                                                                        name.toUpperCase(),
                                                                                                                        center.x,
                                                                                                                        center.y -
                                                                                                                                                dist.radius *
                                                                                                                                                                        zoom -
                                                                                                                                                8
                                                                                                );
                                                                        }
                                                );
                        };

                        // Road grid drawing
                        const drawInfrastructureNetworks = (
                                                ctx: CanvasRenderingContext2D,
                                                layouts: any
                        ) => {
                                                const isAICascadeActive =
                                                                        activeSimulation ===
                                                                        'ai_auth_slow';
                                                const aiStage = Math.floor(
                                                                        (animationTick % 600) / 100
                                                );
                                                const dbStage = Math.floor(
                                                                        (animationTick % 700) / 100
                                                );

                                                // Draw API Roads
                                                if (layerFilters.roads) {
                                                                        const roadsList =
                                                                                                cityData?.roads ||
                                                                                                [];
                                                                        roadsList.forEach(
                                                                                                (
                                                                                                                        r: any
                                                                                                ) => {
                                                                                                                        const src =
                                                                                                                                                layouts
                                                                                                                                                                        .buildings[
                                                                                                                                                                        r
                                                                                                                                                                                                .source_id
                                                                                                                                                ] ||
                                                                                                                                                layouts
                                                                                                                                                                        .landmarks[
                                                                                                                                                                        r
                                                                                                                                                                                                .source_id
                                                                                                                                                ];
                                                                                                                        const tgt =
                                                                                                                                                layouts
                                                                                                                                                                        .buildings[
                                                                                                                                                                        r
                                                                                                                                                                                                .target_id
                                                                                                                                                ] ||
                                                                                                                                                layouts
                                                                                                                                                                        .landmarks[
                                                                                                                                                                        r
                                                                                                                                                                                                .target_id
                                                                                                                                                ];
                                                                                                                        if (
                                                                                                                                                !src ||
                                                                                                                                                !tgt
                                                                                                                        )
                                                                                                                                                return;

                                                                                                                        const pSrc =
                                                                                                                                                project(
                                                                                                                                                                        src.x,
                                                                                                                                                                        src.y
                                                                                                                                                );
                                                                                                                        const pTgt =
                                                                                                                                                project(
                                                                                                                                                                        tgt.x,
                                                                                                                                                                        tgt.y
                                                                                                                                                );

                                                                                                                        let localTrafficLevel =
                                                                                                                                                r.traffic_level ||
                                                                                                                                                'LOW';

                                                                                                                        // Override road traffic for AI Cascade simulation
                                                                                                                        if (
                                                                                                                                                isAICascadeActive
                                                                                                                        ) {
                                                                                                                                                const tgtTier =
                                                                                                                                                                        getBuildingCascadeTier(
                                                                                                                                                                                                tgt.name ||
                                                                                                                                                                                                                        ''
                                                                                                                                                                        );
                                                                                                                                                if (
                                                                                                                                                                        tgtTier >=
                                                                                                                                                                                                0 &&
                                                                                                                                                                        aiStage >=
                                                                                                                                                                                                tgtTier
                                                                                                                                                ) {
                                                                                                                                                                        localTrafficLevel =
                                                                                                                                                                                                'CRITICAL';
                                                                                                                                                }
                                                                                                                        }

                                                                                                                        // Override road traffic for DB Failure simulation
                                                                                                                        if (
                                                                                                                                                activeSimulation ===
                                                                                                                                                'db_fail'
                                                                                                                        ) {
                                                                                                                                                const tgtStage =
                                                                                                                                                                        getDBFailureCascadeStage(
                                                                                                                                                                                                tgt.name ||
                                                                                                                                                                                                                        ''
                                                                                                                                                                        );
                                                                                                                                                if (
                                                                                                                                                                        tgtStage >=
                                                                                                                                                                                                1 &&
                                                                                                                                                                        dbStage >=
                                                                                                                                                                                                tgtStage
                                                                                                                                                ) {
                                                                                                                                                                        localTrafficLevel =
                                                                                                                                                                                                'CRITICAL';
                                                                                                                                                }
                                                                                                                        }

                                                                                                                        // Override road traffic for Scalability simulation
                                                                                                                        if (
                                                                                                                                                loadUsersCount >=
                                                                                                                                                100000000
                                                                                                                        ) {
                                                                                                                                                localTrafficLevel =
                                                                                                                                                                        'CRITICAL';
                                                                                                                        } else if (
                                                                                                                                                loadUsersCount >=
                                                                                                                                                10000000
                                                                                                                        ) {
                                                                                                                                                localTrafficLevel =
                                                                                                                                                                        'HIGH';
                                                                                                                        } else if (
                                                                                                                                                loadUsersCount >=
                                                                                                                                                1000000
                                                                                                                        ) {
                                                                                                                                                localTrafficLevel =
                                                                                                                                                                        'MEDIUM';
                                                                                                                        }

                                                                                                                        const trafficColor =
                                                                                                                                                getTrafficColor(
                                                                                                                                                                        localTrafficLevel
                                                                                                                                                );
                                                                                                                        const isCritical =
                                                                                                                                                localTrafficLevel ===
                                                                                                                                                'CRITICAL';

                                                                                                                        ctx.beginPath();
                                                                                                                        ctx.moveTo(
                                                                                                                                                pSrc.x,
                                                                                                                                                pSrc.y
                                                                                                                        );
                                                                                                                        ctx.lineTo(
                                                                                                                                                pTgt.x,
                                                                                                                                                pTgt.y
                                                                                                                        );
                                                                                                                        ctx.strokeStyle =
                                                                                                                                                isCritical
                                                                                                                                                                        ? 'rgba(239, 68, 68, 0.65)'
                                                                                                                                                                        : trafficColor;
                                                                                                                        ctx.lineWidth =
                                                                                                                                                isCritical
                                                                                                                                                                        ? 4.5
                                                                                                                                                                        : 2.0;
                                                                                                                        ctx.stroke();

                                                                                                                        // Animate traffic particles based on debt traffic level
                                                                                                                        if (
                                                                                                                                                localTrafficLevel ===
                                                                                                                                                'CRITICAL'
                                                                                                                        ) {
                                                                                                                                                // Stationary/pulsing red traffic jam
                                                                                                                                                const pulse =
                                                                                                                                                                        Math.abs(
                                                                                                                                                                                                Math.sin(
                                                                                                                                                                                                                        animationTick *
                                                                                                                                                                                                                                                0.05
                                                                                                                                                                                                )
                                                                                                                                                                        ) *
                                                                                                                                                                        1.5;
                                                                                                                                                [
                                                                                                                                                                        0.25,
                                                                                                                                                                        0.5,
                                                                                                                                                                        0.75,
                                                                                                                                                ].forEach(
                                                                                                                                                                        (
                                                                                                                                                                                                frac
                                                                                                                                                                        ) => {
                                                                                                                                                                                                const px =
                                                                                                                                                                                                                        pSrc.x +
                                                                                                                                                                                                                        (pTgt.x -
                                                                                                                                                                                                                                                pSrc.x) *
                                                                                                                                                                                                                                                frac;
                                                                                                                                                                                                const py =
                                                                                                                                                                                                                        pSrc.y +
                                                                                                                                                                                                                        (pTgt.y -
                                                                                                                                                                                                                                                pSrc.y) *
                                                                                                                                                                                                                                                frac;
                                                                                                                                                                                                ctx.beginPath();
                                                                                                                                                                                                ctx.arc(
                                                                                                                                                                                                                        px,
                                                                                                                                                                                                                        py,
                                                                                                                                                                                                                        3 +
                                                                                                                                                                                                                                                pulse,
                                                                                                                                                                                                                        0,
                                                                                                                                                                                                                        Math.PI *
                                                                                                                                                                                                                                                2
                                                                                                                                                                                                );
                                                                                                                                                                                                ctx.fillStyle =
                                                                                                                                                                                                                        '#EF4444';
                                                                                                                                                                                                ctx.fill();
                                                                                                                                                                        }
                                                                                                                                                );
                                                                                                                        } else if (
                                                                                                                                                localTrafficLevel ===
                                                                                                                                                'HIGH'
                                                                                                                        ) {
                                                                                                                                                // Slow orange flow
                                                                                                                                                for (
                                                                                                                                                                        let i = 0;
                                                                                                                                                                        i <
                                                                                                                                                                        2;
                                                                                                                                                                        i++
                                                                                                                                                ) {
                                                                                                                                                                        const progress =
                                                                                                                                                                                                (animationTick *
                                                                                                                                                                                                                        0.003 +
                                                                                                                                                                                                                        i *
                                                                                                                                                                                                                                                0.5) %
                                                                                                                                                                                                1.0;
                                                                                                                                                                        const px =
                                                                                                                                                                                                pSrc.x +
                                                                                                                                                                                                (pTgt.x -
                                                                                                                                                                                                                        pSrc.x) *
                                                                                                                                                                                                                        progress;
                                                                                                                                                                        const py =
                                                                                                                                                                                                pSrc.y +
                                                                                                                                                                                                (pTgt.y -
                                                                                                                                                                                                                        pSrc.y) *
                                                                                                                                                                                                                        progress;
                                                                                                                                                                        ctx.beginPath();
                                                                                                                                                                        ctx.arc(
                                                                                                                                                                                                px,
                                                                                                                                                                                                py,
                                                                                                                                                                                                2.5,
                                                                                                                                                                                                0,
                                                                                                                                                                                                Math.PI *
                                                                                                                                                                                                                        2
                                                                                                                                                                        );
                                                                                                                                                                        ctx.fillStyle =
                                                                                                                                                                                                '#F97316';
                                                                                                                                                                        ctx.fill();
                                                                                                                                                }
                                                                                                                        } else if (
                                                                                                                                                localTrafficLevel ===
                                                                                                                                                'MEDIUM'
                                                                                                                        ) {
                                                                                                                                                // Moderate yellow flow
                                                                                                                                                const progress =
                                                                                                                                                                        (animationTick *
                                                                                                                                                                                                0.007) %
                                                                                                                                                                        1.0;
                                                                                                                                                const px =
                                                                                                                                                                        pSrc.x +
                                                                                                                                                                        (pTgt.x -
                                                                                                                                                                                                pSrc.x) *
                                                                                                                                                                                                progress;
                                                                                                                                                const py =
                                                                                                                                                                        pSrc.y +
                                                                                                                                                                        (pTgt.y -
                                                                                                                                                                                                pSrc.y) *
                                                                                                                                                                                                progress;
                                                                                                                                                ctx.beginPath();
                                                                                                                                                ctx.arc(
                                                                                                                                                                        px,
                                                                                                                                                                        py,
                                                                                                                                                                        2.0,
                                                                                                                                                                        0,
                                                                                                                                                                        Math.PI *
                                                                                                                                                                                                2
                                                                                                                                                );
                                                                                                                                                ctx.fillStyle =
                                                                                                                                                                        '#EAB308';
                                                                                                                                                ctx.fill();
                                                                                                                        } else {
                                                                                                                                                // Fast green flow (LOW debt)
                                                                                                                                                const progress =
                                                                                                                                                                        (animationTick *
                                                                                                                                                                                                0.015) %
                                                                                                                                                                        1.0;
                                                                                                                                                const px =
                                                                                                                                                                        pSrc.x +
                                                                                                                                                                        (pTgt.x -
                                                                                                                                                                                                pSrc.x) *
                                                                                                                                                                                                progress;
                                                                                                                                                const py =
                                                                                                                                                                        pSrc.y +
                                                                                                                                                                        (pTgt.y -
                                                                                                                                                                                                pSrc.y) *
                                                                                                                                                                                                progress;
                                                                                                                                                ctx.beginPath();
                                                                                                                                                ctx.arc(
                                                                                                                                                                        px,
                                                                                                                                                                        py,
                                                                                                                                                                        1.8,
                                                                                                                                                                        0,
                                                                                                                                                                        Math.PI *
                                                                                                                                                                                                2
                                                                                                                                                );
                                                                                                                                                ctx.fillStyle =
                                                                                                                                                                        '#10B981';
                                                                                                                                                ctx.fill();
                                                                                                                        }
                                                                                                }
                                                                        );
                                                }

                                                // Draw dependency highways
                                                if (layerFilters.highways) {
                                                                        const highwaysList =
                                                                                                cityData?.highways ||
                                                                                                [];
                                                                        highwaysList.forEach(
                                                                                                (
                                                                                                                        hw: any
                                                                                                ) => {
                                                                                                                        const src =
                                                                                                                                                layouts
                                                                                                                                                                        .buildings[
                                                                                                                                                                        hw
                                                                                                                                                                                                .source_id
                                                                                                                                                ] ||
                                                                                                                                                layouts
                                                                                                                                                                        .landmarks[
                                                                                                                                                                        hw
                                                                                                                                                                                                .source_id
                                                                                                                                                ];
                                                                                                                        const tgt =
                                                                                                                                                layouts
                                                                                                                                                                        .buildings[
                                                                                                                                                                        hw
                                                                                                                                                                                                .target_id
                                                                                                                                                ] ||
                                                                                                                                                layouts
                                                                                                                                                                        .landmarks[
                                                                                                                                                                        hw
                                                                                                                                                                                                .target_id
                                                                                                                                                ];
                                                                                                                        if (
                                                                                                                                                !src ||
                                                                                                                                                !tgt
                                                                                                                        )
                                                                                                                                                return;

                                                                                                                        const pSrc =
                                                                                                                                                project(
                                                                                                                                                                        src.x,
                                                                                                                                                                        src.y
                                                                                                                                                );
                                                                                                                        const pTgt =
                                                                                                                                                project(
                                                                                                                                                                        tgt.x,
                                                                                                                                                                        tgt.y
                                                                                                                                                );

                                                                                                                        let localTrafficLevel =
                                                                                                                                                hw.traffic_level ||
                                                                                                                                                'LOW';
                                                                                                                        const isCircular =
                                                                                                                                                hw.type ===
                                                                                                                                                'CIRCULAR';
                                                                                                                        const isUnused =
                                                                                                                                                hw.traffic_level ===
                                                                                                                                                'UNUSED';

                                                                                                                        // Override highway traffic for AI Cascade simulation
                                                                                                                        if (
                                                                                                                                                isAICascadeActive &&
                                                                                                                                                !isCircular &&
                                                                                                                                                !isUnused
                                                                                                                        ) {
                                                                                                                                                const srcTier =
                                                                                                                                                                        getBuildingCascadeTier(
                                                                                                                                                                                                src.name ||
                                                                                                                                                                                                                        ''
                                                                                                                                                                        );
                                                                                                                                                const tgtTier =
                                                                                                                                                                        getBuildingCascadeTier(
                                                                                                                                                                                                tgt.name ||
                                                                                                                                                                                                                        ''
                                                                                                                                                                        );
                                                                                                                                                if (
                                                                                                                                                                        srcTier >=
                                                                                                                                                                                                0 &&
                                                                                                                                                                        tgtTier >=
                                                                                                                                                                                                0 &&
                                                                                                                                                                        tgtTier ===
                                                                                                                                                                                                srcTier +
                                                                                                                                                                                                                        1 &&
                                                                                                                                                                        aiStage >=
                                                                                                                                                                                                tgtTier
                                                                                                                                                ) {
                                                                                                                                                                        localTrafficLevel =
                                                                                                                                                                                                'CRITICAL';
                                                                                                                                                }
                                                                                                                        }

                                                                                                                        // Override highway traffic for DB Failure simulation
                                                                                                                        if (
                                                                                                                                                activeSimulation ===
                                                                                                                                                                        'db_fail' &&
                                                                                                                                                !isCircular &&
                                                                                                                                                !isUnused
                                                                                                                        ) {
                                                                                                                                                const srcStage =
                                                                                                                                                                        getDBFailureCascadeStage(
                                                                                                                                                                                                src.name ||
                                                                                                                                                                                                                        ''
                                                                                                                                                                        );
                                                                                                                                                const tgtStage =
                                                                                                                                                                        getDBFailureCascadeStage(
                                                                                                                                                                                                tgt.name ||
                                                                                                                                                                                                                        ''
                                                                                                                                                                        );
                                                                                                                                                if (
                                                                                                                                                                        srcStage >=
                                                                                                                                                                                                1 &&
                                                                                                                                                                        tgtStage >=
                                                                                                                                                                                                1 &&
                                                                                                                                                                        tgtStage ===
                                                                                                                                                                                                srcStage +
                                                                                                                                                                                                                        1 &&
                                                                                                                                                                        dbStage >=
                                                                                                                                                                                                tgtStage
                                                                                                                                                ) {
                                                                                                                                                                        localTrafficLevel =
                                                                                                                                                                                                'CRITICAL';
                                                                                                                                                }
                                                                                                                        }

                                                                                                                        // Override highway traffic for Scalability simulation
                                                                                                                        if (
                                                                                                                                                loadUsersCount >=
                                                                                                                                                                        100000000 &&
                                                                                                                                                !isCircular &&
                                                                                                                                                !isUnused
                                                                                                                        ) {
                                                                                                                                                localTrafficLevel =
                                                                                                                                                                        'CRITICAL';
                                                                                                                        } else if (
                                                                                                                                                loadUsersCount >=
                                                                                                                                                                        10000000 &&
                                                                                                                                                !isCircular &&
                                                                                                                                                !isUnused
                                                                                                                        ) {
                                                                                                                                                localTrafficLevel =
                                                                                                                                                                        'HIGH';
                                                                                                                        } else if (
                                                                                                                                                loadUsersCount >=
                                                                                                                                                                        1000000 &&
                                                                                                                                                !isCircular &&
                                                                                                                                                !isUnused
                                                                                                                        ) {
                                                                                                                                                localTrafficLevel =
                                                                                                                                                                        'MEDIUM';
                                                                                                                        }

                                                                                                                        const trafficColor =
                                                                                                                                                getTrafficColor(
                                                                                                                                                                        localTrafficLevel
                                                                                                                                                );
                                                                                                                        const isCritical =
                                                                                                                                                localTrafficLevel ===
                                                                                                                                                'CRITICAL';

                                                                                                                        ctx.beginPath();
                                                                                                                        ctx.moveTo(
                                                                                                                                                pSrc.x,
                                                                                                                                                pSrc.y
                                                                                                                        );
                                                                                                                        ctx.lineTo(
                                                                                                                                                pTgt.x,
                                                                                                                                                pTgt.y
                                                                                                                        );

                                                                                                                        let strokeColor =
                                                                                                                                                trafficColor;
                                                                                                                        let lineWidth = 3.0;

                                                                                                                        if (
                                                                                                                                                isCircular
                                                                                                                        ) {
                                                                                                                                                const isFlash =
                                                                                                                                                                        Math.floor(
                                                                                                                                                                                                animationTick /
                                                                                                                                                                                                                        10
                                                                                                                                                                        ) %
                                                                                                                                                                                                2 ===
                                                                                                                                                                        0;
                                                                                                                                                strokeColor =
                                                                                                                                                                        isFlash
                                                                                                                                                                                                ? 'rgba(239, 68, 68, 0.85)'
                                                                                                                                                                                                : 'rgba(239, 68, 68, 0.3)';
                                                                                                                                                lineWidth = 4.0;
                                                                                                                                                ctx.setLineDash(
                                                                                                                                                                        [
                                                                                                                                                                                                4,
                                                                                                                                                                                                6,
                                                                                                                                                                        ]
                                                                                                                                                );
                                                                                                                        } else if (
                                                                                                                                                isUnused
                                                                                                                        ) {
                                                                                                                                                strokeColor =
                                                                                                                                                                        'rgba(71, 85, 105, 0.15)';
                                                                                                                                                lineWidth = 1.5;
                                                                                                                                                ctx.setLineDash(
                                                                                                                                                                        [
                                                                                                                                                                                                2,
                                                                                                                                                                                                10,
                                                                                                                                                                        ]
                                                                                                                                                );
                                                                                                                        } else if (
                                                                                                                                                isCritical
                                                                                                                        ) {
                                                                                                                                                strokeColor =
                                                                                                                                                                        'rgba(239, 68, 68, 0.75)';
                                                                                                                                                lineWidth = 5.5;
                                                                                                                        } else if (
                                                                                                                                                localTrafficLevel ===
                                                                                                                                                'HIGH'
                                                                                                                        ) {
                                                                                                                                                strokeColor =
                                                                                                                                                                        'rgba(249, 115, 22, 0.55)';
                                                                                                                                                lineWidth = 4.2;
                                                                                                                        } else if (
                                                                                                                                                localTrafficLevel ===
                                                                                                                                                'MEDIUM'
                                                                                                                        ) {
                                                                                                                                                strokeColor =
                                                                                                                                                                        'rgba(234, 179, 8, 0.45)';
                                                                                                                                                lineWidth = 3.2;
                                                                                                                        } else {
                                                                                                                                                strokeColor =
                                                                                                                                                                        'rgba(16, 185, 129, 0.35)';
                                                                                                                                                lineWidth = 2.2;
                                                                                                                        }

                                                                                                                        ctx.strokeStyle =
                                                                                                                                                strokeColor;
                                                                                                                        ctx.lineWidth =
                                                                                                                                                lineWidth;
                                                                                                                        ctx.stroke();
                                                                                                                        ctx.setLineDash(
                                                                                                                                                []
                                                                                                                        );

                                                                                                                        // Animate particles along highway depending on debt traffic speed
                                                                                                                        if (
                                                                                                                                                !isUnused &&
                                                                                                                                                !isCircular
                                                                                                                        ) {
                                                                                                                                                if (
                                                                                                                                                                        localTrafficLevel ===
                                                                                                                                                                        'CRITICAL'
                                                                                                                                                ) {
                                                                                                                                                                        // Static gridlock pulsations
                                                                                                                                                                        const pulse =
                                                                                                                                                                                                Math.abs(
                                                                                                                                                                                                                        Math.sin(
                                                                                                                                                                                                                                                animationTick *
                                                                                                                                                                                                                                                                        0.055
                                                                                                                                                                                                                        )
                                                                                                                                                                                                ) *
                                                                                                                                                                                                1.5;
                                                                                                                                                                        [
                                                                                                                                                                                                0.2,
                                                                                                                                                                                                0.4,
                                                                                                                                                                                                0.6,
                                                                                                                                                                                                0.8,
                                                                                                                                                                        ].forEach(
                                                                                                                                                                                                (
                                                                                                                                                                                                                        frac
                                                                                                                                                                                                ) => {
                                                                                                                                                                                                                        const px =
                                                                                                                                                                                                                                                pSrc.x +
                                                                                                                                                                                                                                                (pTgt.x -
                                                                                                                                                                                                                                                                        pSrc.x) *
                                                                                                                                                                                                                                                                        frac;
                                                                                                                                                                                                                        const py =
                                                                                                                                                                                                                                                pSrc.y +
                                                                                                                                                                                                                                                (pTgt.y -
                                                                                                                                                                                                                                                                        pSrc.y) *
                                                                                                                                                                                                                                                                        frac;
                                                                                                                                                                                                                        ctx.beginPath();
                                                                                                                                                                                                                        ctx.arc(
                                                                                                                                                                                                                                                px,
                                                                                                                                                                                                                                                py,
                                                                                                                                                                                                                                                3.5 +
                                                                                                                                                                                                                                                                        pulse,
                                                                                                                                                                                                                                                0,
                                                                                                                                                                                                                                                Math.PI *
                                                                                                                                                                                                                                                                        2
                                                                                                                                                                                                                        );
                                                                                                                                                                                                                        ctx.fillStyle =
                                                                                                                                                                                                                                                '#EF4444';
                                                                                                                                                                                                                        ctx.fill();
                                                                                                                                                                                                }
                                                                                                                                                                        );
                                                                                                                                                } else if (
                                                                                                                                                                        localTrafficLevel ===
                                                                                                                                                                        'HIGH'
                                                                                                                                                ) {
                                                                                                                                                                        for (
                                                                                                                                                                                                let i = 0;
                                                                                                                                                                                                i <
                                                                                                                                                                                                2;
                                                                                                                                                                                                i++
                                                                                                                                                                        ) {
                                                                                                                                                                                                const progress =
                                                                                                                                                                                                                        (animationTick *
                                                                                                                                                                                                                                                0.003 +
                                                                                                                                                                                                                                                i *
                                                                                                                                                                                                                                                                        0.5) %
                                                                                                                                                                                                                        1.0;
                                                                                                                                                                                                const px =
                                                                                                                                                                                                                        pSrc.x +
                                                                                                                                                                                                                        (pTgt.x -
                                                                                                                                                                                                                                                pSrc.x) *
                                                                                                                                                                                                                                                progress;
                                                                                                                                                                                                const py =
                                                                                                                                                                                                                        pSrc.y +
                                                                                                                                                                                                                        (pTgt.y -
                                                                                                                                                                                                                                                pSrc.y) *
                                                                                                                                                                                                                                                progress;
                                                                                                                                                                                                ctx.beginPath();
                                                                                                                                                                                                ctx.arc(
                                                                                                                                                                                                                        px,
                                                                                                                                                                                                                        py,
                                                                                                                                                                                                                        3.2,
                                                                                                                                                                                                                        0,
                                                                                                                                                                                                                        Math.PI *
                                                                                                                                                                                                                                                2
                                                                                                                                                                                                );
                                                                                                                                                                                                ctx.fillStyle =
                                                                                                                                                                                                                        '#F97316';
                                                                                                                                                                                                ctx.fill();
                                                                                                                                                                        }
                                                                                                                                                } else if (
                                                                                                                                                                        localTrafficLevel ===
                                                                                                                                                                        'MEDIUM'
                                                                                                                                                ) {
                                                                                                                                                                        const progress =
                                                                                                                                                                                                (animationTick *
                                                                                                                                                                                                                        0.007) %
                                                                                                                                                                                                1.0;
                                                                                                                                                                        const px =
                                                                                                                                                                                                pSrc.x +
                                                                                                                                                                                                (pTgt.x -
                                                                                                                                                                                                                        pSrc.x) *
                                                                                                                                                                                                                        progress;
                                                                                                                                                                        const py =
                                                                                                                                                                                                pSrc.y +
                                                                                                                                                                                                (pTgt.y -
                                                                                                                                                                                                                        pSrc.y) *
                                                                                                                                                                                                                        progress;
                                                                                                                                                                        ctx.beginPath();
                                                                                                                                                                        ctx.arc(
                                                                                                                                                                                                px,
                                                                                                                                                                                                py,
                                                                                                                                                                                                2.8,
                                                                                                                                                                                                0,
                                                                                                                                                                                                Math.PI *
                                                                                                                                                                                                                        2
                                                                                                                                                                        );
                                                                                                                                                                        ctx.fillStyle =
                                                                                                                                                                                                '#EAB308';
                                                                                                                                                                        ctx.fill();
                                                                                                                                                } else {
                                                                                                                                                                        const progress =
                                                                                                                                                                                                (animationTick *
                                                                                                                                                                                                                        0.012) %
                                                                                                                                                                                                1.0;
                                                                                                                                                                        const px =
                                                                                                                                                                                                pSrc.x +
                                                                                                                                                                                                (pTgt.x -
                                                                                                                                                                                                                        pSrc.x) *
                                                                                                                                                                                                                        progress;
                                                                                                                                                                        const py =
                                                                                                                                                                                                pSrc.y +
                                                                                                                                                                                                (pTgt.y -
                                                                                                                                                                                                                        pSrc.y) *
                                                                                                                                                                                                                        progress;
                                                                                                                                                                        ctx.beginPath();
                                                                                                                                                                        ctx.arc(
                                                                                                                                                                                                px,
                                                                                                                                                                                                py,
                                                                                                                                                                                                2.5,
                                                                                                                                                                                                0,
                                                                                                                                                                                                Math.PI *
                                                                                                                                                                                                                        2
                                                                                                                                                                        );
                                                                                                                                                                        ctx.fillStyle =
                                                                                                                                                                                                '#10B981';
                                                                                                                                                                        ctx.fill();
                                                                                                                                                }
                                                                                                                        }

                                                                                                                        // Draw warning barrier overlay on circular dependency broken roads
                                                                                                                        if (
                                                                                                                                                isCircular
                                                                                                                        ) {
                                                                                                                                                const midX =
                                                                                                                                                                        (pSrc.x +
                                                                                                                                                                                                pTgt.x) /
                                                                                                                                                                        2;
                                                                                                                                                const midY =
                                                                                                                                                                        (pSrc.y +
                                                                                                                                                                                                pTgt.y) /
                                                                                                                                                                        2;
                                                                                                                                                ctx.fillStyle =
                                                                                                                                                                        '#EF4444';
                                                                                                                                                ctx.beginPath();
                                                                                                                                                ctx.arc(
                                                                                                                                                                        midX,
                                                                                                                                                                        midY,
                                                                                                                                                                        5 *
                                                                                                                                                                                                zoom,
                                                                                                                                                                        0,
                                                                                                                                                                        Math.PI *
                                                                                                                                                                                                2
                                                                                                                                                );
                                                                                                                                                ctx.fill();

                                                                                                                                                ctx.fillStyle =
                                                                                                                                                                        '#FFFFFF';
                                                                                                                                                ctx.font =
                                                                                                                                                                        'bold 7px monospace';
                                                                                                                                                ctx.textAlign =
                                                                                                                                                                        'center';
                                                                                                                                                ctx.fillText(
                                                                                                                                                                        'X',
                                                                                                                                                                        midX,
                                                                                                                                                                        midY +
                                                                                                                                                                                                2.5
                                                                                                                                                );
                                                                                                                        }
                                                                                                }
                                                                        );
                                                }
                        };

                        // Landmark rendering
                        const drawLandmarks = (ctx: CanvasRenderingContext2D, layouts: any) => {
                                                Object.keys(layouts.landmarks).forEach(
                                                                        (lId: string) => {
                                                                                                const mark =
                                                                                                                        layouts
                                                                                                                                                .landmarks[
                                                                                                                                                lId
                                                                                                                        ];
                                                                                                const pt =
                                                                                                                        project(
                                                                                                                                                mark.x,
                                                                                                                                                mark.y
                                                                                                                        );
                                                                                                const size =
                                                                                                                        16 *
                                                                                                                        zoom;

                                                                                                // Platform base
                                                                                                ctx.fillStyle =
                                                                                                                        mark.color;
                                                                                                ctx.strokeStyle =
                                                                                                                        'rgba(148, 163, 184, 0.4)';
                                                                                                ctx.lineWidth = 1.2;

                                                                                                ctx.beginPath();
                                                                                                ctx.moveTo(
                                                                                                                        pt.x,
                                                                                                                        pt.y -
                                                                                                                                                size /
                                                                                                                                                                        2
                                                                                                );
                                                                                                ctx.lineTo(
                                                                                                                        pt.x +
                                                                                                                                                size,
                                                                                                                        pt.y
                                                                                                );
                                                                                                ctx.lineTo(
                                                                                                                        pt.x,
                                                                                                                        pt.y +
                                                                                                                                                size /
                                                                                                                                                                        2
                                                                                                );
                                                                                                ctx.lineTo(
                                                                                                                        pt.x -
                                                                                                                                                size,
                                                                                                                        pt.y
                                                                                                );
                                                                                                ctx.closePath();
                                                                                                ctx.fill();
                                                                                                ctx.stroke();

                                                                                                // Core landmark towers
                                                                                                if (
                                                                                                                        mark.type ===
                                                                                                                        'power_station'
                                                                                                ) {
                                                                                                                        const isOffline =
                                                                                                                                                activeSimulation ===
                                                                                                                                                'blackout';
                                                                                                                        const isFailed =
                                                                                                                                                activeSimulation ===
                                                                                                                                                'db_fail';
                                                                                                                        ctx.fillStyle =
                                                                                                                                                isOffline
                                                                                                                                                                        ? '#475569'
                                                                                                                                                                        : isFailed
                                                                                                                                                                          ? '#EF4444'
                                                                                                                                                                          : '#6366F1';
                                                                                                                        ctx.beginPath();
                                                                                                                        ctx.arc(
                                                                                                                                                pt.x,
                                                                                                                                                pt.y -
                                                                                                                                                                        12 *
                                                                                                                                                                                                zoom,
                                                                                                                                                7 *
                                                                                                                                                                        zoom,
                                                                                                                                                0,
                                                                                                                                                Math.PI *
                                                                                                                                                                        2
                                                                                                                        );
                                                                                                                        ctx.fill();

                                                                                                                        if (
                                                                                                                                                isFailed
                                                                                                                        ) {
                                                                                                                                                const waveRadius =
                                                                                                                                                                        ((animationTick %
                                                                                                                                                                                                30) /
                                                                                                                                                                                                30) *
                                                                                                                                                                        32 *
                                                                                                                                                                        zoom;
                                                                                                                                                ctx.strokeStyle = `rgba(239, 68, 68, ${1.0 - (animationTick % 30) / 30})`;
                                                                                                                                                ctx.lineWidth = 1.5;
                                                                                                                                                ctx.beginPath();
                                                                                                                                                ctx.arc(
                                                                                                                                                                        pt.x,
                                                                                                                                                                        pt.y -
                                                                                                                                                                                                12 *
                                                                                                                                                                                                                        zoom,
                                                                                                                                                                        waveRadius,
                                                                                                                                                                        0,
                                                                                                                                                                        Math.PI *
                                                                                                                                                                                                2
                                                                                                                                                );
                                                                                                                                                ctx.stroke();
                                                                                                                        } else if (
                                                                                                                                                !isOffline
                                                                                                                        ) {
                                                                                                                                                const waveRadius =
                                                                                                                                                                        ((animationTick %
                                                                                                                                                                                                30) /
                                                                                                                                                                                                30) *
                                                                                                                                                                        22 *
                                                                                                                                                                        zoom;
                                                                                                                                                ctx.strokeStyle = `rgba(99, 102, 241, ${1.0 - (animationTick % 30) / 30})`;
                                                                                                                                                ctx.lineWidth = 1;
                                                                                                                                                ctx.beginPath();
                                                                                                                                                ctx.arc(
                                                                                                                                                                        pt.x,
                                                                                                                                                                        pt.y -
                                                                                                                                                                                                12 *
                                                                                                                                                                                                                        zoom,
                                                                                                                                                                        waveRadius,
                                                                                                                                                                        0,
                                                                                                                                                                        Math.PI *
                                                                                                                                                                                                2
                                                                                                                                                );
                                                                                                                                                ctx.stroke();
                                                                                                                        }
                                                                                                } else if (
                                                                                                                        mark.type ===
                                                                                                                        'control_tower'
                                                                                                ) {
                                                                                                                        ctx.strokeStyle =
                                                                                                                                                '#64748B';
                                                                                                                        ctx.lineWidth = 2.5;
                                                                                                                        ctx.beginPath();
                                                                                                                        ctx.moveTo(
                                                                                                                                                pt.x,
                                                                                                                                                pt.y
                                                                                                                        );
                                                                                                                        ctx.lineTo(
                                                                                                                                                pt.x,
                                                                                                                                                pt.y -
                                                                                                                                                                        28 *
                                                                                                                                                                                                zoom
                                                                                                                        );
                                                                                                                        ctx.stroke();

                                                                                                                        ctx.fillStyle =
                                                                                                                                                '#475569';
                                                                                                                        ctx.beginPath();
                                                                                                                        ctx.arc(
                                                                                                                                                pt.x,
                                                                                                                                                pt.y -
                                                                                                                                                                        28 *
                                                                                                                                                                                                zoom,
                                                                                                                                                5 *
                                                                                                                                                                        zoom,
                                                                                                                                                0,
                                                                                                                                                Math.PI *
                                                                                                                                                                        2
                                                                                                                        );
                                                                                                                        ctx.fill();

                                                                                                                        // Scanning sweep
                                                                                                                        const sweepAngle =
                                                                                                                                                (animationTick *
                                                                                                                                                                        0.05) %
                                                                                                                                                (Math.PI *
                                                                                                                                                                        2);
                                                                                                                        const rx =
                                                                                                                                                pt.x +
                                                                                                                                                Math.cos(
                                                                                                                                                                        sweepAngle
                                                                                                                                                ) *
                                                                                                                                                                        16 *
                                                                                                                                                                        zoom;
                                                                                                                        const ry =
                                                                                                                                                pt.y -
                                                                                                                                                28 *
                                                                                                                                                                        zoom +
                                                                                                                                                Math.sin(
                                                                                                                                                                        sweepAngle
                                                                                                                                                ) *
                                                                                                                                                                        9 *
                                                                                                                                                                        zoom;
                                                                                                                        ctx.strokeStyle =
                                                                                                                                                'rgba(16, 185, 129, 0.45)';
                                                                                                                        ctx.lineWidth = 1.5;
                                                                                                                        ctx.beginPath();
                                                                                                                        ctx.moveTo(
                                                                                                                                                pt.x,
                                                                                                                                                pt.y -
                                                                                                                                                                        28 *
                                                                                                                                                                                                zoom
                                                                                                                        );
                                                                                                                        ctx.lineTo(
                                                                                                                                                rx,
                                                                                                                                                ry
                                                                                                                        );
                                                                                                                        ctx.stroke();
                                                                                                } else if (
                                                                                                                        mark.type ===
                                                                                                                        'airport'
                                                                                                ) {
                                                                                                                        const isFailed =
                                                                                                                                                activeSimulation ===
                                                                                                                                                                        'airport_fail' ||
                                                                                                                                                mark
                                                                                                                                                                        .entity
                                                                                                                                                                        .status ===
                                                                                                                                                                        'FAILED';
                                                                                                                        ctx.strokeStyle =
                                                                                                                                                isFailed
                                                                                                                                                                        ? '#EF4444'
                                                                                                                                                                        : '#FBBF24';
                                                                                                                        ctx.lineWidth = 2;
                                                                                                                        ctx.beginPath();
                                                                                                                        ctx.moveTo(
                                                                                                                                                pt.x -
                                                                                                                                                                        22 *
                                                                                                                                                                                                zoom,
                                                                                                                                                pt.y
                                                                                                                        );
                                                                                                                        ctx.lineTo(
                                                                                                                                                pt.x +
                                                                                                                                                                        22 *
                                                                                                                                                                                                zoom,
                                                                                                                                                pt.y
                                                                                                                        );
                                                                                                                        ctx.stroke();

                                                                                                                        const lightsOn =
                                                                                                                                                Math.floor(
                                                                                                                                                                        animationTick /
                                                                                                                                                                                                10
                                                                                                                                                ) %
                                                                                                                                                                        2 ===
                                                                                                                                                0;
                                                                                                                        if (
                                                                                                                                                lightsOn
                                                                                                                        ) {
                                                                                                                                                ctx.fillStyle =
                                                                                                                                                                        isFailed
                                                                                                                                                                                                ? '#EF4444'
                                                                                                                                                                                                : '#10B981';
                                                                                                                                                ctx.beginPath();
                                                                                                                                                ctx.arc(
                                                                                                                                                                        pt.x -
                                                                                                                                                                                                16 *
                                                                                                                                                                                                                        zoom,
                                                                                                                                                                        pt.y,
                                                                                                                                                                        2.5,
                                                                                                                                                                        0,
                                                                                                                                                                        Math.PI *
                                                                                                                                                                                                2
                                                                                                                                                );
                                                                                                                                                ctx.arc(
                                                                                                                                                                        pt.x +
                                                                                                                                                                                                16 *
                                                                                                                                                                                                                        zoom,
                                                                                                                                                                        pt.y,
                                                                                                                                                                        2.5,
                                                                                                                                                                        0,
                                                                                                                                                                        Math.PI *
                                                                                                                                                                                                2
                                                                                                                                                );
                                                                                                                                                ctx.fill();
                                                                                                                        }
                                                                                                } else {
                                                                                                                        ctx.fillStyle =
                                                                                                                                                '#64748B';
                                                                                                                        ctx.fillRect(
                                                                                                                                                pt.x -
                                                                                                                                                                        4 *
                                                                                                                                                                                                zoom,
                                                                                                                                                pt.y -
                                                                                                                                                                        12 *
                                                                                                                                                                                                zoom,
                                                                                                                                                8 *
                                                                                                                                                                        zoom,
                                                                                                                                                12 *
                                                                                                                                                                        zoom
                                                                                                                        );
                                                                                                }

                                                                                                // Check hover
                                                                                                const dist =
                                                                                                                        Math.hypot(
                                                                                                                                                pt.x -
                                                                                                                                                                        (hoveredEntity?.screenX ||
                                                                                                                                                                                                0),
                                                                                                                                                pt.y -
                                                                                                                                                                        (hoveredEntity?.screenY ||
                                                                                                                                                                                                0)
                                                                                                                        );
                                                                                                if (
                                                                                                                        dist <
                                                                                                                        15
                                                                                                ) {
                                                                                                                        setHoveredEntity(
                                                                                                                                                {
                                                                                                                                                                        ...mark.entity,
                                                                                                                                                                        screenX: pt.x,
                                                                                                                                                                        screenY: pt.y,
                                                                                                                                                                        type: mark.type,
                                                                                                                                                }
                                                                                                                        );
                                                                                                }
                                                                        }
                                                );
                        };

                        // Building rendering (classes & files)
                        const drawBuildings = (ctx: CanvasRenderingContext2D, layouts: any) => {
                                                // Sort keys based on depth sorting (Y coordinate after projection and rotation)
                                                const sortedBuildingIds = Object.keys(
                                                                        layouts.buildings
                                                ).sort((a, b) => {
                                                                        const posA = project(
                                                                                                layouts
                                                                                                                        .buildings[
                                                                                                                        a
                                                                                                ].x,
                                                                                                layouts
                                                                                                                        .buildings[
                                                                                                                        a
                                                                                                ].y
                                                                        );
                                                                        const posB = project(
                                                                                                layouts
                                                                                                                        .buildings[
                                                                                                                        b
                                                                                                ].x,
                                                                                                layouts
                                                                                                                        .buildings[
                                                                                                                        b
                                                                                                ].y
                                                                        );
                                                                        return posA.y - posB.y;
                                                });

                                                sortedBuildingIds.forEach((bId: string) => {
                                                                        const b =
                                                                                                layouts
                                                                                                                        .buildings[
                                                                                                                        bId
                                                                                                ];
                                                                        const basePt = project(
                                                                                                b.x,
                                                                                                b.y
                                                                        );

                                                                        // Search Query filter highlighting
                                                                        const matchesSearch =
                                                                                                searchQuery.trim() !==
                                                                                                                        '' &&
                                                                                                b.name
                                                                                                                        .toLowerCase()
                                                                                                                        .includes(
                                                                                                                                                searchQuery.toLowerCase()
                                                                                                                        );
                                                                        const isSearchActive =
                                                                                                searchQuery.trim() !==
                                                                                                '';

                                                                        let opacity = 1.0;
                                                                        if (isSearchActive) {
                                                                                                opacity =
                                                                                                                        matchesSearch
                                                                                                                                                ? 1.0
                                                                                                                                                : 0.25;
                                                                        }

                                                                        // Dynamic footprint width: Wide Building -> Many Methods
                                                                        const roomsCount =
                                                                                                b
                                                                                                                        .entity
                                                                                                                        .rooms
                                                                                                                        ?.length ||
                                                                                                0;
                                                                        const baseWidth = Math.min(
                                                                                                22,
                                                                                                Math.max(
                                                                                                                        9,
                                                                                                                        9 +
                                                                                                                                                roomsCount *
                                                                                                                                                                        1.6
                                                                                                )
                                                                        );
                                                                        const w = baseWidth * zoom; // dynamic isometric half width
                                                                        const h = b.height * zoom;

                                                                        // Project top coordinate
                                                                        const topPt = project(
                                                                                                b.x,
                                                                                                b.y,
                                                                                                b.height
                                                                        );

                                                                        const isHovered =
                                                                                                hoveredEntity?.id ===
                                                                                                bId;

                                                                        // Apply base outline shadow
                                                                        ctx.fillStyle = `rgba(0, 0, 0, ${0.15 * opacity})`;
                                                                        ctx.beginPath();
                                                                        ctx.moveTo(
                                                                                                basePt.x,
                                                                                                basePt.y
                                                                        );
                                                                        ctx.lineTo(
                                                                                                basePt.x +
                                                                                                                        w *
                                                                                                                                                1.5,
                                                                                                basePt.y +
                                                                                                                        w *
                                                                                                                                                0.75
                                                                        );
                                                                        ctx.lineTo(
                                                                                                basePt.x,
                                                                                                basePt.y +
                                                                                                                        w *
                                                                                                                                                1.5
                                                                        );
                                                                        ctx.lineTo(
                                                                                                basePt.x -
                                                                                                                        w *
                                                                                                                                                1.5,
                                                                                                basePt.y +
                                                                                                                        w *
                                                                                                                                                0.75
                                                                        );
                                                                        ctx.closePath();
                                                                        ctx.fill();

                                                                        // Apply opacity configuration for search highlighting
                                                                        ctx.globalAlpha = opacity;

                                                                        // LEFT SIDE
                                                                        ctx.fillStyle =
                                                                                                adjustBrightness(
                                                                                                                        b.color,
                                                                                                                        -30
                                                                                                );
                                                                        ctx.beginPath();
                                                                        ctx.moveTo(
                                                                                                basePt.x -
                                                                                                                        w,
                                                                                                basePt.y
                                                                        );
                                                                        ctx.lineTo(
                                                                                                topPt.x -
                                                                                                                        w,
                                                                                                topPt.y
                                                                        );
                                                                        ctx.lineTo(
                                                                                                topPt.x,
                                                                                                topPt.y +
                                                                                                                        w *
                                                                                                                                                0.5
                                                                        );
                                                                        ctx.lineTo(
                                                                                                basePt.x,
                                                                                                basePt.y +
                                                                                                                        w *
                                                                                                                                                0.5
                                                                        );
                                                                        ctx.closePath();
                                                                        ctx.fill();

                                                                        // RIGHT SIDE
                                                                        ctx.fillStyle =
                                                                                                adjustBrightness(
                                                                                                                        b.color,
                                                                                                                        -15
                                                                                                );
                                                                        ctx.beginPath();
                                                                        ctx.moveTo(
                                                                                                basePt.x,
                                                                                                basePt.y +
                                                                                                                        w *
                                                                                                                                                0.5
                                                                        );
                                                                        ctx.lineTo(
                                                                                                topPt.x,
                                                                                                topPt.y +
                                                                                                                        w *
                                                                                                                                                0.5
                                                                        );
                                                                        ctx.lineTo(
                                                                                                topPt.x +
                                                                                                                        w,
                                                                                                topPt.y
                                                                        );
                                                                        ctx.lineTo(
                                                                                                basePt.x +
                                                                                                                        w,
                                                                                                basePt.y
                                                                        );
                                                                        ctx.closePath();
                                                                        ctx.fill();

                                                                        // TOP SIDE
                                                                        ctx.fillStyle = b.color;
                                                                        ctx.beginPath();
                                                                        ctx.moveTo(
                                                                                                topPt.x,
                                                                                                topPt.y -
                                                                                                                        w *
                                                                                                                                                0.5
                                                                        );
                                                                        ctx.lineTo(
                                                                                                topPt.x +
                                                                                                                        w,
                                                                                                topPt.y
                                                                        );
                                                                        ctx.lineTo(
                                                                                                topPt.x,
                                                                                                topPt.y +
                                                                                                                        w *
                                                                                                                                                0.5
                                                                        );
                                                                        ctx.lineTo(
                                                                                                topPt.x -
                                                                                                                        w,
                                                                                                topPt.y
                                                                        );
                                                                        ctx.closePath();
                                                                        ctx.fill();

                                                                        ctx.globalAlpha = 1.0; // restore global alpha

                                                                        // Spotlight / Halo on active search match
                                                                        if (matchesSearch) {
                                                                                                const pulse =
                                                                                                                        (animationTick %
                                                                                                                                                30) /
                                                                                                                        30;
                                                                                                ctx.strokeStyle = `rgba(56, 189, 248, ${1.0 - pulse})`;
                                                                                                ctx.lineWidth = 2.5;
                                                                                                ctx.beginPath();
                                                                                                ctx.ellipse(
                                                                                                                        basePt.x,
                                                                                                                        basePt.y +
                                                                                                                                                w *
                                                                                                                                                                        0.5,
                                                                                                                        w *
                                                                                                                                                2.2 *
                                                                                                                                                pulse,
                                                                                                                        w *
                                                                                                                                                1.1 *
                                                                                                                                                pulse,
                                                                                                                        0,
                                                                                                                        0,
                                                                                                                        Math.PI *
                                                                                                                                                2
                                                                                                );
                                                                                                ctx.stroke();

                                                                                                // Draw neon beacon line
                                                                                                ctx.strokeStyle =
                                                                                                                        '#38BDF8';
                                                                                                ctx.lineWidth = 1.5;
                                                                                                ctx.beginPath();
                                                                                                ctx.moveTo(
                                                                                                                        topPt.x,
                                                                                                                        topPt.y
                                                                                                );
                                                                                                ctx.lineTo(
                                                                                                                        topPt.x,
                                                                                                                        topPt.y -
                                                                                                                                                45 *
                                                                                                                                                                        zoom
                                                                                                );
                                                                                                ctx.stroke();
                                                                        }

                                                                        // Tooltip Card popup on hover
                                                                        if (isHovered) {
                                                                                                ctx.strokeStyle =
                                                                                                                        '#38BDF8';
                                                                                                ctx.lineWidth = 2;
                                                                                                ctx.stroke();

                                                                                                ctx.fillStyle =
                                                                                                                        'rgba(15, 23, 42, 0.95)';
                                                                                                ctx.fillRect(
                                                                                                                        topPt.x -
                                                                                                                                                80,
                                                                                                                        topPt.y -
                                                                                                                                                50,
                                                                                                                        160,
                                                                                                                        42
                                                                                                );
                                                                                                ctx.strokeStyle =
                                                                                                                        '#38BDF8';
                                                                                                ctx.lineWidth = 1.2;
                                                                                                ctx.strokeRect(
                                                                                                                        topPt.x -
                                                                                                                                                80,
                                                                                                                        topPt.y -
                                                                                                                                                50,
                                                                                                                        160,
                                                                                                                        42
                                                                                                );

                                                                                                ctx.fillStyle =
                                                                                                                        '#FFFFFF';
                                                                                                ctx.font =
                                                                                                                        'bold 9px sans-serif';
                                                                                                ctx.textAlign =
                                                                                                                        'center';
                                                                                                ctx.fillText(
                                                                                                                        b.name,
                                                                                                                        topPt.x,
                                                                                                                        topPt.y -
                                                                                                                                                37
                                                                                                );

                                                                                                ctx.fillStyle =
                                                                                                                        '#94A3B8';
                                                                                                ctx.font =
                                                                                                                        '8px monospace';
                                                                                                ctx.fillText(
                                                                                                                        `Height (LOC): ${Math.round(b.height)}m`,
                                                                                                                        topPt.x,
                                                                                                                        topPt.y -
                                                                                                                                                25
                                                                                                );
                                                                                                ctx.fillText(
                                                                                                                        `Footprint (Rooms): ${roomsCount} wide`,
                                                                                                                        topPt.x,
                                                                                                                        topPt.y -
                                                                                                                                                14
                                                                                                );
                                                                        }
                                                });
                        };

                        // Developer citizens rendering
                        const drawCitizens = (ctx: CanvasRenderingContext2D, layouts: any) => {
                                                if (activeSimulation === 'blackout') return;

                                                const devCitizens = cityData?.citizens || [];
                                                devCitizens.forEach((cit: any, idx: number) => {
                                                                        const buildIds =
                                                                                                cit.active_building_ids ||
                                                                                                [];
                                                                        if (buildIds.length < 2)
                                                                                                return;

                                                                        const src =
                                                                                                layouts
                                                                                                                        .buildings[
                                                                                                                        buildIds[0]
                                                                                                ];
                                                                        const tgt =
                                                                                                layouts
                                                                                                                        .buildings[
                                                                                                                        buildIds[1]
                                                                                                ];
                                                                        if (!src || !tgt) return;

                                                                        const pSrc = project(
                                                                                                src.x,
                                                                                                src.y
                                                                        );
                                                                        const pTgt = project(
                                                                                                tgt.x,
                                                                                                tgt.y
                                                                        );

                                                                        // Travel tick cycle
                                                                        const progress =
                                                                                                (animationTick *
                                                                                                                        0.003 +
                                                                                                                        idx *
                                                                                                                                                0.25) %
                                                                                                1.0;
                                                                        const cx =
                                                                                                pSrc.x +
                                                                                                (pTgt.x -
                                                                                                                        pSrc.x) *
                                                                                                                        progress;
                                                                        const cy =
                                                                                                pSrc.y +
                                                                                                (pTgt.y -
                                                                                                                        pSrc.y) *
                                                                                                                        progress -
                                                                                                10 *
                                                                                                                        zoom;

                                                                        ctx.beginPath();
                                                                        ctx.arc(
                                                                                                cx,
                                                                                                cy,
                                                                                                3 *
                                                                                                                        zoom,
                                                                                                0,
                                                                                                Math.PI *
                                                                                                                        2
                                                                        );
                                                                        ctx.fillStyle = '#34D399'; // Emerald citizen indicator
                                                                        ctx.fill();
                                                                        ctx.strokeStyle = '#FFFFFF';
                                                                        ctx.lineWidth = 0.8;
                                                                        ctx.stroke();

                                                                        const mDist = Math.hypot(
                                                                                                cx -
                                                                                                                        (hoveredEntity?.screenX ||
                                                                                                                                                0),
                                                                                                cy -
                                                                                                                        (hoveredEntity?.screenY ||
                                                                                                                                                0)
                                                                        );
                                                                        if (mDist < 20) {
                                                                                                ctx.fillStyle =
                                                                                                                        'rgba(30, 41, 59, 0.9)';
                                                                                                ctx.fillRect(
                                                                                                                        cx -
                                                                                                                                                32,
                                                                                                                        cy -
                                                                                                                                                18,
                                                                                                                        64,
                                                                                                                        11
                                                                                                );
                                                                                                ctx.fillStyle =
                                                                                                                        '#FFFFFF';
                                                                                                ctx.font =
                                                                                                                        'bold 7px sans-serif';
                                                                                                ctx.textAlign =
                                                                                                                        'center';
                                                                                                ctx.fillText(
                                                                                                                        cit.name.split(
                                                                                                                                                ' '
                                                                                                                        )[0],
                                                                                                                        cx,
                                                                                                                        cy -
                                                                                                                                                10
                                                                                                );
                                                                        }
                                                });
                        };

                        // Alarm sirens on Danger Zone nodes
                        const drawDangerZoneSirens = (
                                                ctx: CanvasRenderingContext2D,
                                                layouts: any
                        ) => {
                                                Object.keys(layouts.buildings).forEach(
                                                                        (bId: string) => {
                                                                                                const b =
                                                                                                                        layouts
                                                                                                                                                .buildings[
                                                                                                                                                bId
                                                                                                                        ];
                                                                                                if (
                                                                                                                        b
                                                                                                                                                .entity
                                                                                                                                                .danger_zone_bugs_count >
                                                                                                                                                0 ||
                                                                                                                        activeSimulation ===
                                                                                                                                                'danger_zone'
                                                                                                ) {
                                                                                                                        const topPt =
                                                                                                                                                project(
                                                                                                                                                                        b.x,
                                                                                                                                                                        b.y,
                                                                                                                                                                        b.height
                                                                                                                                                );
                                                                                                                        const alarmPulse =
                                                                                                                                                (animationTick %
                                                                                                                                                                        30) /
                                                                                                                                                30;
                                                                                                                        const pulseRadius =
                                                                                                                                                alarmPulse *
                                                                                                                                                32 *
                                                                                                                                                zoom;

                                                                                                                        ctx.strokeStyle = `rgba(239, 68, 68, ${1.0 - alarmPulse})`;
                                                                                                                        ctx.lineWidth = 1.5;
                                                                                                                        ctx.beginPath();
                                                                                                                        ctx.ellipse(
                                                                                                                                                topPt.x,
                                                                                                                                                topPt.y,
                                                                                                                                                pulseRadius,
                                                                                                                                                pulseRadius *
                                                                                                                                                                        0.5,
                                                                                                                                                0,
                                                                                                                                                0,
                                                                                                                                                Math.PI *
                                                                                                                                                                        2
                                                                                                                        );
                                                                                                                        ctx.stroke();

                                                                                                                        // Pulsing warning badge
                                                                                                                        if (
                                                                                                                                                Math.floor(
                                                                                                                                                                        animationTick /
                                                                                                                                                                                                12
                                                                                                                                                ) %
                                                                                                                                                                        2 ===
                                                                                                                                                0
                                                                                                                        ) {
                                                                                                                                                ctx.fillStyle =
                                                                                                                                                                        '#EF4444';
                                                                                                                                                ctx.beginPath();
                                                                                                                                                ctx.arc(
                                                                                                                                                                        topPt.x,
                                                                                                                                                                        topPt.y -
                                                                                                                                                                                                12 *
                                                                                                                                                                                                                        zoom,
                                                                                                                                                                        5,
                                                                                                                                                                        0,
                                                                                                                                                                        Math.PI *
                                                                                                                                                                                                2
                                                                                                                                                );
                                                                                                                                                ctx.fill();

                                                                                                                                                ctx.fillStyle =
                                                                                                                                                                        '#FFFFFF';
                                                                                                                                                ctx.font =
                                                                                                                                                                        'bold 8px monospace';
                                                                                                                                                ctx.textAlign =
                                                                                                                                                                        'center';
                                                                                                                                                ctx.fillText(
                                                                                                                                                                        '!',
                                                                                                                                                                        topPt.x,
                                                                                                                                                                        topPt.y -
                                                                                                                                                                                                8.5 *
                                                                                                                                                                                                                        zoom
                                                                                                                                                );
                                                                                                                        }
                                                                                                }
                                                                        }
                                                );
                        };

                        // Bug Danger Zones Heatmap Overlay (Feature 8)
                        const drawBugDangerZonesHeatmap = (
                                                ctx: CanvasRenderingContext2D,
                                                layouts: any
                        ) => {
                                                Object.keys(layouts.buildings).forEach(
                                                                        (bId: string) => {
                                                                                                const b =
                                                                                                                        layouts
                                                                                                                                                .buildings[
                                                                                                                                                bId
                                                                                                                        ];
                                                                                                const bugs =
                                                                                                                        b
                                                                                                                                                .entity
                                                                                                                                                .danger_zone_bugs_count ||
                                                                                                                        0;
                                                                                                if (
                                                                                                                        bugs ===
                                                                                                                                                0 &&
                                                                                                                        activeSimulation !==
                                                                                                                                                'danger_zone'
                                                                                                )
                                                                                                                        return;

                                                                                                const basePt =
                                                                                                                        project(
                                                                                                                                                b.x,
                                                                                                                                                b.y
                                                                                                                        );

                                                                                                // LOW: pale green/yellow gradient, MEDIUM: pale orange, HIGH: red, CRITICAL: pulsing red
                                                                                                let baseColor =
                                                                                                                        'rgba(16, 185, 129, 0.22)';
                                                                                                let radiusMultiplier = 2.0;

                                                                                                if (
                                                                                                                        activeSimulation ===
                                                                                                                                                'danger_zone' ||
                                                                                                                        bugs >=
                                                                                                                                                4
                                                                                                ) {
                                                                                                                        const pulse =
                                                                                                                                                Math.abs(
                                                                                                                                                                        Math.sin(
                                                                                                                                                                                                animationTick *
                                                                                                                                                                                                                        0.06
                                                                                                                                                                        )
                                                                                                                                                );
                                                                                                                        baseColor = `rgba(239, 68, 68, ${0.32 + pulse * 0.15})`;
                                                                                                                        radiusMultiplier =
                                                                                                                                                4.2 +
                                                                                                                                                pulse *
                                                                                                                                                                        0.8;
                                                                                                } else if (
                                                                                                                        bugs ===
                                                                                                                        3
                                                                                                ) {
                                                                                                                        baseColor =
                                                                                                                                                'rgba(239, 68, 68, 0.32)'; // Red glow
                                                                                                                        radiusMultiplier = 3.5;
                                                                                                } else if (
                                                                                                                        bugs ===
                                                                                                                        2
                                                                                                ) {
                                                                                                                        baseColor =
                                                                                                                                                'rgba(249, 115, 22, 0.26)'; // Orange glow
                                                                                                                        radiusMultiplier = 2.8;
                                                                                                } else if (
                                                                                                                        bugs ===
                                                                                                                        1
                                                                                                ) {
                                                                                                                        baseColor =
                                                                                                                                                'rgba(234, 179, 8, 0.22)'; // Yellow glow
                                                                                                                        radiusMultiplier = 2.0;
                                                                                                }

                                                                                                const roomsCount =
                                                                                                                        b
                                                                                                                                                .entity
                                                                                                                                                .rooms
                                                                                                                                                ?.length ||
                                                                                                                        0;
                                                                                                const baseWidth =
                                                                                                                        Math.min(
                                                                                                                                                22,
                                                                                                                                                Math.max(
                                                                                                                                                                        9,
                                                                                                                                                                        9 +
                                                                                                                                                                                                roomsCount *
                                                                                                                                                                                                                        1.6
                                                                                                                                                )
                                                                                                                        );
                                                                                                const w =
                                                                                                                        baseWidth *
                                                                                                                        zoom;
                                                                                                const radius =
                                                                                                                        w *
                                                                                                                        radiusMultiplier;

                                                                                                const grad =
                                                                                                                        ctx.createRadialGradient(
                                                                                                                                                basePt.x,
                                                                                                                                                basePt.y,
                                                                                                                                                2 *
                                                                                                                                                                        zoom,
                                                                                                                                                basePt.x,
                                                                                                                                                basePt.y,
                                                                                                                                                radius
                                                                                                                        );
                                                                                                grad.addColorStop(
                                                                                                                        0,
                                                                                                                        baseColor
                                                                                                );
                                                                                                grad.addColorStop(
                                                                                                                        1,
                                                                                                                        'rgba(0, 0, 0, 0)'
                                                                                                );

                                                                                                ctx.fillStyle =
                                                                                                                        grad;
                                                                                                ctx.beginPath();
                                                                                                ctx.ellipse(
                                                                                                                        basePt.x,
                                                                                                                        basePt.y +
                                                                                                                                                w *
                                                                                                                                                                        0.5,
                                                                                                                        radius,
                                                                                                                        radius *
                                                                                                                                                0.5,
                                                                                                                        0,
                                                                                                                        0,
                                                                                                                        Math.PI *
                                                                                                                                                2
                                                                                                );
                                                                                                ctx.fill();
                                                                        }
                                                );
                        };

                        // Software Weather Systems Overlays (Feature 7)
                        const drawWeatherOverlay = (
                                                ctx: CanvasRenderingContext2D,
                                                width: number,
                                                height: number,
                                                layouts: any
                        ) => {
                                                const weather = weatherState.toLowerCase();

                                                // 1. SUNNY: bright light rays
                                                if (weather === 'sunny') {
                                                                        const grad =
                                                                                                ctx.createRadialGradient(
                                                                                                                        0,
                                                                                                                        0,
                                                                                                                        50,
                                                                                                                        0,
                                                                                                                        0,
                                                                                                                        350
                                                                                                );
                                                                        grad.addColorStop(
                                                                                                0,
                                                                                                'rgba(253, 224, 71, 0.08)'
                                                                        );
                                                                        grad.addColorStop(
                                                                                                1,
                                                                                                'rgba(0, 0, 0, 0)'
                                                                        );
                                                                        ctx.fillStyle = grad;
                                                                        ctx.fillRect(
                                                                                                0,
                                                                                                0,
                                                                                                width,
                                                                                                height
                                                                        );

                                                                        ctx.strokeStyle =
                                                                                                'rgba(253, 224, 71, 0.02)';
                                                                        ctx.lineWidth = 15;
                                                                        for (
                                                                                                let i = 0;
                                                                                                i <
                                                                                                4;
                                                                                                i++
                                                                        ) {
                                                                                                const offset =
                                                                                                                        i *
                                                                                                                        40;
                                                                                                ctx.beginPath();
                                                                                                ctx.moveTo(
                                                                                                                        offset,
                                                                                                                        0
                                                                                                );
                                                                                                ctx.lineTo(
                                                                                                                        offset +
                                                                                                                                                180,
                                                                                                                        height
                                                                                                );
                                                                                                ctx.stroke();
                                                                        }
                                                }

                                                // 2. CLOUDY: drifting low-opacity grey shapes
                                                if (
                                                                        weather === 'cloudy' ||
                                                                        weather === 'storm' ||
                                                                        weather === 'lightning'
                                                ) {
                                                                        ctx.fillStyle =
                                                                                                'rgba(71, 85, 105, 0.10)';
                                                                        for (
                                                                                                let i = 0;
                                                                                                i <
                                                                                                3;
                                                                                                i++
                                                                        ) {
                                                                                                const cx =
                                                                                                                        ((animationTick *
                                                                                                                                                0.25 +
                                                                                                                                                i *
                                                                                                                                                                        350) %
                                                                                                                                                (width +
                                                                                                                                                                        300)) -
                                                                                                                        150;
                                                                                                const cy =
                                                                                                                        40 +
                                                                                                                        i *
                                                                                                                                                35;
                                                                                                ctx.beginPath();
                                                                                                ctx.arc(
                                                                                                                        cx,
                                                                                                                        cy,
                                                                                                                        25,
                                                                                                                        0,
                                                                                                                        Math.PI *
                                                                                                                                                2
                                                                                                );
                                                                                                ctx.arc(
                                                                                                                        cx +
                                                                                                                                                20,
                                                                                                                        cy -
                                                                                                                                                10,
                                                                                                                        30,
                                                                                                                        0,
                                                                                                                        Math.PI *
                                                                                                                                                2
                                                                                                );
                                                                                                ctx.arc(
                                                                                                                        cx +
                                                                                                                                                40,
                                                                                                                        cy,
                                                                                                                        25,
                                                                                                                        0,
                                                                                                                        Math.PI *
                                                                                                                                                2
                                                                                                );
                                                                                                ctx.fill();
                                                                        }
                                                }

                                                // 3. STORM: falling blue-grey raindrops
                                                if (
                                                                        weather === 'storm' ||
                                                                        weather === 'lightning'
                                                ) {
                                                                        ctx.strokeStyle =
                                                                                                'rgba(186, 230, 253, 0.2)';
                                                                        ctx.lineWidth = 1.2;
                                                                        for (
                                                                                                let i = 0;
                                                                                                i <
                                                                                                25;
                                                                                                i++
                                                                        ) {
                                                                                                const rx =
                                                                                                                        (i *
                                                                                                                                                65 +
                                                                                                                                                animationTick *
                                                                                                                                                                        5) %
                                                                                                                        width;
                                                                                                const ry =
                                                                                                                        (i *
                                                                                                                                                95 +
                                                                                                                                                animationTick *
                                                                                                                                                                        13) %
                                                                                                                        height;
                                                                                                ctx.beginPath();
                                                                                                ctx.moveTo(
                                                                                                                        rx,
                                                                                                                        ry
                                                                                                );
                                                                                                ctx.lineTo(
                                                                                                                        rx -
                                                                                                                                                8,
                                                                                                                        ry +
                                                                                                                                                15
                                                                                                );
                                                                                                ctx.stroke();
                                                                        }
                                                }

                                                // 4. LIGHTNING: screen flashes and lightning bolts
                                                if (weather === 'lightning') {
                                                                        const cycle =
                                                                                                animationTick %
                                                                                                190;
                                                                        if (cycle < 6) {
                                                                                                ctx.fillStyle = `rgba(255, 255, 255, ${0.45 - cycle * 0.08})`;
                                                                                                ctx.fillRect(
                                                                                                                        0,
                                                                                                                        0,
                                                                                                                        width,
                                                                                                                        height
                                                                                                );

                                                                                                const buildingsKeys =
                                                                                                                        Object.keys(
                                                                                                                                                layouts.buildings
                                                                                                                        );
                                                                                                if (
                                                                                                                        buildingsKeys.length >
                                                                                                                                                0 &&
                                                                                                                        cycle <
                                                                                                                                                3
                                                                                                ) {
                                                                                                                        const targetId =
                                                                                                                                                buildingsKeys.find(
                                                                                                                                                                        (
                                                                                                                                                                                                bId
                                                                                                                                                                        ) =>
                                                                                                                                                                                                layouts
                                                                                                                                                                                                                        .buildings[
                                                                                                                                                                                                                        bId
                                                                                                                                                                                                ]
                                                                                                                                                                                                                        .entity
                                                                                                                                                                                                                        .technical_debt_traffic_level ===
                                                                                                                                                                                                                        'CRITICAL' ||
                                                                                                                                                                                                layouts
                                                                                                                                                                                                                        .buildings[
                                                                                                                                                                                                                        bId
                                                                                                                                                                                                ]
                                                                                                                                                                                                                        .entity
                                                                                                                                                                                                                        .technical_debt_traffic_level ===
                                                                                                                                                                                                                        'HIGH'
                                                                                                                                                ) ||
                                                                                                                                                buildingsKeys[0];

                                                                                                                        const b =
                                                                                                                                                layouts
                                                                                                                                                                        .buildings[
                                                                                                                                                                        targetId
                                                                                                                                                ];
                                                                                                                        const topPt =
                                                                                                                                                project(
                                                                                                                                                                        b.x,
                                                                                                                                                                        b.y,
                                                                                                                                                                        b.height
                                                                                                                                                );

                                                                                                                        ctx.strokeStyle =
                                                                                                                                                '#FFFFFF';
                                                                                                                        ctx.lineWidth = 2.5;
                                                                                                                        ctx.beginPath();
                                                                                                                        ctx.moveTo(
                                                                                                                                                topPt.x -
                                                                                                                                                                        30,
                                                                                                                                                0
                                                                                                                        );
                                                                                                                        ctx.lineTo(
                                                                                                                                                topPt.x +
                                                                                                                                                                        10,
                                                                                                                                                height *
                                                                                                                                                                        0.35
                                                                                                                        );
                                                                                                                        ctx.lineTo(
                                                                                                                                                topPt.x -
                                                                                                                                                                        15,
                                                                                                                                                height *
                                                                                                                                                                        0.55
                                                                                                                        );
                                                                                                                        ctx.lineTo(
                                                                                                                                                topPt.x,
                                                                                                                                                topPt.y
                                                                                                                        );
                                                                                                                        ctx.stroke();
                                                                                                }
                                                                        }
                                                }

                                                // 5. FOG: misty overlays partially covering towers representing poor documentation
                                                if (weather === 'fog') {
                                                                        const grad =
                                                                                                ctx.createLinearGradient(
                                                                                                                        0,
                                                                                                                        height *
                                                                                                                                                0.3,
                                                                                                                        0,
                                                                                                                        height
                                                                                                );
                                                                        const drift =
                                                                                                Math.sin(
                                                                                                                        animationTick *
                                                                                                                                                0.015
                                                                                                ) *
                                                                                                0.02;
                                                                        grad.addColorStop(
                                                                                                0,
                                                                                                'rgba(0, 0, 0, 0)'
                                                                        );
                                                                        grad.addColorStop(
                                                                                                0.4,
                                                                                                `rgba(241, 245, 249, ${0.12 + drift})`
                                                                        );
                                                                        grad.addColorStop(
                                                                                                0.8,
                                                                                                `rgba(241, 245, 249, ${0.22 + drift})`
                                                                        );
                                                                        grad.addColorStop(
                                                                                                1.0,
                                                                                                `rgba(241, 245, 249, ${0.3 + drift})`
                                                                        );

                                                                        ctx.fillStyle = grad;
                                                                        ctx.fillRect(
                                                                                                0,
                                                                                                height *
                                                                                                                        0.3,
                                                                                                width,
                                                                                                height
                                                                        );

                                                                        ctx.fillStyle =
                                                                                                'rgba(241, 245, 249, 0.06)';
                                                                        for (
                                                                                                let i = 0;
                                                                                                i <
                                                                                                4;
                                                                                                i++
                                                                        ) {
                                                                                                const mx =
                                                                                                                        ((animationTick *
                                                                                                                                                0.2 +
                                                                                                                                                i *
                                                                                                                                                                        400) %
                                                                                                                                                (width +
                                                                                                                                                                        400)) -
                                                                                                                        200;
                                                                                                const my =
                                                                                                                        height *
                                                                                                                                                0.5 +
                                                                                                                        i *
                                                                                                                                                45;
                                                                                                ctx.beginPath();
                                                                                                ctx.ellipse(
                                                                                                                        mx,
                                                                                                                        my,
                                                                                                                        120,
                                                                                                                        20,
                                                                                                                        0,
                                                                                                                        0,
                                                                                                                        Math.PI *
                                                                                                                                                2
                                                                                                );
                                                                                                ctx.fill();
                                                                        }
                                                }
                        };

                        // HUD corner statistics
                        const drawOverlayHUD = (
                                                ctx: CanvasRenderingContext2D,
                                                width: number,
                                                height: number
                        ) => {
                                                const isHistorical =
                                                                        timeTravelDate ===
                                                                        'historical';

                                                ctx.fillStyle = 'rgba(15, 23, 42, 0.65)';
                                                ctx.fillRect(10, 10, 220, 56);
                                                ctx.strokeStyle = isHistorical
                                                                        ? 'rgba(249, 115, 22, 0.25)'
                                                                        : 'rgba(56, 189, 248, 0.25)';
                                                ctx.lineWidth = 1;
                                                ctx.strokeRect(10, 10, 220, 56);

                                                ctx.fillStyle = isHistorical
                                                                        ? '#F97316'
                                                                        : '#38BDF8';
                                                ctx.font = 'bold 10px monospace';
                                                ctx.textAlign = 'left';
                                                ctx.fillText(
                                                                        isHistorical
                                                                                                ? 'HISTORICAL TWIN (MARCH 2024)'
                                                                                                : 'SOFTWARE CITY CORPS TELEMETRY',
                                                                        20,
                                                                        23
                                                );

                                                ctx.fillStyle = '#FFFFFF';
                                                ctx.font = '9px monospace';
                                                const formattedLoad =
                                                                        loadUsersCount >= 1000000
                                                                                                ? `${loadUsersCount / 1000000}M`
                                                                                                : loadUsersCount >=
                                                                                                    1000
                                                                                                  ? `${loadUsersCount / 1000}K`
                                                                                                  : loadUsersCount;
                                                ctx.fillText(
                                                                        isHistorical
                                                                                                ? `Monolithic Codebase | Weather: ${weatherState.toUpperCase()}`
                                                                                                : `Load: ${formattedLoad} Users | Weather: ${weatherState.toUpperCase()}`,
                                                                        20,
                                                                        37
                                                );

                                                let statusText = isHistorical
                                                                        ? 'GRID STATUS: UNOPTIMIZED MONOLITH'
                                                                        : 'CITY GRID STATUS: SECURE';
                                                let statusColor = isHistorical
                                                                        ? '#F97316'
                                                                        : '#10B981';
                                                if (activeSimulation) {
                                                                        statusText = `SIMULATION ACTIVE: ${activeSimulation.toUpperCase()}`;
                                                                        statusColor = '#EF4444';
                                                }
                                                ctx.fillStyle = statusColor;
                                                ctx.font = 'bold 9px monospace';
                                                ctx.fillText(statusText, 20, 50);
                        };

                        // Linear interpolation spline point generator for rivers
                        const getSplinePoint = (points: { x: number; y: number }[], t: number) => {
                                                if (points.length === 0) return { x: 0, y: 0 };
                                                if (points.length === 1) return points[0];
                                                if (t <= 0) return points[0];
                                                if (t >= 1) return points[points.length - 1];

                                                const count = points.length - 1;
                                                const index = Math.floor(t * count);
                                                const localT = t * count - index;
                                                const p0 = points[index];
                                                const p1 = points[index + 1];
                                                return {
                                                                        x:
                                                                                                p0.x +
                                                                                                (p1.x -
                                                                                                                        p0.x) *
                                                                                                                        localT,
                                                                        y:
                                                                                                p0.y +
                                                                                                (p1.y -
                                                                                                                        p0.y) *
                                                                                                                        localT,
                                                };
                        };

                        // Performance Rivers drawing representing requests (Feature 9)
                        const drawPerformanceRivers = (
                                                ctx: CanvasRenderingContext2D,
                                                layouts: any
                        ) => {
                                                // 5 coordinates forming a winding pipeline path around the districts
                                                const riverControlPoints = [
                                                                        { x: -320, y: 220 }, // Client
                                                                        { x: -160, y: 50 }, // Gateway
                                                                        { x: -40, y: -80 }, // API Gateway
                                                                        { x: 120, y: 120 }, // Services Controller
                                                                        { x: 0, y: 280 }, // Database SQL Grid
                                                ];

                                                const projectedPoints = riverControlPoints.map(
                                                                        (pt) => project(pt.x, pt.y)
                                                );
                                                const isSlow =
                                                                        activeSimulation ===
                                                                                                'traffic' ||
                                                                        activeSimulation ===
                                                                                                'blackout' ||
                                                                        activeSimulation ===
                                                                                                'ai_auth_slow';

                                                let riverColor = '#22D3EE';
                                                let riverBaseColor = 'rgba(34, 211, 238, 0.28)';
                                                let speed = 0.01;

                                                if (
                                                                        activeSimulation ===
                                                                                                'db_fail' ||
                                                                        loadUsersCount >= 100000000
                                                ) {
                                                                        riverColor = '#EF4444'; // Overloaded Red
                                                                        riverBaseColor =
                                                                                                'rgba(239, 68, 68, 0.28)';
                                                                        speed = 0.001;
                                                } else if (loadUsersCount >= 10000000) {
                                                                        riverColor = '#F97316'; // Heavy Orange
                                                                        riverBaseColor =
                                                                                                'rgba(249, 115, 22, 0.28)';
                                                                        speed = 0.003;
                                                } else if (loadUsersCount >= 1000000) {
                                                                        riverColor = '#EAB308'; // Moderate Yellow
                                                                        riverBaseColor =
                                                                                                'rgba(234, 179, 8, 0.28)';
                                                                        speed = 0.006;
                                                } else if (isSlow) {
                                                                        riverColor = '#EAB308';
                                                                        riverBaseColor =
                                                                                                'rgba(234, 179, 8, 0.28)';
                                                                        speed = 0.002;
                                                }

                                                // Draw River Base Canal Outline
                                                ctx.beginPath();
                                                ctx.moveTo(
                                                                        projectedPoints[0].x,
                                                                        projectedPoints[0].y
                                                );
                                                for (let i = 1; i < projectedPoints.length; i++) {
                                                                        ctx.lineTo(
                                                                                                projectedPoints[
                                                                                                                        i
                                                                                                ].x,
                                                                                                projectedPoints[
                                                                                                                        i
                                                                                                ].y
                                                                        );
                                                }
                                                ctx.strokeStyle = riverBaseColor;
                                                ctx.lineWidth = 10 * zoom;
                                                ctx.lineCap = 'round';
                                                ctx.lineJoin = 'round';
                                                ctx.stroke();

                                                // Draw Inner River Stream
                                                ctx.beginPath();
                                                ctx.moveTo(
                                                                        projectedPoints[0].x,
                                                                        projectedPoints[0].y
                                                );
                                                for (let i = 1; i < projectedPoints.length; i++) {
                                                                        ctx.lineTo(
                                                                                                projectedPoints[
                                                                                                                        i
                                                                                                ].x,
                                                                                                projectedPoints[
                                                                                                                        i
                                                                                                ].y
                                                                        );
                                                }
                                                ctx.strokeStyle = riverColor;
                                                ctx.lineWidth = 4 * zoom;
                                                ctx.stroke();

                                                // Animate flow ripple particles
                                                const rippleCount = 6;
                                                for (let i = 0; i < rippleCount; i++) {
                                                                        const progress =
                                                                                                (animationTick *
                                                                                                                        speed +
                                                                                                                        i *
                                                                                                                                                0.16) %
                                                                                                1.0;
                                                                        const pt = getSplinePoint(
                                                                                                projectedPoints,
                                                                                                progress
                                                                        );

                                                                        ctx.fillStyle = '#FFFFFF';
                                                                        ctx.beginPath();
                                                                        ctx.arc(
                                                                                                pt.x,
                                                                                                pt.y,
                                                                                                (isSlow
                                                                                                                        ? 2.5
                                                                                                                        : 3.5) *
                                                                                                                        zoom,
                                                                                                0,
                                                                                                Math.PI *
                                                                                                                        2
                                                                        );
                                                                        ctx.fill();

                                                                        // Ripple halo ring
                                                                        ctx.strokeStyle = isSlow
                                                                                                ? 'rgba(234, 179, 8, 0.45)'
                                                                                                : 'rgba(34, 211, 238, 0.45)';
                                                                        ctx.lineWidth = 1;
                                                                        ctx.beginPath();
                                                                        ctx.arc(
                                                                                                pt.x,
                                                                                                pt.y,
                                                                                                (isSlow
                                                                                                                        ? 5
                                                                                                                        : 7) *
                                                                                                                        zoom,
                                                                                                0,
                                                                                                Math.PI *
                                                                                                                        2
                                                                        );
                                                                        ctx.stroke();
                                                }

                                                // Label client entry
                                                ctx.fillStyle = 'rgba(148, 163, 184, 0.6)';
                                                ctx.font = '8px monospace';
                                                ctx.textAlign = 'right';
                                                ctx.fillText(
                                                                        'CLIENT RIVER ENTRY',
                                                                        projectedPoints[0].x - 12,
                                                                        projectedPoints[0].y + 3
                                                );
                        };

                        // Knowledge Flow visual mapping (Feature 10)
                        const drawKnowledgeFlow = (ctx: CanvasRenderingContext2D, layouts: any) => {
                                                // 1. Radiant doc beams & floating expertise bubbles
                                                Object.keys(layouts.buildings).forEach(
                                                                        (bId: string) => {
                                                                                                const b =
                                                                                                                        layouts
                                                                                                                                                .buildings[
                                                                                                                                                bId
                                                                                                                        ];
                                                                                                const basePt =
                                                                                                                        project(
                                                                                                                                                b.x,
                                                                                                                                                b.y
                                                                                                                        );
                                                                                                const topPt =
                                                                                                                        project(
                                                                                                                                                b.x,
                                                                                                                                                b.y,
                                                                                                                                                b.height
                                                                                                                        );
                                                                                                const w =
                                                                                                                        Math.min(
                                                                                                                                                22,
                                                                                                                                                Math.max(
                                                                                                                                                                        9,
                                                                                                                                                                        9 +
                                                                                                                                                                                                (b
                                                                                                                                                                                                                        .entity
                                                                                                                                                                                                                        .rooms
                                                                                                                                                                                                                        ?.length ||
                                                                                                                                                                                                                        0) *
                                                                                                                                                                                                                        1.6
                                                                                                                                                )
                                                                                                                        ) *
                                                                                                                        zoom;

                                                                                                // Documentation Beacon: radiant cyan energy beams
                                                                                                if (
                                                                                                                        b
                                                                                                                                                .entity
                                                                                                                                                .documentation_quality >
                                                                                                                        65
                                                                                                ) {
                                                                                                                        const beaconGrad =
                                                                                                                                                ctx.createLinearGradient(
                                                                                                                                                                        topPt.x,
                                                                                                                                                                        topPt.y,
                                                                                                                                                                        topPt.x,
                                                                                                                                                                        topPt.y -
                                                                                                                                                                                                80 *
                                                                                                                                                                                                                        zoom
                                                                                                                                                );
                                                                                                                        beaconGrad.addColorStop(
                                                                                                                                                0,
                                                                                                                                                'rgba(56, 189, 248, 0.28)'
                                                                                                                        );
                                                                                                                        beaconGrad.addColorStop(
                                                                                                                                                0.5,
                                                                                                                                                'rgba(56, 189, 248, 0.08)'
                                                                                                                        );
                                                                                                                        beaconGrad.addColorStop(
                                                                                                                                                1,
                                                                                                                                                'rgba(56, 189, 248, 0)'
                                                                                                                        );

                                                                                                                        ctx.fillStyle =
                                                                                                                                                beaconGrad;
                                                                                                                        ctx.fillRect(
                                                                                                                                                topPt.x -
                                                                                                                                                                        w *
                                                                                                                                                                                                0.35,
                                                                                                                                                topPt.y -
                                                                                                                                                                        80 *
                                                                                                                                                                                                zoom,
                                                                                                                                                w *
                                                                                                                                                                        0.7,
                                                                                                                                                80 *
                                                                                                                                                                        zoom
                                                                                                                        );
                                                                                                }

                                                                                                // Ownership/Expertise floating green energy bubbles
                                                                                                if (
                                                                                                                        cityData?.citizens &&
                                                                                                                        cityData
                                                                                                                                                .citizens
                                                                                                                                                .length >
                                                                                                                                                0
                                                                                                ) {
                                                                                                                        const hasDevs =
                                                                                                                                                cityData.citizens.some(
                                                                                                                                                                        (
                                                                                                                                                                                                cit: any
                                                                                                                                                                        ) =>
                                                                                                                                                                                                cit.active_building_ids &&
                                                                                                                                                                                                cit.active_building_ids.includes(
                                                                                                                                                                                                                        b
                                                                                                                                                                                                                                                .entity
                                                                                                                                                                                                                                                .id
                                                                                                                                                                                                )
                                                                                                                                                );
                                                                                                                        if (
                                                                                                                                                hasDevs
                                                                                                                        ) {
                                                                                                                                                ctx.fillStyle =
                                                                                                                                                                        'rgba(52, 211, 153, 0.35)'; // translucent green bubble
                                                                                                                                                const bubbleCount = 2;
                                                                                                                                                for (
                                                                                                                                                                        let i = 0;
                                                                                                                                                                        i <
                                                                                                                                                                        bubbleCount;
                                                                                                                                                                        i++
                                                                                                                                                ) {
                                                                                                                                                                        const bubbleY =
                                                                                                                                                                                                topPt.y -
                                                                                                                                                                                                ((animationTick *
                                                                                                                                                                                                                        0.45 +
                                                                                                                                                                                                                        i *
                                                                                                                                                                                                                                                20) %
                                                                                                                                                                                                                        45) *
                                                                                                                                                                                                                        zoom;
                                                                                                                                                                        const bubbleX =
                                                                                                                                                                                                topPt.x +
                                                                                                                                                                                                Math.sin(
                                                                                                                                                                                                                        animationTick *
                                                                                                                                                                                                                                                0.06 +
                                                                                                                                                                                                                                                i
                                                                                                                                                                                                ) *
                                                                                                                                                                                                                        6 *
                                                                                                                                                                                                                        zoom;
                                                                                                                                                                        ctx.beginPath();
                                                                                                                                                                        ctx.arc(
                                                                                                                                                                                                bubbleX,
                                                                                                                                                                                                bubbleY,
                                                                                                                                                                                                2 *
                                                                                                                                                                                                                        zoom,
                                                                                                                                                                                                0,
                                                                                                                                                                                                Math.PI *
                                                                                                                                                                                                                        2
                                                                                                                                                                        );
                                                                                                                                                                        ctx.fill();
                                                                                                                                                }
                                                                                                                        }
                                                                                                }
                                                                        }
                                                );

                                                // 2. Collaboration links (floating purple links mapping contributors)
                                                const devCitizens = cityData?.citizens || [];
                                                devCitizens.forEach((cit: any) => {
                                                                        const buildIds =
                                                                                                cit.active_building_ids ||
                                                                                                [];
                                                                        if (buildIds.length >= 2) {
                                                                                                for (
                                                                                                                        let i = 0;
                                                                                                                        i <
                                                                                                                        buildIds.length -
                                                                                                                                                1;
                                                                                                                        i++
                                                                                                ) {
                                                                                                                        const src =
                                                                                                                                                layouts
                                                                                                                                                                        .buildings[
                                                                                                                                                                        buildIds[
                                                                                                                                                                                                i
                                                                                                                                                                        ]
                                                                                                                                                ];
                                                                                                                        const tgt =
                                                                                                                                                layouts
                                                                                                                                                                        .buildings[
                                                                                                                                                                        buildIds[
                                                                                                                                                                                                i +
                                                                                                                                                                                                                        1
                                                                                                                                                                        ]
                                                                                                                                                ];
                                                                                                                        if (
                                                                                                                                                src &&
                                                                                                                                                tgt
                                                                                                                        ) {
                                                                                                                                                const pSrc =
                                                                                                                                                                        project(
                                                                                                                                                                                                src.x,
                                                                                                                                                                                                src.y,
                                                                                                                                                                                                src.height /
                                                                                                                                                                                                                        2
                                                                                                                                                                        );
                                                                                                                                                const pTgt =
                                                                                                                                                                        project(
                                                                                                                                                                                                tgt.x,
                                                                                                                                                                                                tgt.y,
                                                                                                                                                                                                tgt.height /
                                                                                                                                                                                                                        2
                                                                                                                                                                        );

                                                                                                                                                // Curved collaboration bridge arc
                                                                                                                                                ctx.beginPath();
                                                                                                                                                ctx.moveTo(
                                                                                                                                                                        pSrc.x,
                                                                                                                                                                        pSrc.y
                                                                                                                                                );
                                                                                                                                                ctx.quadraticCurveTo(
                                                                                                                                                                        (pSrc.x +
                                                                                                                                                                                                pTgt.x) /
                                                                                                                                                                                                2,
                                                                                                                                                                        Math.min(
                                                                                                                                                                                                pSrc.y,
                                                                                                                                                                                                pTgt.y
                                                                                                                                                                        ) -
                                                                                                                                                                                                30 *
                                                                                                                                                                                                                        zoom,
                                                                                                                                                                        pTgt.x,
                                                                                                                                                                        pTgt.y
                                                                                                                                                );

                                                                                                                                                const pulse =
                                                                                                                                                                        Math.abs(
                                                                                                                                                                                                Math.sin(
                                                                                                                                                                                                                        animationTick *
                                                                                                                                                                                                                                                0.04
                                                                                                                                                                                                )
                                                                                                                                                                        );
                                                                                                                                                ctx.strokeStyle = `rgba(168, 85, 247, ${0.15 + pulse * 0.15})`;
                                                                                                                                                ctx.lineWidth =
                                                                                                                                                                        1.5 *
                                                                                                                                                                        zoom;
                                                                                                                                                ctx.stroke();

                                                                                                                                                // Traveling spark representing contribution commit exchange
                                                                                                                                                const travel =
                                                                                                                                                                        (animationTick *
                                                                                                                                                                                                0.005) %
                                                                                                                                                                        1.0;
                                                                                                                                                const midX =
                                                                                                                                                                        pSrc.x +
                                                                                                                                                                        (pTgt.x -
                                                                                                                                                                                                pSrc.x) *
                                                                                                                                                                                                travel;
                                                                                                                                                const midY =
                                                                                                                                                                        pSrc.y +
                                                                                                                                                                        (pTgt.y -
                                                                                                                                                                                                pSrc.y) *
                                                                                                                                                                                                travel -
                                                                                                                                                                        Math.sin(
                                                                                                                                                                                                travel *
                                                                                                                                                                                                                        Math.PI
                                                                                                                                                                        ) *
                                                                                                                                                                                                30 *
                                                                                                                                                                                                zoom;

                                                                                                                                                ctx.beginPath();
                                                                                                                                                ctx.arc(
                                                                                                                                                                        midX,
                                                                                                                                                                        midY,
                                                                                                                                                                        2.5 *
                                                                                                                                                                                                zoom,
                                                                                                                                                                        0,
                                                                                                                                                                        Math.PI *
                                                                                                                                                                                                2
                                                                                                                                                );
                                                                                                                                                ctx.fillStyle =
                                                                                                                                                                        '#C084FC';
                                                                                                                                                ctx.fill();
                                                                                                                        }
                                                                                                }
                                                                        }
                                                });
                        };

                        // AI City Planner Blueprint holographic suggestions (Feature 14)
                        const drawAIPlannerBlueprints = (ctx: CanvasRenderingContext2D) => {
                                                // We propose 2 microservice split class buildings:
                                                const splits = [
                                                                        {
                                                                                                x: 190,
                                                                                                y: 190,
                                                                                                name: 'Proposed Orders Split API',
                                                                                                height: 75,
                                                                        },
                                                                        {
                                                                                                x: 230,
                                                                                                y: 230,
                                                                                                name: 'Proposed Payments Split API',
                                                                                                height: 90,
                                                                        },
                                                ];

                                                splits.forEach((s) => {
                                                                        const basePt = project(
                                                                                                s.x,
                                                                                                s.y
                                                                        );
                                                                        const topPt = project(
                                                                                                s.x,
                                                                                                s.y,
                                                                                                s.height
                                                                        );
                                                                        const w = 15 * zoom;

                                                                        // Draw dashed holographic bounding wireframe
                                                                        ctx.save();
                                                                        ctx.strokeStyle = '#10B981';
                                                                        ctx.lineWidth = 1.5;
                                                                        ctx.setLineDash([4, 3]);

                                                                        // Draw building base grid block
                                                                        ctx.beginPath();
                                                                        ctx.moveTo(
                                                                                                basePt.x,
                                                                                                basePt.y -
                                                                                                                        w /
                                                                                                                                                2
                                                                        );
                                                                        ctx.lineTo(
                                                                                                basePt.x +
                                                                                                                        w,
                                                                                                basePt.y
                                                                        );
                                                                        ctx.lineTo(
                                                                                                basePt.x,
                                                                                                basePt.y +
                                                                                                                        w /
                                                                                                                                                2
                                                                        );
                                                                        ctx.lineTo(
                                                                                                basePt.x -
                                                                                                                        w,
                                                                                                basePt.y
                                                                        );
                                                                        ctx.closePath();
                                                                        ctx.stroke();

                                                                        // Draw building vertical pillars
                                                                        ctx.beginPath();
                                                                        ctx.moveTo(
                                                                                                basePt.x -
                                                                                                                        w,
                                                                                                basePt.y
                                                                        );
                                                                        ctx.lineTo(
                                                                                                topPt.x -
                                                                                                                        w,
                                                                                                topPt.y
                                                                        );
                                                                        ctx.moveTo(
                                                                                                basePt.x +
                                                                                                                        w,
                                                                                                basePt.y
                                                                        );
                                                                        ctx.lineTo(
                                                                                                topPt.x +
                                                                                                                        w,
                                                                                                topPt.y
                                                                        );
                                                                        ctx.moveTo(
                                                                                                basePt.x,
                                                                                                basePt.y -
                                                                                                                        w /
                                                                                                                                                2
                                                                        );
                                                                        ctx.lineTo(
                                                                                                topPt.x,
                                                                                                topPt.y -
                                                                                                                        w /
                                                                                                                                                2
                                                                        );
                                                                        ctx.moveTo(
                                                                                                basePt.x,
                                                                                                basePt.y +
                                                                                                                        w /
                                                                                                                                                2
                                                                        );
                                                                        ctx.lineTo(
                                                                                                topPt.x,
                                                                                                topPt.y +
                                                                                                                        w /
                                                                                                                                                2
                                                                        );
                                                                        ctx.stroke();

                                                                        // Draw top roof wireframe
                                                                        ctx.beginPath();
                                                                        ctx.moveTo(
                                                                                                topPt.x,
                                                                                                topPt.y -
                                                                                                                        w /
                                                                                                                                                2
                                                                        );
                                                                        ctx.lineTo(
                                                                                                topPt.x +
                                                                                                                        w,
                                                                                                topPt.y
                                                                        );
                                                                        ctx.lineTo(
                                                                                                topPt.x,
                                                                                                topPt.y +
                                                                                                                        w /
                                                                                                                                                2
                                                                        );
                                                                        ctx.lineTo(
                                                                                                topPt.x -
                                                                                                                        w,
                                                                                                topPt.y
                                                                        );
                                                                        ctx.closePath();
                                                                        ctx.stroke();

                                                                        // Light translucent green fill
                                                                        ctx.fillStyle =
                                                                                                'rgba(16, 185, 129, 0.08)';
                                                                        ctx.fill();

                                                                        ctx.restore();

                                                                        // Render floating proposal tag
                                                                        ctx.fillStyle =
                                                                                                'rgba(15, 23, 42, 0.85)';
                                                                        ctx.fillRect(
                                                                                                topPt.x -
                                                                                                                        65,
                                                                                                topPt.y -
                                                                                                                        25,
                                                                                                130,
                                                                                                15
                                                                        );
                                                                        ctx.strokeStyle = '#10B981';
                                                                        ctx.lineWidth = 0.8;
                                                                        ctx.strokeRect(
                                                                                                topPt.x -
                                                                                                                        65,
                                                                                                topPt.y -
                                                                                                                        25,
                                                                                                130,
                                                                                                15
                                                                        );

                                                                        ctx.fillStyle = '#34D399';
                                                                        ctx.font =
                                                                                                'bold 7px monospace';
                                                                        ctx.textAlign = 'center';
                                                                        ctx.fillText(
                                                                                                s.name,
                                                                                                topPt.x,
                                                                                                topPt.y -
                                                                                                                        15
                                                                        );
                                                });

                                                // Draw proposed MQ queue queue connector canal link to the East district
                                                const pStart = project(190, 190);
                                                const pEnd = project(300, 0); // Railway station MQ link
                                                ctx.save();
                                                ctx.strokeStyle = 'rgba(52, 211, 153, 0.6)';
                                                ctx.lineWidth = 2.0;
                                                ctx.setLineDash([3, 5]);
                                                ctx.beginPath();
                                                ctx.moveTo(pStart.x, pStart.y);
                                                ctx.quadraticCurveTo(
                                                                        (pStart.x + pEnd.x) / 2,
                                                                        Math.min(pStart.y, pEnd.y) -
                                                                                                40 *
                                                                                                                        zoom,
                                                                        pEnd.x,
                                                                        pEnd.y
                                                );
                                                ctx.stroke();
                                                ctx.restore();
                        };

                        // Software Satellite View: Organization Enterprise Map (Feature 16)
                        const drawSatelliteView = (
                                                ctx: CanvasRenderingContext2D,
                                                width: number,
                                                height: number
                        ) => {
                                                // 4 cities configurations representing microservice repositories
                                                const cities = [
                                                                        {
                                                                                                id: 'codeatlas',
                                                                                                name: 'CodeAtlas (Backend)',
                                                                                                x: -220,
                                                                                                y: -160,
                                                                                                color: '#38BDF8',
                                                                                                towerColors: [
                                                                                                                        '#10B981',
                                                                                                                        '#3B82F6',
                                                                                                                        '#10B981',
                                                                                                ],
                                                                                                desc: 'Core backend repository. Health: 85%',
                                                                        },
                                                                        {
                                                                                                id: 'payments',
                                                                                                name: 'Payment Gateway',
                                                                                                x: 220,
                                                                                                y: -160,
                                                                                                color: '#A855F7',
                                                                                                towerColors: [
                                                                                                                        '#C084FC',
                                                                                                                        '#3B82F6',
                                                                                                ],
                                                                                                desc: 'Payment Vault microservice. Health: 92%',
                                                                        },
                                                                        {
                                                                                                id: 'billing',
                                                                                                name: 'Billing Monolith',
                                                                                                x: 220,
                                                                                                y: 160,
                                                                                                color: '#F97316',
                                                                                                towerColors: [
                                                                                                                        '#EF4444',
                                                                                                                        '#EF4444',
                                                                                                                        '#F97316',
                                                                                                ],
                                                                                                desc: 'Legacy billing processor. Health: 48%',
                                                                        },
                                                                        {
                                                                                                id: 'notifications',
                                                                                                name: 'Notification Service',
                                                                                                x: -220,
                                                                                                y: 160,
                                                                                                color: '#10B981',
                                                                                                towerColors: [
                                                                                                                        '#10B981',
                                                                                                                        '#10B981',
                                                                                                ],
                                                                                                desc: 'Queue listener & mailer. Health: 96%',
                                                                        },
                                                ];

                                                // 1. Draw inter-repository highways
                                                ctx.lineWidth = 3.5 * zoom;
                                                ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
                                                ctx.setLineDash([4, 6]);

                                                // Draw circular connecting loop
                                                ctx.beginPath();
                                                const pA = project(cities[0].x, cities[0].y);
                                                const pB = project(cities[1].x, cities[1].y);
                                                const pC = project(cities[2].x, cities[2].y);
                                                const pD = project(cities[3].x, cities[3].y);

                                                ctx.moveTo(pA.x, pA.y);
                                                ctx.quadraticCurveTo(
                                                                        (pA.x + pB.x) / 2,
                                                                        Math.min(pA.y, pB.y) -
                                                                                                50 *
                                                                                                                        zoom,
                                                                        pB.x,
                                                                        pB.y
                                                );
                                                ctx.quadraticCurveTo(
                                                                        (pB.x + pC.x) / 2,
                                                                        (pB.y + pC.y) / 2,
                                                                        pC.x,
                                                                        pC.y
                                                );
                                                ctx.quadraticCurveTo(
                                                                        (pC.x + pD.x) / 2,
                                                                        Math.max(pC.y, pD.y) +
                                                                                                50 *
                                                                                                                        zoom,
                                                                        pD.x,
                                                                        pD.y
                                                );
                                                ctx.quadraticCurveTo(
                                                                        (pD.x + pA.x) / 2,
                                                                        (pD.y + pA.y) / 2,
                                                                        pA.x,
                                                                        pA.y
                                                );
                                                ctx.stroke();
                                                ctx.setLineDash([]); // Reset dash

                                                // Animate satellite highway request dots
                                                const travel = (animationTick * 0.004) % 1.0;
                                                const drawTravelingSpark = (
                                                                        start: {
                                                                                                x: number;
                                                                                                y: number;
                                                                        },
                                                                        end: {
                                                                                                x: number;
                                                                                                y: number;
                                                                        },
                                                                        curveOffset: number
                                                ) => {
                                                                        const midX =
                                                                                                start.x +
                                                                                                (end.x -
                                                                                                                        start.x) *
                                                                                                                        travel;
                                                                        const midY =
                                                                                                start.y +
                                                                                                (end.y -
                                                                                                                        start.y) *
                                                                                                                        travel -
                                                                                                Math.sin(
                                                                                                                        travel *
                                                                                                                                                Math.PI
                                                                                                ) *
                                                                                                                        curveOffset *
                                                                                                                        zoom;
                                                                        ctx.beginPath();
                                                                        ctx.arc(
                                                                                                midX,
                                                                                                midY,
                                                                                                3.5 *
                                                                                                                        zoom,
                                                                                                0,
                                                                                                Math.PI *
                                                                                                                        2
                                                                        );
                                                                        ctx.fillStyle = '#67E8F9';
                                                                        ctx.fill();
                                                };
                                                drawTravelingSpark(pA, pB, 50);
                                                drawTravelingSpark(pB, pC, 0);
                                                drawTravelingSpark(pC, pD, -50);
                                                drawTravelingSpark(pD, pA, 0);

                                                // 2. Draw each repository city
                                                cities.forEach((c) => {
                                                                        const pt = project(
                                                                                                c.x,
                                                                                                c.y
                                                                        );
                                                                        const rad = 65 * zoom;

                                                                        // Base boundary circle
                                                                        ctx.fillStyle =
                                                                                                'rgba(15, 23, 42, 0.8)';
                                                                        ctx.strokeStyle = c.color;
                                                                        ctx.lineWidth = 2 * zoom;
                                                                        ctx.beginPath();
                                                                        ctx.arc(
                                                                                                pt.x,
                                                                                                pt.y,
                                                                                                rad,
                                                                                                0,
                                                                                                Math.PI *
                                                                                                                        2
                                                                        );
                                                                        ctx.fill();
                                                                        ctx.stroke();

                                                                        // Pulsing glow rings around the city bases
                                                                        const pulse = Math.abs(
                                                                                                Math.sin(
                                                                                                                        animationTick *
                                                                                                                                                0.04
                                                                                                )
                                                                        );
                                                                        ctx.strokeStyle = c.color;
                                                                        ctx.lineWidth = 0.8;
                                                                        ctx.beginPath();
                                                                        ctx.arc(
                                                                                                pt.x,
                                                                                                pt.y,
                                                                                                rad +
                                                                                                                        pulse *
                                                                                                                                                12 *
                                                                                                                                                zoom,
                                                                                                0,
                                                                                                Math.PI *
                                                                                                                        2
                                                                        );
                                                                        ctx.stroke();

                                                                        // Draw simplified towers inside the repository base circle
                                                                        c.towerColors.forEach(
                                                                                                (
                                                                                                                        tColor,
                                                                                                                        idx
                                                                                                ) => {
                                                                                                                        const offsetAngle =
                                                                                                                                                (idx *
                                                                                                                                                                        Math.PI *
                                                                                                                                                                        2) /
                                                                                                                                                c
                                                                                                                                                                        .towerColors
                                                                                                                                                                        .length;
                                                                                                                        const tx =
                                                                                                                                                c.x +
                                                                                                                                                Math.cos(
                                                                                                                                                                        offsetAngle
                                                                                                                                                ) *
                                                                                                                                                                        25;
                                                                                                                        const ty =
                                                                                                                                                c.y +
                                                                                                                                                Math.sin(
                                                                                                                                                                        offsetAngle
                                                                                                                                                ) *
                                                                                                                                                                        12;
                                                                                                                        const tPt =
                                                                                                                                                project(
                                                                                                                                                                        tx,
                                                                                                                                                                        ty
                                                                                                                                                );
                                                                                                                        const tH =
                                                                                                                                                (35 +
                                                                                                                                                                        idx *
                                                                                                                                                                                                12) *
                                                                                                                                                zoom;
                                                                                                                        const tW =
                                                                                                                                                8 *
                                                                                                                                                zoom;

                                                                                                                        // Draw tower columns
                                                                                                                        ctx.fillStyle =
                                                                                                                                                tColor;
                                                                                                                        ctx.fillRect(
                                                                                                                                                tPt.x -
                                                                                                                                                                        tW /
                                                                                                                                                                                                2,
                                                                                                                                                tPt.y -
                                                                                                                                                                        tH,
                                                                                                                                                tW,
                                                                                                                                                tH
                                                                                                                        );

                                                                                                                        ctx.strokeStyle =
                                                                                                                                                'rgba(255, 255, 255, 0.15)';
                                                                                                                        ctx.strokeRect(
                                                                                                                                                tPt.x -
                                                                                                                                                                        tW /
                                                                                                                                                                                                2,
                                                                                                                                                tPt.y -
                                                                                                                                                                        tH,
                                                                                                                                                tW,
                                                                                                                                                tH
                                                                                                                        );
                                                                                                }
                                                                        );

                                                                        // Name tags
                                                                        ctx.fillStyle = '#FFFFFF';
                                                                        ctx.font =
                                                                                                'bold 9px monospace';
                                                                        ctx.textAlign = 'center';
                                                                        ctx.fillText(
                                                                                                c.name.toUpperCase(),
                                                                                                pt.x,
                                                                                                pt.y -
                                                                                                                        rad -
                                                                                                                        8
                                                                        );

                                                                        // Tooltip Card popup on hover
                                                                        const isHovered =
                                                                                                hoveredEntity &&
                                                                                                hoveredEntity.type ===
                                                                                                                        'repository' &&
                                                                                                hoveredEntity.id ===
                                                                                                                        c.id;

                                                                        if (isHovered) {
                                                                                                ctx.strokeStyle =
                                                                                                                        c.color;
                                                                                                ctx.lineWidth = 2;
                                                                                                ctx.beginPath();
                                                                                                ctx.arc(
                                                                                                                        pt.x,
                                                                                                                        pt.y,
                                                                                                                        rad,
                                                                                                                        0,
                                                                                                                        Math.PI *
                                                                                                                                                2
                                                                                                );
                                                                                                ctx.stroke();

                                                                                                // Draw tooltip modal
                                                                                                ctx.fillStyle =
                                                                                                                        'rgba(15, 23, 42, 0.95)';
                                                                                                ctx.fillRect(
                                                                                                                        pt.x -
                                                                                                                                                90,
                                                                                                                        pt.y -
                                                                                                                                                48,
                                                                                                                        180,
                                                                                                                        42
                                                                                                );
                                                                                                ctx.strokeStyle =
                                                                                                                        c.color;
                                                                                                ctx.lineWidth = 1.2;
                                                                                                ctx.strokeRect(
                                                                                                                        pt.x -
                                                                                                                                                90,
                                                                                                                        pt.y -
                                                                                                                                                48,
                                                                                                                        180,
                                                                                                                        42
                                                                                                );

                                                                                                ctx.fillStyle =
                                                                                                                        '#FFFFFF';
                                                                                                ctx.font =
                                                                                                                        'bold 8px monospace';
                                                                                                ctx.fillText(
                                                                                                                        c.name,
                                                                                                                        pt.x,
                                                                                                                        pt.y -
                                                                                                                                                37
                                                                                                );

                                                                                                ctx.fillStyle =
                                                                                                                        '#94A3B8';
                                                                                                ctx.font =
                                                                                                                        '7px sans-serif';
                                                                                                ctx.fillText(
                                                                                                                        c.desc,
                                                                                                                        pt.x,
                                                                                                                        pt.y -
                                                                                                                                                25
                                                                                                );
                                                                                                ctx.fillStyle =
                                                                                                                        '#10B981';
                                                                                                ctx.font =
                                                                                                                        'bold 7px monospace';
                                                                                                ctx.fillText(
                                                                                                                        'TELEPORT: CLICK TO INFILTRATE',
                                                                                                                        pt.x,
                                                                                                                        pt.y -
                                                                                                                                                14
                                                                                                );
                                                                        }
                                                });

                                                // Satellite view title HUD
                                                ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
                                                ctx.fillRect(10, 10, 240, 56);
                                                ctx.strokeStyle = '#10B981';
                                                ctx.lineWidth = 1;
                                                ctx.strokeRect(10, 10, 240, 56);

                                                ctx.fillStyle = '#10B981';
                                                ctx.font = 'bold 10px monospace';
                                                ctx.textAlign = 'left';
                                                ctx.fillText(
                                                                        'SATELLITE VIEW: ENTERPRISE MAP',
                                                                        20,
                                                                        23
                                                );

                                                ctx.fillStyle = '#FFFFFF';
                                                ctx.font = '9px monospace';
                                                ctx.fillText(
                                                                        'Hover city for details | Click to inspect',
                                                                        20,
                                                                        37
                                                );
                                                ctx.fillText(
                                                                        'Connected nodes: 4 Active Repositories',
                                                                        20,
                                                                        50
                                                );
                        };

                        // Mouse drag & select interactions
                        const handleMouseDown = (e: React.MouseEvent) => {
                                                setIsDragging(true);
                                                setDragStart({
                                                                        x: e.clientX - pan.x,
                                                                        y: e.clientY - pan.y,
                                                });
                        };

                        const handleMouseMove = (e: React.MouseEvent) => {
                                                const canvas = canvasRef.current;
                                                if (!canvas) return;

                                                const rect = canvas.getBoundingClientRect();
                                                const x = e.clientX - rect.left;
                                                const y = e.clientY - rect.top;

                                                if (isDragging) {
                                                                        setPan({
                                                                                                x:
                                                                                                                        e.clientX -
                                                                                                                        dragStart.x,
                                                                                                y:
                                                                                                                        e.clientY -
                                                                                                                        dragStart.y,
                                                                        });
                                                } else {
                                                                        let found = false;

                                                                        if (isSatelliteView) {
                                                                                                const cities =
                                                                                                                        [
                                                                                                                                                {
                                                                                                                                                                        id: 'codeatlas',
                                                                                                                                                                        name: 'CodeAtlas (Backend)',
                                                                                                                                                                        x: -220,
                                                                                                                                                                        y: -160,
                                                                                                                                                },
                                                                                                                                                {
                                                                                                                                                                        id: 'payments',
                                                                                                                                                                        name: 'Payment Gateway',
                                                                                                                                                                        x: 220,
                                                                                                                                                                        y: -160,
                                                                                                                                                },
                                                                                                                                                {
                                                                                                                                                                        id: 'billing',
                                                                                                                                                                        name: 'Billing Monolith',
                                                                                                                                                                        x: 220,
                                                                                                                                                                        y: 160,
                                                                                                                                                },
                                                                                                                                                {
                                                                                                                                                                        id: 'notifications',
                                                                                                                                                                        name: 'Notification Service',
                                                                                                                                                                        x: -220,
                                                                                                                                                                        y: 160,
                                                                                                                                                },
                                                                                                                        ];
                                                                                                cities.forEach(
                                                                                                                        (
                                                                                                                                                c
                                                                                                                        ) => {
                                                                                                                                                if (
                                                                                                                                                                        found
                                                                                                                                                )
                                                                                                                                                                        return;
                                                                                                                                                const pt =
                                                                                                                                                                        project(
                                                                                                                                                                                                c.x,
                                                                                                                                                                                                c.y
                                                                                                                                                                        );
                                                                                                                                                const dist =
                                                                                                                                                                        Math.hypot(
                                                                                                                                                                                                pt.x -
                                                                                                                                                                                                                        x,
                                                                                                                                                                                                pt.y -
                                                                                                                                                                                                                        y
                                                                                                                                                                        );
                                                                                                                                                if (
                                                                                                                                                                        dist <
                                                                                                                                                                        75 *
                                                                                                                                                                                                zoom
                                                                                                                                                ) {
                                                                                                                                                                        setHoveredEntity(
                                                                                                                                                                                                {
                                                                                                                                                                                                                        id: c.id,
                                                                                                                                                                                                                        name: c.name,
                                                                                                                                                                                                                        type: 'repository',
                                                                                                                                                                                                                        screenX: pt.x,
                                                                                                                                                                                                                        screenY: pt.y,
                                                                                                                                                                                                }
                                                                                                                                                                        );
                                                                                                                                                                        found = true;
                                                                                                                                                }
                                                                                                                        }
                                                                                                );
                                                                                                if (
                                                                                                                        !found
                                                                                                ) {
                                                                                                                        setHoveredEntity(
                                                                                                                                                null
                                                                                                                        );
                                                                                                }
                                                                                                return;
                                                                        }

                                                                        const layouts =
                                                                                                layoutCacheRef.current;

                                                                        if (layouts?.buildings) {
                                                                                                Object.keys(
                                                                                                                        layouts.buildings
                                                                                                ).forEach(
                                                                                                                        (
                                                                                                                                                bId: string
                                                                                                                        ) => {
                                                                                                                                                if (
                                                                                                                                                                        found
                                                                                                                                                )
                                                                                                                                                                        return;
                                                                                                                                                const b =
                                                                                                                                                                        layouts
                                                                                                                                                                                                .buildings[
                                                                                                                                                                                                bId
                                                                                                                                                                        ];
                                                                                                                                                const pt =
                                                                                                                                                                        project(
                                                                                                                                                                                                b.x,
                                                                                                                                                                                                b.y,
                                                                                                                                                                                                b.height /
                                                                                                                                                                                                                        2
                                                                                                                                                                        );
                                                                                                                                                const dist =
                                                                                                                                                                        Math.hypot(
                                                                                                                                                                                                pt.x -
                                                                                                                                                                                                                        x,
                                                                                                                                                                                                pt.y -
                                                                                                                                                                                                                        y
                                                                                                                                                                        );

                                                                                                                                                if (
                                                                                                                                                                        dist <
                                                                                                                                                                        22 *
                                                                                                                                                                                                zoom
                                                                                                                                                ) {
                                                                                                                                                                        setHoveredEntity(
                                                                                                                                                                                                {
                                                                                                                                                                                                                        ...b.entity,
                                                                                                                                                                                                                        id: bId,
                                                                                                                                                                                                                        screenX: pt.x,
                                                                                                                                                                                                                        screenY: pt.y,
                                                                                                                                                                                                                        rawX: x,
                                                                                                                                                                                                                        rawY: y,
                                                                                                                                                                                                }
                                                                                                                                                                        );
                                                                                                                                                                        found = true;
                                                                                                                                                }
                                                                                                                        }
                                                                                                );
                                                                        }

                                                                        if (
                                                                                                !found &&
                                                                                                layouts?.landmarks
                                                                        ) {
                                                                                                Object.keys(
                                                                                                                        layouts.landmarks
                                                                                                ).forEach(
                                                                                                                        (
                                                                                                                                                lId: string
                                                                                                                        ) => {
                                                                                                                                                if (
                                                                                                                                                                        found
                                                                                                                                                )
                                                                                                                                                                        return;
                                                                                                                                                const mark =
                                                                                                                                                                        layouts
                                                                                                                                                                                                .landmarks[
                                                                                                                                                                                                lId
                                                                                                                                                                        ];
                                                                                                                                                const pt =
                                                                                                                                                                        project(
                                                                                                                                                                                                mark.x,
                                                                                                                                                                                                mark.y
                                                                                                                                                                        );
                                                                                                                                                const dist =
                                                                                                                                                                        Math.hypot(
                                                                                                                                                                                                pt.x -
                                                                                                                                                                                                                        x,
                                                                                                                                                                                                pt.y -
                                                                                                                                                                                                                        y
                                                                                                                                                                        );

                                                                                                                                                if (
                                                                                                                                                                        dist <
                                                                                                                                                                        18 *
                                                                                                                                                                                                zoom
                                                                                                                                                ) {
                                                                                                                                                                        setHoveredEntity(
                                                                                                                                                                                                {
                                                                                                                                                                                                                        ...mark.entity,
                                                                                                                                                                                                                        screenX: pt.x,
                                                                                                                                                                                                                        screenY: pt.y,
                                                                                                                                                                                                                        type: mark.type,
                                                                                                                                                                                                }
                                                                                                                                                                        );
                                                                                                                                                                        found = true;
                                                                                                                                                }
                                                                                                                        }
                                                                                                );
                                                                        }

                                                                        if (!found) {
                                                                                                setHoveredEntity(
                                                                                                                        null
                                                                                                );
                                                                        }
                                                }
                        };

                        const handleMouseUp = () => {
                                                setIsDragging(false);
                        };

                        const handleClick = () => {
                                                if (
                                                                        isSatelliteView &&
                                                                        hoveredEntity &&
                                                                        hoveredEntity.type ===
                                                                                                'repository'
                                                ) {
                                                                        if (onSelectRepository) {
                                                                                                onSelectRepository(
                                                                                                                        hoveredEntity.id
                                                                                                );
                                                                        }
                                                                        return;
                                                }
                                                if (hoveredEntity) {
                                                                        onSelectBuilding(
                                                                                                hoveredEntity
                                                                        );
                                                }
                        };

                        const handleWheel = (e: React.WheelEvent) => {
                                                e.preventDefault();
                                                const newZoom = Math.min(
                                                                        2.5,
                                                                        Math.max(
                                                                                                0.4,
                                                                                                zoom -
                                                                                                                        e.deltaY *
                                                                                                                                                0.001
                                                                        )
                                                );
                                                setZoom(newZoom);
                        };

                        return (
                                                <div
                                                                        ref={containerRef}
                                                                        className="relative w-full h-full min-h-[500px] bg-slate-950 border border-slate-900 rounded-lg overflow-hidden select-none"
                                                >
                                                                        <canvas
                                                                                                ref={
                                                                                                                        canvasRef
                                                                                                }
                                                                                                onMouseDown={
                                                                                                                        handleMouseDown
                                                                                                }
                                                                                                onMouseMove={
                                                                                                                        handleMouseMove
                                                                                                }
                                                                                                onMouseUp={
                                                                                                                        handleMouseUp
                                                                                                }
                                                                                                onClick={
                                                                                                                        handleClick
                                                                                                }
                                                                                                onWheel={
                                                                                                                        handleWheel
                                                                                                }
                                                                                                className="w-full h-full block cursor-grab active:cursor-grabbing"
                                                                        />

                                                                        {/* Control Buttons */}
                                                                        <div className="absolute right-4 bottom-4 flex flex-col gap-2 bg-slate-900/90 border border-slate-800 p-2 rounded-md backdrop-blur-sm">
                                                                                                <button
                                                                                                                        onClick={() =>
                                                                                                                                                setZoom(
                                                                                                                                                                        (
                                                                                                                                                                                                z
                                                                                                                                                                        ) =>
                                                                                                                                                                                                Math.min(
                                                                                                                                                                                                                        2.5,
                                                                                                                                                                                                                        z +
                                                                                                                                                                                                                                                0.1
                                                                                                                                                                                                )
                                                                                                                                                )
                                                                                                                        }
                                                                                                                        className="w-8 h-8 rounded border border-slate-700 hover:bg-slate-800 flex items-center justify-center font-bold text-white text-sm"
                                                                                                                        title="Zoom In"
                                                                                                >
                                                                                                                        +
                                                                                                </button>
                                                                                                <button
                                                                                                                        onClick={() =>
                                                                                                                                                setZoom(
                                                                                                                                                                        (
                                                                                                                                                                                                z
                                                                                                                                                                        ) =>
                                                                                                                                                                                                Math.max(
                                                                                                                                                                                                                        0.4,
                                                                                                                                                                                                                        z -
                                                                                                                                                                                                                                                0.1
                                                                                                                                                                                                )
                                                                                                                                                )
                                                                                                                        }
                                                                                                                        className="w-8 h-8 rounded border border-slate-700 hover:bg-slate-800 flex items-center justify-center font-bold text-white text-sm"
                                                                                                                        title="Zoom Out"
                                                                                                >
                                                                                                                        -
                                                                                                </button>
                                                                                                <button
                                                                                                                        onClick={() => {
                                                                                                                                                if (
                                                                                                                                                                        canvasRef.current
                                                                                                                                                ) {
                                                                                                                                                                        setPan(
                                                                                                                                                                                                {
                                                                                                                                                                                                                        x:
                                                                                                                                                                                                                                                canvasRef
                                                                                                                                                                                                                                                                        .current
                                                                                                                                                                                                                                                                        .width /
                                                                                                                                                                                                                                                2,
                                                                                                                                                                                                                        y:
                                                                                                                                                                                                                                                canvasRef
                                                                                                                                                                                                                                                                        .current
                                                                                                                                                                                                                                                                        .height /
                                                                                                                                                                                                                                                3,
                                                                                                                                                                                                }
                                                                                                                                                                        );
                                                                                                                                                                        setZoom(
                                                                                                                                                                                                0.9
                                                                                                                                                                        );
                                                                                                                                                }
                                                                                                                        }}
                                                                                                                        className="px-2 py-1 text-[10px] uppercase tracking-wider rounded border border-slate-700 hover:bg-slate-800 font-mono text-white text-center"
                                                                                                                        title="Recenter Camera"
                                                                                                >
                                                                                                                        Reset
                                                                                                </button>
                                                                        </div>

                                                                        {/* Interactive Legend overlay */}
                                                                        <div className="absolute left-4 bottom-4 bg-slate-900/90 border border-slate-800 px-3 py-2 rounded-md backdrop-blur-sm pointer-events-none">
                                                                                                <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider mb-1">
                                                                                                                        Grid
                                                                                                                        Blueprint
                                                                                                </div>
                                                                                                <div className="flex flex-col gap-1 text-[9px] font-mono text-slate-300">
                                                                                                                        <div className="flex items-center gap-1.5">
                                                                                                                                                <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block"></span>
                                                                                                                                                Green
                                                                                                                                                Building:
                                                                                                                                                Healthy
                                                                                                                        </div>
                                                                                                                        <div className="flex items-center gap-1.5">
                                                                                                                                                <span className="w-2.5 h-2.5 rounded bg-blue-500 inline-block"></span>
                                                                                                                                                Blue
                                                                                                                                                Building:
                                                                                                                                                Tested
                                                                                                                        </div>
                                                                                                                        <div className="flex items-center gap-1.5">
                                                                                                                                                <span className="w-2.5 h-2.5 rounded bg-red-500 inline-block"></span>
                                                                                                                                                Red
                                                                                                                                                Building:
                                                                                                                                                High
                                                                                                                                                Debt
                                                                                                                        </div>
                                                                                                                        <div className="flex items-center gap-1.5">
                                                                                                                                                <span className="w-2.5 h-2.5 rounded bg-amber-500 inline-block"></span>
                                                                                                                                                Landmarks:
                                                                                                                                                Services
                                                                                                                        </div>
                                                                                                </div>
                                                                        </div>
                                                </div>
                        );
}
