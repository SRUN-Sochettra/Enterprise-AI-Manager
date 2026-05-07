"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Bot,
    Send,
    Trash2,
    Sparkles,
    User,
    Package,
    Users,
    Lightbulb,
    Copy,
    Check,
} from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/src/lib/utils";

const SUGGESTED = [
    "How many products do we have?",
    "What is the most expensive product?",
    "Which department has the most employees?",
    "What is the average salary?",
    "List all products under $50",
    "Who are the employees in Engineering?",
    "What's the total payroll cost?",
    "Which products cost more than $100?",
];

function CopyButton({ text }) {
    const [copied, setCopied] = useState(false);
    const handle = async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button
            onClick={handle}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-white/10 text-white/30 hover:text-white/70"
        >
            {copied
                ? <Check className="w-3 h-3 text-emerald-400" />
                : <Copy className="w-3 h-3" />}
        </button>
    );
}

function Message({ msg, isLast }) {
    const isUser = msg.role === "user";
    return (
        <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={cn(
                "flex gap-3",
                isUser ? "flex-row-reverse" : "flex-row"
            )}
        >
            {/* Avatar */}
            <div className={cn(
                "w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5",
                isUser
                    ? "bg-gradient-to-br from-blue-500 to-violet-600"
                    : "bg-gradient-to-br from-violet-500/30 to-blue-500/30 border border-white/10"
            )}>
                {isUser
                    ? <User className="w-3.5 h-3.5 text-white" />
                    : <Bot className="w-3.5 h-3.5 text-violet-300" />}
            </div>

            {/* Bubble */}
            <div className={cn(
                "group relative max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                isUser
                    ? "bg-gradient-to-br from-blue-600 to-violet-600 text-white rounded-tr-sm shadow-lg shadow-blue-500/20"
                    : "glass-card border border-white/8 text-white/80 rounded-tl-sm"
            )}>
                {!isUser && (
                    <p className="text-[10px] font-bold text-violet-400 mb-1.5 flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" /> Gemini 2.5 Flash
                    </p>
                )}
                <p className="whitespace-pre-wrap">{msg.text}</p>
                {!isUser && (
                    <div className="absolute top-2 right-2">
                        <CopyButton text={msg.text} />
                    </div>
                )}
            </div>
        </motion.div>
    );
}

