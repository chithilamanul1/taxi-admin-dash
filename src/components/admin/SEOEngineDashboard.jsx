'use client';

import { useState, useEffect, useCallback } from 'react';
import { Zap, TrendingUp, Target, RefreshCw, Sparkles, CheckCircle, Circle, Play, Loader2, ChevronDown, ChevronUp, Search, Calendar, Globe, Brain, PenTool, Database } from 'lucide-react';

const CLUSTER_COLORS = {
    blue: 'bg-blue-100 text-blue-700 border-blue-200',
    purple: 'bg-purple-100 text-purple-700 border-purple-200',
    green: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    cyan: 'bg-cyan-100 text-cyan-700 border-cyan-200',
    amber: 'bg-amber-100 text-amber-700 border-amber-200',
    orange: 'bg-orange-100 text-orange-700 border-orange-200',
    rose: 'bg-rose-100 text-rose-700 border-rose-200',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
    indigo: 'bg-indigo-100 text-indigo-700 border-indigo-200',
};

const PIPELINE_PHASES = [
    {
        num: '1',
        icon: Globe,
        color: 'text-blue-500',
        bg: 'bg-blue-50 border-blue-200',
        label: 'SERP Research',
        model: 'SerpApi',
        desc: 'Scrapes Google SL top results, People Also Ask, and related searches for the target keyword'
    },
    {
        num: '2',
        icon: Brain,
        color: 'text-purple-500',
        bg: 'bg-purple-50 border-purple-200',
        label: 'Content Strategy',
        model: 'DeepSeek R1',
        desc: 'Analyzes SERP gaps and creates a detailed content brief with H2 outline, LSI keywords, and FAQ questions'
    },
    {
        num: '3',
        icon: PenTool,
        color: 'text-rose-500',
        bg: 'bg-rose-50 border-rose-200',
        label: 'Content Writing',
        model: 'Claude 3.5 Sonnet',
        desc: 'Writes a 1400+ word human-quality article from the strategic brief with real Sri Lanka facts and CTAs'
    },
    {
        num: '4',
        icon: Database,
        color: 'text-emerald-500',
        bg: 'bg-emerald-50 border-emerald-200',
        label: 'CMS Publish',
        model: 'MongoDB + Next.js',
        desc: 'Formats SEO meta tags, publishes to your site, revalidates caches and makes it live immediately'
    }
];

