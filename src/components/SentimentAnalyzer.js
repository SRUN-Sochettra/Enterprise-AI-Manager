"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Brain,
    Sparkles,
    RefreshCw,
    Lightbulb,
    TrendingUp,
    TrendingDown,
    Minus,
    History,
    X,
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import toast from "react-hot-toast";

const EXAMPLES = [
    "This employee is amazing and always delivers great work!",
    "Performance has been very poor and deadlines are missed.",
    "The team is doing okay, nothing exceptional.",
    "Outstanding leadership and communication skills!",
    "Consistently late and shows lack of motivation.",
];

const getSentimentConfig = (sentiment) => {
    switch (sentiment) {
        case "POSITIVE":
            return {
                icon: TrendingUp,
                label: "Positive",
                color: "text-emerald-400",
                bg: "bg-emerald-400/8",
                border: "border-emerald-400/20",
                bar: "from-emerald-500 to-teal-500",
                glow: "shadow-emerald-500/20",
                dot: "bg-emerald-400",
            };
        case "NEGATIVE":
            return {
                icon: TrendingDown,
                label: "Negative",
                color: "text-rose-400",
                bg: "bg-rose-400/8",
                border: "border-rose-400/20",
                bar: "from-rose-500 to-red-500",
                glow: "shadow-rose-500/20",
                dot: "bg-rose-400",
            };
        default:
            return {
                icon: Minus,
                label: "Neutral",
                color: "text-amber-400",
                bg: "bg-amber-400/8",
                border: "border-amber-400/20",
                bar: "from-amber-500 to-orange-500",
                glow: "shadow-amber-500/20",
                dot: "bg-amber-400",
            };
    }
};

function HistoryItem({ item, index }) {
    const cfg = getSentimentConfig(item.sentiment);
    return (
        <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-3 glass rounded-xl px-3 py-2.5 border border-white/5"
        >
            <span className={cn("w-2 h-2 rounded-full shrink-0", cfg.dot)} />
            <p className="text-xs text-white/50 flex-1 truncate">{item.text}</p>
            <div className="flex items-center gap-2 shrink-0">
                <span className={cn("text-xs font-bold", cfg.color)}>
                    {cfg.label}
                </span>
                <span className="text-[10px] text-white/25">{item.confidence}%</span>
            </div>
        </motion.div>
    );
}

