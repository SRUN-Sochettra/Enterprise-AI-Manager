"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Sparkles,
    Package,
    Users,
    X,
    Bot,
    TrendingUp,
    DollarSign,
    Building2,
    Zap,
} from "lucide-react";
import { formatCurrency, getDepartmentColor, cn } from "@/src/lib/utils";
import toast from "react-hot-toast";

const EXAMPLES = [
    { label: "Most expensive products", query: "Show me the most expensive products" },
    { label: "IT employees", query: "Employees in IT department" },
    { label: "Products under $1000", query: "Products under $1000" },
    { label: "Highest salary", query: "Who has the highest salary?" },
    { label: "Food products", query: "Show me all food products" },
    { label: "High earners", query: "Employees earning more than $500" },
];

const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, delay: i * 0.06, ease: "easeOut" },
    }),
};

function ProductCard({ product, index }) {
    return (
        <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={index}
            className="glass-card rounded-2xl p-4 border border-white/5 hover:border-violet-500/20 transition-all duration-200 group hover:-translate-y-0.5"
        >
            <div className="flex items-start justify-between mb-2">
                <span className="text-[10px] font-bold text-violet-400/70 bg-violet-400/8 px-2 py-0.5 rounded-lg">
                    #{product.productId}
                </span>
                <span className="text-lg font-black text-emerald-400">
                    {formatCurrency(product.productPrice)}
                </span>
            </div>
            <h3 className="font-bold text-white/85 text-sm group-hover:text-white transition-colors">
                {product.productName}
            </h3>
        </motion.div>
    );
}

function EmployeeCard({ employee, index }) {
    return (
        <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={index}
            className="glass-card rounded-2xl p-4 border border-white/5 hover:border-blue-500/20 transition-all duration-200 group hover:-translate-y-0.5"
        >
            <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/30 to-violet-500/30 border border-white/8 flex items-center justify-center text-xs font-bold text-white/70 shrink-0">
                    {(employee.firstName?.[0] || "") + (employee.lastName?.[0] || "")}
                </div>
                <div className="min-w-0">
                    <p className="font-bold text-white/85 text-sm group-hover:text-white transition-colors truncate">
                        {employee.firstName} {employee.lastName}
                    </p>
                    <p className="text-[11px] text-white/35 truncate">
                        {employee.email}
                    </p>
                </div>
            </div>
            <div className="flex items-center justify-between">
                <span className={cn(
                    "text-[11px] font-bold px-2.5 py-1 rounded-lg border",
                    getDepartmentColor(employee.department)
                )}>
                    {employee.department || "—"}
                </span>
                <span className="text-sm font-black text-emerald-400">
                    {formatCurrency(employee.salary)}
                </span>
            </div>
        </motion.div>
    );
}

export default function SmartSearch({ products, employees }) {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);

    const handleSearch = async (q) => {
        const searchQuery = q || query;
        if (!searchQuery.trim()) return;

        setLoading(true);
        setResults(null);

        try {
            const res = await fetch("/api/search", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query: searchQuery, products, employees }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setResults(data);
            const total = (data.products?.length || 0) + (data.employees?.length || 0);
            toast.success(`Found ${total} result${total !== 1 ? "s" : ""}!`);
        } catch (err) {
            toast.error(err.message || "Search failed");
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setResults(null);
        setQuery("");
    };

    const noResults =
        results &&
        results.products?.length === 0 &&
        results.employees?.length === 0;

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
                        Smart Search
                    </h1>
                    <p className="text-sm text-white/40">
                        Natural language search across all your data
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/20 flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        Gemini 2.5 Flash
                    </span>
                </div>
            </motion.div>

            {/* Search box */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="glass-card rounded-3xl border border-white/5 p-5 space-y-4"
            >
                {/* Input row */}
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            placeholder='Try "employees in IT" or "products under $500"…'
                            disabled={loading}
                            className="w-full bg-white/5 border border-white/8 text-white placeholder-white/20 pl-11 pr-4 py-3.5 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/30 transition-all disabled:opacity-50"
                        />
                        {query && (
                            <button
                                onClick={() => setQuery("")}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                    <button
                        onClick={() => handleSearch()}
                        disabled={loading || !query.trim()}
                        className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold text-sm hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-violet-500/20 hover:-translate-y-0.5"
                    >
                        {loading
                            ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            : <Search className="w-4 h-4" />}
                        {loading ? "Searching…" : "Search"}
                    </button>
                    {results && (
                        <button
                            onClick={handleClear}
                            className="px-4 py-3.5 rounded-2xl glass border border-white/8 text-white/40 hover:text-white/80 hover:bg-white/5 transition-all"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Example chips */}
                <div className="space-y-2">
                    <p className="text-[10px] font-bold text-white/25 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-amber-400/60" />
                        Try these examples
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {EXAMPLES.map((ex, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    setQuery(ex.query);
                                    handleSearch(ex.query);
                                }}
                                disabled={loading}
                                className="text-xs px-3 py-1.5 rounded-full glass border border-white/6 text-white/45 hover:text-white/80 hover:bg-white/5 hover:border-white/10 transition-all disabled:opacity-40"
                            >
                                {ex.label}
                            </button>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Loading state */}
            <AnimatePresence>
                {loading && (
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        className="text-center py-16"
                    >
                        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 border border-violet-500/15 flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                            <Bot className="w-8 h-8 text-violet-300" />
                        </div>
                        <p className="text-white/50 font-semibold">
                            AI is searching your data…
                        </p>
                        <p className="text-white/25 text-sm mt-1">
                            Powered by Gemini 2.5 Flash
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Results */}
            <AnimatePresence>
                {results && !loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-6"
                    >
                        {/* AI interpretation */}
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-start gap-3 glass-card rounded-2xl px-5 py-4 border border-violet-500/15 bg-violet-500/5"
                        >
                            <div className="w-8 h-8 rounded-xl bg-violet-500/20 border border-violet-500/20 flex items-center justify-center shrink-0 mt-0.5">
                                <Bot className="w-4 h-4 text-violet-300" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-violet-400 uppercase tracking-wider mb-1">
                                    AI Interpretation
                                </p>
                                <p className="text-sm text-white/70 leading-relaxed">
                                    {results.interpretation}
                                </p>
                            </div>
                        </motion.div>

                        {/* No results */}
                        {noResults && (
                            <motion.div
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-16"
                            >
                                <p className="text-4xl mb-4">🔍</p>
                                <p className="text-white/50 font-bold text-lg">
                                    No results found
                                </p>
                                <p className="text-white/25 text-sm mt-2">
                                    Try rephrasing your query
                                </p>
                                <button
                                    onClick={handleClear}
                                    className="mt-4 text-sm text-violet-400 hover:text-violet-300 transition-colors"
                                >
                                    Clear and try again
                                </button>
                            </motion.div>
                        )}

                        {/* Product results */}
                        {results.products?.length > 0 && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Package className="w-4 h-4 text-violet-400" />
                                    <h2 className="font-bold text-white/80">
                                        Products
                                    </h2>
                                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-400 border border-violet-500/20">
                                        {results.products.length}
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {results.products.map((product, i) => (
                                        <ProductCard key={product.productId} product={product} index={i} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Employee results */}
                        {results.employees?.length > 0 && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-blue-400" />
                                    <h2 className="font-bold text-white/80">
                                        Employees
                                    </h2>
                                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/20">
                                        {results.employees.length}
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {results.employees.map((emp, i) => (
                                        <EmployeeCard key={emp.employeeId} employee={emp} index={i} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}