export default function SEOEngineDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expandedCluster, setExpandedCluster] = useState(null);
    const [selectedKeywords, setSelectedKeywords] = useState([]);
    const [generating, setGenerating] = useState(false);
    const [schedulerRunning, setSchedulerRunning] = useState(false);
    const [generationLog, setGenerationLog] = useState([]);
    const [customTopic, setCustomTopic] = useState('');
    const [generatingSingle, setGeneratingSingle] = useState(false);
    const [pipelineMode, setPipelineMode] = useState(true); // true = full 4-phase, false = quick mode

    const fetchKeywords = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/seo-keywords');
            const json = await res.json();
            if (json.success) setData(json);
        } catch (e) {
            console.error('Failed to fetch SEO keywords:', e);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchKeywords();
    }, [fetchKeywords]);

    const toggleKeyword = (kw) => {
        setSelectedKeywords(prev =>
            prev.includes(kw) ? prev.filter(k => k !== kw) : [...prev, kw]
        );
    };

    const selectAllUncoveredInCluster = (cluster) => {
        const uncovered = cluster.keywords.filter(k => !k.covered).map(k => k.keyword);
        setSelectedKeywords(prev => [...new Set([...prev, ...uncovered])]);
    };

    const handleBulkGenerate = async () => {
        if (selectedKeywords.length === 0) return alert('Select at least one keyword!');
        const estMins = Math.ceil(selectedKeywords.length * (pipelineMode ? 15 : 8) / 60);
        if (!confirm(`Generate ${selectedKeywords.length} posts using ${pipelineMode ? '4-Phase Pipeline' : 'Quick Mode'}?\n\nEstimated time: ~${estMins} minutes.\n\nThe page will remain active — check the log below for progress.`)) return;

        setGenerating(true);
        setGenerationLog([{
            type: 'info',
            message: `🚀 Starting ${pipelineMode ? '4-phase pipeline' : 'quick'} generation for ${selectedKeywords.length} keywords...`
        }]);

        try {
            const endpoint = pipelineMode ? '/api/admin/seo-bulk-generate' : '/api/admin/seo-bulk-generate';
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ keywords: selectedKeywords })
            });
            const json = await res.json();

            if (json.success) {
                setGenerationLog(prev => [
                    ...prev,
                    { type: 'success', message: `✅ Generated: ${json.generated} posts` },
                    { type: 'info', message: `⏭️ Skipped (already exist): ${json.skipped}` },
                    ...(json.failed > 0 ? [{ type: 'error', message: `❌ Failed: ${json.failed}` }] : []),
                    ...json.results.map(r => ({
                        type: r.status === 'success' ? 'success' : r.status === 'skipped' ? 'info' : 'error',
                        message: r.status === 'success'
                            ? `📝 Published: "${r.title}" (~${r.wordCount || '?'} words) → /blog/${r.slug}`
                            : r.status === 'skipped'
                                ? `⏭️ Skipped: "${r.keyword}"`
                                : `❌ Failed: "${r.keyword}" — ${r.error}`
                    }))
                ]);
                setSelectedKeywords([]);
                await fetchKeywords();
            } else {
                setGenerationLog(prev => [...prev, { type: 'error', message: `❌ Error: ${json.error}` }]);
            }
        } catch (e) {
            setGenerationLog(prev => [...prev, { type: 'error', message: `❌ Network error: ${e.message}` }]);
        }
        setGenerating(false);
    };

    const handleRunScheduler = async () => {
        setSchedulerRunning(true);
        setGenerationLog([{ type: 'info', message: '🕐 Running daily scheduler (full 4-phase pipeline)...' }]);
        try {
            const res = await fetch('/api/admin/seo-scheduler', { method: 'POST' });
            const json = await res.json();
            if (json.success) {
                setGenerationLog(prev => [
                    ...prev,
                    { type: 'success', message: json.message || `✅ Published: "${json.title}"` },
                    json.wordCount ? { type: 'info', message: `📝 Word count: ~${json.wordCount} words` } : null,
                    json.serpSkipped ? { type: 'info', message: '⚠️ SerpApi key not set — SERP research was skipped' } : { type: 'success', message: '✅ SERP research completed' }
                ].filter(Boolean));
                await fetchKeywords();
            } else {
                setGenerationLog(prev => [...prev, { type: 'error', message: `❌ Error: ${json.error}` }]);
            }
        } catch (e) {
            setGenerationLog(prev => [...prev, { type: 'error', message: `❌ Network error: ${e.message}` }]);
        }
        setSchedulerRunning(false);
    };

    const handleSinglePipeline = async () => {
        if (!customTopic.trim()) return alert('Enter a keyword!');
        setGeneratingSingle(true);
        setGenerationLog([{ type: 'info', message: `🚀 Running full pipeline for: "${customTopic}"` }]);
        try {
            const endpoint = pipelineMode ? '/api/admin/seo-pipeline' : '/api/admin/generate-blog';
            const body = pipelineMode ? { keyword: customTopic } : { topic: customTopic };
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const json = await res.json();
            if (json.success || json.data) {
                const title = json.title || json.data?.title;
                const slug = json.slug || json.data?.slug;
                const wordCount = json.wordCount;
                setGenerationLog(prev => [
                    ...prev,
                    { type: 'success', message: `✅ Published: "${title}"` },
                    wordCount ? { type: 'info', message: `📝 Word count: ~${wordCount} words` } : null,
                    { type: 'info', message: `🔗 Live at: /blog/${slug}` },
                    json.serpSkipped ? { type: 'info', message: '⚠️ No SERPAPI_KEY — SERP phase was skipped' } : { type: 'success', message: '✅ SerpApi data used for strategy' }
                ].filter(Boolean));
                setCustomTopic('');
                await fetchKeywords();
            } else {
                setGenerationLog(prev => [...prev, { type: 'error', message: `❌ ${json.error}` }]);
            }
        } catch (e) {
            setGenerationLog(prev => [...prev, { type: 'error', message: `❌ ${e.message}` }]);
        }
        setGeneratingSingle(false);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <Loader2 size={48} className="animate-spin text-emerald-600" />
                <p className="text-emerald-700 font-bold text-lg">Loading SEO Engine...</p>
            </div>
        );
    }

    const stats = data?.stats || {};
    const clusters = data?.clusters || [];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-br from-emerald-900 to-emerald-700 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <Zap size={28} className="text-yellow-400" />
                            <h2 className="text-2xl font-black tracking-tight">SEO Engine</h2>
                            <span className="text-xs bg-yellow-400 text-emerald-900 px-2 py-0.5 rounded-full font-black uppercase">4-Phase AI Pipeline</span>
                        </div>
                        <p className="text-emerald-200 text-sm">SerpApi → DeepSeek R1 → Claude 3.5 Sonnet → MongoDB — Rank #1 in Sri Lanka</p>
                    </div>
                    <button onClick={fetchKeywords} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-sm font-bold transition-all">
                        <RefreshCw size={14} /> Refresh
                    </button>
                </div>

                {/* Stats Bar */}
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                        { label: 'Total Posts', value: stats.totalPosts || 0, color: 'text-yellow-400' },
                        { label: 'Keywords Covered', value: stats.coveredKeywords || 0, color: 'text-emerald-300' },
                        { label: 'Gaps to Fill', value: stats.uncoveredKeywords || 0, color: 'text-red-300' },
                        { label: 'Coverage', value: `${stats.coveragePercent || 0}%`, color: 'text-white' },
                    ].map(s => (
                        <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
                            <div className={`text-3xl font-black ${s.color}`}>{s.value}</div>
                            <div className="text-xs text-emerald-200 font-medium mt-1">{s.label}</div>
                        </div>
                    ))}
                </div>

                <div className="mt-4">
                    <div className="flex justify-between text-xs text-emerald-200 mb-1">
                        <span>Keyword Coverage Progress</span>
                        <span>{stats.coveredKeywords}/{stats.totalKeywords}</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2.5">
                        <div
                            className="bg-yellow-400 h-2.5 rounded-full transition-all duration-1000"
                            style={{ width: `${stats.coveragePercent || 0}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Pipeline Phases Diagram */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                    <Zap size={14} className="text-yellow-500" /> 4-Phase Content Pipeline
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {PIPELINE_PHASES.map((phase, i) => (
                        <div key={i} className={`rounded-xl border p-3 ${phase.bg}`}>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-black text-slate-400">Phase {phase.num}</span>
                                <phase.icon size={14} className={phase.color} />
                            </div>
                            <div className="font-bold text-slate-800 text-sm mb-0.5">{phase.label}</div>
                            <div className={`text-xs font-bold ${phase.color} mb-1`}>{phase.model}</div>
                            <div className="text-xs text-slate-500 leading-relaxed">{phase.desc}</div>
                        </div>
                    ))}
                </div>

                {/* Mode Toggle */}
                <div className="mt-4 flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Mode:</span>
                    <button
                        onClick={() => setPipelineMode(true)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${pipelineMode ? 'bg-emerald-700 text-white shadow-sm' : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300'}`}
                    >
                        🧠 Full Pipeline (SerpApi + DeepSeek + Claude)
                    </button>
                    <button
                        onClick={() => setPipelineMode(false)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${!pipelineMode ? 'bg-slate-700 text-white shadow-sm' : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300'}`}
                    >
                        ⚡ Quick Mode (Gemini 2.5 Flash only)
                    </button>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Single Post */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                    <div className="flex items-center gap-2 mb-3">
                        <Sparkles size={18} className="text-indigo-600" />
                        <h3 className="font-bold text-slate-800">Generate Single Post</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${pipelineMode ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                            {pipelineMode ? '4-Phase' : 'Quick'}
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={customTopic}
                            onChange={e => setCustomTopic(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSinglePipeline()}
                            placeholder="e.g. airport taxi colombo to kandy"
                            className="flex-1 text-sm border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                        />
                        <button
                            onClick={handleSinglePipeline}
                            disabled={generatingSingle}
                            className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all flex items-center gap-2 disabled:opacity-60"
                        >
                            {generatingSingle ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
                            {generatingSingle ? 'Running...' : 'Run'}
                        </button>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">
                        {pipelineMode
                            ? '⏱ ~2–3 min: SerpApi → DeepSeek R1 brief → Claude 3.5 Sonnet 1400+ word article'
                            : '⚡ ~30 sec: Gemini 2.5 Flash quick generation'}
                    </p>
                </div>

                {/* Daily Scheduler */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                    <div className="flex items-center gap-2 mb-3">
                        <Calendar size={18} className="text-emerald-600" />
                        <h3 className="font-bold text-slate-800">Daily Auto-Scheduler</h3>
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">Vercel Cron — 1am UTC</span>
                    </div>
                    <p className="text-sm text-slate-500 mb-4">
                        Runs the <strong>full 4-phase pipeline</strong> automatically every day for the next uncovered keyword.
                    </p>
                    <button
                        onClick={handleRunScheduler}
                        disabled={schedulerRunning}
                        className="w-full bg-emerald-700 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-800 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                        {schedulerRunning ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
                        {schedulerRunning ? 'Running Pipeline...' : "Run Now — Today's Auto Post"}
                    </button>
                </div>
            </div>

            {/* Bulk Actions Bar */}
            {selectedKeywords.length > 0 && (
                <div className="sticky top-4 z-20 bg-indigo-600 text-white rounded-2xl p-4 flex items-center justify-between gap-3 shadow-2xl shadow-indigo-600/30 flex-wrap">
                    <div className="flex items-center gap-3 flex-wrap">
                        <Target size={20} className="text-indigo-200 shrink-0" />
                        <span className="font-bold">{selectedKeywords.length} selected</span>
                        <span className="text-indigo-200 text-sm">
                            ≈ {pipelineMode ? Math.ceil(selectedKeywords.length * 3) : Math.ceil(selectedKeywords.length * 0.7)} min total
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSelectedKeywords([])} className="text-indigo-200 hover:text-white text-sm">Clear</button>
                        <button
                            onClick={handleBulkGenerate}
                            disabled={generating}
                            className="bg-white text-indigo-600 px-5 py-2 rounded-xl font-black text-sm hover:bg-indigo-50 transition-all flex items-center gap-2 disabled:opacity-60"
                        >
                            {generating ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
                            {generating ? 'Generating...' : `Bulk Generate ${selectedKeywords.length} Posts`}
                        </button>
                    </div>
                </div>
            )}

            {/* Generation Log */}
            {generationLog.length > 0 && (
                <div className="bg-slate-900 rounded-2xl p-4 font-mono text-sm max-h-72 overflow-y-auto">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-emerald-400 font-bold text-xs uppercase tracking-widest">Pipeline Log</span>
                        <button onClick={() => setGenerationLog([])} className="text-slate-500 hover:text-slate-300 text-xs">Clear</button>
                    </div>
                    {generationLog.map((log, i) => (
                        <div key={i} className={`py-0.5 text-xs ${log.type === 'success' ? 'text-emerald-400' : log.type === 'error' ? 'text-red-400' : 'text-slate-400'}`}>
                            {log.message}
                        </div>
                    ))}
                    {(generating || generatingSingle || schedulerRunning) && (
                        <div className="text-yellow-400 animate-pulse mt-2 text-xs">⏳ Pipeline running... this may take a few minutes</div>
                    )}
                </div>
            )}

            {/* Keyword Clusters */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <TrendingUp size={20} className="text-emerald-600" />
                        Keyword Clusters
                    </h3>
                    <p className="text-sm text-slate-500">Click keywords to queue for bulk generation</p>
                </div>

                {clusters.map(cluster => {
                    const covered = cluster.keywords.filter(k => k.covered).length;
                    const total = cluster.keywords.length;
                    const pct = Math.round((covered / total) * 100);
                    const isExpanded = expandedCluster === cluster.id;
                    const colorClass = CLUSTER_COLORS[cluster.color] || CLUSTER_COLORS.slate;

                    return (
                        <div key={cluster.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <button
                                onClick={() => setExpandedCluster(isExpanded ? null : cluster.id)}
                                className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left"
                            >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <span className={`text-sm font-bold px-3 py-1 rounded-full border shrink-0 ${colorClass}`}>
                                        {cluster.label}
                                    </span>
                                    <span className="text-slate-400 text-sm hidden sm:block truncate">{cluster.description}</span>
                                </div>
                                <div className="flex items-center gap-4 shrink-0 ml-2">
                                    <div className="text-right">
                                        <div className="text-xs text-slate-500">{covered}/{total}</div>
                                        <div className={`text-xs font-bold ${pct === 100 ? 'text-emerald-600' : pct > 50 ? 'text-amber-600' : 'text-red-500'}`}>{pct}%</div>
                                    </div>
                                    <div className="w-16 bg-slate-100 rounded-full h-1.5">
                                        <div
                                            className={`h-1.5 rounded-full ${pct === 100 ? 'bg-emerald-500' : pct > 50 ? 'bg-amber-500' : 'bg-red-400'}`}
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                    {isExpanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                                </div>
                            </button>

                            {isExpanded && (
                                <div className="border-t border-slate-100 p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-xs text-slate-500">{total - covered} uncovered — select to queue for generation</span>
                                        <button
                                            onClick={() => selectAllUncoveredInCluster(cluster)}
                                            className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg font-bold hover:bg-indigo-100 transition-all"
                                        >
                                            Select All Uncovered
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {cluster.keywords.map(({ keyword, covered: isCovered }) => {
                                            const isSelected = selectedKeywords.includes(keyword);
                                            return (
                                                <button
                                                    key={keyword}
                                                    onClick={() => !isCovered && toggleKeyword(keyword)}
                                                    disabled={isCovered}
                                                    title={isCovered ? 'Already covered' : 'Click to queue'}
                                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all
                                                        ${isCovered
                                                            ? 'bg-emerald-50 text-emerald-600 border-emerald-200 cursor-default opacity-70'
                                                            : isSelected
                                                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-105'
                                                                : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-400 hover:text-indigo-600 cursor-pointer'
                                                        }`}
                                                >
                                                    {isCovered ? <CheckCircle size={10} className="text-emerald-500" /> : isSelected ? <Zap size={10} /> : <Circle size={10} />}
                                                    {keyword}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Env Setup Guide */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                <h3 className="font-bold text-amber-800 mb-3 flex items-center gap-2 text-sm">
                    <Search size={14} /> Required Environment Variables
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {[
                        { key: 'OPENROUTER_API_KEY', desc: 'Required — DeepSeek R1 + Claude 3.5 Sonnet', url: 'https://openrouter.ai/keys', required: true },
                        { key: 'SERPAPI_KEY', desc: 'Recommended — Real Google SL SERP data (Phase 1)', url: 'https://serpapi.com/manage-api-key', required: false },
                        { key: 'UNSPLASH_ACCESS_KEY', desc: 'Optional — Royalty-free cover images', url: 'https://unsplash.com/developers', required: false },
                        { key: 'SEO_CRON_SECRET', desc: 'Optional — Protect the scheduler endpoint', url: null, required: false },
                    ].map(env => (
                        <div key={env.key} className="bg-white rounded-xl p-3 border border-amber-100">
                            <div className="flex items-center gap-2 mb-1">
                                <code className="font-mono font-bold text-amber-700 text-xs">{env.key}</code>
                                {env.required
                                    ? <span className="text-[9px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">REQUIRED</span>
                                    : <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold">OPTIONAL</span>
                                }
                            </div>
                            <p className="text-slate-500">{env.desc}</p>
                            {env.url && <a href={env.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline mt-1 block">Get key →</a>}
                        </div>
                    ))}
                </div>
                <p className="text-xs text-amber-600 mt-3">
                    ⚠️ Without SERPAPI_KEY the pipeline will skip Phase 1 and run Phases 2–4 only (still produces great content).
                </p>
            </div>
        </div>
    );
}