export default function SentimentAnalyzer() {
    const [text, setText] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);

    const handleAnalyze = async (inputText) => {
        const textToAnalyze = inputText || text;
        if (!textToAnalyze.trim()) return;

        setLoading(true);
        setResult(null);

        try {
            const res = await fetch("/api/sentiment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: textToAnalyze }),
            });
            const data = await res.json();

            if (data.loading) {
                toast("Model is loading, try again in 20s", { icon: "⏳" });
                return;
            }
            if (!res.ok) throw new Error(data.error);

            setResult(data);
            setText("");

            setHistory((prev) => [
                { text: textToAnalyze, sentiment: data.sentiment, confidence: data.confidence },
                ...prev.slice(0, 4),
            ]);
        } catch (err) {
            toast.error(err.message || "Sentiment analysis failed");
        } finally {
            setLoading(false);
        }
    };

    const config = result ? getSentimentConfig(result.sentiment) : null;
    const ResultIcon = config?.icon;

    return (
        <div className="space-y-6">
            {/* Page-level header (used when embedded in employees page) */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h2 className="text-xl font-black text-white mb-0.5">
                        Sentiment Analyzer
                    </h2>
                    <p className="text-sm text-white/40">
                        Analyze tone of employee feedback using DistilBERT
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/20">
                        DistilBERT SST-2
                    </span>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
                        FREE
                    </span>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Left: Input */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="lg:col-span-3 space-y-4"
                >
                    {/* Examples */}
                    <div className="glass-card rounded-2xl border border-white/5 p-5 space-y-3">
                        <div className="flex items-center gap-2 mb-1">
                            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                            <span className="text-xs font-bold text-white/40 uppercase tracking-wider">
                                Try an example
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {EXAMPLES.map((ex, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleAnalyze(ex)}
                                    disabled={loading}
                                    className="text-xs glass border border-white/6 text-white/45 hover:text-white/80 hover:bg-white/5 px-3 py-1.5 rounded-full transition-all disabled:opacity-40 text-left"
                                >
                                    {ex.slice(0, 38)}…
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Textarea + button */}
                    <div className="glass-card rounded-2xl border border-white/5 p-5 space-y-3">
                        <label className="text-xs font-bold text-white/40 uppercase tracking-wider">
                            Your Text
                        </label>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Type employee feedback, review, or any text to analyze…"
                            rows={5}
                            disabled={loading}
                            className="w-full bg-white/5 border border-white/8 text-white placeholder-white/20 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 resize-none transition-all disabled:opacity-50"
                        />
                        <button
                            onClick={() => handleAnalyze()}
                            disabled={loading || !text.trim()}
                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold py-3 rounded-xl hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/20 hover:-translate-y-0.5"
                        >
                            {loading ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                                <Brain className="w-4 h-4" />
                            )}
                            {loading ? "Analyzing…" : "Analyze Sentiment"}
                        </button>
                    </div>
                </motion.div>

                {/* Right: Result + History */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="lg:col-span-2 space-y-4"
                >
                    {/* Result card */}
                    <AnimatePresence mode="wait">
                        {!result && !loading && (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="glass-card rounded-2xl border border-white/5 p-6 flex flex-col items-center justify-center text-center min-h-[200px] gap-3"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-center">
                                    <Brain className="w-6 h-6 text-white/20" />
                                </div>
                                <p className="text-white/30 text-sm">
                                    Result will appear here
                                </p>
                            </motion.div>
                        )}

                        {loading && (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="glass-card rounded-2xl border border-white/5 p-6 flex flex-col items-center justify-center text-center min-h-[200px] gap-4"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center animate-pulse-glow">
                                    <Brain className="w-6 h-6 text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-white/60 font-semibold text-sm">
                                        Analyzing sentiment…
                                    </p>
                                    <p className="text-white/25 text-xs mt-1">
                                        DistilBERT is processing
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {result && config && !loading && (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, scale: 0.95, y: 12 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -12 }}
                                transition={{ type: "spring", stiffness: 300, damping: 28 }}
                                className={cn(
                                    "glass-card rounded-2xl border p-6 space-y-4",
                                    config.border,
                                    config.bg
                                )}
                            >
                                {/* Main result */}
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg",
                                        config.bg,
                                        `border ${config.border}`,
                                        config.glow
                                    )}>
                                        <ResultIcon className={cn("w-6 h-6", config.color)} />
                                    </div>
                                    <div>
                                        <p className={cn("text-2xl font-black", config.color)}>
                                            {config.label}
                                        </p>
                                        <p className="text-white/40 text-xs">
                                            {result.confidence}% confidence
                                        </p>
                                    </div>
                                    <div className="ml-auto text-right">
                                        <p className={cn("text-4xl font-black", config.color)}>
                                            {result.confidence}%
                                        </p>
                                    </div>
                                </div>

                                {/* Confidence bar */}
                                <div className="space-y-1.5">
                                    <div className="w-full h-2 bg-white/8 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${result.confidence}%` }}
                                            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                                            className={cn(
                                                "h-full rounded-full bg-gradient-to-r",
                                                config.bar
                                            )}
                                        />
                                    </div>
                                </div>

                                {/* All scores */}
                                {result.all && (
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-wider">
                                            All Scores
                                        </p>
                                        {result.all.map((item) => {
                                            const c = getSentimentConfig(item.label);
                                            const Icon = c.icon;
                                            return (
                                                <div
                                                    key={item.label}
                                                    className="flex items-center gap-2 text-xs"
                                                >
                                                    <Icon className={cn("w-3 h-3 shrink-0", c.color)} />
                                                    <span className={cn("font-semibold w-16", c.color)}>
                                                        {c.label}
                                                    </span>
                                                    <div className="flex-1 h-1.5 bg-white/8 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${Math.round(item.score * 100)}%` }}
                                                            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                                                            className={cn("h-full rounded-full bg-gradient-to-r", c.bar)}
                                                        />
                                                    </div>
                                                    <span className="text-white/40 w-8 text-right">
                                                        {Math.round(item.score * 100)}%
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* History */}
                    <AnimatePresence>
                        {history.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="glass-card rounded-2xl border border-white/5 p-4 space-y-3"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <History className="w-3.5 h-3.5 text-white/30" />
                                        <span className="text-xs font-bold text-white/40 uppercase tracking-wider">
                                            Recent
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => setHistory([])}
                                        className="text-[10px] text-white/25 hover:text-rose-400 transition-colors flex items-center gap-1"
                                    >
                                        <X className="w-3 h-3" />
                                        Clear
                                    </button>
                                </div>
                                <div className="space-y-1.5">
                                    {history.map((item, i) => (
                                        <HistoryItem key={i} item={item} index={i} />
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
}