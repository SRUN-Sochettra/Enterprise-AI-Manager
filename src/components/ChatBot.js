"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Bot,
    X,
    Send,
    Trash2,
    Sparkles,
    User,
    Minimize2,
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import toast from "react-hot-toast";

const SUGGESTED = [
    "How many products?",
    "Who earns the most?",
    "What departments exist?",
    "Cheapest product?",
];

const WELCOME = {
    role: "ai",
    text: "Hi! 👋 I'm your AI assistant powered by Gemini. Ask me anything about your products or employees!",
};

function Message({ msg }) {
    const isUser = msg.role === "user";
    return (
        <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.25 }}
            className={cn("flex gap-2", isUser ? "flex-row-reverse" : "flex-row")}
        >
            {/* Avatar */}
            <div className={cn(
                "w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
                isUser
                    ? "bg-gradient-to-br from-blue-500 to-violet-600"
                    : "bg-gradient-to-br from-violet-500/30 to-blue-500/30 border border-white/10"
            )}>
                {isUser
                    ? <User className="w-3 h-3 text-white" />
                    : <Bot className="w-3 h-3 text-violet-300" />}
            </div>

            {/* Bubble */}
            <div className={cn(
                "max-w-[82%] rounded-2xl px-3 py-2.5 text-[13px] leading-relaxed",
                isUser
                    ? "bg-gradient-to-br from-blue-600 to-violet-600 text-white rounded-tr-sm"
                    : "bg-white/8 border border-white/8 text-white/80 rounded-tl-sm"
            )}>
                <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
        </motion.div>
    );
}

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [question, setQuestion] = useState("");
    const [messages, setMessages] = useState([WELCOME]);
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [employees, setEmployees] = useState([]);
    const bottomRef = useRef(null);
    const inputRef = useRef(null);

    /* Fetch data once */
    useEffect(() => {
        const fetchData = async () => {
            try {
                const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
                const [pr, em] = await Promise.all([
                    fetch(`${API}/api/v1/products/all`),
                    fetch(`${API}/api/v1/employees/all`),
                ]);
                const pj = await pr.json();
                const ej = await em.json();
                setProducts(pj.data || []);
                setEmployees(ej.data || []);
            } catch {
                /* silent fail */
            }
        };
        fetchData();
    }, []);

    /* Auto-scroll */
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    /* Focus on open */
    useEffect(() => {
        if (isOpen) setTimeout(() => inputRef.current?.focus(), 150);
    }, [isOpen]);

    const handleAsk = async (q) => {
        const text = q || question;
        if (!text.trim()) return;

        setQuestion("");
        setMessages((prev) => [...prev, { role: "user", text }]);
        setLoading(true);

        try {
            const res = await fetch("/api/gemini", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question: text, products, employees }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setMessages((prev) => [...prev, { role: "ai", text: data.answer }]);
        } catch {
            toast.error("Failed to get response");
            setMessages((prev) => prev.slice(0, -1));
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
        setMessages([WELCOME]);
    };

    return (
        <>
            {/* Chat window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 24, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 24, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 28 }}
                        className="fixed bottom-24 right-4 sm:right-6 z-50 w-[340px] sm:w-[380px] glass-card border border-white/8 rounded-3xl shadow-2xl shadow-black/40 flex flex-col overflow-hidden"
                        style={{ maxHeight: "72vh" }}
                    >
                        {/* Header */}
                        <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2.5 bg-gradient-to-r from-violet-600/20 to-blue-600/20 shrink-0">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500/40 to-blue-500/40 border border-white/10 flex items-center justify-center">
                                <Bot className="w-4 h-4 text-violet-300" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-white/90">
                                    AI Assistant
                                </p>
                                <p className="text-[10px] text-white/35 flex items-center gap-1">
                                    <Sparkles className="w-2.5 h-2.5 text-violet-400" />
                                    Gemini 2.5 Flash
                                </p>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={handleClear}
                                    className="w-7 h-7 rounded-lg hover:bg-white/8 flex items-center justify-center text-white/30 hover:text-rose-400 transition-all"
                                    title="Clear chat"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="w-7 h-7 rounded-lg hover:bg-white/8 flex items-center justify-center text-white/30 hover:text-white/80 transition-all"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                            {messages.map((msg, i) => (
                                <Message key={i} msg={msg} />
                            ))}

                            {/* Loading bubble */}
                            <AnimatePresence>
                                {loading && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="flex gap-2"
                                    >
                                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500/30 to-blue-500/30 border border-white/10 flex items-center justify-center shrink-0">
                                            <Bot className="w-3 h-3 text-violet-300" />
                                        </div>
                                        <div className="bg-white/8 border border-white/8 rounded-2xl rounded-tl-sm px-3 py-2.5">
                                            <div className="flex gap-1 items-center h-4">
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
                                )}
                            </AnimatePresence>

                            <div ref={bottomRef} />
                        </div>

                        {/* Quick suggestions */}
                        <div className="px-4 py-2 border-t border-white/5 flex gap-1.5 overflow-x-auto shrink-0">
                            {SUGGESTED.map((q, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleAsk(q)}
                                    disabled={loading}
                                    className="shrink-0 text-[11px] px-2.5 py-1.5 rounded-full glass border border-white/6 text-white/40 hover:text-white/80 hover:bg-white/5 transition-all disabled:opacity-40 whitespace-nowrap"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>

                        {/* Input */}
                        <div className="px-4 py-3 border-t border-white/5 flex gap-2 shrink-0">
                            <input
                                ref={inputRef}
                                type="text"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask anything…"
                                disabled={loading}
                                className="flex-1 bg-white/5 border border-white/8 text-white placeholder-white/20 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 disabled:opacity-50 transition-all"
                            />
                            <button
                                onClick={() => handleAsk()}
                                disabled={loading || !question.trim()}
                                className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 text-white flex items-center justify-center hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-violet-500/20 hover:-translate-y-0.5 shrink-0"
                            >
                                {loading
                                    ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    : <Send className="w-4 h-4" />}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                className={cn(
                    "fixed bottom-6 right-4 sm:right-6 z-50 w-14 h-14 rounded-2xl shadow-2xl flex items-center justify-center transition-all duration-300",
                    isOpen
                        ? "bg-white/10 border border-white/10 backdrop-blur-xl"
                        : "bg-gradient-to-br from-violet-600 to-blue-600 shadow-violet-500/30 animate-pulse-glow"
                )}
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <X className="w-5 h-5 text-white/70" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="open"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Bot className="w-6 h-6 text-white" />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Notification dot */}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-background animate-pulse" />
                )}
            </motion.button>
        </>
    );
}