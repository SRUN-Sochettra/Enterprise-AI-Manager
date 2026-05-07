"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Hash, DollarSign, Tag, Package } from "lucide-react";
import { getProductById } from "@/src/lib/api/products";
import { formatCurrency, cn } from "@/src/lib/utils";
import toast from "react-hot-toast";

const CATEGORY_COLORS = [
    "text-blue-400   bg-blue-400/10   border-blue-400/20",
    "text-violet-400 bg-violet-400/10 border-violet-400/20",
    "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    "text-amber-400  bg-amber-400/10  border-amber-400/20",
];

export default function SearchProductById({ categories }) {
    const [id, setId] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const getCategoryName = (cid) =>
        categories.find((c) => c.categoryId === cid)?.categoryName || "Unknown";

    const getCategoryColor = (cid) => {
        const idx = categories.findIndex((c) => c.categoryId === cid);
        return CATEGORY_COLORS[idx % CATEGORY_COLORS.length] || CATEGORY_COLORS[0];
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!id.trim()) { toast.error("Please enter an ID"); return; }
        setLoading(true);
        setResult(null);
        try {
            const data = await getProductById(id);
            if (!data) throw new Error("Product not found");
            setResult(data);
            toast.success(`Product #${data.productId} found!`);
        } catch (err) {
            toast.error(err.message || "Not found");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-5 space-y-4">
            <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                    <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                    <input
                        type="text"
                        inputMode="numeric"
                        value={id}
                        onChange={(e) => setId(e.target.value.replace(/\D/g, ""))}
                        placeholder="Enter product ID…"
                        className="w-full bg-white/5 border border-white/8 text-white placeholder-white/20 pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading || !id}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-violet-500/20"
                >
                    {loading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <Search className="w-4 h-4" />
                    )}
                    {loading ? "Searching…" : "Search"}
                </button>
            </form>

            <AnimatePresence>
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        className="rounded-2xl border border-violet-500/20 bg-violet-500/5 overflow-hidden"
                    >
                        <div className="px-5 py-4 border-b border-white/5 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/30 to-blue-500/30 border border-white/8 flex items-center justify-center">
                                <Package className="w-5 h-5 text-violet-300" />
                            </div>
                            <div>
                                <p className="font-bold text-white/90">{result.productName}</p>
                                <p className="text-xs text-violet-400 font-medium">
                                    Product #{result.productId}
                                </p>
                            </div>
                            <div className="ml-auto">
                                <span className="text-lg font-black text-emerald-400">
                                    {formatCurrency(result.productPrice)}
                                </span>
                            </div>
                        </div>

                        <div className="p-5">
                            <span
                                className={cn(
                                    "text-xs font-bold px-3 py-1.5 rounded-lg border",
                                    getCategoryColor(result.categoryId)
                                )}
                            >
                                {getCategoryName(result.categoryId)}
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}