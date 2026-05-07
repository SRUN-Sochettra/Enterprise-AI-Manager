"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Trash2, AlertTriangle, Hash, X, Package } from "lucide-react";
import { getProductById, deleteProduct } from "@/src/lib/api/products";
import { formatCurrency, cn } from "@/src/lib/utils";
import toast from "react-hot-toast";

const CATEGORY_COLORS = [
    "text-blue-400   bg-blue-400/10   border-blue-400/20",
    "text-violet-400 bg-violet-400/10 border-violet-400/20",
    "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    "text-amber-400  bg-amber-400/10  border-amber-400/20",
];

export default function DeleteProduct({ categories }) {
    const [id, setId] = useState("");
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);

    const getCategoryName = (cid) =>
        categories.find((c) => c.categoryId === cid)?.categoryName || "Unknown";

    const getCategoryColor = (cid) => {
        const idx = categories.findIndex((c) => c.categoryId === cid);
        return CATEGORY_COLORS[idx % CATEGORY_COLORS.length] || CATEGORY_COLORS[0];
    };

    const handleFetch = async (e) => {
        e.preventDefault();
        if (!id.trim()) { toast.error("Please enter an ID"); return; }
        setLoading(true);
        setProduct(null);
        try {
            const data = await getProductById(id);
            if (!data) throw new Error("Product not found");
            setProduct(data);
        } catch (err) {
            toast.error(err.message || "Not found");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            await deleteProduct(id);
            toast.success(`"${product.productName}" deleted!`);
            setProduct(null);
            setId("");
        } catch (err) {
            toast.error(err.message || "Delete failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-5 space-y-4">
            <AnimatePresence mode="wait">
                {!product ? (
                    <motion.form
                        key="search"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onSubmit={handleFetch}
                        className="flex gap-2"
                    >
                        <div className="relative flex-1">
                            <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                            <input
                                type="text"
                                inputMode="numeric"
                                value={id}
                                onChange={(e) => setId(e.target.value.replace(/\D/g, ""))}
                                placeholder="Enter product ID to delete…"
                                className="w-full bg-white/5 border border-white/8 text-white placeholder-white/20 pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/40 transition-all"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !id}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-rose-500/20"
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Search className="w-4 h-4" />
                            )}
                            Find
                        </button>
                    </motion.form>
                ) : (
                    <motion.div
                        key="confirm"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                    >
                        <div className="rounded-2xl border border-rose-500/25 bg-rose-500/5 overflow-hidden">
                            <div className="px-5 py-3 border-b border-rose-500/15 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-rose-400" />
                                <span className="text-sm font-bold text-rose-400">
                                    Confirm deletion
                                </span>
                                <button
                                    onClick={() => { setProduct(null); setId(""); }}
                                    className="ml-auto text-white/30 hover:text-white/70 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="p-5 space-y-4">
                                {/* Product preview */}
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/20 flex items-center justify-center">
                                        <Package className="w-5 h-5 text-rose-300" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-white/90">
                                            {product.productName}
                                        </p>
                                        <p className="text-xs text-rose-400">
                                            #{product.productId}
                                        </p>
                                    </div>
                                    <div className="ml-auto text-right">
                                        <p className="text-lg font-black text-emerald-400">
                                            {formatCurrency(product.productPrice)}
                                        </p>
                                        <span
                                            className={cn(
                                                "text-[10px] font-bold px-2 py-0.5 rounded-lg border",
                                                getCategoryColor(product.categoryId)
                                            )}
                                        >
                                            {getCategoryName(product.categoryId)}
                                        </span>
                                    </div>
                                </div>

                                <p className="text-xs text-rose-300/60">
                                    ⚠️ This action is permanent and cannot be undone.
                                </p>

                                <div className="flex gap-2">
                                    <button
                                        onClick={handleDelete}
                                        disabled={loading}
                                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-red-600 text-white font-semibold py-2.5 rounded-xl hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-rose-500/20"
                                    >
                                        {loading ? (
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <Trash2 className="w-4 h-4" />
                                        )}
                                        {loading ? "Deleting…" : "Yes, Delete"}
                                    </button>
                                    <button
                                        onClick={() => { setProduct(null); setId(""); }}
                                        disabled={loading}
                                        className="flex-1 glass border border-white/8 text-white/60 font-semibold py-2.5 rounded-xl hover:bg-white/5 hover:text-white/90 transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}