function TypingIndicator() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex gap-3"
        >
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-violet-500/30 to-blue-500/30 border border-white/10 flex items-center justify-center shrink-0">
                <Bot className="w-3.5 h-3.5 text-violet-300" />
            </div>
            <div className="glass-card border border-white/8 rounded-2xl rounded-tl-sm px-4 py-3">
                <p className="text-[10px] font-bold text-violet-400 mb-2 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 animate-pulse" /> Thinking…
                </p>
                <div className="flex gap-1.5 items-center h-4">
                    {[0, 1, 2].map((i) => (
                        <span
                            key={i}
                            className="w-1.5 h-1.5 bg-violet-400/60 rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 150}ms` }}
                        />
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

export default function GeminiChat({ products = [], employees = [] }) {
    const [question, setQuestion] = useState("");
    const [loading, setLoading] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);
    const bottomRef = useRef(null);
    const inputRef = useRef(null);
    const [activeSuggestions, setActiveSuggestions] = useState(SUGGESTED.slice(0, 4));

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatHistory, loading]);

    const handleAsk = async (q) => {
        const text = q || question;
        if (!text.trim()) return;

        setQuestion("");
        setChatHistory((prev) => [...prev, { role: "user", text }]);
        setLoading(true);

        // Rotate suggestions
        setActiveSuggestions(
            SUGGESTED.filter((s) => s !== text).slice(0, 3)
        );

        try {
            const res = await fetch("/api/gemini", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question: text, products, employees }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.details || data.error || "Unknown error");

            setChatHistory((prev) => [...prev, { role: "ai", text: data.answer }]);
        } catch (err) {
            toast.error(err.message || "Failed to get AI response");
            setChatHistory((prev) => prev.slice(0, -1));
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleAsk();
        }
    };

    const handleClear = () => {
        setChatHistory([]);
        setActiveSuggestions(SUGGESTED.slice(0, 4));
        toast.success("Chat cleared!");
    };

    const isEmpty = chatHistory.length === 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
                <div>
                    <h1 className="text-2xl font-black text-white mb-1">
                        AI Assistant
                    </h1>
                    <p className="text-sm text-white/40">
                        Ask anything about your data in plain English
                    </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/20 flex items-center gap-1">
                        <Package className="w-3 h-3" />
                        {products.length} products
                    </span>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/20 flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {employees.length} employees
                    </span>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
                        Gemini 2.5 Flash
                    </span>
                </div>
            </motion.div>

            {/* Main chat container */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="glass-card rounded-3xl border border-white/5 overflow-hidden flex flex-col"
                style={{ minHeight: "70vh" }}
            >
                {/* Empty state */}
                {isEmpty && (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5, type: "spring" }}
                            className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-blue-500/15 flex items-center justify-center mb-5 animate-float"
                        >
                            <Bot className="w-10 h-10 text-violet-300" />
                        </motion.div>

                        <h2 className="text-xl font-black text-white mb-2">
                            Ask me anything
                        </h2>
                        <p className="text-white/40 text-sm max-w-md mb-8 leading-relaxed">
                            I have full context of your{" "}
                            <span className="text-blue-400 font-semibold">
                                {products.length} products
                            </span>{" "}
                            and{" "}
                            <span className="text-violet-400 font-semibold">
                                {employees.length} employees
                            </span>
                            . Ask in plain English!
                        </p>

                        {/* Suggestion grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-xl">
                            {SUGGESTED.map((q, i) => (
                                <motion.button
                                    key={q}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + i * 0.05 }}
                                    onClick={() => handleAsk(q)}
                                    disabled={loading}
                                    className="flex items-center gap-2.5 px-4 py-3 rounded-xl glass border border-white/6 text-left text-sm text-white/55 hover:text-white/90 hover:bg-white/5 hover:border-white/10 transition-all duration-200 disabled:opacity-50 group"
                                >
                                    <Lightbulb className="w-3.5 h-3.5 text-amber-400/60 group-hover:text-amber-400 transition-colors shrink-0" />
                                    {q}
                                </motion.button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Chat messages */}
                {!isEmpty && (
                    <div className="flex-1 overflow-y-auto p-5 space-y-4">
                        {chatHistory.map((msg, i) => (
                            <Message
                                key={i}
                                msg={msg}
                                isLast={i === chatHistory.length - 1}
                            />
                        ))}
                        <AnimatePresence>
                            {loading && <TypingIndicator />}
                        </AnimatePresence>
                        <div ref={bottomRef} />
                    </div>
                )}

                {/* Quick suggestions (after chat starts) */}
                {!isEmpty && (
                    <div className="px-5 py-3 border-t border-white/5 flex gap-2 overflow-x-auto">
                        {activeSuggestions.map((q) => (
                            <button
                                key={q}
                                onClick={() => handleAsk(q)}
                                disabled={loading}
                                className="shrink-0 text-xs px-3 py-1.5 rounded-full glass border border-white/6 text-white/40 hover:text-white/80 hover:bg-white/5 transition-all disabled:opacity-40"
                            >
                                {q}
                            </button>
                        ))}
                    </div>
                )}

                {/* Input area */}
                <div className="px-4 py-4 border-t border-white/5 flex flex-col gap-3">
                    {!isEmpty && (
                        <div className="flex justify-end">
                            <button
                                onClick={handleClear}
                                className="flex items-center gap-1.5 text-xs text-white/30 hover:text-rose-400 transition-colors px-2 py-1 rounded-lg hover:bg-rose-500/10"
                            >
                                <Trash2 className="w-3 h-3" />
                                Clear chat
                            </button>
                        </div>
                    )}

                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <textarea
                                ref={inputRef}
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask anything about your products & employees…"
                                disabled={loading}
                                rows={2}
                                className="w-full bg-white/5 border border-white/8 text-white placeholder-white/20 px-4 py-3 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/30 resize-none transition-all duration-200 disabled:opacity-50 pr-4"
                            />
                        </div>
                        <button
                            onClick={() => handleAsk()}
                            disabled={loading || !question.trim()}
                            className="self-end flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold text-sm hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-violet-500/20 hover:-translate-y-0.5"
                        >
                            {loading
                                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                : <Send className="w-4 h-4" />}
                            {loading ? "Thinking…" : "Send"}
                        </button>
                    </div>

                    <p className="text-[10px] text-white/20 text-center">
                        Enter to send · Shift+Enter for new line · Powered by Gemini 2.5 Flash
                    </p>
                </div>
            </motion.div>
        </div>
    );
}