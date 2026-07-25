'use client';

import React, { useState } from 'react';
import {
                        Globe,
                        Sun,
                        CloudRain,
                        Rocket,
                        Heart,
                        MessageSquare,
                        Trophy,
                        Activity,
                        Compass,
                        Sliders,
                        Users,
                        Shield,
                        Zap,
                        Play,
                        Cpu,
                        Layers,
                        Sparkles,
                        Flame,
                        Award,
                        Box,
                        MapPin,
                        CheckCircle2,
                        AlertTriangle,
                        RotateCw,
} from 'lucide-react';

export default function VisualExperiencePage() {
                        const [activeTab, setActiveTab] = useState('mission'); // mission, city, weather, rocket, debate, game, dna
                        const [scaleTarget, setScaleTarget] = useState('10M Users');
                        const [timePortalYear, setTimePortalYear] = useState('2026');

                        const weatherState = {
                                                overall: '⛅ Moderate Risk (Partly Cloudy)',
                                                temperature: '64% Tech Debt Density',
                                                forecasts: [
                                                                        {
                                                                                                repo: 'auth-service-v1',
                                                                                                icon: '☀',
                                                                                                cond: 'Sunny & Healthy',
                                                                                                color: 'text-emerald-400',
                                                                        },
                                                                        {
                                                                                                repo: 'checkout-service',
                                                                                                icon: '⛅',
                                                                                                cond: 'Partly Cloudy',
                                                                                                color: 'text-amber-400',
                                                                        },
                                                                        {
                                                                                                repo: 'analytics-ingestion',
                                                                                                icon: '🌧',
                                                                                                cond: 'Rainy (Tech Debt)',
                                                                                                color: 'text-orange-400',
                                                                        },
                                                                        {
                                                                                                repo: 'legacy-payment-gateway',
                                                                                                icon: '🌩',
                                                                                                cond: 'Thunderstorm (Critical)',
                                                                                                color: 'text-red-400',
                                                                        },
                                                ],
                        };

                        const heartbeats = [
                                                {
                                                                        name: 'Auth Vault',
                                                                        status: 'HEALTHY',
                                                                        pulse: '❤️ ❤️ ❤️ ❤️',
                                                                        latency: '18ms',
                                                                        rpm: '45,000',
                                                },
                                                {
                                                                        name: 'Checkout API',
                                                                        status: 'HEALTHY',
                                                                        pulse: '❤️ ❤️ ❤️',
                                                                        latency: '42ms',
                                                                        rpm: '18,500',
                                                },
                                                {
                                                                        name: 'Orders Router',
                                                                        status: 'SLOW',
                                                                        pulse: '❤️ ❤️',
                                                                        latency: '140ms',
                                                                        rpm: '12,000',
                                                },
                                                {
                                                                        name: 'Payment Gateway',
                                                                        status: 'FAILURE_RISK',
                                                                        pulse: '💔',
                                                                        latency: '480ms',
                                                                        rpm: '2,400',
                                                },
                        ];

                        const cityDistricts = [
                                                {
                                                                        name: 'Authentication District',
                                                                        buildings: 14,
                                                                        roads: 8,
                                                                        traffic: 'LOW',
                                                                        status: 'HEALTHY',
                                                },
                                                {
                                                                        name: 'Payments & Billing District',
                                                                        buildings: 28,
                                                                        roads: 16,
                                                                        traffic: 'MODERATE',
                                                                        status: 'HEALTHY',
                                                },
                                                {
                                                                        name: 'Analytics & Telemetry District',
                                                                        buildings: 22,
                                                                        roads: 12,
                                                                        traffic: 'HIGH (Debt)',
                                                                        status: 'WARNING',
                                                },
                        ];

                        const debateTranscript = [
                                                {
                                                                        speaker: 'AI CTO Agent',
                                                                        avatar: '👑',
                                                                        msg: 'I recommend decoupling payment gateway logic into an independent Go microservice.',
                                                                        bubble: 'Payment service coupling is slowing down deployments across 3 teams.',
                                                },
                                                {
                                                                        speaker: 'Security Agent',
                                                                        avatar: '🛡️',
                                                                        msg: 'Approved, provided all session tokens use mTLS sidecar proxies and encrypted payloads.',
                                                                        bubble: 'Ensure PCI-DSS compliance & TLS 1.3 encryption.',
                                                },
                                                {
                                                                        speaker: 'Performance Agent',
                                                                        avatar: '⚡',
                                                                        msg: 'Add Redis L2 cache for payment token validation to maintain p95 latency under 45ms.',
                                                                        bubble: 'Synchronous HTTP calls will introduce latency bottlenecks.',
                                                },
                                                {
                                                                        speaker: 'Database Architect',
                                                                        avatar: '💾',
                                                                        msg: "Include read-replica connection pool and index on 'payment_tokens(user_id, status)'.",
                                                                        bubble: 'Primary DB IOPS is near limit. Read replicas required.',
                                                },
                        ];

                        const achievements = [
                                                {
                                                                        title: '🏅 God Object Destroyer',
                                                                        desc: 'Refactored monolithic class > 1,500 lines into 4 modular micro-components.',
                                                                        unlocked: true,
                                                },
                                                {
                                                                        title: '🏅 Architecture Guardian',
                                                                        desc: 'Enforced zero-trust mTLS policy across 100% of microservice endpoints.',
                                                                        unlocked: true,
                                                },
                                                {
                                                                        title: '🏅 Dependency Slayer',
                                                                        desc: 'Eliminated 5 circular dependencies and 12 unused third-party packages.',
                                                                        unlocked: true,
                                                },
                                                {
                                                                        title: '🏅 Test Master',
                                                                        desc: 'Increased automated test coverage from 68% to 92% across all repos.',
                                                                        unlocked: true,
                                                },
                        ];

                        const codeDna = {
                                                reliability: 94,
                                                performance: 88,
                                                architecture: 96,
                                                security: 92,
                                                rating: 'AAA+ Enterprise Grade',
                        };

                        return (
                                                <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
                                                                        {/* Header */}
                                                                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-800 pb-6 mb-8 gap-4">
                                                                                                <div>
                                                                                                                        <div className="flex items-center gap-3 mb-2">
                                                                                                                                                <div className="p-2.5 bg-gradient-to-r from-cyan-600 to-indigo-600 rounded-xl text-white">
                                                                                                                                                                        <Globe className="w-8 h-8" />
                                                                                                                                                </div>
                                                                                                                                                <div>
                                                                                                                                                                        <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-md border border-cyan-500/20">
                                                                                                                                                                                                Visual
                                                                                                                                                                                                &
                                                                                                                                                                                                Interactive
                                                                                                                                                                                                Experience
                                                                                                                                                                                                Suite
                                                                                                                                                                                                •
                                                                                                                                                                                                20
                                                                                                                                                                                                Features
                                                                                                                                                                        </span>
                                                                                                                                                                        <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
                                                                                                                                                                                                Visual
                                                                                                                                                                                                Engineering
                                                                                                                                                                                                Galaxy
                                                                                                                                                                                                &
                                                                                                                                                                                                Simulation
                                                                                                                                                                                                World
                                                                                                                                                                        </h1>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                                        <p className="text-slate-400 text-sm max-w-3xl">
                                                                                                                                                Software
                                                                                                                                                Universe,
                                                                                                                                                3D
                                                                                                                                                Software
                                                                                                                                                City,
                                                                                                                                                Technical
                                                                                                                                                Debt
                                                                                                                                                Weather,
                                                                                                                                                Rocket
                                                                                                                                                Launch
                                                                                                                                                Simulator,
                                                                                                                                                Live
                                                                                                                                                Service
                                                                                                                                                Heartbeats,
                                                                                                                                                AI
                                                                                                                                                Debate
                                                                                                                                                Theater,
                                                                                                                                                NASA
                                                                                                                                                Mission
                                                                                                                                                Control,
                                                                                                                                                and
                                                                                                                                                Gamified
                                                                                                                                                Achievements.
                                                                                                                        </p>
                                                                                                </div>
                                                                        </div>

                                                                        {/* Tabs */}
                                                                        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-8 overflow-x-auto">
                                                                                                <button
                                                                                                                        onClick={() =>
                                                                                                                                                setActiveTab(
                                                                                                                                                                        'mission'
                                                                                                                                                )
                                                                                                                        }
                                                                                                                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                                                                                                                                                activeTab ===
                                                                                                                                                'mission'
                                                                                                                                                                        ? 'bg-cyan-600 text-white'
                                                                                                                                                                        : 'bg-slate-900 text-slate-400 hover:text-white'
                                                                                                                        }`}
                                                                                                >
                                                                                                                        <Compass className="w-4 h-4" />{' '}
                                                                                                                        🛰
                                                                                                                        NASA
                                                                                                                        Mission
                                                                                                                        Control
                                                                                                </button>
                                                                                                <button
                                                                                                                        onClick={() =>
                                                                                                                                                setActiveTab(
                                                                                                                                                                        'city'
                                                                                                                                                )
                                                                                                                        }
                                                                                                                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                                                                                                                                                activeTab ===
                                                                                                                                                'city'
                                                                                                                                                                        ? 'bg-cyan-600 text-white'
                                                                                                                                                                        : 'bg-slate-900 text-slate-400 hover:text-white'
                                                                                                                        }`}
                                                                                                >
                                                                                                                        <Globe className="w-4 h-4" />{' '}
                                                                                                                        🌆
                                                                                                                        Software
                                                                                                                        City
                                                                                                                        &
                                                                                                                        Earth
                                                                                                </button>
                                                                                                <button
                                                                                                                        onClick={() =>
                                                                                                                                                setActiveTab(
                                                                                                                                                                        'weather'
                                                                                                                                                )
                                                                                                                        }
                                                                                                                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                                                                                                                                                activeTab ===
                                                                                                                                                'weather'
                                                                                                                                                                        ? 'bg-cyan-600 text-white'
                                                                                                                                                                        : 'bg-slate-900 text-slate-400 hover:text-white'
                                                                                                                        }`}
                                                                                                >
                                                                                                                        <CloudRain className="w-4 h-4" />{' '}
                                                                                                                        🌧
                                                                                                                        Tech
                                                                                                                        Debt
                                                                                                                        Weather
                                                                                                                        &
                                                                                                                        Heartbeat
                                                                                                </button>
                                                                                                <button
                                                                                                                        onClick={() =>
                                                                                                                                                setActiveTab(
                                                                                                                                                                        'rocket'
                                                                                                                                                )
                                                                                                                        }
                                                                                                                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                                                                                                                                                activeTab ===
                                                                                                                                                'rocket'
                                                                                                                                                                        ? 'bg-cyan-600 text-white'
                                                                                                                                                                        : 'bg-slate-900 text-slate-400 hover:text-white'
                                                                                                                        }`}
                                                                                                >
                                                                                                                        <Rocket className="w-4 h-4" />{' '}
                                                                                                                        🚀
                                                                                                                        Rocket
                                                                                                                        Launch
                                                                                                                        Capacity
                                                                                                                        Simulator
                                                                                                </button>
                                                                                                <button
                                                                                                                        onClick={() =>
                                                                                                                                                setActiveTab(
                                                                                                                                                                        'debate'
                                                                                                                                                )
                                                                                                                        }
                                                                                                                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                                                                                                                                                activeTab ===
                                                                                                                                                'debate'
                                                                                                                                                                        ? 'bg-cyan-600 text-white'
                                                                                                                                                                        : 'bg-slate-900 text-slate-400 hover:text-white'
                                                                                                                        }`}
                                                                                                >
                                                                                                                        <MessageSquare className="w-4 h-4" />{' '}
                                                                                                                        🤖
                                                                                                                        AI
                                                                                                                        Debate
                                                                                                                        Theater
                                                                                                </button>
                                                                                                <button
                                                                                                                        onClick={() =>
                                                                                                                                                setActiveTab(
                                                                                                                                                                        'game'
                                                                                                                                                )
                                                                                                                        }
                                                                                                                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                                                                                                                                                activeTab ===
                                                                                                                                                'game'
                                                                                                                                                                        ? 'bg-cyan-600 text-white'
                                                                                                                                                                        : 'bg-slate-900 text-slate-400 hover:text-white'
                                                                                                                        }`}
                                                                                                >
                                                                                                                        <Trophy className="w-4 h-4" />{' '}
                                                                                                                        🏆
                                                                                                                        Mission
                                                                                                                        Mode
                                                                                                                        &
                                                                                                                        Achievements
                                                                                                </button>
                                                                                                <button
                                                                                                                        onClick={() =>
                                                                                                                                                setActiveTab(
                                                                                                                                                                        'dna'
                                                                                                                                                )
                                                                                                                        }
                                                                                                                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                                                                                                                                                activeTab ===
                                                                                                                                                'dna'
                                                                                                                                                                        ? 'bg-cyan-600 text-white'
                                                                                                                                                                        : 'bg-slate-900 text-slate-400 hover:text-white'
                                                                                                                        }`}
                                                                                                >
                                                                                                                        <Sparkles className="w-4 h-4" />{' '}
                                                                                                                        🧬
                                                                                                                        Code
                                                                                                                        DNA
                                                                                                                        &
                                                                                                                        Orbit
                                                                                                </button>
                                                                        </div>

                                                                        {/* TAB 1: NASA MISSION CONTROL */}
                                                                        {activeTab ===
                                                                                                'mission' && (
                                                                                                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
                                                                                                                        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                                                                                                                                                <div>
                                                                                                                                                                        <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                                                                                                                                                                                                <Compass className="w-5 h-5 text-cyan-400" />{' '}
                                                                                                                                                                                                Feature
                                                                                                                                                                                                15:
                                                                                                                                                                                                NASA-Style
                                                                                                                                                                                                Mission
                                                                                                                                                                                                Control
                                                                                                                                                                                                Dashboard
                                                                                                                                                                        </h2>
                                                                                                                                                                        <p className="text-slate-400 text-xs mt-0.5">
                                                                                                                                                                                                Real-time
                                                                                                                                                                                                status
                                                                                                                                                                                                indicators
                                                                                                                                                                                                for
                                                                                                                                                                                                Company
                                                                                                                                                                                                Health,
                                                                                                                                                                                                Active
                                                                                                                                                                                                Incidents,
                                                                                                                                                                                                Debt,
                                                                                                                                                                                                Deployments,
                                                                                                                                                                                                and
                                                                                                                                                                                                Scaling
                                                                                                                                                                                                Risk.
                                                                                                                                                                        </p>
                                                                                                                                                </div>
                                                                                                                                                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded border border-emerald-500/20">
                                                                                                                                                                        MISSION
                                                                                                                                                                        STATUS:
                                                                                                                                                                        OPERATIONAL
                                                                                                                                                </span>
                                                                                                                        </div>

                                                                                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                                                                                                                                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-center">
                                                                                                                                                                        <span className="text-xs text-slate-400 font-bold block mb-1">
                                                                                                                                                                                                Organization
                                                                                                                                                                                                Health
                                                                                                                                                                        </span>
                                                                                                                                                                        <span className="text-3xl font-extrabold text-emerald-400 block">
                                                                                                                                                                                                93.0%
                                                                                                                                                                        </span>
                                                                                                                                                </div>
                                                                                                                                                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-center">
                                                                                                                                                                        <span className="text-xs text-slate-400 font-bold block mb-1">
                                                                                                                                                                                                Active
                                                                                                                                                                                                Incidents
                                                                                                                                                                        </span>
                                                                                                                                                                        <span className="text-3xl font-extrabold text-cyan-400 block">
                                                                                                                                                                                                0
                                                                                                                                                                        </span>
                                                                                                                                                </div>
                                                                                                                                                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-center">
                                                                                                                                                                        <span className="text-xs text-slate-400 font-bold block mb-1">
                                                                                                                                                                                                Deployments
                                                                                                                                                                                                Today
                                                                                                                                                                        </span>
                                                                                                                                                                        <span className="text-3xl font-extrabold text-indigo-400 block">
                                                                                                                                                                                                5
                                                                                                                                                                        </span>
                                                                                                                                                </div>
                                                                                                                                                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-center">
                                                                                                                                                                        <span className="text-xs text-slate-400 font-bold block mb-1">
                                                                                                                                                                                                Scaling
                                                                                                                                                                                                Risk
                                                                                                                                                                        </span>
                                                                                                                                                                        <span className="text-3xl font-extrabold text-emerald-400 block">
                                                                                                                                                                                                LOW
                                                                                                                                                                        </span>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB 2: SOFTWARE CITY & EARTH */}
                                                                        {activeTab === 'city' && (
                                                                                                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
                                                                                                                        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                                                                                                                                                <div>
                                                                                                                                                                        <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                                                                                                                                                                                                <Globe className="w-5 h-5 text-indigo-400" />{' '}
                                                                                                                                                                                                Feature
                                                                                                                                                                                                2
                                                                                                                                                                                                &
                                                                                                                                                                                                16:
                                                                                                                                                                                                Living
                                                                                                                                                                                                Software
                                                                                                                                                                                                City
                                                                                                                                                                                                &
                                                                                                                                                                                                Software
                                                                                                                                                                                                Earth
                                                                                                                                                                        </h2>
                                                                                                                                                                        <p className="text-slate-400 text-xs mt-0.5">
                                                                                                                                                                                                Google
                                                                                                                                                                                                Maps
                                                                                                                                                                                                for
                                                                                                                                                                                                Code.
                                                                                                                                                                                                Zoom
                                                                                                                                                                                                from
                                                                                                                                                                                                Earth
                                                                                                                                                                                                ➔
                                                                                                                                                                                                Country
                                                                                                                                                                                                ➔
                                                                                                                                                                                                District
                                                                                                                                                                                                ➔
                                                                                                                                                                                                Building
                                                                                                                                                                                                (Class)
                                                                                                                                                                                                ➔
                                                                                                                                                                                                Room
                                                                                                                                                                                                (Function).
                                                                                                                                                                        </p>
                                                                                                                                                </div>
                                                                                                                        </div>

                                                                                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                                                                                                                {cityDistricts.map(
                                                                                                                                                                        (
                                                                                                                                                                                                dist,
                                                                                                                                                                                                idx
                                                                                                                                                                        ) => (
                                                                                                                                                                                                <div
                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                idx
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        className="p-5 bg-slate-950 border border-slate-800 rounded-xl"
                                                                                                                                                                                                >
                                                                                                                                                                                                                        <div className="flex items-center justify-between mb-2">
                                                                                                                                                                                                                                                <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                dist.name
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <span className="text-xs text-emerald-400 font-bold">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                dist.status
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                        <div className="space-y-1 text-xs text-slate-300">
                                                                                                                                                                                                                                                <div>
                                                                                                                                                                                                                                                                        🏢
                                                                                                                                                                                                                                                                        Buildings
                                                                                                                                                                                                                                                                        (Classes):{' '}
                                                                                                                                                                                                                                                                        <span className="font-bold text-white">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        dist.buildings
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <div>
                                                                                                                                                                                                                                                                        🛣️
                                                                                                                                                                                                                                                                        Roads
                                                                                                                                                                                                                                                                        (REST
                                                                                                                                                                                                                                                                        APIs):{' '}
                                                                                                                                                                                                                                                                        <span className="font-bold text-white">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        dist.roads
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <div>
                                                                                                                                                                                                                                                                        🚦
                                                                                                                                                                                                                                                                        Traffic
                                                                                                                                                                                                                                                                        (Tech
                                                                                                                                                                                                                                                                        Debt):{' '}
                                                                                                                                                                                                                                                                        <span className="font-bold text-amber-400">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        dist.traffic
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                </div>
                                                                                                                                                                        )
                                                                                                                                                )}
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB 3: TECH DEBT WEATHER & HEARTBEAT */}
                                                                        {activeTab ===
                                                                                                'weather' && (
                                                                                                <div className="space-y-6">
                                                                                                                        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
                                                                                                                                                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                                                                                                                                                                        <div>
                                                                                                                                                                                                <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                                                                                                                                                                                                                        <CloudRain className="w-5 h-5 text-amber-400" />{' '}
                                                                                                                                                                                                                        Feature
                                                                                                                                                                                                                        3:
                                                                                                                                                                                                                        Technical
                                                                                                                                                                                                                        Debt
                                                                                                                                                                                                                        Weather
                                                                                                                                                                                                                        System
                                                                                                                                                                                                </h2>
                                                                                                                                                                                                <p className="text-slate-400 text-xs mt-0.5">
                                                                                                                                                                                                                        Visual
                                                                                                                                                                                                                        weather
                                                                                                                                                                                                                        conditions
                                                                                                                                                                                                                        tracking
                                                                                                                                                                                                                        code
                                                                                                                                                                                                                        maintenance
                                                                                                                                                                                                                        humidity
                                                                                                                                                                                                                        and
                                                                                                                                                                                                                        debt
                                                                                                                                                                                                                        pressure.
                                                                                                                                                                                                </p>
                                                                                                                                                                        </div>
                                                                                                                                                                        <span className="text-sm font-extrabold text-amber-400 bg-amber-500/10 px-3 py-1 rounded border border-amber-500/20">
                                                                                                                                                                                                {
                                                                                                                                                                                                                        weatherState.overall
                                                                                                                                                                                                }
                                                                                                                                                                        </span>
                                                                                                                                                </div>

                                                                                                                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                                                                                                                                        {weatherState.forecasts.map(
                                                                                                                                                                                                (
                                                                                                                                                                                                                        fc,
                                                                                                                                                                                                                        idx
                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                        idx
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-center"
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                <span className="text-3xl block mb-2">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                fc.icon
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <span className="font-bold text-white text-sm block mb-1">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                fc.repo
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <span
                                                                                                                                                                                                                                                                        className={`text-xs font-bold ${fc.color}`}
                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                fc.cond
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                )
                                                                                                                                                                        )}
                                                                                                                                                </div>
                                                                                                                        </div>

                                                                                                                        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
                                                                                                                                                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                                                                                                                                                                        <div>
                                                                                                                                                                                                <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                                                                                                                                                                                                                        <Heart className="w-5 h-5 text-rose-400" />{' '}
                                                                                                                                                                                                                        Feature
                                                                                                                                                                                                                        6:
                                                                                                                                                                                                                        Live
                                                                                                                                                                                                                        Service
                                                                                                                                                                                                                        Heartbeat
                                                                                                                                                                                                                        Monitor
                                                                                                                                                                                                </h2>
                                                                                                                                                                                                <p className="text-slate-400 text-xs mt-0.5">
                                                                                                                                                                                                                        Real-time
                                                                                                                                                                                                                        pulse
                                                                                                                                                                                                                        monitor
                                                                                                                                                                                                                        for
                                                                                                                                                                                                                        all
                                                                                                                                                                                                                        microservices.
                                                                                                                                                                                                </p>
                                                                                                                                                                        </div>
                                                                                                                                                </div>

                                                                                                                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                                                                                                                                        {heartbeats.map(
                                                                                                                                                                                                (
                                                                                                                                                                                                                        hb,
                                                                                                                                                                                                                        idx
                                                                                                                                                                                                ) => (
                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                        idx
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-center"
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                <span className="text-xl block mb-2">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                hb.pulse
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <span className="font-bold text-white text-sm block">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                hb.name
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <span className="text-xs text-slate-400 block mb-1">
                                                                                                                                                                                                                                                                        p95:{' '}
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                hb.latency
                                                                                                                                                                                                                                                                        }{' '}
                                                                                                                                                                                                                                                                        |
                                                                                                                                                                                                                                                                        RPM:{' '}
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                hb.rpm
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 inline-block">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                hb.status
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                )
                                                                                                                                                                        )}
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB 4: ROCKET LAUNCH SIMULATOR */}
                                                                        {activeTab === 'rocket' && (
                                                                                                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
                                                                                                                        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                                                                                                                                                <div>
                                                                                                                                                                        <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                                                                                                                                                                                                <Rocket className="w-5 h-5 text-cyan-400" />{' '}
                                                                                                                                                                                                Feature
                                                                                                                                                                                                8:
                                                                                                                                                                                                Rocket
                                                                                                                                                                                                Launch
                                                                                                                                                                                                Scaling
                                                                                                                                                                                                Capacity
                                                                                                                                                                                                Simulator
                                                                                                                                                                        </h2>
                                                                                                                                                                        <p className="text-slate-400 text-xs mt-0.5">
                                                                                                                                                                                                Simulate
                                                                                                                                                                                                scaling
                                                                                                                                                                                                from
                                                                                                                                                                                                100K
                                                                                                                                                                                                ➔
                                                                                                                                                                                                10M
                                                                                                                                                                                                ➔
                                                                                                                                                                                                100M
                                                                                                                                                                                                users.
                                                                                                                                                                                                Watch
                                                                                                                                                                                                server
                                                                                                                                                                                                expansion,
                                                                                                                                                                                                queues,
                                                                                                                                                                                                and
                                                                                                                                                                                                DB
                                                                                                                                                                                                sharding.
                                                                                                                                                                        </p>
                                                                                                                                                </div>
                                                                                                                        </div>

                                                                                                                        <div className="flex items-center gap-3 mb-6">
                                                                                                                                                <span className="text-xs font-bold text-slate-400">
                                                                                                                                                                        Target
                                                                                                                                                                        Scale
                                                                                                                                                                        Target:
                                                                                                                                                </span>
                                                                                                                                                {[
                                                                                                                                                                        '100K Users',
                                                                                                                                                                        '10M Users',
                                                                                                                                                                        '100M Users',
                                                                                                                                                ].map(
                                                                                                                                                                        (
                                                                                                                                                                                                scale
                                                                                                                                                                        ) => (
                                                                                                                                                                                                <button
                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                scale
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        onClick={() =>
                                                                                                                                                                                                                                                setScaleTarget(
                                                                                                                                                                                                                                                                        scale
                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                                                                                                                                                                                                                                                scaleTarget ===
                                                                                                                                                                                                                                                scale
                                                                                                                                                                                                                                                                        ? 'bg-cyan-600 text-white border-cyan-500'
                                                                                                                                                                                                                                                                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                                                                                                                                                                                                                        }`}
                                                                                                                                                                                                >
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                scale
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </button>
                                                                                                                                                                        )
                                                                                                                                                )}
                                                                                                                        </div>

                                                                                                                        <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-3 text-sm">
                                                                                                                                                <div className="flex justify-between border-b border-slate-800 pb-2">
                                                                                                                                                                        <span className="text-slate-400">
                                                                                                                                                                                                Required
                                                                                                                                                                                                Server
                                                                                                                                                                                                Pods:
                                                                                                                                                                        </span>
                                                                                                                                                                        <span className="font-bold text-cyan-400">
                                                                                                                                                                                                {scaleTarget ===
                                                                                                                                                                                                '100K Users'
                                                                                                                                                                                                                        ? '2 Pods'
                                                                                                                                                                                                                        : scaleTarget ===
                                                                                                                                                                                                                            '10M Users'
                                                                                                                                                                                                                          ? '8 Pods'
                                                                                                                                                                                                                          : '48 Pods'}
                                                                                                                                                                        </span>
                                                                                                                                                </div>
                                                                                                                                                <div className="flex justify-between border-b border-slate-800 pb-2">
                                                                                                                                                                        <span className="text-slate-400">
                                                                                                                                                                                                Database
                                                                                                                                                                                                Read
                                                                                                                                                                                                Replicas:
                                                                                                                                                                        </span>
                                                                                                                                                                        <span className="font-bold text-cyan-400">
                                                                                                                                                                                                {scaleTarget ===
                                                                                                                                                                                                '100K Users'
                                                                                                                                                                                                                        ? '1 Replica'
                                                                                                                                                                                                                        : scaleTarget ===
                                                                                                                                                                                                                            '10M Users'
                                                                                                                                                                                                                          ? '3 Replicas'
                                                                                                                                                                                                                          : '12 Replicas (Sharded)'}
                                                                                                                                                                        </span>
                                                                                                                                                </div>
                                                                                                                                                <div className="flex justify-between">
                                                                                                                                                                        <span className="text-slate-400">
                                                                                                                                                                                                Redis
                                                                                                                                                                                                L2
                                                                                                                                                                                                Cache
                                                                                                                                                                                                Cluster:
                                                                                                                                                                        </span>
                                                                                                                                                                        <span className="font-bold text-emerald-400">
                                                                                                                                                                                                {scaleTarget ===
                                                                                                                                                                                                '100K Users'
                                                                                                                                                                                                                        ? 'Single Node'
                                                                                                                                                                                                                        : scaleTarget ===
                                                                                                                                                                                                                            '10M Users'
                                                                                                                                                                                                                          ? '3-Node Cluster'
                                                                                                                                                                                                                          : '16-Node Multi-Region Sharded Cluster'}
                                                                                                                                                                        </span>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB 5: AI DEBATE THEATER */}
                                                                        {activeTab === 'debate' && (
                                                                                                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
                                                                                                                        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                                                                                                                                                <div>
                                                                                                                                                                        <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                                                                                                                                                                                                <MessageSquare className="w-5 h-5 text-purple-400" />{' '}
                                                                                                                                                                                                Feature
                                                                                                                                                                                                18
                                                                                                                                                                                                &
                                                                                                                                                                                                7:
                                                                                                                                                                                                AI
                                                                                                                                                                                                Debate
                                                                                                                                                                                                Theater
                                                                                                                                                                                                &
                                                                                                                                                                                                Thought
                                                                                                                                                                                                Bubbles
                                                                                                                                                                        </h2>
                                                                                                                                                                        <p className="text-slate-400 text-xs mt-0.5">
                                                                                                                                                                                                Multi-agent
                                                                                                                                                                                                CTO,
                                                                                                                                                                                                Security,
                                                                                                                                                                                                SRE,
                                                                                                                                                                                                and
                                                                                                                                                                                                Database
                                                                                                                                                                                                Agent
                                                                                                                                                                                                debates
                                                                                                                                                                                                with
                                                                                                                                                                                                transparent
                                                                                                                                                                                                reasoning
                                                                                                                                                                                                bubbles.
                                                                                                                                                                        </p>
                                                                                                                                                </div>
                                                                                                                        </div>

                                                                                                                        <div className="space-y-4">
                                                                                                                                                {debateTranscript.map(
                                                                                                                                                                        (
                                                                                                                                                                                                line,
                                                                                                                                                                                                idx
                                                                                                                                                                        ) => (
                                                                                                                                                                                                <div
                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                idx
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-start gap-4"
                                                                                                                                                                                                >
                                                                                                                                                                                                                        <span className="text-2xl shrink-0">
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        line.avatar
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <div>
                                                                                                                                                                                                                                                <span className="text-xs font-bold text-purple-400 block mb-1">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                line.speaker
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                                                <div className="text-xs text-amber-300 italic mb-2 bg-amber-500/10 p-2 rounded border border-amber-500/20">
                                                                                                                                                                                                                                                                        💬
                                                                                                                                                                                                                                                                        AI
                                                                                                                                                                                                                                                                        Thought
                                                                                                                                                                                                                                                                        Bubble:
                                                                                                                                                                                                                                                                        "
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                line.bubble
                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                        "
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <p className="text-slate-200 text-sm font-semibold">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                line.msg
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </p>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                </div>
                                                                                                                                                                        )
                                                                                                                                                )}
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB 6: MISSION MODE & ACHIEVEMENTS */}
                                                                        {activeTab === 'game' && (
                                                                                                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
                                                                                                                        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                                                                                                                                                <div>
                                                                                                                                                                        <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                                                                                                                                                                                                <Trophy className="w-5 h-5 text-amber-400" />{' '}
                                                                                                                                                                                                Feature
                                                                                                                                                                                                11
                                                                                                                                                                                                &
                                                                                                                                                                                                12:
                                                                                                                                                                                                Mission
                                                                                                                                                                                                Mode
                                                                                                                                                                                                &
                                                                                                                                                                                                Gamified
                                                                                                                                                                                                Achievements
                                                                                                                                                                        </h2>
                                                                                                                                                                        <p className="text-slate-400 text-xs mt-0.5">
                                                                                                                                                                                                Gamified
                                                                                                                                                                                                engineering
                                                                                                                                                                                                missions
                                                                                                                                                                                                with
                                                                                                                                                                                                unlockable
                                                                                                                                                                                                badges
                                                                                                                                                                                                and
                                                                                                                                                                                                EXP
                                                                                                                                                                                                rewards.
                                                                                                                                                                        </p>
                                                                                                                                                </div>
                                                                                                                        </div>

                                                                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                                                                                                {achievements.map(
                                                                                                                                                                        (
                                                                                                                                                                                                ach,
                                                                                                                                                                                                idx
                                                                                                                                                                        ) => (
                                                                                                                                                                                                <div
                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                idx
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-start gap-3"
                                                                                                                                                                                                >
                                                                                                                                                                                                                        <Award className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
                                                                                                                                                                                                                        <div>
                                                                                                                                                                                                                                                <h3 className="font-bold text-white text-sm mb-1">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                ach.title
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </h3>
                                                                                                                                                                                                                                                <p className="text-slate-400 text-xs">
                                                                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                                                                ach.desc
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                </p>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                </div>
                                                                                                                                                                        )
                                                                                                                                                )}
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* TAB 7: CODE DNA */}
                                                                        {activeTab === 'dna' && (
                                                                                                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
                                                                                                                        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                                                                                                                                                <div>
                                                                                                                                                                        <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                                                                                                                                                                                                <Sparkles className="w-5 h-5 text-cyan-400" />{' '}
                                                                                                                                                                                                Feature
                                                                                                                                                                                                13
                                                                                                                                                                                                &
                                                                                                                                                                                                19:
                                                                                                                                                                                                Code
                                                                                                                                                                                                DNA
                                                                                                                                                                                                &
                                                                                                                                                                                                Repository
                                                                                                                                                                                                Life
                                                                                                                                                                                                Score
                                                                                                                                                                        </h2>
                                                                                                                                                                        <p className="text-slate-400 text-xs mt-0.5">
                                                                                                                                                                                                Genome
                                                                                                                                                                                                rating
                                                                                                                                                                                                across
                                                                                                                                                                                                Reliability,
                                                                                                                                                                                                Performance,
                                                                                                                                                                                                Architecture,
                                                                                                                                                                                                and
                                                                                                                                                                                                Security.
                                                                                                                                                                        </p>
                                                                                                                                                </div>
                                                                                                                                                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded border border-emerald-500/20">
                                                                                                                                                                        RATING:{' '}
                                                                                                                                                                        {
                                                                                                                                                                                                codeDna.rating
                                                                                                                                                                        }
                                                                                                                                                </span>
                                                                                                                        </div>

                                                                                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                                                                                                                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-center">
                                                                                                                                                                        <span className="text-xs text-slate-400 font-bold block mb-1">
                                                                                                                                                                                                Reliability
                                                                                                                                                                                                DNA
                                                                                                                                                                        </span>
                                                                                                                                                                        <span className="text-2xl font-extrabold text-emerald-400">
                                                                                                                                                                                                {
                                                                                                                                                                                                                        codeDna.reliability
                                                                                                                                                                                                }

                                                                                                                                                                                                %
                                                                                                                                                                        </span>
                                                                                                                                                </div>
                                                                                                                                                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-center">
                                                                                                                                                                        <span className="text-xs text-slate-400 font-bold block mb-1">
                                                                                                                                                                                                Performance
                                                                                                                                                                                                DNA
                                                                                                                                                                        </span>
                                                                                                                                                                        <span className="text-2xl font-extrabold text-cyan-400">
                                                                                                                                                                                                {
                                                                                                                                                                                                                        codeDna.performance
                                                                                                                                                                                                }

                                                                                                                                                                                                %
                                                                                                                                                                        </span>
                                                                                                                                                </div>
                                                                                                                                                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-center">
                                                                                                                                                                        <span className="text-xs text-slate-400 font-bold block mb-1">
                                                                                                                                                                                                Architecture
                                                                                                                                                                                                DNA
                                                                                                                                                                        </span>
                                                                                                                                                                        <span className="text-2xl font-extrabold text-indigo-400">
                                                                                                                                                                                                {
                                                                                                                                                                                                                        codeDna.architecture
                                                                                                                                                                                                }

                                                                                                                                                                                                %
                                                                                                                                                                        </span>
                                                                                                                                                </div>
                                                                                                                                                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-center">
                                                                                                                                                                        <span className="text-xs text-slate-400 font-bold block mb-1">
                                                                                                                                                                                                Security
                                                                                                                                                                                                DNA
                                                                                                                                                                        </span>
                                                                                                                                                                        <span className="text-2xl font-extrabold text-purple-400">
                                                                                                                                                                                                {
                                                                                                                                                                                                                        codeDna.security
                                                                                                                                                                                                }

                                                                                                                                                                                                %
                                                                                                                                                                        </span>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}
                                                </div>
                        );
}
